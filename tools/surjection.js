const fs = require('fs');

let hz = fs.readdirSync("data/gen/contours-chr").filter(x=>x.endsWith(".json")).map(x=>String.fromCodePoint(parseInt(x.split('.')[0])));

let map = {};
let cover = {};

for (let i = 0; i < hz.length; i++){
  cover[hz[i]]=hz[i];
}

let vs = fs.readFileSync("data/variants.txt").toString().split("\n").map(x=>Array.from(x))

for (let i = 0; i < vs.length; i++){
  for (let j = 0; j < vs[i].length; j++){
    if (cover[vs[i][j]]){
      for (let k = 0; k < vs[i].length; k++){
        if (k==j)continue;
        if (!cover[vs[i][k]]){
          if (!map[vs[i][j]]){
            map[vs[i][j]] = [vs[i][j]]
          }
          map[vs[i][j]].push(vs[i][k]);
          cover[vs[i][k]]=vs[i][j];
        }
      }
    }
  }
}

let sc = fs.readFileSync("data/sctc.txt").toString().split("\n").filter(x=>x.length).map(x=>[x.split("\t")[0],Array.from(x.split("\t")[1])])
for (let i = 0; i < sc.length; i++){
  if (!cover[sc[i][0]] && sc[i][1].length == 1 && cover[sc[i][1][0]]){
    let par = cover[sc[i][1][0]];
    if (!map[par]){
      map[par] = [par]
    }
    map[par].push(sc[i][0]);
    cover[sc[i][0]] = par;
  }
}

let cnt = 0;
for (let k in map){
  map[k] = Array.from(new Set(map[k]));
  for (let i = map[k].length-1; i >= 1; i--){
    let u = map[k][i].codePointAt(0);
    if (u<0x4e00||u>0x9fff){
      map[k].splice(i,1);
    }
  }
  cnt += map[k].length-1;
}

console.log(cnt);
fs.writeFileSync("data/gen/surjection.json",JSON.stringify(map,null,2));
