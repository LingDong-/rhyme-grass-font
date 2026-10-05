const fs = require('fs');

let lorem = Object.fromEntries(fs.readFileSync('data/lorem.txt').toString().split('\n\n').map(x=>x.trim()).filter(x=>x.length).map(x=>[x.slice(0,5),x]))



let html = `
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="font/result.css">
<style>
  @font-face{font-family:'Blank';src:url(data:font/otf;base64,T1RUTwAKAIAAAwAgQ0ZGIN6nWacAAAfMAAABMURTSUcAAAABAAAJCAAAAAhPUy8yAF+xmwAAARAAAABgY21hcAE0tLwAAAasAAABAGhlYWQIOsNZAAAArAAAADZoaGVhB1oD7wAAAOQAAAAkaG10eAPoAHwAAAkAAAAACG1heHAAAlAAAAABCAAAAAZuYW1lc0mXUAAAAXAAAAU6cG9zdP+4ADIAAAesAAAAIAABAAAAAgBB1Q6SE18PPPUAAwPoAAAAANKdP6AAAAAA0p0/oAB8/4gDbANwAAAAAwACAAAAAAAAAAEAAANw/4gAAAPoAHwAfANsAAEAAAAAAAAAAAAAAAAAAAACAABQAAACAAAAAwPoAZAABQAAAooCWAAAAEsCigJYAAABXgAyANwAAAAAAAAAAAAAAAD3/67/+9///w/gAD8AAAAAQURCTwBAAAD//wNw/4gAAANwAHhgLwH/AAAAAAAAAAAAAAAgAAAAAAALAIoAAwABBAkAAACUAAAAAwABBAkAAQAaAJQAAwABBAkAAgAOAK4AAwABBAkAAwA4ALwAAwABBAkABAAaAJQAAwABBAkABQB0APQAAwABBAkABgAWAWgAAwABBAkACAA0AX4AAwABBAkACwA0AbIAAwABBAkADQKWAeYAAwABBAkADgA0BHwAQwBvAHAAeQByAGkAZwBoAHQAIACpACAAMgAwADEAMwAsACAAMgAwADEANQAgAEEAZABvAGIAZQAgAFMAeQBzAHQAZQBtAHMAIABJAG4AYwBvAHIAcABvAHIAYQB0AGUAZAAgACgAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGEAZABvAGIAZQAuAGMAbwBtAC8AKQAuAEEAZABvAGIAZQAgAEIAbABhAG4AawAgADIAUgBlAGcAdQBsAGEAcgAyAC4AMAAwADEAOwBBAEQAQgBPADsAQQBkAG8AYgBlAEIAbABhAG4AawAyADsAQQBEAE8AQgBFAFYAZQByAHMAaQBvAG4AIAAyAC4AMAAwADEAOwBQAFMAIAAyAC4AMAAwADEAOwBoAG8AdABjAG8AbgB2ACAAMQAuADAALgA4ADgAOwBtAGEAawBlAG8AdABmAC4AbABpAGIAMgAuADUALgA2ADUAMAAxADIAQQBkAG8AYgBlAEIAbABhAG4AawAyAEEAZABvAGIAZQAgAFMAeQBzAHQAZQBtAHMAIABJAG4AYwBvAHIAcABvAHIAYQB0AGUAZABoAHQAdABwADoALwAvAHcAdwB3AC4AYQBkAG8AYgBlAC4AYwBvAG0ALwB0AHkAcABlAC8AVABoAGkAcwAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABpAHMAIABsAGkAYwBlAG4AcwBlAGQAIAB1AG4AZABlAHIAIAB0AGgAZQAgAFMASQBMACAATwBwAGUAbgAgAEYAbwBuAHQAIABMAGkAYwBlAG4AcwBlACwAIABWAGUAcgBzAGkAbwBuACAAMQAuADEALgAgAFQAaABpAHMAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAaQBzACAAZABpAHMAdAByAGkAYgB1AHQAZQBkACAAbwBuACAAYQBuACAAIgBBAFMAIABJAFMAIgAgAEIAQQBTAEkAUwAsACAAVwBJAFQASABPAFUAVAAgAFcAQQBSAFIAQQBOAFQASQBFAFMAIABPAFIAIABDAE8ATgBEAEkAVABJAE8ATgBTACAATwBGACAAQQBOAFkAIABLAEkATgBEACwAIABlAGkAdABoAGUAcgAgAGUAeABwAHIAZQBzAHMAIABvAHIAIABpAG0AcABsAGkAZQBkAC4AIABTAGUAZQAgAHQAaABlACAAUwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUAIABmAG8AcgAgAHQAaABlACAAcwBwAGUAYwBpAGYAaQBjACAAbABhAG4AZwB1AGEAZwBlACwAIABwAGUAcgBtAGkAcwBzAGkAbwBuAHMAIABhAG4AZAAgAGwAaQBtAGkAdABhAHQAaQBvAG4AcwAgAGcAbwB2AGUAcgBuAGkAbgBnACAAeQBvAHUAcgAgAHUAcwBlACAAbwBmACAAdABoAGkAcwAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUALgBoAHQAdABwADoALwAvAHMAYwByAGkAcAB0AHMALgBzAGkAbAAuAG8AcgBnAC8ATwBGAEwAAAAAAAEAAwAKAAAADAANAAAAAAD0AAAAAAAAABMAAAAAAADX/wAAAAEAAOAAAAD9zwAAAAEAAP3wAAD//QAAAAEAAQAAAAH//QAAAAEAAgAAAAL//QAAAAEAAwAAAAP//QAAAAEABAAAAAT//QAAAAEABQAAAAX//QAAAAEABgAAAAb//QAAAAEABwAAAAf//QAAAAEACAAAAAj//QAAAAEACQAAAAn//QAAAAEACgAAAAr//QAAAAEACwAAAAv//QAAAAEADAAAAAz//QAAAAEADQAAAA3//QAAAAEADgAAAA7//QAAAAEADwAAAA///QAAAAEAEAAAABD//QAAAAEAAwAAAAAAAP+1ADIAAAAAAAAAAAAAAAAAAAAAAAAAAAEABAIAAQEBDEFkb2JlQmxhbmsyAAEBAS34G/gciwwe+B0B+B4Ci/sM+gD6BAUeKgAfDB+NDCL3Uw/3WRH3Vgwl96wMJAAFAQEGDlZjcEFkb2JlSWRlbnRpdHlDb3B5cmlnaHQgMjAxMywgMjAxNSBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZCAoaHR0cDovL3d3dy5hZG9iZS5jb20vKS5BZG9iZSBCbGFuayAyQWRvYmVCbGFuazItMgAAAAABAAAAAAIBAUxO+nz7DLf6JLcB9xC3+Sy3A/cQ+gQV/nz5hPp8B/1Y/icV+dIH98X8MwWmsBX7xfg3Bfj2BqZiFf3SB/vF+DMFcGYV98X8NwX89gYOiw4AAQEBCfgfDCaX97kS+46LHAVGiwa9Cr0LAAAAA+gAfAAAAAAAAAABAAAAAA==) format('opentype');font-display:block}
  #render {
    opacity:1;
		background: antiquewhite;
		box-shadow:
        inset 0px 11px 8px -10px rgba(0,0,0,0.1),
        inset 0px -11px 8px -10px rgba(0,0,0,0.1);
				font-display: block;
		overflow-x: auto;

    writing-mode: vertical-rl;
    text-orientation: mixed; 
    font-family: "SPLITFONT", "Blank";
    line-height: 1.1;
    margin-left: auto; 
    margin-right: 0;
    font-display: block;
    color: rgba(0,0,0,0.8);

  }
</style>
</head>

<body>
<div style="position:absolute; left:30px; top:30px; min-width: 620px; width: calc(100% - 60px); height: 120px;  border:1px solid black; font-family:monospace">
&nbsp;<b>GRASS-RHYME-FONT(韻草) TESTBED</b>
&nbsp;/&nbsp;TEXT=<select id="sel-txt">${Object.keys(lorem).map(x=>'<option value="'+x+'"">'+x+"</option>")}</select>
&nbsp;/&nbsp;SIZE=<select id="sel-fs">${["huge","big","medium","small"].map(x=>'<option value="'+x+'"">'+x.toUpperCase()+"</option>")}</select>
&nbsp;/&nbsp;BG=<select id="sel-bg">${["antiquewhite","cornsilk","floralwhite","ghostwhite","ivory","linen","oldlace","seashell","white","whitesmoke"].map(x=>'<option value="'+x+'"">'+x.toUpperCase()+"</option>")}</select>
&nbsp;/&nbsp;<button id="btn-render">RENDER</button>
<textarea id="ta" style="position:absolute; left:0px; top:20px; width: 100%; height: 100px; resize: none; border: none; border-top: 1px solid black">
</textarea>
</div>
<div id="render" style="position:absolute; top: 180px; left: 0px; width: calc(100% - 50px); height: 665px; padding: 25px;">


</div>
<div style="position:absolute;top:910px; right:30px; font-family: monospace">
Open source font by Lingdong Huang 2026, <a href="https://github.com/LingDong-/rhyme-grass-font">Download on GitHub</a>.
</div>


</body>
<script>
var lorem = ${JSON.stringify(lorem)};
</script>
<script>(${(function (){
	function update_r(){
		var t = document.getElementById("ta").value;
		var tc = "";
		for (var k of t){
			if (k == "\n"){
				tc += "<br>"
			}else{
        tc += k;
      }
		}
		var ts = document.getElementById("sel-fs").value;
    document.getElementById("render").style.fontSize = {
      huge:162,
      big:96,
      medium:64,
      small:32
    }[ts]
		document.getElementById("render").innerHTML = tc;
	}

	function update_ta(){
		document.getElementById("ta").value = lorem[document.getElementById("sel-txt").value];
		update_r();
	}
	function update_fs(){
		update_r();
	}
  document.getElementById("sel-txt").value = Object.keys(lorem)[0]
	document.getElementById("sel-fs").value = "medium"
	update_ta()
	update_fs()


  document.getElementById("sel-txt").onchange = update_ta;
	document.getElementById("sel-fs").onchange = update_fs;
	document.getElementById("sel-bg").onchange = function(){document.getElementById("render").style.background=document.getElementById("sel-bg").value}
	document.getElementById("ta").onkeyup=document.getElementById("ta").onchange=update_r
	document.getElementById("btn-render").onclick = update_r;

	document.getElementById("render").addEventListener('wheel', (e)=> {
		//https://stackoverflow.com/questions/10744645/detect-touchpad-vs-mouse-in-javascript
		var isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0;
		if (!isTouchPad){
			document.getElementById("render").scrollLeft -= e.deltaY;
			e.preventDefault();
		}
	})


}).toString()})()</script>



`

fs.writeFileSync("site/index.html",html)