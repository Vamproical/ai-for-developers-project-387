install:
	npm ci
	cd frontend && npm ci

setup: install

build:
	npm run build

dev:
	npm run dev

start:
	npm run start

test:
	npm run test

test-e2e:
	npm run test:e2e

test-e2e-headed:
	npm run test:e2e:headed

lint:
	npm run lint

tsp-compile:
	npm run tsp:compile

tsp-watch:
	npm run tsp:watch

tsp-clean:
	rm -rf tsp-output

tsp-rebuild: tsp-clean tsp-compile

tsp-openapi: tsp-compile

docker-build:
	docker build -t calendar-slot-code:local -f Dockerfile .
