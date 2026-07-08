# Contributing to pool-screenlogic

## Development Setup

```sh
bun install
bun run dev      # start with file watching
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with watch mode |
| `bun run start` | Start production server |
| `bun run check` | TypeScript type check |
| `bun run lint` | Biome lint |
| `bun run format` | Biome format |

## PR Workflow (Stacked PRs)

We use stacked PRs to keep changes small and reviewable:

1. Branch off the relevant parent (not always `main`)
2. Keep each PR focused on one concern
3. Target your PR at the parent branch
4. Merge in order from the bottom of the stack upward

### Example stack:

```
main
 └─ docs/project-foundations    ← PR #1
     └─ chore/biome-format      ← PR #2 (targets docs/project-foundations)
         └─ feat/polling        ← PR #3 (targets chore/biome-format)
```

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — tooling, deps, CI changes
- `docs:` — documentation only
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `test:` — adding or updating tests

## Code Standards

- Run `bun run lint` and `bun run check` before pushing
- All functions must have explicit return types
- Functional style — no classes unless wrapping an external library
- Comments explain "why", not "what"
