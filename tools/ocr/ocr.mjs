import fs from 'fs'; import path from 'path'; import http from 'http';
import { fileURLToPath, pathToFileURL } from 'url';
const D = path.dirname(fileURLToPath(import.meta.url));

globalThis.self ??= globalThis;
const ort = await import('./ort.min.mjs');

ort.env.wasm.numThreads = 1;
ort.env.wasm.proxy = false;
ort.env.wasm.wasmPaths = pathToFileURL(D + path.sep).href;
ort.env.wasm.wasmBinary = fs.readFileSync(path.join(D, 'ort-wasm-simd-threaded.wasm'));

const H = 48;
const chars = JSON.parse(fs.readFileSync(path.join(D, 'charset.json'), 'utf8'));
let sess = null;
const load = async () => sess ||= await ort.InferenceSession.create(
  fs.readFileSync(path.join(D, 'PP-OCRv6_rec_small.onnx')), { executionProviders: ['wasm'] });


async function recognize(gray, k = 5, enc = "utf8") {
  const W = gray.length / H, N = H * W;
  const f = new Float32Array(3 * N);
  for (let i = 0; i < N; i++) { const v = gray[i] / 127.5 - 1; f[i] = f[N + i] = f[2 * N + i] = v; }

  const s = await load();
  const out = await s.run({ [s.inputNames[0]]: new ort.Tensor('float32', f, [1, 3, H, W]) });
  const o = out[s.outputNames[0]], [, T, C] = o.dims, raw = o.data;

  let sum0 = 0; for (let i = 0; i < C; i++) sum0 += raw[i];
  const soft = Math.abs(sum0 - 1) > 0.01;

  const P = [];
  for (let t = 0; t < T; t++) {
    let r = Array.from(raw.subarray(t * C, (t + 1) * C));
    if (soft) { let m = -1e30; for (const v of r) if (v > m) m = v;
                let z = 0; r = r.map(v => { const e = Math.exp(v - m); z += e; return e; }).map(v => v / z); }
    P.push(r);
  }

  const amax = r => { let b = 0; for (let i = 1; i < r.length; i++) if (r[i] > r[b]) b = i; return b; };
  const groups = []; let prev = -1, cur = [];
  for (let t = 0; t < T; t++) {
    const i = amax(P[t]);
    if (i === 0)           { if (cur.length) groups.push([prev, cur]); prev = -1; cur = []; }
    else if (i === prev)   { cur.push(t); }
    else                   { if (cur.length) groups.push([prev, cur]); prev = i; cur = [t]; }
  }
  if (cur.length) groups.push([prev, cur]);

  return groups.map(([idx, fr]) => {
    let bt = fr[0]; for (const t of fr) if (P[t][idx] > P[bt][idx]) bt = t;
    const d = P[bt].slice(); d[0] = 0;
    let z = 0; for (const v of d) z += v;
    const top = d.map((v, i) => [i, v / z]).sort((a, b) => b[1] - a[1]).slice(0, k)
                 .map(([i, v]) => ({ char: {'utf8':chars[i],'dec':chars[i].charCodeAt(0),'hex':chars[i].charCodeAt(0).toString(16).padStart(4,'0')}[enc], p: +v.toFixed(5) }));
    return top;
  });
}

if (process.argv[2]) {
  recognize(new Uint8Array(fs.readFileSync(process.argv[2])), +(process.argv[3] || 5))
    .then(r => console.log(JSON.stringify(r)));
} else {
  http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x');
    let buf;
    if (req.method === 'POST') { const c = []; for await (const p of req) c.push(p); buf = Buffer.concat(c); }
    else buf = Buffer.from(u.searchParams.get('b64') || '', 'base64');
    let body;
    try { body = JSON.stringify(await recognize(new Uint8Array(buf), +(u.searchParams.get('k') || 5), (u.searchParams.get('enc') || 'utf8'))); }
    catch (e) { res.writeHead(400, { 'content-type': 'application/json' });
                return res.end(JSON.stringify({ error: String(e) })); }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(body);
  }).listen(8765, () => console.error('listening on http://127.0.0.1:8765'));
}