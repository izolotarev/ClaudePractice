# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Single-list todo app (add, complete, delete). Also a learning project for CI/CD with Claude Code; `course/` holds the lessons. `SPEC.md` is the source of truth for behavior, API and limits.

## Commands (run from repo root)

- `npm install`: installs both workspaces (`client`, `server`).
- `npm test`: server tests, then client tests. Both must pass.
- `npm test -w server` / `npm test -w client`: one workspace.
- Single test: `npm test -w server -- -t "gaps"` (Vitest `-t` matches the test name).
- `npm run build && npm start`: serves the built client and API on http://localhost:3000.
- `npm run dev`: server and Vite dev server together (Vite proxies `/api` to port 3000).
- No linter or formatter is configured.

## Architecture

- `server/src/app.js` exports `createApp(db, { staticDir })`; `index.js` only wires up the real DB and port. Tests call `createApp(openDb(':memory:'))` with supertest, so keep routes in `app.js`.
- SQLite via `better-sqlite3` (synchronous). `DB_PATH` sets the file (default `./data/todos.db`, git-ignored), `PORT` the port.
- In production the server serves `client/dist`; the client calls relative `/api/...` URLs (no CORS).
- Responses return `done` as a boolean; the DB stores 0/1. Text is trimmed and limited to 1-200 characters.
- Client is one component, `client/src/App.jsx`. Its tests mock `fetch` with Vitest.

## Gotchas

- Tests that use a single row hide bugs. A past planted bug (DELETE by list position instead of id) passed every test until a test with gaps in ids was added. Use several rows and out-of-order ids.
- Windows: write multi-file changes with the Write tool, not long shell heredocs. Stop a server by its port's process ID, never kill all `node` processes.

## Hooks and permissions (`.claude/settings.json`)

- Deny rule: `Read(./.env)`. Never read `.env` or try to get around the rule.
- PostToolUse hook runs Prettier (`.claude/hooks/format.mjs`, config in `.prettierrc`) on edited code files. It may reformat the whole file, so expect formatting-only diffs.
- Stop hook runs `npm test`; I can't finish a turn while tests fail. Fix the tests, don't bypass the hook.

## Git and privacy rules

- `main` is protected: change it only through a PR. Branch names: `feat/`, `fix/`, `chore/`, `docs/`.
- Commit email is the GitHub no-reply address (repo-local `user.email`). Never write the real email in any file, script or commit.
- `course/transcripts/` is exported with `node course/export-transcripts.mjs <logs-dir> course/transcripts`, which redacts emails and profile paths. Do not hand-write transcripts.
- Before pushing, check commit metadata as well as content: `git log --all --format='%ae %ce'`. A GitHub squash merge writes the account's email, so merge PRs with rebase.
- After each lesson: mark it done in `course/PROGRESS.md`, add a section to `course/PLAYBOOK.md`, re-export transcripts.
