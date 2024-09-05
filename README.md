## Usage

Development

```sh
bun dev
```

Production

```
bun run build
```

CLI usage

```sh
cd apps/cli
npm link

srcpad start
```

In use example

```
user@device dir % srcpad
Usage:
  [command]

Available Commands:
  echo    echoes the given text
  start   starts the srcpad server and UI

Flags:
  -h, --help      help
  -v, --version   version
```

> For anyone finding this on NPM it won't work just testing CI with it didn't setup global
> path resolution handling yet, will be done at some point
