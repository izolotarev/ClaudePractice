# Session 7
Source: d49d68e7-da5d-419d-a52b-5c6d52567bae.jsonl
Started: 2026-11-17T03:31:08.410Z

## You

Summarize SPEC.md in 5 bullets

> **Tool:** Read {"file_path":"c:\\Repositories\\SampleApp\\SPEC.md"}

> Result:
```
1	# Todo app: spec
2	
3	## Goal
4	A single-list todo web app: add, complete, and delete todos. Learning project for CI/CD with Claude Code.
5	
6	## Decisions (from interview)
7	- Frontend: React + Vite, in `client/`
8	- Backend: Node + Express, in `server/`
9	- Storage: SQLite via `better-sqlite3`
10	- Features v1: add, complete (toggle), delete. Nothing else.
11	- No users, no login. One shared list.
12	- Tests: Vitest for API (with supertest) and React components (with Testing Library)
13	- Deploy: Render free tier. Data resets on each deploy, which is accepted.
14	
15	## Assumptions (change if wrong)
16	- Node 20 or newer.
17	- A todo's text is 1 to 200 characters after trimming whitespace.
18	- Todos are listed oldest first.
19	- The server serves the built client (`client/dist`) in pr
… [truncated 2296 chars]
```

## Claude

- **Goal:** A single-list todo web app with add, complete (toggle) and delete. It has no users or login, and it doubles as a CI/CD learning project.
- **Stack:** React + Vite client in `client/`, Node + Express server in `server/`, SQLite via `better-sqlite3`, and Vitest for tests (supertest for the API, Testing Library for the UI). It deploys to Render's free tier, and data resets on each deploy.
- **API:** `GET/POST /api/todos`, `PATCH/DELETE /api/todos/:id` and `GET /api/health`. Todo text is 1–200 characters after trimming. Errors are 400 for invalid input and 404 for an unknown id. Responses return `done` as a boolean, though the DB stores 0/1.
- **UI:** Text input with an Add button (Enter also adds, and the input clears afterward). Each todo has a checkbox, strikethrough text when done, and a Delete button. There is an empty state ("No todos yet") and a short error message when a request fails or the input is whitespace-only.
- **Config and done criteria:** `DB_PATH` (default `./data/todos.db`; tests use `:memory:`) and `PORT` (default 3000). In production the server serves `client/dist`, and in dev Vite proxies `/api`. Done means `npm test` passes with every route and error case covered, `npm run build && npm start` works, data persists across reload, `/api/health` returns ok, and no `.env` or DB file is committed. Editing, filters, due dates, ordering, accounts and pagination are out of scope.
