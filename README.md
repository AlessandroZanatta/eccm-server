# eccm-server

Thin Hono wrapper around [ECCM](https://github.com/bijomaru78/eccm) that persists network configurations server-side instead of in browser localStorage.

## Run

Download the docker-compose.yaml and run it:

```bash
curl -O https://raw.githubusercontent.com/alessandrozanatta/eccm-server/main/docker-compose.yaml
docker compose up -d
```

or run the image directly:

```bash
docker run -p 3000:3000 -v eccm-data:/data \
  ghcr.io/alessandrozanatta/eccm-server:latest
```

## Environment variables

| Variable         | Default            | Description        |
| ---------------- | ------------------ | ------------------ |
| `PORT`           | `3000`             | HTTP port          |
| `ECCM_DATA_FILE` | `/data/store.json` | Path to JSON store |

## Development

`ECCM.html` must be present in the repo root (gitignored). Fetch it matching the version in `.eccm-version`:

```bash
ECCM_VERSION=$(cat .eccm-version)
curl -fsSL "https://codeload.github.com/bijomaru78/eccm/tar.gz/refs/tags/${ECCM_VERSION}" \
  | tar -xz --strip-components=1 "eccm-${ECCM_VERSION}/ECCM.html"
```

Then:

```bash
yarn install
yarn dev
```
