# Contributing

## Branching strategy

- `main` is the release-ready branch.
- Create feature branches from `main` using names like `feat/<short-name>` or `fix/<short-name>`.
- Open a Pull Request to merge back into `main`.

## Commit message convention

This repository uses Conventional Commits.

Format:

```txt
type(scope): short description
```

Common types:

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`
- `ci`

Examples:

```txt
feat(grammar): add html-jsx language grammar
fix(injection): preserve script tag and JSX highlighting
docs(readme): add production workflow section
```

## Local checks

Run these before opening a PR:

```txt
npm ci
npm run lint
npm run package
```

## Pull Requests

- Keep PRs focused.
- Include a clear summary and validation steps.
- Update `CHANGELOG.md` when behavior changes are user-visible.
