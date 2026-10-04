const fs = require('fs');
const {encode_ttf} = require("./ttfw.js");

let gs0 = [];
let hz = fs.readdirSync("data/gen/contours-chr").filter(x=>x.endsWith(".json"));
hz = hz.concat(fs.readdirSync("data/gen/contours-syn").filter(x=>x.endsWith(".json")));

let sj = JSON.parse(fs.readFileSync("data/gen/surjection.json").toString());

let info = {
  upM:960,
  asc:900,
  dsc:-300,
}

function get_bbox(points){
  let xmin = Infinity;
  let ymin = Infinity;
  let xmax = -Infinity;
  let ymax = -Infinity
  for (let i = 0;i < points.length; i++){
    let x = points[i][0];
    let y = points[i][1];
    xmin = Math.min(xmin,x);
    ymin = Math.min(ymin,y);
    xmax = Math.max(xmax,x);
    ymax = Math.max(ymax,y);
  }
  return {xmin,ymin,xmax,ymax};
}

let cnt=0;
for (let i = 0; i < hz.length; i++){
  if (i % 100 == 0) console.log(i,'/',hz.length)
  let g0 = {};

  let fn = `data/gen/contours-chr/`+hz[i];
  if (!fs.existsSync(fn)){
    fn = `data/gen/contours-syn/`+hz[i];
  }
  let ps = JSON.parse(fs.readFileSync(fn).toString());

  for (let k = ps.length-1; k>=0; k--){

    for (let l = 0; l < ps[k].length; l++){
      ps[k][l][0] = (ps[k][l][0]-288)*1.2+288;
      ps[k][l][1] = (ps[k][l][1]-288)*1.2+288;

      ps[k][l][0] -= 0;
      ps[k][l][1] -= 576;
      ps[k][l][0] /= 576;
      ps[k][l][1] /=-576;
      ps[k][l][0] *= info.upM;
      ps[k][l][1] *= info.upM;
      ps[k][l][0] = Math.round(ps[k][l][0]);
      ps[k][l][1] = Math.round(ps[k][l][1]);
    }
  }
  let bb = get_bbox(ps.flat());
  let u = parseInt(hz[i].split('.')[0]);
  // if (u > 0x9FFF) continue
  g0.unicode = u;
  let ch = String.fromCodePoint(u);
  if (sj[ch]){
    g0.unicode = sj[ch].map(x=>x.codePointAt(0));
    // console.log(g0)
    cnt += g0.unicode.length;
  }else{
    cnt++;
  }
  g0.contours = ps;
  g0.lsb = bb.xmin;
  g0.advw = 960;
  g0.tsb = 60;
  g0.advh = (bb.ymax-bb.ymin)+120;
  gs0.push(g0);
  
}


{
  let bytes = encode_ttf({
    family : "Rhyme Grass",
    style : "Grass",
    designer : 'Lingdong Huang',
    upM : info.upM,
    asc : info.asc,
    dsc : info.dsc,
  }, gs0, []);
  fs.writeFileSync(`Rhyme-Grass-G.ttf`,new Uint8Array(bytes));
}

console.log('covered',cnt)