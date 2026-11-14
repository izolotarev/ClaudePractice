# Claude Code in 5 hours

You build one app (a todo web app, Node + Express + Vitest) and ship it through GitHub Actions to a live URL. Each lesson is about 30 minutes: a goal, steps, a check, and the key facts. Facts are from code.claude.com docs.

| # | Lesson | Min |
|---|---|---|
| 1 | Basics: talk, approve, undo | 20 |
| 2 | Specific prompts, spec, build the app | 35 |
| 3 | Tests as the check | 30 |
| 4 | Git and GitHub | 30 |
| 5 | CLAUDE.md and context | 25 |
| 6 | Permissions and hooks | 35 |
| 7 | Subagents and review | 30 |
| 8 | GitHub Actions with Claude | 40 |
| 9 | Deploy | 35 |
| 10 | Headless, cost, wrap-up | 20 |
| | **Total** | **300** |

---

## 1. Basics (20 min)
**Goal:** operate a session safely.
**Do:**
1. Ask a question about the folder. Create a file. (Done: you saw tool calls.)
2. Press `Shift+Tab` to cycle permission modes: Manual (asks before edits and commands), Accept edits, Plan (no edits), Auto (safety classifier, the default in VS Code).
3. Start a task, press `Esc` mid-run. Everything done so far is kept.
4. Make an edit, then `/rewind` (or Esc twice) and restore it.
**Done when:** you can stop me mid-task and roll an edit back.
**Key facts:** `/rewind` restores only files edited with Claude's file tools. A file changed by a shell command is not restored, and neither are deploys or database changes. Git is the real safety net (lesson 4).

## 2. Specific prompts, spec, build (35 min)
**Goal:** get what you pictured on the first try.
**Rule:** a good prompt names the files, states the symptom or goal, and says what "done" means. Vague: "make a todo app". Specific: "Node + Express, plain HTML frontend, add/complete/delete, `npm test` runs Vitest, `npm start` serves on port 3000, no other libraries."
**Do:**
1. Run the interview: `I want a todo web app. Interview me until you could write the spec, then write it to SPEC.md.` Answer its questions.
2. `/clear`, then: `Build the app from SPEC.md.`
3. Use `@SPEC.md` to point at a file instead of describing it.
**Done when:** `npm start` serves the app and `SPEC.md` exists.
**Key facts:** "be ambitious" widens scope (edge cases, empty states). It does not make me think harder; `/effort` does. Plan mode (`Shift+Tab`) lets me propose before editing.

## 3. Tests as the check (30 min)
**Goal:** stop trusting "done"; make me prove it.
**Why:** I stop when work looks finished. A command that returns pass/fail lets me fix my own errors.
**Do:**
1. Ask: `Add Vitest tests for add, complete, delete. Run them and show me the output.`
2. Plant a bug (e.g. delete removes the wrong item) where no test looks. Ask me to "make sure it works". Watch if I catch it.
3. Add the missing test; repeat.
**Done when:** `npm test` passes and you saw the actual output, not just my word.
**Key facts:** always ask for evidence (the command and its output). The strongest check lines up from prompt (`run tests until they pass`), to `/goal`, to a Stop hook (lesson 6), to CI (lesson 8).

## 4. Git and GitHub (30 min)
**Goal:** real history, a remote, and a protected `main`.
**Do (needs `gh auth login` first):**
1. `git init`, add `.gitignore` (`node_modules`, `.env`), first commit.
2. `gh repo create <name> --private --source . --push`.
3. Work on a branch: `git switch -c feat/x`; commit; push; open a PR with `gh pr create`.
4. In GitHub, add a branch rule on `main`: require a PR before merging.
**Done when:** a PR is open and a direct push to `main` is rejected.
**Key facts:** I commit, push, and open PRs only when you ask. I add a `Co-Authored-By` line to commits.

## 5. CLAUDE.md and context (25 min)
**Goal:** give me the facts I can't see, keep my context clean.
**Do:**
1. `/init` creates CLAUDE.md. Cut it under 50 lines. Keep only: test/lint/run commands, gotchas, decisions not in the code. Delete anything I'd learn by reading the code.
2. `/context` to see what's loaded.
3. `/clear` between unrelated tasks. `/compact keep the API decisions` to summarize a long one.
**Done when:** CLAUDE.md lists the exact test and run commands, and you ran `/context`.
**Key facts:** after `/compact`, root CLAUDE.md is re-loaded. Rules scoped with `paths:` and nested CLAUDE.md files are not, until I touch a matching file again. A rule that must always apply goes in root CLAUDE.md or a hook. CLAUDE.md is guidance I can decide not to follow.

## 6. Permissions and hooks (35 min)
**Goal:** make rules with zero exceptions deterministic.
**Rules vs hooks:** CLAUDE.md = I decide. Deny rules and hooks = Claude Code enforces.
**Do (`.claude/settings.json`):**
1. Deny: `"permissions": {"deny": ["Read(./.env)"]}`. Create `.env`, ask me to read it. It must fail, via the Read tool and `cat .env`.
2. PostToolUse hook, matcher `Edit|Write`, running Prettier on the edited file.
3. Stop hook: `npm test 1>&2 || exit 2`. Break a test; I can't finish until it passes.
**Done when:** all three work as described.
**Key facts:**
- Rules evaluate deny, then ask, then allow; the first match wins. An allow can't override a deny, and a hook can't override one either.
- Exit code **2** blocks. Exit 1 does not.
- A deny rule matches command text only. It doesn't stop a script that opens the file, so for real isolation turn on `/sandbox`.
- The Stop hook gives up after 8 blocked stops in a row.
- On Windows, the docs' `jq` examples need Git Bash; or set `"shell": "powershell"`.

## 7. Subagents and review (30 min)
**Goal:** a reviewer that didn't write the code.
**Do:**
1. Create `.claude/agents/reviewer.md`:
   ```
   ---
   name: reviewer
   description: Reviews changes against SPEC.md. Use before opening a PR.
   tools: Read, Grep, Glob
   ---
   Compare the changed files to the spec. Report only gaps that affect correctness. Skip style.
   ```
2. `have the reviewer check the app against SPEC.md`.
3. Run `/code-review` on a branch diff.
**Done when:** the reviewer returns findings and can't edit files.
**Key facts:** a subagent starts with fresh context and returns only a summary. It costs extra tokens and gives no smarter answer, only parallelism, noise isolation, and a fresh pair of eyes. Without "skip style" a reviewer invents nitpicks. Set `model: haiku` for simple jobs.

## 8. GitHub Actions with Claude (40 min)
**Goal:** CI gates every PR; `@claude` works in GitHub.
**Do:**
1. `.github/workflows/ci.yml`: on `pull_request`, `npm ci` then `npm test`. Mark it required in the branch rule.
2. `/install-github-app` (installs the app, stores the secret, opens a PR with `claude.yml`). Merge it.
3. Create an issue, comment `@claude add input validation`. I open a PR. Review and merge.
4. Add `--max-turns 8` under `claude_args`, and `timeout-minutes: 15` on the job.
**Done when:** a Claude-authored PR passes CI and you merged it.
**Key facts:**
- The secret is `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN`; never commit it.
- Only users with write access can trigger me; bots are rejected unless in `allowed_bots`.
- CI won't run on commits pushed with `GITHUB_TOKEN`; don't pass it.
- Fork PRs don't get secrets.
- A comment, issue body, or PR text is untrusted input to the agent. Keep permissions minimal.

## 9. Deploy (35 min)
**Goal:** `main` goes live through CI, not from your laptop.
**Target:** Render (Node web service from the GitHub repo). Alternatives: GitHub Pages (static only), Azure App Service.
**Do:**
1. Connect the repo on the platform; store its deploy token/hook as a GitHub secret.
2. `deploy.yml`: on push to `main`, after tests pass, trigger the deploy. Use a GitHub Environment `production` with required reviewer.
3. Add a smoke test after deploy: `curl --fail https://<url>/health`.
4. Break something, deploy, then roll back with a revert PR.
**Done when:** a live URL serves the app, the health check runs in CI, and you've rolled back once.
**Key facts:** Auto mode blocks production deploys by default. Keep deploy credentials out of my reach (`deny` rules, GitHub Secrets). A person approves the production step.

## 10. Headless, cost, wrap-up (20 min)
**Do:**
1. `claude --bare -p "Summarize README.md" --allowedTools "Read" --output-format json --max-turns 3`
2. `/usage` to see where tokens went.
3. `/effort low` for quick edits, `high` for hard bugs. `/model` to switch.
**Key facts:**
- `claude -p` without `--bare` runs the repo's hooks and MCP servers with no trust prompt.
- `--bare` uses `ANTHROPIC_API_KEY`, not your login.
- Unattended-run checklist: done criteria, self-check, allowed scope, stop limits (`--max-turns`, `--max-budget-usd`), human merge.
- Cache is about 1 hour on a subscription, 5 minutes on API key; `/clear` between tasks saves tokens.

## After the course
Parallel work (`claude -w`, worktrees, `/batch`), skills (`.claude/skills/`), prompt-injection testing, team settings. All in the docs under code.claude.com/docs/en.
