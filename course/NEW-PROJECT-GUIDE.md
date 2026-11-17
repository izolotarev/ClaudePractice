# New project guide: from an empty folder to a deployed app

A reusable checklist based on the 10-lesson course (`course/PLAYBOOK.md` has the full notes per lesson). It assumes a Node web app deployed to Render, the same stack as the todo app. Swap the commands for another stack, keep the structure.

Legend: **[you]** = only you can do it (a website, a secret, an approval). **[claude]** = ask Claude Code to do it. Items marked *(not done in the course)* are suggestions I added, not things we tried.

## The big picture

```
idea -> SPEC.md -> CLAUDE.md -> code + tests (local, with hooks)
     -> branch -> PR -> CI "test" (required) -> merge with rebase
     -> push to main -> Deploy workflow: test -> YOUR approval -> Render hook -> smoke test
     -> broken? revert PR, same pipeline
```

Rules that never change:
1. `main` changes only through a PR with a green `test` check.
2. Production changes only through the Deploy workflow, never from your laptop.
3. A person approves the production step and merges every PR.
4. Secrets live in GitHub Secrets. Never in files, chat or commits.

## Workflows at a glance

| File | Starts when | What it does |
|---|---|---|
| `.github/workflows/ci.yml` | a pull request is opened or updated | `npm ci`, `npm test`. Required check named `test`. |
| `.github/workflows/claude.yml` | a comment, issue or review contains `@claude` | Runs Claude on a throwaway VM, pushes a `claude/...` branch. You open the PR. |
| `.github/workflows/deploy.yml` | a push to `main`, or the manual button | tests, then waits for your approval, calls the Render hook, runs the smoke test. |

Local guardrails (in `.claude/`): a deny rule for `.env`, a Prettier hook after edits, a Stop hook that blocks finishing while tests fail, and a read-only `reviewer` subagent.

---

## Phase 0: Accounts and tools (once, not per project)

- [ ] **[you]** GitHub account. In Settings, Emails: turn on "Keep my email addresses private" and note your no-reply address, `<id>+<username>@users.noreply.github.com`.
- [ ] **[you]** Install Node 20+, git, the GitHub CLI (`gh auth login`), and Claude Code.
- [ ] **[you]** Render account, connected to GitHub.
- [ ] **[you]** A Claude subscription (for the `@claude` Action token) or an API key.

## Phase 1: Empty folder to first commit

- [ ] Create the folder and run `git init -b main`.
- [ ] **Privacy first.** Set the commit email for this repo only, before the first commit:
  ```
  git config user.name "<your name>"
  git config user.email "<id>+<username>@users.noreply.github.com"
  ```
  Never write your real email in any file, script or commit.
- [ ] Add `.gitignore`: `node_modules`, `.env`, `data/` (any local database), `client/dist` (build output).
- [ ] Create the GitHub repo and push the first commit straight to `main`. This is the only direct push to `main` you will ever do, because branch protection comes after it (Phase 6).
  ```
  gh repo create <name> --public --source . --remote origin --push
  ```
- [ ] Check what you are about to publish: `git log --all --format='%ae %ce'` must show only no-reply addresses.

## Phase 2: Write the spec before any code

Open Claude Code in the folder and ask it to **interview you** about the project, then write `SPEC.md`. Specific prompts beat vague ones.

`SPEC.md` is the source of truth. Include:
- **Goal** in one sentence, and **decisions** (frontend, backend, storage, test tools, deploy target).
- **Assumptions**, written so you can correct them (limits like "text is 1 to 200 characters", defaults, ports).
- **Data model** and an **API table** (method, path, body, success, each error).
- **UI behavior**, including empty and error states.
- **Out of scope** (prevents Claude from adding features).
- **Definition of done**, as a numbered list you can verify.
- A **`GET /api/health`** route returning `{"status":"ok"}`. The deploy needs it later.

Commit the spec on a branch and merge it by PR as soon as Phase 6 is in place, or commit it before protecting `main`.

## Phase 3: `CLAUDE.md`

Create it at the repo root (`/init` can draft it, then trim). Keep it short, because it is sent with every call and costs tokens each time. Put in:
- One paragraph on what the app is and that `SPEC.md` is the truth.
- **Commands**: install, test (all, one workspace, a single test), build, start, dev.
- **Architecture** in a few lines: where routes live, how tests create the app, which env vars exist (`PORT`, `DB_PATH`).
- **Gotchas** that cost you time. Example from the course: tests with a single row hid a bug, so always use several rows and out-of-order ids.
- **Git and privacy rules**: branch names (`feat/`, `fix/`, `chore/`, `docs/`), "main is protected", no-reply email, merge with rebase.
- **Hooks**: what they do, and that Claude must fix failing tests, not bypass the hook.

## Phase 4: Build with tests as the check

- [ ] **[claude]** Plan first, then build in small steps: server, then client.
- [ ] Keep the app factory separate from the entry point, for example `createApp(db, options)` in `app.js` and only wiring in `index.js`. Tests then run against an in-memory database with no network.
- [ ] **Build behavior test first.** Write the test, run it, read the failure (it must fail for the right reason, not a typo or import error), then write the smallest code that passes. Ask: `Write the tests only, run them, and show me the failure. Explain each test in one plain sentence. Don't write the feature yet.`, then `Now write the smallest code that passes, and run the full suite.` Go code first only on purpose, for exploring, glue and config, visuals, or a bug you can't reproduce yet, and then add the check that would have caught it (see the table in `course/PLAYBOOK.md`).
- [ ] **Not a testing expert? You don't need to be.** Claude writes the tests. Your part is to describe the behavior in plain words (in `SPEC.md`), read the test names and the failure message, and see green. Keep one habit: send the two prompts above (the first asks for a one-sentence explanation of each test, the second says `Now write the smallest code that passes, and run the full suite.`). If you can't tell whether the tests are good, ask: `List what each new test checks in one plain sentence, and which case isn't covered.` If a task feels too big to describe, split it: a feature you can state in a few sentences is one you can check, with or without testing skills.
- [ ] Tests must cover **every route, success and each error case**, using **several rows and out-of-order ids**. Prove a new test is real: plant a bug, watch the test fail, remove the bug, watch it pass. A test that passes before the code exists proves nothing, so break the code on purpose afterwards to check it.
- [ ] Root `package.json` with workspaces and scripts `build`, `start`, `test`, `dev`. `npm test` must run everything.
- [ ] Verify yourself in a real browser: `npm run build && npm start`, then add, complete, delete, reload.
- [ ] Remember the blind spot: files that tests don't import (such as `index.js`) can break production unnoticed. Keep them tiny.

## Phase 5: Local guardrails in `.claude/`

**`.claude/settings.json`** (committed, shared):
```json
{
  "permissions": { "deny": ["Read(./.env)"] },
  "hooks": {
    "Stop": [
      { "hooks": [ { "type": "command",
        "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm test 1>&2 || exit 2" } ] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|Write",
        "hooks": [ { "type": "command",
        "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/format.mjs\"" } ] }
    ]
  }
}
```
- The **deny rule** is enforced by Claude Code, unlike `CLAUDE.md`, which is only guidance. Create a fake `.env` yourself to prove the rule blocks reads.
- The **Stop hook** (exit code 2) stops me from finishing a turn while tests fail. It catches breakage within seconds, before you commit.
- The **PostToolUse hook** runs Prettier on edited files (`.claude/hooks/format.mjs` reads the edited path from stdin; config in `.prettierrc`: `singleQuote`, `printWidth: 120`). Expect formatting-only diffs.
- Personal-only rules go in `.claude/settings.local.json` (not committed).
- On Windows, use Git Bash for hook commands, or set `"shell": "powershell"`.

**`.claude/agents/reviewer.md`**:
```markdown
---
name: reviewer
description: Reviews changes against SPEC.md. Use before opening a PR.
tools: Read, Grep, Glob
---
Compare the changed files to the spec. Report only gaps that affect correctness. Skip style.
```
Read-only tools mean it cannot edit anything. Agent files load at session start: restart the session after creating one. Use it with `have the reviewer check the app against @SPEC.md`. You can also type `/code-review` on a branch diff (Claude cannot launch it for you).

## Phase 6: GitHub setup

- [ ] Add `.github/pull_request_template.md` with: summary, type of change, how it was tested, a privacy check (no real email in files, no-reply commit emails), and "merge with rebase".
- [ ] **[you]** Do this after `ci.yml` has run once (Phase 7), because a check only appears in the list after it has run in the last 7 days. Settings, Branches (or Rules), add a rule for `main`:
  - Require a pull request before merging.
  - Require status checks to pass, and add **`test`**.
  - Require branches to be up to date before merging.
  - Include administrators, so the rule applies to you too.
  - Click **Save** at the bottom of the page.
- [ ] *(not done in the course)* In Settings, General, Pull Requests, allow **only** rebase merging. It makes the no-squash rule impossible to break by accident.
- [ ] Merge every PR with rebase: `gh pr merge <n> --rebase --delete-branch`. A squash merge writes your real account email into the commit.
- [ ] Optionally require 1 approving review on a team. The course repo requires 0, since you are the only developer.

## Phase 7: CI, the required `test` check

`.github/workflows/ci.yml`:
```yaml
name: CI

on:
  pull_request:

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
```
- `checkout` puts your code on the empty runner. `setup-node` pins the Node version and caches npm downloads. `npm ci` installs exactly what `package-lock.json` says.
- Work on a branch (`chore/ci-workflow`), open a PR, let CI run, then add `test` to the branch rule (Phase 6) and merge.
- CI runs on a clean Linux machine, so it also catches problems your laptop hides. Keep the Stop hook anyway: the hook is fast local feedback, CI is the enforced gate.

## Phase 8: `@claude` in GitHub (optional but part of the course)

- [ ] **[you]** `/install-github-app` does not exist in the VS Code extension, so do it by hand:
  1. Install the Claude app at https://github.com/apps/claude for this repo only.
  2. In a normal terminal run `claude setup-token`, then store the result as the repo secret `CLAUDE_CODE_OAUTH_TOKEN` through the GitHub web form (Settings, Secrets and variables, Actions). The web form shows the whole pasted value in one box, which avoided a 401 error in the course. Never paste the token into chat or a file. With an API key, use `ANTHROPIC_API_KEY` and `anthropic_api_key:` instead.
- [ ] Add `.github/workflows/claude.yml` and merge it **before** testing, because comment and issue triggers run the file from `main`:
```yaml
name: Claude

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          claude_args: |
            --max-turns 12
            --max-budget-usd 1
            --allowedTools "Bash(npm test:*)"
```
- Use: create a specific issue, comment `@claude <task>`. The action pushes a `claude/issue-N-...` branch and leaves a "Create PR" link. **You open the PR**, check the diff against `SPEC.md`, wait for `test`, merge with rebase.
- Limits: turns, time and dollars are capped. Self-checking costs turns (9 were needed for one tiny test, so 8 failed the run). If a run fails, read the issue comment and `git branch -r` first: the work may be there.
- Delegate only tasks that are small, easy to verify and safe to throw away. Check the code first, because the course's test issue asked for a test that already existed.
- Treat issue and comment text as untrusted input. Only people with write access can trigger the action.

## Phase 9: Deploy to Render through CI

**[you] on Render**
1. New Web Service from the GitHub repo. Build command: `npm ci && npm run build`. Start command: `npm start`. Health check path: `/api/health`.
2. **Turn Auto-Deploy off.** If it stays on, Render deploys every push itself and skips the tests, your approval and the smoke test.
3. Settings, Deploy Hook: copy the URL. It is a secret.

**[you] on GitHub**
4. Secret `RENDER_DEPLOY_HOOK` = the hook URL (web form or `gh secret set RENDER_DEPLOY_HOOK`).
5. Variable `APP_URL` = `https://<service>.onrender.com`, no trailing slash. A variable is visible, a secret is write-only and masked.
6. Settings, Environments, new environment **`production`**, tick **Required reviewers**, add yourself. (Free for public repos; a private repo needs a paid plan.)

**[claude] `.github/workflows/deploy.yml`:**
```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: deploy
  cancel-in-progress: false

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    timeout-minutes: 15
    environment:
      name: production
      url: ${{ vars.APP_URL }}
    steps:
      - name: Trigger Render deploy
        env:
          DEPLOY_HOOK: ${{ secrets.RENDER_DEPLOY_HOOK }}
        run: |
          # Deploy the exact commit that passed the tests. Never echo the hook URL.
          curl --fail --silent --show-error --output /dev/null -X POST "${DEPLOY_HOOK}&ref=${GITHUB_SHA}"
          echo "Deploy requested for ${GITHUB_SHA}"

      - name: Smoke test
        env:
          APP_URL: ${{ vars.APP_URL }}
        run: |
          # Render needs a few minutes to build and restart, so retry for up to 10 minutes.
          # Check the API AND the home page: a broken client build keeps /api/health green.
          check() {
            curl --fail --silent --show-error --max-time 10 "${APP_URL}/api/health" | grep -q '"status":"ok"' &&
            curl --fail --silent --show-error --max-time 10 "${APP_URL}/" | grep -q 'id="root"' &&
            curl --fail --silent --show-error --max-time 10 "${APP_URL}/api/todos" | grep -q '^\['
          }
          for i in $(seq 1 40); do
            if check; then
              echo "Smoke test passed on attempt ${i}"
              exit 0
            fi
            echo "Attempt ${i}: not healthy yet"
            sleep 15
          done
          echo "Smoke test failed after 10 minutes"
          exit 1
```
Adapt the smoke test to your app: it should touch every path a user needs (health, the page, one data route).

**First deploy**
- Merge the workflow PR. The merge is a push to `main`, so it starts a run. When the tests finish the run waits: open it, **Review deployments**, tick `production`, **Approve and deploy**.
- Confirm in Render (Events or Deploys) that the live commit is the one you expect. The smoke test cannot prove that, because the old version also answers `/api/health`.
- *(not done in the course)* To make it exact, have `/api/health` also report the build's commit (Render sets `RENDER_GIT_COMMIT`), update `SPEC.md` and a test, and make the smoke test compare it with `$GITHUB_SHA`.

**Rollback = a revert PR, not a dashboard rollback**
```
git checkout main && git pull
git checkout -b fix/revert-<what>
git revert --no-edit <bad-commit-sha>
git push -u origin fix/revert-<what>
gh pr create ...        # wait for `test`, merge with rebase, approve the deploy
```
A dashboard rollback is faster but bypasses git, so `main` keeps the bug and the next push redeploys it. A revert goes through the same gate.

Every merge to `main` starts a deploy run that waits for approval, even docs-only PRs. Approve or reject them from the Actions tab.

## Phase 10: The loop for every change

1. `git checkout main && git pull`, then `git checkout -b feat/<short-name>`.
2. Update `SPEC.md` first if behavior, API or limits change.
3. **[claude]** **Red:** write the tests only (several rows, gapped and out-of-order ids), run them, and show the failure. **Green:** write the smallest code that passes and run `npm test`. **Guard check:** break the code on purpose, see a test go red, restore. A hook runs Prettier on each edit, which can reformat unrelated lines in files that aren't Prettier-formatted (use a script for those files and check `git diff --stat`). The Stop hook blocks finishing while `npm test` fails, so red and green happen in one turn.
4. Ask the `reviewer` agent to check the diff against `SPEC.md`. Treat its "not checked" lines as follow-ups.
5. Check in the running app if the UI or API changed.
6. Commit (end the message with Claude's co-author line if you use it), push, `gh pr create` using the template.
7. CI `test` goes green. Read the diff yourself. Merge with rebase and delete the branch.
8. Approve the deploy. Watch the smoke test. Open the live URL once.
9. `git fetch --prune` to clean stale remote branches.
10. At the end of a piece of work, update your notes (`PLAYBOOK.md`, `PROGRESS.md`) and re-export transcripts if you keep them.

Before every push: `git log --all --format='%ae %ce'` must show only no-reply addresses (or `claude[bot]`).

## Phase 11: Cost and unattended-run checklist

- A small task still carries a large fixed context (instructions plus `CLAUDE.md` and memory), so even a short question cost about 8 cents in the course. Keep `CLAUDE.md` short, use `/clear` between unrelated tasks, and batch related work inside the cache window (about 1 hour on a subscription, about 5 minutes with an API key, per the syllabus).
- `/effort low` for quick edits, `high` for hard bugs. `/model` switches the model. `/usage` shows where tokens went.
- Headless run: `claude -p "<task>" --allowedTools "Read" --output-format json --max-turns 3 --max-budget-usd 0.50`. Read `result` and check `is_error`. Without `--bare` it loads the repo's hooks and settings; `--bare` needs `ANTHROPIC_API_KEY` (billed per token) and was not tried in the course.

Before letting anything run unattended, check:

| Item | Question |
|---|---|
| Done criteria | Can I say in a few sentences what "finished" means? |
| Self-check | Can it run the tests itself before it pushes? |
| Allowed scope | Can it push a branch but not merge? Are there no extra secrets in reach? |
| Stop limits | Are `--max-turns`, `--max-budget-usd` and `timeout-minutes` all set? |
| Human merge | Does a person read the diff and approve the deploy? |

## Gotchas collected from the course

- **Tests with one row hide bugs.** Use several rows and out-of-order ids.
- **A test that has never failed has not been shown to work.** See it red first, for the right reason, and break the code on purpose after green. A test that passes before the code exists proves nothing.
- **Green only means the tests you wrote pass.** Mocked UI tests can't show layout or real behavior, so click the feature in a browser after the deploy.
- **Files tests don't import can break production.** A wrong static path in `index.js` passed CI and a health-only smoke test, and took the home page down.
- **A health-only smoke test misses real outages.** Check the page and a data route.
- **Pick a demo break that passes CI.** A broken health route fails the required check and can never merge.
- **Comment and issue workflows run the file on `main`.** Merge `claude.yml` first.
- **A failed Claude run can still leave a good branch.** Look before redoing.
- **A 2-second failure with cost 0 usually means auth.** Add `show_full_output: true` temporarily to see it (then remove it, because it puts more detail in public logs).
- **`gh secret list` proves a secret exists, not that it is valid.**
- **Squash merges write your real email.** Merge with rebase.
- **Auto-Deploy on in Render defeats the whole pipeline.**
- **On Windows:** write multi-file changes with the Write tool, not long heredocs. Stop a server by the process on its port, never kill all `node` processes. Git Bash can rewrite strings that look like paths (such as `/api/x` in a `curl -w` label), though the request itself is unaffected.
- **Agent files load at session start.** Restart after creating `.claude/agents/*.md`.
- **Node 20 warnings** on `actions/checkout@v4` and `setup-node@v4`: bump versions in a chore PR when needed.
- **SQLite on Render's free tier resets on each deploy.** Fine for a learning project, wrong for real data.

## Suggested order, as a short checklist

1. Phase 1: folder, git, no-reply email, GitHub repo, first push.
2. Phase 2 and 3: `SPEC.md`, `CLAUDE.md`.
3. Phase 4: build with tests.
4. Phase 5: `.claude/` settings, hooks, reviewer.
5. Phase 7: `ci.yml` via the first PR.
6. Phase 6: branch rule with required `test`, template, rebase-only merging.
7. Phase 9: Render service, secret, variable, `production` environment, `deploy.yml`, first approved deploy.
8. Phase 8: `@claude` (optional): app, token, `claude.yml`.
9. Phase 10: the loop, forever. Phase 11 whenever you automate.

Step 6 depends on step 5 only because the `test` check must have run once before GitHub offers it in the rule.
