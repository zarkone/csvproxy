VERSION = 0.0.1

docker-build:
	docker build -t zarkone/csvproxy:$(VERSION) -t zarkone/csvproxy:latest .