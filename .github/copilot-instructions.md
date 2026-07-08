# Copilot Instructions — pool-screenlogic

## Project Overview

Bun + HTMX control surface for Pentair ScreenLogic pool/spa systems.
Server-rendered HTML partials delivered over HTMX; no client-side JS framework.

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode)
- **Frontend:** HTMX (hypermedia-driven, no SPA)
- **Tooling:** Biome (lint + format), bun:test
- **CI:** GitHub Actions

## Code Style

- **Indentation:** Tabs
- **Quotes:** Double quotes
- **Semicolons:** Always
- **Return types:** Always explicit on all functions (exported and internal)
- **Philosophy:** Functional — plain functions and composition. No classes unless wrapping an external library that requires it.
- **Comments:** Minimal. Code should be self-documenting. Comment only "why", never "what".
- **Naming:** camelCase for variables/functions, PascalCase for types/interfaces
- **Imports:** Named imports, no default exports. Barrel files (`index.ts`) for module boundaries.
- **Error handling:** Throw typed errors with descriptive messages. Use try/finally for resource cleanup.

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add temperature history chart
fix: handle null circuit names gracefully
chore: update biome to 2.x
docs: add deployment guide
```

Scope is optional but encouraged: `feat(views): add spa heat mode toggle`

## Project Structure

```
src/
  server.ts              Entry point — HTTP routing only
  screenlogic/           ScreenLogic client, discovery, types
  views/                 HTML partial renderers and helpers
public/
  index.html             Static shell page
  htmx.min.js            HTMX library (vendored)
```

## PR Workflow

This project uses **stacked PRs**:
- Each feature branch targets its parent branch, not always `main`.
- Keep PRs small and focused — one concern per PR.
- Merge in order from bottom of stack to top.

## Testing

- Use `bun:test` for unit and integration tests.
- Test files live next to source: `src/screenlogic/client.test.ts`
- Run with `bun test`.

## Key Patterns

- **HTMX partials:** Server returns HTML fragments, not JSON. The `renderX()` functions in `src/views/` produce HTML strings.
- **ScreenLogic client lifecycle:** Always use `withClient()` — it handles connect/disconnect. Never hold a connection open between requests.
- **Static files:** Served from `public/` directory via explicit route matching.
