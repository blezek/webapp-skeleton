

watch:
	node_modules/.bin/gulp watch

test:
	npm test

build:
	node_modules/.bin/gulp build

dev:
	npm install

.PHONY: dev build watch test
