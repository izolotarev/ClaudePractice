# Session 2
Source: ed5b6cc3-a514-445c-8a7d-1adad09ef84a.jsonl
Started: 2026-11-14T19:57:44.255Z

## You

I would like to know how to use Claude in the most efficient way. I need some kind of interactive way to learn how to work with you. Lets imagine we are building simple web app using git repo and github actions. Use your official docs https://code.claude.com/docs/en/agents to teach me. I would like to understand the best practices of using Claude

## Claude

I'll start by reading the page you pointed to.

> **Tool:** ToolSearch {"query":"select:WebFetch","max_results":1}

> Result:
```

```

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/agents","prompt":"Summarize this page in detail: what it covers, key concepts, best practices, and any links to related docs (best practices, memory/CLAUDE.md, subagents, hooks, GitHub Actions, common workflows)."}

> Result:
```
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Run agents in parallel

> Compare the ways Claude Code can take on multiple tasks at once: subagents, agent view, agent teams, dynamic workflows, and projects.

Claude Code has five ways to work on several tasks at once: [subagents](https://code.claude.com/docs/en/sub-agents.md), [agent view](https://code.claude.com/docs/en/agent-view.md), [agent teams](https://code.claude.com/docs/en/agent-teams.md), [dynamic workflows](https://code.claude.com/docs/en/workflows.md), and [projects](https://code.claude.com/docs/en/claude-projects.md). They differ in how involved you stay, from steering each conversation yours
… [truncated 8582 chars]
```

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/best-practices","prompt":"List the key best practices in detail: verification, explore-plan-code, context management, CLAUDE.md, permissions, subagents, parallel sessions, headless/CI usage, common failure patterns."}

> Result:
```
<persisted-output>
Output too large (51.2KB). Full output saved to: C:\Users\USER\.claude\projects\c--Repositories-SampleApp\daaa1446-9d1d-4cd0-a104-9b71d7bbc0e1\tool-results\toolu_01ATytpoVjSCQTjoUSSpe4s3.txt

Preview (first 2KB):
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Best practices for Claude Code

> Get more out of Claude Code: tell Claude what it can't see, give it a check to run, and enforce the rules that can't have exceptions.

Claude Code is built in a way that, in most cases, your first plain prompt in a fresh session already does the right thing, without any setup on your part.

For example:

* To let commands run without you approving
… [truncated 1439 chars]
```

> **Tool:** Read {"file_path":"C:\\Users\\USER\\.claude\\projects\\c--Repositories-SampleApp\\daaa1446-9d1d-4cd0-a104-9b71d7bbc0e1\\tool-results\\toolu_01ATytpoVjSCQTjoUSSpe4s3.txt"}

> Result:
```
1	> ## Documentation Index
2	> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
3	> Use this file to discover all available pages before exploring further.
4	
5	# Best practices for Claude Code
6	
7	> Get more out of Claude Code: tell Claude what it can't see, give it a check to run, and enforce the rules that can't have exceptions.
8	
9	Claude Code is built in a way that, in most cases, your first plain prompt in a fresh session already does the right thing, without any setup on your part.
10	
11	For example:
12	
13	* To let commands run without you approving each one, new terminal and VS Code sessions start in [auto mode](https://code.claude.com/docs/en/permission-modes.md#eliminate-prompts-with-auto-mode).
14	* To keep your main conversation focused while
… [truncated 54082 chars]
```

## Claude

I read the [agents page](https://code.claude.com/docs/en/agents) and the linked [best practices page](https://code.claude.com/docs/en/best-practices). The agents page only covers running work in parallel, so I used best practices for the fundamentals. I've turned both into a course you do inside this session, one lesson at a time. You do the step and I coach, so you learn by building the app.

## The course

| # | Lesson | You practice | Source idea |
|---|---|---|---|
| 1 | **Prompt with specifics** | Scaffold the app with a prompt that names files, symptoms and "done" | Specific prompts and `@file` references |
| 2 | **Interview, then spec** | Have me interview you and write `SPEC.md` | Brainstorm first, then build in a fresh session |
| 3 | **Give Claude a check** | Add tests and a lint command, and get me to prove they pass | "Give Claude a check to run" |
| 4 | **Short CLAUDE.md** | Run `/init`, then cut it to only what I can't infer | Keep CLAUDE.md short |
| 5 | **Steering** | Try `Esc`, `/rewind`, `/clear` and `/btw` on purpose | Steer the session |
| 6 | **Git and GitHub** | Branch, commit, open a PR with `gh` | Connect the tools Claude needs |
| 7 | **Hooks and deny rules** | Auto-format hook, deny `.env`, `Stop` hook running tests | Deterministic vs. non-deterministic rules |
| 8 | **Subagents and review** | Build a read-only `reviewer` agent and use `/code-review` | Subagents and independent review |
| 9 | **GitHub Actions and headless** | Run `claude -p` in CI with a turn cap and a human merge | Let Claude run without you |
| 10 | **Parallel work** | Use `claude -w`, worktrees, `claude agents` and `/batch` | The agents page |

Three ideas run through all of it:
- **Tell me what I can't see.** I can read your code, so write down only decisions and gotchas that aren't in it.
- **Give me a pass/fail check.** Otherwise "looks done" is all I have to go on.
- **Make hard rules deterministic.** Anything that must always or never happen belongs in a hook or deny rule, not in CLAUDE.md.

## Lesson 1: start now

Your folder `c:\Repositories\SampleApp` is empty and not yet a git repo. Compare these two prompts:

- **Weak:** "make a todo app"
- **Strong:** "Create a minimal todo web app in `c:\Repositories\SampleApp` using Node and Express, with a plain HTML frontend. It needs add, complete and delete. Use `npm test` with Vitest. No extra libraries. Done means `npm test` passes and `npm start` serves it on port 3000."

**Your turn:** send me a prompt in the strong style for an app you choose. I'll build it, then show you what the good version gave me that the weak one wouldn't have.

If you'd like a stack other than Node, tell me. Pick whichever you know best.

## You

Lets actually add a lesson for creating real git repo and github actions and how to use Claude there

## Claude

I'll check the official GitHub Actions docs first so the lesson matches them.

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/github-actions","prompt":"Detail the setup: /install-github-app, manual setup steps and secrets, the anthropics/claude-code-action usage with example workflow YAML (v1), @claude mentions, triggers, prompt/claude_args inputs, CLAUDE.md use, security and cost best practices, troubleshooting."}

> Result:
```
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Claude Code GitHub Actions

> Run Claude Code in GitHub Actions workflows to respond to @claude mentions, automate tasks, and turn issues into pull requests

[Claude Code GitHub Actions](https://github.com/anthropics/claude-code-action) is a GitHub Action that runs Claude Code inside your repository's workflows. Mention `@claude` in a pull request or issue comment to have Claude analyze code, implement changes, and push commits. You can also give the Claude Code GitHub Action a prompt to run automatically on any GitHub event. Use it to turn issues into pull requests, fix bugs from a comment, or automate recu
… [truncated 29003 chars]
```

## Claude

I've added it as a two-part block, **Lessons 6 and 9**, based on the [GitHub Actions docs](https://code.claude.com/docs/en/github-actions). The updated course:

| # | Lesson | You practice |
|---|---|---|
| 1 | Prompt with specifics | Scaffold the app |
| 2 | Interview, then spec | `SPEC.md` |
| 3 | Give Claude a check | Tests and lint, with evidence |
| 4 | Short CLAUDE.md | `/init`, then cut it down |
| 5 | Steering | `Esc`, `/rewind`, `/clear`, `/btw` |
| **6** | **Real git repo and GitHub** | `git init`, `.gitignore`, first commit, `gh repo create`, push, branch, PR |
| 7 | Hooks and deny rules | Formatter hook, deny `.env`, `Stop` hook |
| 8 | Subagents and review | A read-only `reviewer` and `/code-review` |
| **9** | **GitHub Actions with Claude** | A plain CI workflow, then `@claude` and an automated PR review |
| 10 | Parallel work | Worktrees, `claude agents`, `/batch` |

### Lesson 6: real git repo and GitHub
Needs the GitHub CLI installed and signed in with `gh auth login`.
1. Ask me to run `git init`, add a `.gitignore` for `node_modules` and `.env`, and make the first commit.
2. Ask me to create the GitHub repo and push it with `gh`. Starting private is safest.
3. Work on a branch, not `main`. Ask me to commit, push and open a PR with a good description.
4. **Practice point:** I'll only commit, push or open PRs when you ask. That's a good habit to keep, because those actions are outward-facing.

### Lesson 9: GitHub Actions with Claude
It has three steps, each adding more automation:
1. **Plain CI first.** A `ci.yml` that runs `npm test` on every PR. This is the deterministic check from Lesson 3, now enforced by GitHub rather than by me.
2. **Interactive Claude.** Run `/install-github-app`, which installs the GitHub App, stores the secret, and opens a PR with `claude.yml`. Merge it, then comment `@claude add input validation to the todo form` on an issue. I'll implement it and open a PR.
3. **Automation mode.** A workflow with a `prompt` that runs a code review on every PR, using the `code-review` plugin.

Best practices from the docs for this lesson:
- Store the key or token as a GitHub Secret and never commit it. `/install-github-app` does this for you.
- Cap each run with `--max-turns` and a job `timeout-minutes`.
- Write specific `@claude` requests, since vague ones cost more turns and tokens.
- Keep CLAUDE.md short. In CI I read it on every run.
- Protect `main` with branch protection, so a person approves every merge, including mine.
- The workflow trigger runs only for users with write access. That's the security boundary, so don't loosen it.
- If CI doesn't run on my commits, check that you didn't pass `GITHUB_TOKEN`. GitHub doesn't trigger workflows from that token.

Two things to know before Lesson 9:
- You need admin access to the repo.
- Runs bill either to an API key or to your Claude subscription token, and they also use GitHub Actions minutes.

We'll do lessons 1 to 5 first so the app, tests and CLAUDE.md exist. Then the git and Actions lessons have something real to work on.

**Your turn for Lesson 1:** send me a specific prompt for the app you want. Say the stack too, or I'll default to Node and Express with Vitest.

## You

and also lets deploy this app somewhere

## Claude

I've added deployment as **Lesson 10**, and parallel work moves to 11. Deploying also changes what a few earlier lessons are for.

| # | Lesson | You practice |
|---|---|---|
| 1-5 | Prompting, spec, checks, CLAUDE.md, steering | Build the app |
| 6 | Real git repo and GitHub | Repo, branch, PR |
| 7 | Hooks and deny rules | Guardrails |
| 8 | Subagents and review | Independent reviewer |
| 9 | GitHub Actions with Claude | CI, `@claude`, PR review |
| **10** | **Deploy** | CD pipeline, staging, a release skill, rollback |
| 11 | Parallel work | Worktrees, `claude agents`, `/batch` |

### Lesson 10: deploy
The docs' main point is that deploys are one of the things you should not leave to my judgment. Auto mode's classifier blocks production deploys by default, and the best practices page says `CI publishes from there, never publish from your machine`. So the lesson builds a deploy pipeline instead of having me run a deploy command.

1. **Choose a target.** Pick one:
   - **Static site on GitHub Pages:** free, no extra account, and the simplest path if the app is plain HTML and JS.
   - **Node app on Render or Fly.io:** free or cheap, and it deploys straight from your GitHub repo.
   - **Azure App Service:** fits well if you already use Azure.
2. **Put the deploy in CI, not in me.** A `deploy.yml` that runs only on pushes to `main` after `ci.yml` passes. Credentials go in GitHub Secrets, and I never see them.
3. **Add a staging step.** Deploy PRs or `main` to staging first, and require manual approval for production using a GitHub Environment.
4. **Write a `/release` skill.** Use `disable-model-invocation: true` so only you can run it. It bumps the version, writes the changelog, tags and pushes. CI does the publishing.
5. **Add guardrails from Lesson 7.** An `ask` rule on `git push *`, a `deny` rule on `.env` and deploy tokens, and branch protection on `main`.
6. **Practice a rollback.** Break something on purpose, then ask me to revert the commit through a PR and redeploy. This is the "who signs off" question from the unattended-runs checklist.
7. **Add a smoke test.** Have me add a post-deploy `curl` health check to the workflow. It's the pass/fail check from Lesson 3, now run against the live URL.

I'll only write the deploy config and explain it. I won't touch your cloud account or run any production deploy. You trigger that step, and I'll ask before anything that publishes.

If you have a preference, tell me which target you want so I can plan the app for it. Otherwise I'd default to **a Node and Express app deployed to Render**, since it exercises the full CI/CD loop and has a free tier.

We're still at the start of the course. **Your turn for Lesson 1:** send me a specific prompt for the app. For example: "Node and Express todo app, add/complete/delete, Vitest tests, runs on port 3000, no extra libraries."

## You

Is this really deep lessons? I want to understand it on professional level, not just easy stuff for beginners

## Claude

No. What I gave you is a syllabus: topic names, a few best-practice bullets, and exercises like "run `/init`". That's fine for orientation, but it won't make you effective at a professional level. I'd treat it as the table of contents.

## What's missing

Professional use rests on understanding the mechanics, so you can predict what I'll do and debug me when I don't do it. The outline skips things like:

- **How the agent loop works.** What loads at startup (system prompt, CLAUDE.md, skill descriptions, MCP tool definitions), what each turn re-sends, why cache hits matter, and what compaction loses.
- **The context budget.** Where tokens actually go (`/context`, `/usage`), why a bloated CLAUDE.md or a pile of MCP servers makes every task worse, and when to `/clear` versus `/compact`.
- **Permission evaluation order.** Deny, ask and allow rules, then hooks, then the auto-mode classifier, then the sandbox. You need to know which layer wins when they disagree, and what each layer can't catch. For example, a `Read` deny rule catches `cat .env` but not a script that opens the file.
- **Settings scopes and precedence.** User, project, local and managed settings, who they bind, and which ones take effect only after the trust dialog.
- **Hook internals.** Event types, the JSON your script receives on stdin, exit code 2 versus other codes, `onFailure: "block"`, and how a `Stop` hook can trap you in a loop (the block cap is 8).
- **Failure modes.** Over-engineering, reviewers that always find something, plausible "done" claims with no evidence, and prompt injection through issues, PR bodies and web content.
- **CI security.** Fork PRs, token scopes, the write-access gate, bots, `GITHUB_TOKEN` not triggering workflows, and OIDC instead of long-lived secrets.
- **Evaluating changes.** How to tell whether a CLAUDE.md edit or a new hook helped, using cost, turns and defect rate rather than feel.
- **Team scale.** Managed settings, shared skills and plugins, spend limits, and running `claude -p` safely in scripts with budget caps.

## What a deep lesson looks like

Each one would have four parts:

1. **Mechanism.** How the feature actually works, checked against the docs.
2. **Experiment.** Something you run to observe the behavior yourself. For example, deliberately overload CLAUDE.md, then compare `/context` before and after. Or make a deny rule and an auto-mode rule conflict and watch which wins.
3. **Break it.** Reproduce the failure mode on purpose, such as a hook that blocks forever or an injected instruction in an issue body.
4. **Decision rule.** When to use it, when not to, and what it costs.

For example, **Lesson 7 (hooks)** would become: write a `PreToolUse` script that logs the raw stdin JSON, so you see exactly what I send. Then build a protected-paths guard, test it against bypass attempts through Bash, and finish with the rule for what belongs in a hook, a deny rule, or CLAUDE.md.

## Proposed change

I'd split the course into tracks:

- **A. Foundations of the mechanism:** loop, context, permissions, settings.
- **B. Engineering workflow:** specs, checks, review, git, parallel work.
- **C. Automation and security:** hooks, CI, `claude -p`, injection, deploy pipelines.
- **D. Operating at scale:** cost, evaluation, team setup.

The app, git repo, Actions and deploy then serve as the lab for those experiments. They aren't the lesson content.

I also want to be upfront about what "official docs" covers. They document the features well, but much of "what actually works in practice" comes from running experiments, so some lessons will have you measure things rather than just read about them.

**Where to start:** a short diagnostic, so I pitch the depth correctly. How do you currently use Claude Code day to day, and which of these could you already explain: context compaction, permission rule precedence, hook exit codes, worktrees? Answer briefly and I'll rebuild the syllabus around your gaps. If you'd rather skip that, I'll start with **Track A, Lesson 1: what happens in one turn**, with an experiment you can run right now in this session.

## You

Make this course deep enough with your proposals like for professional developer

## Claude

I'll ground the deep version in the actual docs rather than my memory, so I'm pulling the mechanism pages for each track.

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/how-claude-code-works","prompt":"Extract precise mechanics: the agentic loop, tools categories, what loads at startup, context handling, compaction, checkpoints, sessions, permissions overview. Keep specifics, numbers, command names."}

> Result:
```
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# How Claude Code works

> Understand the agentic loop, built-in tools, and how Claude Code interacts with your project.

Claude Code is an agentic assistant that runs in your terminal. While it excels at coding, it can help with anything you can do from the command line: writing docs, running builds, searching files, researching topics, and more.

This guide covers the core architecture, built-in capabilities, and [tips for working effectively](#work-effectively-with-claude-code). For step-by-step walkthroughs, see [Common workflows](https://code.claude.com/docs/en/common-workflows.md). For extensibility feat
… [truncated 19142 chars]
```

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/context-window","prompt":"Extract precisely: what occupies context at startup and its order, what loads when (CLAUDE.md, rules, skills, MCP, subagents, hooks), compaction behavior and what survives it, /context output, caching. Keep specifics."}

> Result:
```
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Explore the context window

> An interactive simulation of how Claude Code's context window fills during a session. See what loads automatically, what each file read costs, and when rules and hooks fire.

Claude Code's context window holds everything Claude knows about your session: your instructions, the files it reads, its own responses, and content that never appears in your terminal. The timeline below plays a full session from startup to compaction: what loads before you type, what each file read, rule, and hook adds as Claude works, and how a subagent keeps large reads out of your context. See [the wri
… [truncated 8000 chars]
```

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/permissions","prompt":"Extract precisely: rule syntax (Bash, Read, Edit, WebFetch, MCP), evaluation order deny/ask/allow, settings precedence and scopes, wildcard behavior, known limits and bypasses, additionalDirectories, trust dialog."}

> Result:
```
<persisted-output>
Output too large (90.5KB). Full output saved to: C:\Users\USER\.claude\projects\c--Repositories-SampleApp\daaa1446-9d1d-4cd0-a104-9b71d7bbc0e1\tool-results\toolu_01LfmLmpeksYkqCWETaR9vQd.txt

Preview (first 2KB):
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Configure permissions

> Control what Claude Code can access and do with fine-grained permission rules, modes, and managed policies.

Claude Code supports fine-grained permissions so that you can specify exactly what the agent is allowed to do and what it can't. You can check permission settings into version control to share them with every developer in your organization, and each
… [truncated 1415 chars]
```

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/hooks","prompt":"Extract precisely: all hook events, matcher syntax, stdin JSON input shape, exit code semantics, JSON output decisions (permissionDecision etc.), handler types, timeouts, onFailure, Stop hook cap, workspace trust, common pitfalls."}

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/memory","prompt":"Extract precisely: CLAUDE.md locations and load order, imports, .claude/rules paths frontmatter, CLAUDE.local.md, auto memory, size guidance, how instructions survive compaction, troubleshooting."}

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/sub-agents","prompt":"Extract precisely: subagent file format and frontmatter fields, tools restriction, model choice, isolation worktree, background vs foreground, fork mode, built-in agents, context isolation, limits, costs."}

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/headless","prompt":"Extract precisely: claude -p usage, flags (--bare, --output-format, --json-schema, --max-turns, --max-budget-usd, --allowedTools, --permission-mode, --resume), structured output, streaming, exit behavior, CI patterns."}

> **Tool:** WebFetch {"url":"https://code.claude.com/docs/en/security","prompt":"Extract precisely: threat model, prompt injection protections, sandbox, permission architecture, MCP trust, best practices for untrusted content, data handling."}

> Result:
```
<persisted-output>
Output too large (54.1KB). Full output saved to: C:\Users\USER\.claude\projects\c--Repositories-SampleApp\daaa1446-9d1d-4cd0-a104-9b71d7bbc0e1\tool-results\toolu_01KF5D2Z288pGHm6Zj7hGoP7.txt

Preview (first 2KB):
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# How Claude remembers your project

> Give Claude persistent instructions with CLAUDE.md or AGENTS.md files, and let Claude accumulate learnings automatically with auto memory.

Each Claude Code session begins with a fresh context window. Two mechanisms carry knowledge across sessions:

* **CLAUDE.md files**: instructions you write to give Claude persistent context. Claude can also
… [truncated 1342 chars]
```

> Result:
```
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Run Claude Code programmatically

> Use the Agent SDK to run Claude Code programmatically from the CLI, Python, or TypeScript.

The [Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview.md) gives you the same tools, agent loop, and context management that power Claude Code. It's available as a CLI for scripts and CI/CD, or as [Python](https://code.claude.com/docs/en/agent-sdk/python.md) and [TypeScript](https://code.claude.com/docs/en/agent-sdk/typescript.md) packages for full programmatic control.

To run Claude Code in non-interactive mode, pass `-p` with your prompt and the [CLI options](https://
… [truncated 38093 chars]
```

> Result:
```
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Security

> Learn about Claude Code's security safeguards and best practices for safe usage.

## How we approach security

### Security foundation

Your code's security is paramount. Claude Code is built with security at its core, developed according to Anthropic's comprehensive security program. Learn more and access resources (SOC 2 Type 2 report, ISO 27001 certificate, etc.) at [Anthropic Trust Center](https://trust.anthropic.com).

### Permission-based architecture

A session's permission mode sets which actions Claude can take without asking you first. Auto mode is the built-in starting permission mode 
… [truncated 14635 chars]
```

> Result:
```
# Custom Subagents in Claude Code: Summary

## File format
Subagents are Markdown files with YAML frontmatter. The body is the system prompt.

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

- Only `name` and `description` are required. Multi-word fields use camelCase, and unrecognized fields are silently ignored.
- `name` must be unique, can't contain `:`, and can be at most 256 characters.
- **Locations, by priority:** managed settings (1), `--agents` CLI flag (2), `.claude/agents/` (3), `~/.claude/agents/` (4), plugin `agents/` (5).
- Changes to these direct
… [truncated 6154 chars]
```

> Result:
```
# Claude Code Hooks: Key Reference

The excerpt is cut off before the **Workspace trust** section and before any dedicated **Stop hook cap** section, so I can't confirm those details. Notes on them are at the end.

## 1. Hook events

| Cadence | Events |
|---|---|
| Per session | `SessionStart`, `SessionEnd`, `Setup` (`--init-only`, or `--init`/`--maintenance` with `-p`) |
| Per turn | `UserPromptSubmit`, `UserPromptExpansion`, `Stop`, `StopFailure` |
| Per tool call | `PreToolUse`, `PermissionRequest`, `PermissionDenied`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch` |
| Agents and tasks | `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `TeammateIdle` |
| Context and config | `PreCompact`, `PostCompact`, `InstructionsLoaded`, `ConfigChange`, `CwdChanged`, `Director
… [truncated 12702 chars]
```

## Claude

The permissions and memory pages were too large to return inline, so I'll pull out the precedence and limits sections directly.

> **Tool:** Grep {"pattern":"^#{2,4} .*(Precedence|precedence|Bash rule limits|Settings precedence|read-only|Working directories|What runs before)","path":"C:\\Users\\USER\\.claude\\projects\\c--Repositories-SampleApp\\daaa1446-9d1d-4cd0-a104-9b71d7bbc0e1\\tool-results\\toolu_01LfmLmpeksYkqCWETaR9vQd.txt","output_mode":"content","-n":true}

> Result:
```
635:### Precedence among rules, hooks, and mods
667:## Working directories
767:## Settings precedence
806:### What runs before you trust a folder
```

> **Tool:** Grep {"pattern":"deny.*(first|take|precedence)|Rules are evaluated|evaluated in order|highest|cannot be overridden|process substitution|wrapper","path":"C:\\Users\\USER\\.claude\\projects\\c--Repositories-SampleApp\\daaa1446-9d1d-4cd0-a104-9b71d7bbc0e1\\tool-results\\toolu_01LfmLmpeksYkqCWETaR9vQd.txt","output_mode":"content","-n":true,"head_limit":30}

> Result:
```
31:[Omitted long matching line]
35:You can attach a note to Claude when you approve or deny a single action. On most permission prompts, including Bash, PowerShell, file, and MCP tool prompts, move to **Yes** or **No** and press `Tab` to open a comment field on that option. WebFetch and browser prompts don't offer the field. The options that allow the action for the rest of the session or save a rule don't take one either.
56:Rules are evaluated in order: deny, then ask, then allow. The first match in that order determines the outcome, and rule specificity doesn't change the order.
58:A broad deny rule like `Bash(aws *)` blocks every matching call, including calls that also match a narrower allow rule like `Bash(aws s3 ls)`. An allow rule can't carve an exception out of a deny rule. The sa
… [truncated 2653 chars]
```

> **Tool:** Grep {"pattern":"^#{2,3} ","path":"C:\\Users\\USER\\.claude\\projects\\c--Repositories-SampleApp\\daaa1446-9d1d-4cd0-a104-9b71d7bbc0e1\\tool-results\\toolu_01KF5D2Z288pGHm6Zj7hGoP7.txt","output_mode":"content","-n":true}

> Result:
```
22:## CLAUDE.md vs auto memory
38:## CLAUDE.md files
42:### When to add to CLAUDE.md
53:### Choose where to put CLAUDE.md files
68:### Set up a project CLAUDE.md
80:### Write effective instructions
102:### Import additional files
142:### How CLAUDE.md files load
168:### Organize rules with `.claude/rules/`
286:### Manage CLAUDE.md for large teams
353:## AGENTS.md
369:### When Claude Code reads AGENTS.md
387:### Choose which instruction files load
414:### When AGENTS.md support is unavailable
424:### Where AGENTS.md differs from CLAUDE.md
434:### Remove an earlier AGENTS.md workaround
443:### Share one file with other coding tools
450:## Claude Code
468:### Migrate instructions from other tools
478:## Auto memory
491:### Enable or disable auto memory
514:### Storage location
548:### How it 
… [truncated 400 chars]
```

## Claude

I now have the mechanism details for each track. I'm writing the course to a file so it persists across sessions and I can mark progress against it.

> **Tool:** Write {"file_path":"c:\\Repositories\\SampleApp\\course\\SYLLABUS.md","content":"# Claude Code: Professional Track\n\nLab project: SampleApp (web app, git repo, GitHub Actions, deploy).\nFacts below were checked against code.claude.com docs. Where docs are silent, a lesson says so and you measure it instead.\nCheck your version first (`claude --version`): several behaviors are version-gated.\n\n## How e
… [truncated 13716 chars]

> **Tool:** Write {"file_path":"c:\\Repositories\\SampleApp\\course\\PROGRESS.md","content":"# Progress\n\n| Lesson | Status | Prediction score | Notes |\n|---|---|---|---|\n| A1 Loop, harness, sessions | not started | | |\n| A2 Context economics | not started | | |\n| A3 Instruction files | not started | | |\n| A4 Permissions | not started | | |\n| A5 Extension surfaces | not started | | |\n| B1 Spec and prompting
… [truncated 545 chars]

> Result:
```
File created successfully at: c:\Repositories\SampleApp\course\SYLLABUS.md (file state is current in your context — no need to Read it back)
```

> Result:
```
File created successfully at: c:\Repositories\SampleApp\course\PROGRESS.md (file state is current in your context — no need to Read it back)
```

## Claude

I rebuilt the course as 20 lessons in four tracks and saved it to [course/SYLLABUS.md](course/SYLLABUS.md), with a tracker in [course/PROGRESS.md](course/PROGRESS.md). I checked the mechanics against the current docs: how-it-works, context-window, permissions, hooks, subagents, headless, security and GitHub Actions. I read the memory docs only as a heading list, so A3 leans on the best-practices page.

Written for: you, a professional developer who wants to understand Claude Code's mechanics, not just its features.

## Structure

| Track | Lessons | What you end up able to do |
|---|---|---|
| **A. Mechanism** | Loop and sessions, context economics, instruction files, permissions as layers, choosing an extension | Predict what I'll do and debug me when I don't do it |
| **B. Workflow** | Specs, verification, git as a safety layer, subagents, parallelism, skills | Run the engineering loop with a measurable defect rate |
| **C. Automation and security** | Hooks, headless `claude -p`, GitHub Actions, prompt injection, deploy pipeline | Run me unattended without it being a liability |
| **D. Scale** | Cost, evaluating your own setup, team rollout, capstone | Show that a change helped, using numbers |

## Examples of the depth

- **Context (A2):** after `/compact`, root CLAUDE.md survives but rules scoped with `paths:` do not, so a "must follow" rule in one can silently vanish. You'll reproduce that and fix it.
- **Permissions (A4):** rules evaluate deny, then ask, then allow, and the first match wins. A narrow allow can't override a broad deny, and a hook can't override a deny rule either. A `Read` deny catches `cat .env` but not a script that opens the file. You'll predict ten cases, then run them.
- **Hooks (C1):** exit 1 does not block, only exit 2 does. A matcher like `Edit.*` also matches `NotebookEdit`. A `PreToolUse` timeout doesn't block unless you set `onFailure: "block"`.
- **Headless (C2):** `claude -p` without `--bare` runs the repo's hooks and MCP servers with no trust prompt, which matters in CI.
- **Evaluation (D2):** a small benchmark you re-run across variants, using `claude --bare -p --output-format json` to record cost and pass/fail.

## How it runs

Every lesson uses the same loop: you **predict**, **run** the experiment, **observe** the evidence (`/context`, `/usage`, transcripts, diffs), **explain** any gap, then write a **decision rule**. Each ends with an exit test you answer without notes, and I'll mark you honestly on it.

## Caveats

- The docs cover what the features do. Whether a setup is actually better is something we measure in D2, not something I'll assert.
- Some behavior is version-gated, so start with `claude --version`.
- The hooks docs use `jq`-style examples, and you're on Windows. C1 includes a decision on Git Bash versus PowerShell.
- The `course/` folder sits inside the app repo. Add it to `.gitignore` or move it out before the first commit if you don't want it published.

## Where to start

I recommend **A1 and A2 first**, because everything else depends on them, then B1 to scaffold the app. A1 opens with one question, and you answer before I show anything: *"If I ask you to fix a failing test, what do you expect the first three things I do to be?"* Send me your prediction.

## You

Lets start with A1

## Claude

## A1: The loop, harness, and sessions

This lesson has three parts: you predict, I run a task, and we compare the transcript with your predictions. Nothing runs until you've committed to answers.

### Step 1: Predict (answer all four, short is fine)

I'll set up a tiny project with one failing test, and you'll say "fix the failing test."

1. What are the first three tool calls you expect me to make, in order?
2. Of the three phases (gather context, act, verify), which do you expect to take the most tool calls, and why?
3. After I fix it, will I run the tests again without being told to? Why or why not?
4. While I'm working, you type a correction and press Enter, without pressing Esc. When do you expect I'll see it: immediately, at the end of my turn, or at the next tool boundary?

### Step 2: Run (I do this after your answers)

- I create the failing-test project in `course/labs/a1/`.
- You send the "fix the failing test" prompt.
- You queue one correction mid-run to test question 4.
- Together we read the session's JSONL transcript under `~/.claude/projects/`. We count the tool calls, label each by phase, and score your predictions.

### Step 3: Break it

- I run a Bash command that modifies a file, then you `/rewind`. We check whether the change is restored, which tells you what checkpoints cover and what they don't.

### What the docs say (hold this back until after your predictions)

I've read the relevant section of the [how it works page](https://code.claude.com/docs/en/how-claude-code-works). I won't tell you what it says before you answer, so your predictions stay honest.

### Exit test (for the end of the lesson)

Explain, without notes, why "I'll just rewind" is unsafe after a database migration script.

Send me your four answers.

## You

I do not really understand what you mean. Make this course so that I am starting from scratch and go to advanced level.

## Claude

You're right, and that's my mistake. I wrote the course for someone who already knows the basics, and I opened with prediction quizzes before teaching anything. I'm rebuilding it to start from zero and build up to the advanced material.

> **Tool:** Edit {"replace_all":false,"file_path":"c:\\Repositories\\SampleApp\\course\\SYLLABUS.md","old_string":"1. **Predict.** You write down what you expect to happen. No peeking.\n2. **Run.** You do the experiment in this repo.\n3. **Observe.** Evidence only: `/context`, `/usage`, the session transcript, git diff, workflow logs.\n4. **Explain.** You explain any gap between prediction and result. I push back.
… [truncated 769 chars]

> **Tool:** Edit {"replace_all":false,"file_path":"c:\\Repositories\\SampleApp\\course\\SYLLABUS.md","old_string":"## Track A: Mechanism (why Claude behaves as it does)","new_string":"## Level 1: Foundations (start here, no prior knowledge assumed)\n\n- **F1. What Claude Code is.** It is a chat that can read your files, edit them, and run commands. What a \"tool call\" is, what a permission prompt is, where the ch
… [truncated 1454 chars]

> **Tool:** Edit {"replace_all":false,"file_path":"c:\\Repositories\\SampleApp\\course\\PROGRESS.md","old_string":"| Lesson | Status | Prediction score | Notes |\n|---|---|---|---|","new_string":"| Lesson | Status | Prediction score | Notes |\n|---|---|---|---|\n| F1 What Claude Code is | in progress | | |\n| F2 Asking well | not started | | |\n| F3 Watching and approving | not started | | |\n| F4 Undo | not start
… [truncated 164 chars]

> Result:
```
The file c:\Repositories\SampleApp\course\SYLLABUS.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

> Result:
```
The file c:\Repositories\SampleApp\course\SYLLABUS.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

> Result:
```
The file c:\Repositories\SampleApp\course\PROGRESS.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

## Claude

I've updated [course/SYLLABUS.md](course/SYLLABUS.md). The path is now:

**Level 1 Foundations (F1-F8)**, then **Level 2 Working**, then **Levels 3-5**, the advanced tracks. Quizzes and predictions only start at Level 3.

---

## F1: What Claude Code is

### Learn
Think of me as a **colleague sitting at your computer**. You describe what you want in plain English. I can do four things a normal chat can't:

- **Read** files in your project folder.
- **Edit** those files and create new ones.
- **Run commands** in a terminal, such as running tests.
- **Look things up** on the web.

Each of these actions is called a **tool call**. When I say "I'll read the file," that's a tool call. You can see every one in the chat, so nothing happens in secret.

For anything risky, such as editing a file or running a command, I may **ask permission first**. A small prompt appears and you choose Yes or No. That's how you stay in control.

Right now you're in VS Code with a project folder, `c:\Repositories\SampleApp`. That folder is my whole world. It currently holds only the `course` folder with these notes.

### Do
Two small steps. I'll watch and help.

**Step 1.** Type this to me: `What files are in this folder?`
I'll use a tool to look, then answer. Notice that you see a tool call appear in the chat before my answer.

**Step 2.** Type this: `Create a file called hello.txt that says: my first Claude file`
I'll ask permission first, or it may happen automatically depending on your mode. Either way, the file will appear in your folder list on the left.

### Check
After both steps, tell me:
- Did you see a permission prompt? What did it say?
- Do you see `hello.txt` in the VS Code file list?

Then I'll explain exactly what happened behind the scenes and what the permission prompt was protecting you from.

Do the two steps now. If anything looks different from what I described, tell me what you see and I'll sort it out.

## You

What files are in this folder?

> **Tool:** Glob {"pattern":"**/*","path":"c:\\Repositories\\SampleApp"}

> Result:
```
course\SYLLABUS.md
course\PROGRESS.md
```

## Claude

The folder holds one subfolder, `course`, with two files in it:

- `course/SYLLABUS.md`: the full course outline
- `course/PROGRESS.md`: the progress tracker

That's all there is, so there's no app code yet.

**What just happened:** I made one tool call, a file search (the `Glob` tool) over the folder. That call is the "Read" ability from the Learn section. It looked, got a list back, and I turned that list into this answer. Claude Code ran that search for me and showed it to you in the chat.

You can answer from my result, but notice that you have no reason to take my word for it. The tool call is visible, so you can check what I looked at. That visibility is the main way you stay in control.

**Step 2:** type `Create a file called hello.txt that says: my first Claude file`

While it runs, watch for a permission prompt and tell me what it says.

## You

Create a file called hello.txt that says: my first Claude file

> **Tool:** Write {"file_path":"c:\\Repositories\\SampleApp\\hello.txt","content":"my first Claude file\n"}

> Result:
```
File created successfully at: c:\Repositories\SampleApp\hello.txt (file state is current in your context — no need to Read it back)
```

## Claude

I created `hello.txt` in `c:\Repositories\SampleApp` with the text `my first Claude file`. It should now appear in your VS Code file list.

## Check

Tell me what you saw:
1. Did a **permission prompt** appear before the file was created? If so, what did it say?
2. Do you see `hello.txt` in the file list on the left?

## What happened behind the scenes

This time I used a different tool, `Write`, which creates or overwrites a file. Your first step was a read action (`Glob`) and this one is a write action. The difference matters for how permission works:

- **Reading** is low risk, so it usually runs without asking.
- **Writing** changes your computer, so Claude Code normally asks first, or a permission mode you've chosen allows it.

If you didn't see a prompt, your session is probably in **Auto** mode, which the docs say is the default for interactive VS Code sessions. In that mode a safety check runs in the background and only blocks risky actions. Creating a text file in your project folder isn't risky, so it went through. F3 covers the modes properly.

## Rule for F1

You can see every tool call, and a write is a bigger step than a read. When you start working on real code, glance at which tool is being used before you worry about the details.

Once you've answered the two check questions, we move to **F2: Asking well**. There you'll send me the same request two ways, vague and specific, and compare what you get.

## You

No, it did not ask for permission because of the auto mode. Yes, the file is there

## Claude

Confirmed, and that matches the docs: Auto mode is the default in VS Code, and a harmless file creation passes the background safety check.

> **Tool:** Edit {"replace_all":false,"file_path":"c:\\Repositories\\SampleApp\\course\\PROGRESS.md","old_string":"| F1 What Claude Code is | in progress | | |\n| F2 Asking well | not started | | |","new_string":"| F1 What Claude Code is | done | | Saw Glob (read) and Write; Auto mode, no prompt |\n| F2 Asking well | in progress | | |"}

> Result:
```
The file c:\Repositories\SampleApp\course\PROGRESS.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

## Claude

F1 is done.

## F2: Asking well

### Learn
I can read your files and run commands, but I **can't read your mind**. Whatever you don't tell me, I fill in with a guess. Often the guess is fine. Sometimes it's not what you wanted, and you only find out after I've done the work.

An analogy: ask a contractor to "build me a shelf" and you get *a* shelf. Ask for "a 120 cm oak shelf, three levels, wall-mounted, in the hallway" and you get yours.

There are three kinds of information I can't get on my own:
1. **What "done" looks like.** What should work when I'm finished?
2. **Your preferences.** Which of several reasonable approaches do you want?
3. **Things outside the project.** Decisions made in meetings, constraints, names of things.

A specific request includes those. A vague one leaves me to guess. Vague isn't always wrong, though. When you're just exploring ("what would you improve here?"), it's fine.

You can also **hand me things instead of describing them**. Type `@` followed by a file name and I get its contents. You can paste a screenshot or an error message directly too.

### Do
You'll send two requests, and I'll put each result in its own folder so you can compare.

**Request A, vague.** Send exactly this:
`Make me a web page`

**Request B, specific.** After you see A's result, send this:
`Make a web page for a small bakery called "Crumb & Co". One HTML file with the CSS inside it, no libraries. It needs a header with the name, a menu with three items and prices, and an opening-hours section. Use warm brown and cream colours. Make it work on a phone screen.`

I'll save A in `course/labs/f2a` and B in `course/labs/f2b`. Once you've sent both, you open each `index.html` in a browser and compare.

### Check (after both)
- Which result matched what you'd imagined?
- What did request A force me to guess?

Send request A now.

## You

How many hours I need to learn this course?

## Claude

This is my own estimate, not something from the docs. It assumes hands-on work and that you do each exercise rather than skim.

| Level | Lessons | Hours | What you can do after |
|---|---|---|---|
| 1. Foundations | F1-F8 | 6-10 | Build and fix a small app with Claude, use git and GitHub, and undo mistakes |
| 2. Working | B1-B3 plus first Action and deploy | 8-12 | Work in pull requests, with tests and CI, and ship to a live URL |
| 3. Mechanism | A1-A5 | 8-12 | Predict and debug what I do |
| 4. Automation and security | C1-C5 and B4-B6 | 15-20 | Hooks, subagents, scripted runs, hardened CI, a safe deploy pipeline |
| 5. Scale | D1-D4 | 8-12 | Measure setups, roll out to a team, and finish the capstone |
| **Total** | 20 lessons | **about 45-65 hours** | |

**Rough pacing:**
- **1 hour a day:** 2-3 months.
- **Part-time, 5 hours a week:** about 3 months.
- **Intensive, 2-3 weeks full-time.**

**What changes the number:**
- If you already know git and CI, cut Levels 1-2 roughly in half.
- Slower lessons are the ones where something breaks, like workflows failing or a hook misfiring. Debugging is where much of the learning happens, so I'd keep it in.
- Deployment depends on the platform you choose. A first-time setup can add a few hours.

**What you need to be useful sooner:**
You don't need all of it to benefit. Levels 1-2, about **15-20 hours**, give you most of the day-to-day productivity. Levels 3-5 matter if you want to run Claude unattended, secure it, or roll it out to a team.

Lesson F2 is about 20-30 minutes. Send request A whenever you're ready: `Make me a web page`

## You

Can you compact all these lessons to approximately 5 hours? There is too much text. Make it straight to the point and not vague.

## Claude

I'm replacing the 20-lesson syllabus with 10 lessons of about 30 minutes each. Each has only the steps and a check that you're done.

> **Tool:** Write {"file_path":"c:\\Repositories\\SampleApp\\course\\SYLLABUS.md","content":"# Claude Code in 5 hours\n\nYou build one app (a todo web app, Node + Express + Vitest) and ship it through GitHub Actions to a live URL. Each lesson is about 30 minutes: a goal, steps, a check, and the key facts. Facts are from code.claude.com docs.\n\n| # | Lesson | Min |\n|---|---|---|\n| 1 | Basics: talk, approve, undo 
… [truncated 8669 chars]

> **Tool:** Write {"file_path":"c:\\Repositories\\SampleApp\\course\\PROGRESS.md","content":"# Progress\n\n| # | Lesson | Status |\n|---|---|---|\n| 1 | Basics: talk, approve, undo | in progress (tool calls and Auto mode done; modes, Esc, rewind left) |\n| 2 | Specific prompts, spec, build | not started |\n| 3 | Tests as the check | not started |\n| 4 | Git and GitHub | not started |\n| 5 | CLAUDE.md and context | 
… [truncated 234 chars]

> Result:
```
The file c:\Repositories\SampleApp\course\SYLLABUS.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

> Result:
```
The file c:\Repositories\SampleApp\course\PROGRESS.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

## Claude

I cut the course to **10 lessons, about 5 hours**, in [course/SYLLABUS.md](course/SYLLABUS.md). Every lesson now has the same four parts:

- **Goal.**
- **Do**, as numbered steps.
- **Done when**, a check you can verify yourself.
- **Key facts**, the details that matter.

You build one app, a todo web app, and ship it to a live URL.

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

**What I dropped:** the multi-level structure, prediction quizzes, and the deeper material such as worktrees, skills, prompt-injection labs and team rollout. These are listed in one line at the end for later.

**What I kept:** the facts that stop you making expensive mistakes. For example, only exit code 2 blocks in a hook, deny rules beat allow rules, and `claude -p` runs a repo's hooks without a trust prompt.

You've already done the first part of lesson 1 (tool calls, Auto mode). The rest is mode switching, `Esc`, and `/rewind`, about 10 minutes.

**Next step:** press `Shift+Tab` to cycle through the modes and tell me which ones you see.

## You

I pressed Shift+Tab, I see Manual, Accept edits, Plan and Auto

## Claude

Those are the four modes. In plain terms:

| Mode | Behavior |
|---|---|
| **Manual** | I ask before every edit and every command that isn't read-only. |
| **Accept edits** | I edit files and run simple file commands (`mkdir`, `mv`) without asking, and still ask for other commands. |
| **Plan** | I read and propose, and don't edit your files. |
| **Auto** | A background safety check approves routine actions and blocks risky ones. |

## Step 1: see Manual mode

1. Press `Shift+Tab` until you reach **Manual**.
2. Send me: `Add a second line to hello.txt: manual mode test`
3. Approve it when prompted. Notice the prompt shows exactly what I'm about to do, and that you can say No.

## Step 2: undo with rewind

1. Send me: `Change hello.txt so it says only: rewind test`
2. Open the rewind menu: press `Esc` twice on an empty prompt, or type `/rewind`.
3. Pick the message before that change and restore the **code**.
4. Open `hello.txt`. It should be back to the two-line version.

## Step 3: stop me mid-task

1. Send me: `Create 10 files named note1.txt to note10.txt, each with a different sentence, one at a time`
2. Press `Esc` while I'm working. Everything created up to that point stays, and I wait for your next instruction.

Do these in order. When you've finished, tell me:
- What `hello.txt` contained after the rewind.
- How many `note` files exist after you pressed `Esc`.

Then I'll cover the one case where rewind does **not** work, which is the main safety fact of this lesson.

## You

Add a second line to hello.txt: manual mode test

> **Tool:** Edit {"replace_all":false,"file_path":"c:\\Repositories\\SampleApp\\hello.txt","old_string":"my first Claude file\n","new_string":"my first Claude file\nmanual mode test\n"}

> Result:
```
The file c:\Repositories\SampleApp\hello.txt has been updated successfully. (file state is current in your context — no need to Read it back)
```

## Claude

I added the second line, so `hello.txt` now reads:

```
my first Claude file
manual mode test
```

I used the `Edit` tool this time, which replaces specific text in an existing file. Last time I used `Write`, which creates a whole file.

Two things to check:
1. Were you in **Manual** mode, and did a prompt appear asking you to approve the edit? The prompt should have shown the old text and the new text, so you could judge the change.
2. If no prompt appeared, tell me which mode the session was in, because the mode may not have switched.

Then go on to **Step 2** (undo with rewind): send me `Change hello.txt so it says only: rewind test`.

## You

yes, there was a prompt

## Claude

Good. That's Manual mode: you saw the exact change before it happened and could have said No.

**Step 2 (rewind):** send me this now.

`Change hello.txt so it says only: rewind test`

After I make the change, restore it:
1. Press `Esc` twice on an empty prompt, or type `/rewind`.
2. Choose the message from before this change (the one that added "manual mode test").
3. Restore the **code**, not just the conversation.
4. Open `hello.txt` and confirm it's back to two lines.

Tell me what the file contains afterward.

## You

Change hello.txt so it says only: rewind test

> **Tool:** Write {"file_path":"c:\\Repositories\\SampleApp\\hello.txt","content":"rewind test\n"}

> Result:
```
The file c:\Repositories\SampleApp\hello.txt has been updated successfully. (file state is current in your context — no need to Read it back)
```

## Claude

I replaced the file's contents, so `hello.txt` now says only `rewind test`. I used `Write` again because the whole file changed.

**Your turn: undo it.**
1. Press `Esc` twice on an empty prompt, or type `/rewind`.
2. Select the message just before this change (the one that added "manual mode test").
3. Choose to restore the **code**.
4. Open `hello.txt`.

It should be back to the two-line version. Tell me what it contains. If it still says only `rewind test`, tell me which options the menu showed and I'll help.

## You

It's back to two lines

## Claude

Rewind restored the file, so you've got your first safety net. It worked because I changed the file with my own file tools (`Edit` and `Write`), and Claude Code snapshots a file before those tools edit it.

## The case where rewind fails

Rewind covers only changes made through the file tools. A change made through a **shell command** is not tracked. Try it:

1. Send me: `Use a shell command (not your file edit tool) to append the line "from shell" to hello.txt`
2. Open `hello.txt` to confirm the new third line.
3. Press `Esc` twice (or `/rewind`), pick the message before that, and restore the **code**.
4. Open `hello.txt` again.

**Predict first:** will "from shell" still be there after the rewind?

Tell me what you see. This is why git (lesson 4) is the real safety net, and why a database migration or a deploy can never be rewound.

## You

Use a shell command (not your file edit tool) to append the line "from shell" to hello.txt

> **Tool:** Bash {"command":"echo \"from shell\" >> \"c:/Repositories/SampleApp/hello.txt\" && cat \"c:/Repositories/SampleApp/hello.txt\"","description":"Append a line to hello.txt and show it"}

> Result:
```
my first Claude file
manual mode test
from shell
```

## Claude

I used the `Bash` tool, which runs a shell command, and `hello.txt` now has three lines:

```
my first Claude file
manual mode test
from shell
```

**Your turn:**
1. Press `Esc` twice (or type `/rewind`).
2. Pick the message before this one and restore the **code**.
3. Open `hello.txt`.

Tell me whether "from shell" is still there. Also tell me whether the rewind menu warned you about shell changes.
