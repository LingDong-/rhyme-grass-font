PAGE ?= 1
UNICODE ?= 19969
DATAID ?=
CS_SRC ?= data/hongwu.txt
CS_IDX ?= 0

dl.all: dl.pdf dl.unifont dl.hanaminb dl.ids dl.ocr
	echo "done"

dl.unifont:
	curl -L -o unifont.hex.gz https://unifoundry.com/pub/unifont/unifont-18.0.01/font-builds/unifont-18.0.01.hex.gz
	gunzip unifont.hex.gz
	mv unifont.hex data/dl
dl.hanaminb:
	curl -L -o data/dl/HanaMinB.ttf https://github.com/googlefonts/chinese/raw/refs/heads/gh-pages/fonts/HanaMin/HanaMinB.ttf
dl.ids:
	curl -L -o data/dl/ids.txt https://raw.githubusercontent.com/cjkvi/cjkvi-ids/refs/heads/master/ids.txt
dl.ocr:
	cd tools/ocr
	make download
dl.pdf:
	curl -L -o data/dl/input.pdf https://shuge.hanjihebi.com/d/%E4%B9%A6%E6%A0%BC%E7%BD%91%E7%AB%99%E8%B5%84%E6%BA%90/%E9%87%91%E7%9F%B3%E4%B9%A6%E6%B3%95/%E8%8D%89%E9%9F%B5%E8%BE%A8%E4%BD%93.%E4%BA%94%E5%8D%B7.%E6%98%8E%E9%83%AD%E8%B0%8C%E8%BE%91.%E6%98%8E%E4%B8%87%E5%8E%86%E5%8D%81%E4%BA%8C%E5%B9%B4%E5%88%8A%E6%9C%AC.pdf


ocr.serve:
	node tools/ocr/ocr.mjs

gen.pages:
	npx pdf-to-png-converter input.pdf --output-folder data/dl/pages --viewport-scale 2
	cd data/dl/pages && node -e "const fs = require('fs'); fs.readdirSync('.').filter(x=>x.endsWith('.png')).map(x=>fs.renameSync(x,x.split('_').at(-1).padStart(9,'0')))"

anno.chr: CS_SRC = data/hongwu.txt
anno.chr: gen.cheatsheet
	dither -xvt c tools/annotate.dh $(PAGE) $(CS_IDX) cybt-dataset/labels-chr

anno.rad: CS_SRC = data/ezrad.txt
anno.rad: gen.cheatsheet
	dither -xvt c tools/annotate.dh $(PAGE) $(CS_IDX) cybt-dataset/labels-rad

maskedit.chr:
	dither -xvt c tools/maskedit.dh chr $(UNICODE)
maskedit.rad:
	dither -xvt c tools/maskedit.dh rad $(UNICODE)

review:
	dither -xvt c tools/review.dh

reassign: CS_SRC = data/hongwu.txt
reassign: gen.cheatsheet
	dither -xvt c tools/reassign.dh

vectorize.chr:
	mkdir -p data/gen/contours-chr
	dither -xvt c tools/vectorize.dh chr $(DATAID)
vectorize.rad:
	mkdir -p data/gen/contours-rad
	dither -xvt c tools/vectorize.dh rad $(DATAID)

gen.cheatsheet:
	node -e "const fs = require('fs'); fs.writeFileSync('data/gen/cheatsheet.txt',Array.from(fs.readFileSync('$(CS_SRC)').toString().replace(/\\n/g,'')).map(x=>x.codePointAt(0)+' '+x).join('\\n'))"
gen.surjection:
	node tools/surjection.js
gen.synthplan:
	node tools/synthplan.js
gen.synth:
	mkdir -p data/gen/contours-syn
	node tools/synthesize.js

gen.chart:
	dither -xvt c tools/chart.dh

gen.font:
	node tools/makefont.js
zip.font:
	for f in *.ttf; do\
		zip -9 $$f.zip $$f LICENSE;\
	done;

gen.woffsplit:
	npx -y -p cn-font-split -c 'cn-font-split i wasm32-wasip1 && node tools/woffsplit.mjs Rhyme-Grass-G.ttf'

dl.release:
	curl -L -o Rhyme-Grass-G.ttf.zip https://github.com/LingDong-/rhyme-grass-font/releases/download/v0.0/Rhyme-Grass-G.ttf.zip
	unzip -o Rhyme-Grass-G.ttf.zip

deploy: dl.release gen.woffsplit
	node tools/makesite.js
