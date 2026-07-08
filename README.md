# Pool ScreenLogic

A lightweight Bun + HTMX control surface for Pentair ScreenLogic pool/spa systems.

## Quick Start

```sh
bun install
bun run dev
```

Open `http://127.0.0.1:3000`.

## Project Structure

```
src/
  server.ts              HTTP server and routing
  screenlogic/           ScreenLogic client, discovery, types
  views/                 HTML partials and template helpers
public/
  index.html             Main page (static)
  htmx.min.js            HTMX library
```

## Configuration

By default the server discovers the first local ScreenLogic gateway via UDP broadcast.  
Copy `.env.example` to `.env` and override as needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `SCREENLOGIC_HOST` | _(auto-discover)_ | Gateway IP address |
| `SCREENLOGIC_PORT` | `80` | Gateway port |
| `SCREENLOGIC_NAME` | `Pentair: 00-00-00` | Display name |
| `SCREENLOGIC_PASSWORD` | _(empty)_ | Gateway password |
| `SCREENLOGIC_SEARCH_MS` | `2500` | Discovery timeout (ms) |
| `PORT` | `3000` | HTTP listen port |
| `HOST` | `127.0.0.1` | HTTP bind address |

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start with file watching |
| `bun run start` | Start without watching |
| `bun run check` | Type-check with tsc |
