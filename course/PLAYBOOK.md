# Claude Code playbook

Copy this file into any new project. Updated after each lesson. Lessons done: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.

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
4. `/code-review` on the branch diff. You can type it, and Claude can also start it when you ask for a review in plain words. It found no bugs and two low-severity test-diagnostic notes.

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

## Lesson 9: Deploy

**Goal:** `main` goes live through CI, not from your laptop.

**Steps that worked:**

1. Render: New Web Service from the GitHub repo. Build `npm ci && npm run build`, start `npm start`, health check path `/api/health`. **Turn Auto-Deploy off**, otherwise Render deploys every push itself and skips tests, approval and the smoke test.
2. Copy the service's Deploy Hook (Render, Settings, Deploy Hook). Save it as the repo **secret** `RENDER_DEPLOY_HOOK` through the GitHub web form or `gh secret set`. Save the public URL as the **variable** `APP_URL` (no trailing slash). Secrets are write-only and masked in logs, variables are visible.
3. GitHub: Settings, Environments, new environment `production`, tick Required reviewers and add yourself. Free for public repos.
4. `.github/workflows/deploy.yml`: on push to `main` (and `workflow_dispatch`), job `test`, then job `deploy` with `needs: test` and `environment: production`. The deploy step posts to the hook with `&ref=$GITHUB_SHA` so the tested commit is deployed; the hook URL goes through an env var and is never echoed. `concurrency: deploy` with `cancel-in-progress: false` queues deploys instead of overlapping them.
5. Smoke test step: retry every 15 seconds for 10 minutes, passing only when `/api/health` is ok, `/` contains `id="root"` and `/api/todos` returns a JSON array.
6. Break and roll back: PR #13 changed `client/dist` to `client/distt` in `server/src/index.js`. Tests passed (`index.js` is not covered) and the deploy went green, but `/` returned 404. Rolled back with `git revert` on a branch, a PR, the usual `test` check, then approval of the second deploy.

**Facts and gotchas:**

- **Health-only smoke tests miss real outages.** With the break live, `/api/health` stayed 200 while the home page was dead, and the run was green. Check what users need: the page, a data route. Fixed in a follow-up PR.
- **Pick a break that passes CI.** A broken health route fails the required `test` check and can never merge, so it can't demonstrate a bad deploy.
- **A smoke test cannot tell old from new.** The previous version answers `/api/health` too, so attempt 1 can pass before the new build is live. An exact check needs the health route to report the build's commit (Render sets `RENDER_GIT_COMMIT`); that would change SPEC.md.
- **Confirm the deployed commit in the Render dashboard** (Events or Deploys tab). Here it showed the commit that CI had tested.
- **Roll back with a revert PR, not a dashboard redeploy.** A dashboard rollback bypasses git, so `main` keeps the bug and the next push redeploys it. A revert goes through the same gate.
- Every merge to `main` triggers a deploy run that waits for approval, including docs-only PRs. Approve or reject it from the run page (Review deployments); a human decision is the point.
- Auto mode blocks production deploys by default. Keep deploy credentials in GitHub Secrets, out of Claude's reach.
- In Git Bash, `curl -w "/api/x %{http_code}"` labels can get a path prefix like `C:/Program Files/Git/`: MSYS rewrites strings that look like paths. The request itself is unaffected.
- Actions `checkout@v4` and `setup-node@v4` currently warn about Node 20; bump the versions in a chore PR when needed.

## Lesson 10: Headless, cost, wrap-up

**Goal:** run Claude without the interactive UI, know what it costs, and set up unattended runs safely.

**Steps that worked:**

1. Headless run: `claude -p "Summarize SPEC.md in 5 bullets" --allowedTools "Read" --output-format json --max-turns 3 --max-budget-usd 0.50`. The JSON has `result`, `num_turns`, `total_cost_usd`, `usage`, `session_id` and `is_error`; scripts read `result` and check `is_error`. Result: 2 turns, 14 s, **$0.08**.
2. `/effort low` for quick edits, `high` for hard bugs, `/model` to switch. Effort applies to the current session only.
3. Unattended-run checklist, checked against `claude.yml` (below).
4. Harden `claude.yml` (PRs #17 and #19): `setup-node` and `npm ci` before the action, then `claude_args` with `--max-turns 12`, `--max-budget-usd 1` and `--allowedTools "Bash(npm test:*)"`.
5. Test with a throwaway issue and `@claude`: both flags were accepted, Claude ran `npm test` before pushing (server 36 passed), cost **$0.115**.

**Unattended-run checklist:**

| Item | In this repo |
|---|---|
| Done criteria | A specific issue plus `SPEC.md` and `CLAUDE.md`. Nothing enforces it. |
| Self-check | Allow exactly `Bash(npm test:*)` and install dependencies first, otherwise tests can't run. |
| Allowed scope | The token can push branches but cannot merge: `main` needs a PR and the `test` check, admins included. No other secrets are passed. |
| Stop limits | `--max-turns`, `--max-budget-usd`, `timeout-minutes`. Turns and minutes limit time, only the budget flag limits money. |
| Human merge | PR plus required `test`. The rule requires 0 approving reviews, so reading the diff is a habit, not a rule. |

**Facts and gotchas:**

- **A short task still carries a big fixed context.** The 5-bullet summary cost 8 cents: about 17k tokens written to the cache and 69k read back, only 595 output tokens. Claude Code's instructions and your memory files go with every call. `/clear` between tasks.
- **Cache lifetime:** the usage showed `ephemeral_1h_input_tokens`, so a subscription login gets the 1-hour cache. With an API key it is about 5 minutes.
- **`--bare` was not tried here.** It skips your login and needs `ANTHROPIC_API_KEY` (billed per token), which was not set. Without `--bare`, `claude -p` loads the repo's hooks and settings.
- **Repo hooks run inside the Action too.** The Prettier hook reformatted the whole test file Claude edited; Claude reverted and re-applied its change with a script. Expect formatting noise and extra turns.
- **Self-checking costs turns.** With `--max-turns 8` the run used 9 turns, and the action marked it **failed** ("successful result after 9 turns, exceeding the maximum of 8") although the work was pushed. 12 leaves room for read, edit, test, commit.
- **A failed run can still leave a good branch.** Check the issue comment and `git branch -r` before assuming nothing happened.
- **Pick test issues carefully.** The throwaway issue asked for a test that already existed. Check the code before delegating, then close the issue and delete the branch if it adds nothing.
- Every merge to `main` starts a Deploy run that waits for approval, including workflow-only and docs-only PRs. Approve or reject them from the run page.

**After the course:** parallel work (`claude -w`, worktrees, `/batch`), skills (`.claude/skills/`), prompt-injection testing, team settings. All in the docs at code.claude.com/docs/en.

## TDD: red-green on a real feature (after the course)

Built "clear completed" twice, API first (PR #22), then the button (PR #23).

**The cycle:**

1. **Spec first.** Add the behavior to `SPEC.md` (API row, UI bullet, the Features line).
2. **Red.** Write the tests only, no production code. Use several rows, gapped ids and out-of-order state. Run them and read the failure: it must fail for the right reason (`expected 404 to be 200`, `Unable to find role="button" and name "Clear completed"`), not a typo or import error.
3. **Green.** Write the smallest code that passes, then run the full suite (`npm test`).
4. **Guard check.** Break the code on purpose, see the tests go red, restore. Here: route moved after `/:id` (3 server tests failed), button always visible, list not updated, wrong URL (each caught by a client test).
5. **Review.** The `reviewer` agent compares the diff with `SPEC.md`; it only reads, so run the tests yourself. Then PR, required `test`, rebase merge, approved deploy, check the live site.

**Facts and gotchas:**

- **A test that passes before the code exists proves nothing.** "Hides the button while nothing is done" passed in the red step because no button existed. It only means something after you make the button always visible and watch it fail.
- **Read the red message.** A route named `completed` was swallowed by `/api/todos/:id` and answered 404. The test found it before any code existed. The fix is registering the route before `/:id`, with a comment saying why.
- **The Prettier hook adds noise.** It fires on every Edit and Write and can reformat a whole file that isn't Prettier-formatted (`client/src/App.jsx`, `client/src/App.test.jsx`, `server/test/api.test.js`). It rewrote 10 unrelated lines of the server test file. Check `git diff --stat`; for those files apply the change with a script (the hook does not fire for shell edits) so the diff holds only the feature.
- **The Stop hook blocks a red turn.** It stops me finishing while tests fail, so the red-to-green step must complete inside one turn. A red test cannot be left on a branch between turns.
- **Green is not "correct".** It only means the tests you wrote pass. Mocked-`fetch` UI tests cannot show layout or real behavior, so click the feature in a browser after the deploy.
- **Check the live data before testing a destructive endpoint.** `DELETE /api/todos/completed` removes every done todo. Read `GET /api/todos` first and use a throwaway todo.

**Test first or code first?** Default to test first, and use code first on purpose.

| Situation | Approach | Why |
|---|---|---|
| Clear, checkable behavior: API rules, validation, component state, bug fixes | **Test first** | The failing test is a target I can't fudge; it exposes wrong guesses early (the swallowed route) |
| Exploring or prototyping, unsure what you want | Code first, then rewrite test first | Learn from a throwaway, then build it properly |
| Glue and config: `index.js`, workflows, deploy settings | Code first, then add the check that would have caught it | Unit tests don't reach it; the `client/distt` break passed every test. Use the smoke test and a real run |
| Layout and styling | Build, then look in a browser | Tests can't judge appearance |
| A bug you can't reproduce | Find the cause in the running app first, then write the test that fails because of it | You need a reproduction before a meaningful red test |
| Large code with no tests | Add tests around current behavior first, then change it | A safety net before edits |

**Why test first suits Claude in particular:** I stop when work looks finished, so a failing test is a definition of done I can check. Tests I write after the code tend to copy my bugs. Four short tests are also the cheapest thing for you to review.

**How to ask (two turns you can inspect):**

1. `Update SPEC.md, then write the tests only, run them, and show me the failure. Explain each test in one plain sentence. Don't write the feature yet.`
2. `Now write the smallest code that passes, and run the full suite.`

The Stop hook blocks a red turn, so unless you switch it off briefly, red and green happen in one turn. Ask for the failure output in my message so you still see the red step.

**Not a testing expert? You don't need to be.** Claude writes the tests. Your job is judgment about the product, not test code:

1. Describe the behavior in plain words in `SPEC.md`.
2. Read the test names and the failure message. Check that the names match what you asked for and the failure says something sensible (`button not found`, `expected 404 to be 200`).
3. See green, then try the feature in the browser.

| Worry | What to do |
|---|---|
| "I can't tell if the tests are good" | Ask: `List what each new test checks in one plain sentence, and which case isn't covered.` |
| "I don't understand the failure" | Ask me to explain it. Fluency is not required. |
| "Tests passed, is that enough?" | Green only means the tests I wrote pass. Try the feature yourself. |
| "Too much ceremony" | Scale it down: full cycle for logic that stores or deletes data and for validation; for small changes ask for test and code, make sure the suite runs, and look at the result; for visuals and config, a quick look in the browser is the right check. |

You don't need to learn how to write test code or terms like mocks and fixtures. Keep one habit: send the first prompt above, read the output, then `Now write the smallest code that passes, and run the full suite.` If a task feels too big to describe, split it. A feature you can state in a few sentences is one you can check, with or without testing skills.

**Avoid:** tests and code in the same breath with no test run in between (a test can pass without ever being red); treating green as correct; testing trivia such as whether `setError('')` is called. Test what a user or caller can see.

## Review with /code-review (extra, after the course)

**Goal:** get an independent bug hunt on a diff, and know when to use it instead of the `reviewer` agent.

**What we did:** on a practice branch (`fix/review-practice`, never pushed) I planted one bug. `GET /api/todos` ordered by `text COLLATE NOCASE` instead of `id`, so todos came back alphabetically, against the spec's "oldest first". All 48 tests stayed green, because the "oldest first" test adds only `'a'` then `'b'`, which is alphabetical and insertion order at once. I committed it with a neutral message ("Tidy GET /api/todos query") so the message gave no hint.

**What each tool did:**

| Run | Findings | Found the bug | Notes |
|---|---|---|---|
| `/code-review` (no level), twice | 5, then 4 | Yes, both | Cited `SPEC.md` lines; the second run named the weak test |
| `/code-review low`, twice | 1 each | Yes, both | Short and on target. Said "SPEC.md was not checked" and still caught it from the code |
| `/code-review high` | 5 | Yes | Added tie order, ASCII-only `NOCASE`, missing test, sort cost |
| `/code-review client/src` (path target) | 10 | n/a | Reviewed existing code the branch never touched |
| `reviewer` agent | 1 bug plus the test gap | Yes | Cited the spec, explained why the tests missed it, and confirmed the other requirements were fine |

**Facts and gotchas:**

- **You can type it, and Claude can start it** when you ask for a review in plain words. Earlier notes said it couldn't; that was too absolute.
- **Runs differ.** The same command gave 5 findings, then 4, with different wording. Treat it as a second opinion, not a checklist.
- **Deeper is not always better.** `low` gave the main bug with no noise. `high` added a few real points (the weak test, tie order) and several minor ones.
- **Some findings are wrong, and a wrong one can repeat.** Every deeper run read "ordering" in the spec's out-of-scope list as forbidding the sort. That line most likely means custom reordering. If a false finding keeps coming back, check whether the spec wording is ambiguous.
- **The level is remembered.** If you type no level, it reuses the last `low` to `max` you typed, even in a later session, and prints "Reusing high effort". Type the level you want.
- **A path target reviews the code as it is, not the diff.** `client/src` returned 10 findings on files this branch never touched, several speculative. Use a path for an audit of one area, not for reviewing a PR.
- **It can read `SPEC.md`.** The docs say it reads `CLAUDE.md`, but it can open repo files, and our `CLAUDE.md` names `SPEC.md` as the source of truth. At `low` it did not check the spec. For a spec check, use the `reviewer`.
- **The `reviewer` can't run `git`.** Tell it which files changed, not what the bug is, so it has to find the gap by comparing with the spec.
- **`--fix` edits sit outside `/rewind` checkpoints.** Commit first, check `git diff`, and undo with git. In our practice run the branch was clean afterwards, so no `--fix` edits were observed.
- **It is advice, not a gate.** Tests, the required `test` check, branch protection and your merge approval stay the gates.
- **It uses your session's usage.** Run it once per PR, not after every edit.

**Where it fits:** `spec, red, green, guard check, commit, reviewer (spec check), /code-review, fix what is real, PR, CI, merge, deploy`. Use `low` for small changes and `high` for risky code. Skip it for docs-only PRs. Triage: fix Important, skip Nits, note Pre-existing.

**Which tool for which job:**

| Situation | Use |
|---|---|
| A feature with a spec | The `reviewer` agent first (it checks requirements and says what is fine), then `/code-review` |
| Any other code change | `/code-review low`, or `high` for risky code |
| Audit of an area you did not change | `/code-review <path>`; expect some speculative findings |
| You want fixes applied | Commit, `/code-review low --fix`, then check `git diff` and `npm test` |
| You want comments on a PR | `--comment`, only when a PR exists and others should see it |

Skip it for docs-only PRs, tiny edits and half-written code. Run it once per PR, not after every commit. Type the level, because the last one you typed is remembered.

**Turn a finding into a test.** The reviewer's suggestion is the regression test for this bug: add `'c'`, `'a'`, `'b'` and expect that order back. It goes red against the planted query.

**Not covered:** an explicit `main...branch` target (output not recorded), a PR-number target, `--comment`, `ultra`, and the managed GitHub Code Review service.

## Where you review as a human

Tests, `/code-review` and the `reviewer` agent support your review. They do not replace it. They cannot tell whether the feature is the right one, how it feels to use, or whether a plausible change quietly broke something nobody tested.

**Your checkpoints, in order:**

| When | Where | What you check |
|---|---|---|
| Before any code | `SPEC.md` | Is the behavior what you want? Everything else is checked against it, so this review is worth the most |
| Red step | Test names and the failure message | Do the names match what you asked for? Does the failure say something sensible (`expected 404 to be 200`), not a typo? |
| After the change | The PR, "Files changed" tab | The diff, read in the order below |
| Before merging | The PR's checks | The required `test` check is green |
| Deploy | The Actions approval screen | Is it the commit you expect, and is it safe to ship? |
| After the deploy | The live site | Does the feature work in a browser? |

The PR diff is the only checkpoint where you read code.

**Reading order for a PR diff** (do not start at the top of the file list):

1. The PR title and description. A vague title for a behavior change is a warning sign: the planted bug was committed as "Tidy GET /api/todos query".
2. The `SPEC.md` change, if any.
3. The tests. Several rows? Out-of-order cases? Would they go red if the code broke? A weak test is a bigger risk than odd-looking code.
4. The production code, only what changed.
5. Anything outside the feature: unrelated edits, reformatting noise (`git diff --stat`), new dependencies, config changes.

**Read closely when the change touches:**

- Data that is deleted, overwritten or stored (`DELETE` routes, any `WHERE`). A wrong condition is silent data loss.
- Validation and limits (the 200-character rule, id parsing).
- Workflows and deploy files (`.github/workflows/*`, the Render hook, the smoke test). Tests do not cover them: the `client/distt` typo passed every test.
- Permissions and hooks (`.claude/settings.json`, deny rules, the Stop and Prettier hooks). A loosened rule is easy to miss.
- Secrets: no token or `.env` content in the diff.
- `CLAUDE.md` and other instruction files. They shape every later session.
- Dependencies: new packages in `package.json`, and why.

**Skim, don't dwell, on:** docs-only changes, mechanical test additions once the failure message made sense and the suite is green, and formatting (Prettier handles it).

**Questions to ask while reading:**

- Does this do only what the PR says?
- What happens with an empty list, a huge value, a missing id, or two requests at once?
- Could it delete or expose something it should not?
- Would I notice if it broke? Is there a test or smoke check that would?
- If it is wrong in production, how do I undo it? (Here: a revert PR.)

**Keep it manageable:**

- Keep PRs small: one behavior per PR, as with the API and the button. A diff you can read in five minutes gets read properly.
- If part of a diff is unclear, ask `explain what this change does and what could go wrong`, then check the answer against the code.
- Scale the care to the stakes. For a toy app, read data-touching code and workflows closely and skim the rest. For real users or money, review more carefully or get a second person.

## Todo app stack (reuse as a template)

- Root `package.json` with npm workspaces `client` and `server`; scripts `build`, `start`, `test`, `dev`.
- Server: Express + `better-sqlite3`; `createApp(db, { staticDir })` kept separate from `index.js` so tests use `:memory:`.
- Client: React + Vite, `vite.config.js` proxies `/api`; tests with Vitest, jsdom, Testing Library.
- `.gitignore`: `node_modules`, `.env`, `data/`, `client/dist`.
- Reference implementation: `C:\Repositories\SampleApp`.

## Windows notes

- Long multi-file shell heredocs can fail in Git Bash. Use the Write tool for files.
- Stop a server by its port's process ID, not by killing all of `node`.
