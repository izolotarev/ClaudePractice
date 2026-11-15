# Claude Code playbook

Copy this file into any new project. Updated after each lesson. Lessons done: 1, 2, 3, 4, 5, 6, 7, 8.

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

## Lesson 4: Git and GitHub

**Prerequisite:** `gh auth login` (check with `gh auth status`; needs the `repo` scope).

**Steps that worked:**

1. `git init -b main`; `.gitignore` with `node_modules`, `.env`, `data/`, `client/dist`; `git add -A`; check `git status` for anything private before committing.
2. `gh repo create <name> --private --source . --remote origin --push`.
3. Branch: `git switch -c chore/short-description`; commit; `git push -u origin <branch>`; `gh pr create --base main --title ... --body ...`.
4. Branch rule on `main` through the API:
   `gh api -X PUT repos/<user>/<repo>/branches/main/protection --input -` with `required_pull_request_reviews` (0 approvals for a solo repo), `enforce_admins: true`, `required_status_checks: null`, `restrictions: null`.
5. Prove it: a direct `git push origin main` must fail with `GH006 ... Changes must be made through a pull request`.

**Branch names:** `type/short-description`: `feat/`, `fix/`, `chore/` (housekeeping), `docs/`. Git doesn't care; it's a label for humans.

**Gotchas:**

- **Branch protection needs a public repo or a paid plan.** A private repo on the free plan returns `403 Upgrade to GitHub Pro or make this repository public`. Run it right after switching visibility; if you get `Repository has been locked`, wait 10-20 seconds and retry.
- **Making a repo public can't be undone** (caches, search engines). Clean first.
- **Personal data in history stays in history.** Deleting a file in a new commit doesn't remove it. Check before the first push: `git grep -I -i "<your email>" $(git rev-list --all)`.
- **Use the GitHub no-reply email for commits:** `git config user.email "<user>@users.noreply.github.com"`.
- **Cleaning history** (`git filter-branch --env-filter` for emails, `--tree-filter` for file contents, then delete `refs/original`, expire the reflog, `git gc --prune=now`) fixes your local copy only. GitHub keeps old commits reachable through PR refs and by hash, so for a clean result **delete and recreate the remote repo**, then push the cleaned history.
- **Redact transcripts** (`course/export-transcripts.mjs` does it): emails become `user@example.com`, profile paths become `USER`. Match emails by pattern, never write the real address in a script.
- Claude commits, pushes and opens PRs only when asked, and adds a `Co-Authored-By` line to commits.
- Windows: Git warns "LF will be replaced by CRLF". Harmless.

## Lesson 5: CLAUDE.md and context

**Goal:** give Claude the facts it can't see in the code, and keep its context clean.

**Steps that worked:**

1. `/init` creates `CLAUDE.md`. Then cut it to under 50 lines. Keep only: test, build and run commands (including how to run a single test), architecture that takes several files to see, gotchas, and decisions not visible in code. Delete anything Claude would learn by reading the code (file trees, component lists, generic advice). Verify every command in it by running it.
2. `/context` shows what is loaded and how much of the window is used.
3. `/clear` between unrelated tasks. `/compact keep the API decisions` summarizes a long one.

**Reading `/context`:** the fixed overhead (system prompt, tools, skills) is about 10% of a 1M window; MCP tools are "deferred" (loaded by name only). The conversation itself was about 9.5% after a long session, so space is rarely the problem. The reason to `/clear` is quality and cost: old output distracts and is re-sent every turn.

**Gotchas:**

- `CLAUDE.md` loads at session start. One created mid-session will not appear in `/context` until the next `/clear` or restart.
- After `/compact`, root `CLAUDE.md` is reloaded. Path-scoped rules and nested `CLAUDE.md` files are not, until a matching file is touched again. A rule that must always apply goes in root `CLAUDE.md` or a hook.
- `CLAUDE.md` is guidance Claude can decide not to follow. Rules with no exceptions belong in deny rules and hooks (lesson 6).
- Put lessons that cost you time into `CLAUDE.md` (here: the privacy and git rules), so the next session doesn't repeat the mistake.
- Protected `main`: do `CLAUDE.md` changes on a `docs/` branch and merge with rebase.

## Lesson 6: Permissions and hooks

**Rules vs hooks:** `CLAUDE.md` is guidance Claude can ignore. Deny rules and hooks are enforced by Claude Code. Evaluation order: deny, then ask, then allow; first match wins. An allow can't override a deny, and a hook can't either.

**Config lives in `.claude/settings.json`** (committed, shared). Personal-only rules go in `.claude/settings.local.json`. Changes were picked up immediately, no restart.

**Step 1: deny rule.** `"permissions": { "deny": ["Read(./.env)"] }`. Create a `.env` with a fake value yourself (the rule also blocks Claude from writing it). Both the Read tool and `cat .env` were refused.

**Step 2: PostToolUse hook that runs Prettier.**

- Event `PostToolUse`, matcher `Edit|Write`, command `node "$CLAUDE_PROJECT_DIR/.claude/hooks/format.mjs"`.
- The hook gets a JSON description of the tool call on **stdin** (`tool_input.file_path`). There is no file-path environment variable.
- The docs' example uses `jq`, which is not installed on Windows by default. A small Node script that reads stdin does the same job with no extra tool. Use `.mjs` so Node reads `import` and top-level `await` without a `package.json` change.
- Add a `.prettierrc` that matches the existing style (here `singleQuote: true`, `printWidth: 120`), or Prettier rewrites every quote. Add a `.prettierignore` (`node_modules`, `client/dist`, `package-lock.json`, generated transcripts).
- Limit it to code extensions (`.js .jsx .mjs .json .css`) so notes in Markdown aren't reformatted.
- Side effect: the first edit to an old file reformats the whole file, which makes the diff noisy. Format everything once in its own commit, or accept it.
- The VS Code Prettier extension formats your own saves; the hook formats Claude's edits and works without VS Code. They share `.prettierrc`.

**Step 3: Stop hook.** `"Stop"` with command `cd "$CLAUDE_PROJECT_DIR" && npm test 1>&2 || exit 2`. Proof: change one assertion so a test fails, then let Claude finish. Claude Code refused and returned the failing output; Claude fixed it and finished.

**Facts and gotchas:**

- **Exit code 2 blocks. Exit 1 does not**; it only shows an error.
- The Stop hook gives up after 8 blocked stops in a row.
- A deny rule matches command text only. It doesn't stop a script that opens the file. For real isolation turn on `/sandbox`.
- A hook is code that runs with your permissions. Read hooks in a shared repo before trusting them.
- The Stop hook only checks Claude's turns. It does not cover your own edits, commits or pushes; required CI (lesson 8) does.
- Each Stop adds the full test time (about 4 seconds here).
- Check the docs before writing a hook. An assumed environment variable was wrong; the docs showed the stdin JSON instead.
- On Windows the docs' `jq` examples need Git Bash, or set `"shell": "powershell"`.

## Lesson 7: Subagents and review

**Goal:** a reviewer that didn't write the code.

**Steps that worked:**

1. Create `.claude/agents/reviewer.md`: frontmatter `name`, `description`, `tools: Read, Grep, Glob`, then a one-line instruction: `Compare the changed files to the spec. Report only gaps that affect correctness. Skip style.` Commit it so the team shares it.
2. `have the reviewer check the app against @SPEC.md`. The report came back with file:line references and no edits.
3. Turn the review's weak spots into work: it noted PATCH tests used one row. Add a test with several rows and gapped ids, plant the bug (patch by list position) to see the test **fail**, revert, see it pass.
4. `/code-review` on the branch diff. You type it; Claude can't launch it. It found no bugs and two low-severity test-diagnostic notes.

**Facts and gotchas:**

- **Agent files load at session start.** `reviewer.md` created mid-session was reported as "Agent type 'reviewer' not found". Restart the session (or reload agents) first. A general-purpose agent given the same instructions was the fallback.
- A subagent starts with fresh context and returns only a summary. It costs extra tokens and is no smarter; the value is parallelism, noise isolation and a fresh pair of eyes.
- Restricting `tools` to Read, Grep, Glob is what makes it unable to edit files. It also can't run tests, so its review is from reading only. Ask for `npm test` separately.
- "Skip style" keeps a reviewer from inventing nitpicks. Set `model: haiku` in the frontmatter for simple jobs.
- A reviewer's blind spot is its own claims: it said strikethrough was unverified because the CSS wasn't in the files it read. Treat "not checked" lines as follow-ups.
- Rebase merges change commit hashes, so `git branch --merged` won't list merged branches. Compare with `git cherry main <branch>` (lines starting `-` are already in main) or check PR state with `gh pr list --state all --head <branch>`.
- `gh pr merge <n> --rebase --delete-branch` also removes the local branch; run `git fetch --prune` afterwards to drop the stale remote ref.

## Lesson 8: GitHub Actions with Claude

**Goal:** CI gates every PR, and `@claude` works in GitHub.

**Steps that worked:**

1. `.github/workflows/ci.yml`: on `pull_request`, checkout, `setup-node` (Node 22, `cache: npm`), `npm ci`, `npm test`. Open the PR, let it run once.
2. Branch rule on `main`: tick "Require status checks to pass", then search for `test` and add it. The list stays empty until the check has run once in the last 7 days. Save the rule (easy to miss at the bottom).
3. `/install-github-app` is **not available in the VS Code extension**. Do it by hand: install the Claude app at github.com/apps/claude for this repo only, run `claude setup-token` in a normal terminal, store the result as the repo secret `CLAUDE_CODE_OAUTH_TOKEN`, and write `.github/workflows/claude.yml` using `anthropics/claude-code-action@v1`. Merge it.
4. Create an issue and comment `@claude add input validation`. Claude pushes a `claude/issue-N-...` branch and comments a "Create PR" link; it did **not** open the PR itself. Review the diff against `SPEC.md`, open the PR, wait for CI, merge.
5. Limits: `timeout-minutes: 15` on the job, `claude_args: --max-turns 8` on the action.

**Facts and gotchas:**

- **Workflows triggered by comments or issues run the file on `main`.** `@claude` did nothing until `claude.yml` was merged.
- **A 401 hides behind a 2-second failure.** The run showed "Claude encountered an error after 2s", cost 0, no turns. Adding `show_full_output: true` revealed `authentication_failed` (401). The fix was re-entering the token through the GitHub web form, where the pasted value is visible. Remove `show_full_output` afterwards: full output puts more detail in the run log.
- `gh secret list` shows only that a secret exists, not whether it is valid. Never paste a token into chat or a file.
- Claude's own error comment triggers a second run that is "skipped". Harmless.
- A workflow edit goes through a PR like everything else, and each PR needs the `test` check green before a rebase merge.
- "Require branches to be up to date" means a second PR must be updated after the first merges. Good for correctness, slower for parallel work.
- Commits by the action are authored by `claude[bot]` (no-reply address); rebase merging keeps the committer as your no-reply address too.
- Only users with write access can trigger the action. Treat issue and comment text as untrusted input and keep permissions minimal.

## Todo app stack (reuse as a template)

- Root `package.json` with npm workspaces `client` and `server`; scripts `build`, `start`, `test`, `dev`.
- Server: Express + `better-sqlite3`; `createApp(db, { staticDir })` kept separate from `index.js` so tests use `:memory:`.
- Client: React + Vite, `vite.config.js` proxies `/api`; tests with Vitest, jsdom, Testing Library.
- `.gitignore`: `node_modules`, `.env`, `data/`, `client/dist`.
- Reference implementation: `C:\Repositories\SampleApp`.

## Windows notes

- Long multi-file shell heredocs can fail in Git Bash. Use the Write tool for files.
- Stop a server by its port's process ID, not by killing all of `node`.
