

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

.PHONY: dev build watch test
