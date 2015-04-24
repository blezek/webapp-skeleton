define help

Makefile for MRML Drop
  watch	     - run gulp, rebuilding on changes
  build	     - build site in directory ./build 
  test       - test using NPM
  dev        - install node packages
  X          - build development version of xtk
  install    - build and deploy on AWS instance

  help       - this help

endef
export help

help:
	@echo "$$help"

watch:
	node_modules/.bin/gulp watch

test:
	npm test

build:
	node_modules/.bin/gulp build

dev:
	npm install

X:
	(cd ../X/utils && ./build.py)
	rsync -r ../X/ build/
	rsync -r ../X/xtk-deps.js build/


install: build example
	rsync -arv --copy-links build/ aws:/usr/share/nginx/html/

example:
	mkdir -p example-data
	touch example-data/examples.txt
	test -s example-data/HeadNeckAtlas.mrb || wget --output-document example-data/HeadNeckAtlas.mrb http://slicer.kitware.com/midas3/download/item/127000
	test -s example-data/LungSegments.mrb || wget --output-document example-data/LungSegments.mrb http://slicer.kitware.com/midas3/download/item/126553
	test -s example-data/GBM.mrb || wget --output-document example-data/GBM.mrb http://slicer.kitware.com/midas3/download/item/153172
	test -s example-data/KneeAtlas.mrb || wget --output-document example-data/KneeAtlas.mrb http://slicer.kitware.com/midas3/download/item/126998

.PHONY: dev build watch test install
