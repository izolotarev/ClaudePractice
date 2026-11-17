# Todo app: spec

## Goal
A single-list todo web app: add, complete, and delete todos. Learning project for CI/CD with Claude Code.

## Decisions (from interview)
- Frontend: React + Vite, in `client/`
- Backend: Node + Express, in `server/`
- Storage: SQLite via `better-sqlite3`
- Features v1: add, complete (toggle), delete, and clear completed (`DELETE /api/todos/completed`). Nothing else.
- No users, no login. One shared list.
- Tests: Vitest for API (with supertest) and React components (with Testing Library)
- Deploy: Render free tier. Data resets on each deploy, which is accepted.

## Assumptions (change if wrong)
- Node 20 or newer.
- A todo's text is 1 to 200 characters after trimming whitespace.
- Todos are listed oldest first.
- The server serves the built client (`client/dist`) in production, so there is one URL and no CORS.
- In development, Vite proxies `/api` to the server.
- The SQLite file path comes from `DB_PATH` (default `./data/todos.db`). Tests use `:memory:`.
- Port comes from `PORT` (default 3000).

## Data model
`todos(id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)`

## API (JSON)
| Method | Path | Body | Success | Errors |
|---|---|---|---|---|
| GET | `/api/todos` | | 200, array of todos | |
| POST | `/api/todos` | `{ "text": string }` | 201, the new todo | 400 if text missing, empty, or over 200 chars |
| PATCH | `/api/todos/:id` | `{ "done": boolean }` | 200, the updated todo | 400 if `done` is not a boolean; 404 if no such id |
| DELETE | `/api/todos/:id` | | 204 | 404 if no such id |
| DELETE | `/api/todos/completed` | | 200, `{ "deleted": number }`, the count of removed todos (0 if none were done) | |
| GET | `/api/health` | | 200, `{ "status": "ok" }` | |

A todo is `{ id, text, done, created_at }` with `done` as a boolean in responses.

## UI
- Text input and an Add button. Enter also adds. Input clears after adding.
- List of todos. Each has a checkbox (toggles done), the text (struck through when done), and a Delete button.
- Empty state: "No todos yet".
- Error state: if a request fails, show a short message and keep the list unchanged.
- Whitespace-only input shows no request and a short message.
- A "Clear completed" button appears only while at least one todo is done. Clicking it calls `DELETE /api/todos/completed` and removes the done todos from the list, keeping the open ones. If the request fails, show the short error message and keep the list unchanged.

## Out of scope
Editing text, filters, due dates, ordering, accounts, pagination, deploys with persistent storage.

## Repo layout
```
client/   React + Vite app, its tests
server/   Express app, SQLite code, its tests
```
Root `package.json` scripts: `build` (build client), `start` (run server serving `client/dist`), `test` (run all tests), `dev` (server and client together).

## Definition of done
1. `npm test` passes from the repo root, covering every API route (success and each error case) and the main UI actions.
2. `npm run build && npm start` serves the app at http://localhost:3000.
3. In the browser, I can add, complete, and delete a todo, and it persists across a page reload.
4. `GET /api/health` returns `{"status":"ok"}`.
5. No `.env` or database file is committed (`.gitignore` covers `node_modules`, `.env`, `data/`, `client/dist`).
