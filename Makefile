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


install: build
	rsync -arv --copy-links build/ aws:/usr/share/nginx/html/

.PHONY: dev build watch test install
