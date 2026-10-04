import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [FONT = 'font.ttf', TEXT = 'data/lorem.txt', OUT = 'site/font'] = process.argv.slice(2);

const binDir = process.env.PATH.split(path.delimiter)
  .find((p) => fs.existsSync(path.join(p, 'cn-font-split')));

const pkgDir = path.join(binDir, '..', 'cn-font-split');
const wasmPath = path.join(pkgDir, 'dist', 'libffi-wasm32-wasip1.wasm');


const { fontSplit, StaticWasm } = await import(pathToFileURL(path.join(pkgDir, 'dist', 'wasm', 'index.mjs')));
const wasm = new StaticWasm(fs.readFileSync(wasmPath));

const firstChunk = [...new Set([...fs.readFileSync(TEXT, 'utf8')].filter((c) => !/\s/.test(c)))]
  .map((c) => c.codePointAt(0));
console.log(`first chunk: ${firstChunk.length} characters from ${TEXT}`);

const toBytes = (cps) => new Uint8Array(new Uint32Array(cps).buffer);

fs.mkdirSync(OUT, { recursive: true });

const result = await fontSplit(
  {
    input: new Uint8Array(fs.readFileSync(FONT)),
    outDir: OUT,
    subsets: [toBytes(firstChunk)],
    css: { fontDisplay: 'block', fontFamily: 'SPLITFONT' },
    testHtml: false,
    reporter: false,
    chunkSize: 512 * 1024,
  },
  wasm.WasiHandle,
  { logger: (msg) => console.log(msg) },
);

if (Array.isArray(result)) {
  for (const f of result) fs.writeFileSync(path.join(OUT, f.name), f.data);
}

const woff2 = fs.readdirSync(OUT).filter((n) => n.endsWith('.woff2')).length;
console.log(`done: ${woff2} chunks in ${OUT}`);
