const fs = require('fs')
let plan = JSON.parse(fs.readFileSync("data/gen/synthplan.json").toString())

let dbg_folder = process.argv[2]

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

let W = 576;

function proc(c,method,l,r){

  let L = JSON.parse(fs.readFileSync(`data/gen/contours-rad/${l.codePointAt(0)}.json`).toString());
  let R = JSON.parse(fs.readFileSync(`data/gen/contours-chr/${r.codePointAt(0)}.json`).toString());

  if (method == "⿰"){
    for (let i = 0; i < R.length; i++){
      for (let j = 0; j < R[i].length; j++){
        R[i][j][0] = (R[i][j][0]-W/2)*0.85+W/2;
      }
    }
    let bbl = get_bbox(L.flat());
    let bbr = get_bbox(R.flat());
    let lw = (bbl.xmax-bbl.xmin);

    for (let i = 0; i < R.length; i++){
      for (let j = 0; j < R[i].length; j++){
        R[i][j][0] += lw/2;
      }
    }
    for (let i = 0; i < L.length; i++){
      for (let j = 0; j < L[i].length; j++){
        L[i][j][0] += (bbr.xmin + lw/2 - lw)-bbl.xmin+0;
      }
    }
  }else{
    for (let i = 0; i < R.length; i++){
      for (let j = 0; j < R[i].length; j++){
        R[i][j][1] = (R[i][j][1]-W/2)*0.8+W/2;
      }
    }
    let bbl = get_bbox(L.flat());
    let bbr = get_bbox(R.flat());
    let lh = (bbl.ymax-bbl.ymin);
    for (let i = 0; i < R.length; i++){
      for (let j = 0; j < R[i].length; j++){
        R[i][j][1] += lh/2-8;
      }
    }
    for (let i = 0; i < L.length; i++){
      for (let j = 0; j < L[i].length; j++){
        L[i][j][1] += (bbr.ymin + lh/2 - lh)-bbl.ymin+12;
      }
    }
  }
  let C = L.concat(R);

  fs.writeFileSync(`data/gen/contours-syn/${c.codePointAt(0)}.json`,JSON.stringify(C));

  if (dbg_folder){
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="576" height="576">`;
    svg += `<rect x="0" y="0" width="576" height="576" fill="white"/>`;  
    svg += `<path d="`;
    for (let j = 0; j < C.length; j++){
      for (let k = 0; k < C[j].length; k++){
        let [x,y] = C[j][k];  
        svg += ((k == 0) ? "M" : "L") + `${x} ${y} `;
      }
    }
    svg += `z" fill="black"/>`;
    svg += `</svg>`;

    fs.writeFileSync(dbg_folder+`/${c.codePointAt(0)}.svg`,svg);
  }
}


for (let k in plan){
  proc(k,plan[k][0],plan[k][1],plan[k][2])
  // break;
}