# CSVPROXY

Simple service which converts CSV to json. Caches result in MongoDB for quicker access.

## INSTALL

### Docker

```sh
docker pull zarkone/csvproxy:latest
```

### Dev

```sh

docker-compose -f docker-compose.dev.yml up -d # Runs MongoDB
yarn run watch-dev
```

## Endpoints

TODO: add swagger

```
# Post content, url or plain csv:
< POST /csv
< { url | csv }
> { url: :id }

# Get it:
> GET /csv/:id.json
> GET /csv/:id.csv

# proxy, convert without saving:
> GET /proxy?url=<url>

```
