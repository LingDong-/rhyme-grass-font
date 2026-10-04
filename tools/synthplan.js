const fs = require('fs');

let ids = fs.readFileSync("data/dl/ids.txt").toString().split("\n").slice(2).filter(x=>x.length).map(x=>x.split("\t"));
let rads = fs.readFileSync("data/ezrad.txt").toString().split("\n").map(x=>Array.from(x));


let doable = {};
for (let i = 0; i < ids.length; i++){
  if (ids[i][1].codePointAt(0) > 0xFFFF){
    continue
  }
  if (ids[i][1].codePointAt(0) > 0x9FFF || ids[i][1].codePointAt(0)< 0x4E00){
    // console.log(ids[i])
    continue;
  }
  for (let j = 2; j < ids[i].length; j++){
    let cs = Array.from(ids[i][j].split('[')[0]);
    if (cs.length == 3 && cs[0] == "⿰"){
      for (let k = 0; k < rads[0].length; k++){
        if (cs[1] == rads[0][k]){
          if (!doable[ids[i][1]]){
            doable[ids[i][1]] = cs;
          }
        }
      }
    }else if (cs.length == 3 && cs[0] == "⿱"){
      for (let k = 0; k < rads[1].length; k++){
        if (cs[1] == rads[1][k]){
          if (!doable[ids[i][1]]){
            doable[ids[i][1]] = cs;
          }
        }
      }
    }else if (cs.length == 3 && cs[0] == "⿵"){
      for (let k = 0; k < rads[2].length; k++){
        if (cs[1] == rads[2][k]){
          if (!doable[ids[i][1]]){
            doable[ids[i][1]] = cs;
          }
        }
      }
    }
  }
}


let haz = fs.readdirSync("data/gen/contours-chr").filter(x=>x.endsWith(".json")).map(x=>String.fromCodePoint(parseInt(x.split('.')[0])));

let cover = JSON.parse(fs.readFileSync("data/gen/surjection.json").toString());

let willdo = {};


function proc(e){
  for (let i = 0; i < haz.length; i++){
    if (haz[i]==e) return;
  }
  for (let k in cover){
    if (k == e){
      return;
    }
    for (let i = 0; i < cover[k].length; i++){
      if (e == cover[k][i]){
        return;
      }
    }
  }
  for (let i = 0; i < haz.length; i++){
    if (doable[e][2] == haz[i]){
      willdo[e] = doable[e]
      return;
    }
  }
  for (let k in cover){
    if (doable[e][2] == k){
      willdo[e] = doable[e]
      return;
    }else{
      for (let i = 0; i < cover[k]; i++){
        if (doable[e][2] == cover[k][i]){
          willdo[e] = doable[e].slice();
          willdo[e][2] = cover[k][i];
          return;
        }
      }
    }
  }
}

for (let e in doable){
  proc(e);
}

console.log(Object.keys(willdo).length)

fs.writeFileSync("data/gen/synthplan.json",JSON.stringify(willdo,null,2));