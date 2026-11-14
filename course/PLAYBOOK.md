# Claude Code playbook

Copy this file into any new project. Updated after each lesson. Lessons done: 1, 2, 3.

## Lesson 1: Operate a session safely

- `Shift+Tab` cycles permission modes: Manual (asks before edits and commands), Accept edits, Plan (no edits), Auto (safety classifier, default in VS Code).
- `Esc` mid-run stops the task. Everything done so far is kept.
- `/rewind` (or Esc twice) restores earlier file edits.
- **Gotcha:** `/rewind` only restores files edited with Claude's file tools. Files changed by shell commands, deploys and database changes are not restored. Git is the real safety net (lesson 4).
- Auto mode can block commands it judges too broad (e.g. killing every `node` process). Target the one process you started instead.

## Lesson 2: Specific prompts, spec, build

**Prompt rule:** name the files, state the symptom or goal, say what "done" means.

- Vague: `make a todo app`
- Specific: `Node + Express, plain HTML frontend, add/complete/delete, npm test runs Vitest, npm start serves on port 3000, no other libraries.`

**Workflow that worked:**

1. Interview: `I want a <thing>. Interview me until you could write the spec, then write it to SPEC.md.` Answer the questions.
2. `/clear`, then: `Build the app from @SPEC.md. Done means npm test passes and npm run build && npm start serves it on port 3000.`
3. Use `@file` to point at files instead of describing them.
4. Ask for evidence at the end: run the commands and show the output.

**SPEC.md sections to reuse:** Goal, Decisions (from interview), Assumptions (change if wrong), Data model, API table (method, path, body, success, errors), UI, Out of scope, Repo layout, Definition of done (numbered, checkable).

**Facts:**

- "Be ambitious" widens scope (edge cases, empty states). It does not make Claude think harder. `/effort` does.
- Plan mode (`Shift+Tab`) lets Claude propose before editing.
- `/clear` ends the conversation, not the files. Anything worth keeping goes in a file.

## Lesson 3: Tests as the check

**Why:** Claude stops when work looks finished. A command with pass/fail output lets it find and fix its own errors. Passing tests only prove what the tests cover.

**Prompts that worked:**

- `Add Vitest tests for add, complete, delete. Run them and show me the output.`
- `Make sure the app works.` (After a bug is planted. A good answer runs the tests, then exercises the running app with data the tests don't use.)

**Workflow that worked (test first):**

1. Plant a bug where no test looks. Example: DELETE removes the row at position `id - 1` instead of the row with that id. It passes while ids run 1, 2, 3 with no gaps.
2. Confirm the old tests still pass (they did: 13 of 13). This shows the gap.
3. Find the bug by running the real app: add several todos, delete from the middle, check the list. Use a temp `DB_PATH` and a spare `PORT` so real data and port 3000 stay untouched.
4. Write the missing test and run it against the buggy code. It must **fail**. That proves the test can see the bug.
5. Fix the code, rerun. The test passes.

**Gotchas:**

- Always ask for the command and its output, not just "done".
- A test that has never failed has not been shown to work.
- Tests that use one row can't catch bugs that depend on several rows, gaps, or order. Vary the data.
- A bug you wrote yourself is not a fair test of Claude, because it knows where to look. Judge by what it actually ran.
- The strongest check ladder: prompt (`run tests until they pass`), then `/goal`, then a Stop hook (lesson 6), then CI (lesson 8).

## Todo app stack (reuse as a template)

- Root `package.json` with npm workspaces `client` and `server`; scripts `build`, `start`, `test`, `dev`.
- Server: Express + `better-sqlite3`; `createApp(db, { staticDir })` kept separate from `index.js` so tests use `:memory:`.
- Client: React + Vite, `vite.config.js` proxies `/api`; tests with Vitest, jsdom, Testing Library.
- `.gitignore`: `node_modules`, `.env`, `data/`, `client/dist`.
- Reference implementation: `C:\Repositories\SampleApp`.

## Windows notes

- Long multi-file shell heredocs can fail in Git Bash. Use the Write tool for files.
- Stop a server by its port's process ID, not by killing all of `node`.
