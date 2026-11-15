# Session 4
Source: 57c5a2e0-7dd7-42aa-acb2-76cfdde6587d.jsonl
Started: 2026-11-15T09:52:31.628Z

## You

<local-command-caveat>The command below was run directly in Claude Code, not sent to you as a request, and its output goes straight to the user. It's recorded here as context for later messages.</local-command-caveat>

## You

<command-name>/clear</command-name>
            <command-message>clear</command-message>
            <command-args></command-args>

## You

what is my learning progress?

> **Tool:** Read {"file_path":"c:\\Repositories\\SampleApp\\course\\PROGRESS.md"}

> Result:
```
1	# Progress
2	
3	| # | Lesson | Status |
4	|---|---|---|
5	| 1 | Basics: talk, approve, undo | done |
6	| 2 | Specific prompts, spec, build | done |
7	| 3 | Tests as the check | done |
8	| 4 | Git and GitHub | done |
9	| 5 | CLAUDE.md and context | done |
10	| 6 | Permissions and hooks | done |
11	| 7 | Subagents and review | not started |
12	| 8 | GitHub Actions with Claude | not started |
13	| 9 | Deploy | not started |
14	| 10 | Headless, cost, wrap-up | not started |
15
```

## Claude

You've finished 6 of 10 lessons (60%).

**Done:**
1. Basics: talk, approve, undo
2. Specific prompts, spec, build
3. Tests as the check
4. Git and GitHub
5. CLAUDE.md and context
6. Permissions and hooks

**Not started:**
7. Subagents and review
8. GitHub Actions with Claude
9. Deploy
10. Headless, cost, wrap-up

Lesson 7 is next. The latest commit, "Add lesson 6 notes, update CLAUDE.md, refresh transcripts", shows lesson 6 was wrapped up properly, and the git status was clean at the start of this session.

## You

let's start lesson 7

> **Tool:** Glob {"pattern":"course/**/*","path":"c:\\Repositories\\SampleApp"}

> **Tool:** Read {"file_path":"C:\\Users\\USER\\.claude\\projects\\c--Repositories-SampleApp\\memory\\course-user-goal.md"}

> Result:
```
course\SYLLABUS.md
course\transcripts\session-1.md
course\transcripts\session-2.md
course\PLAYBOOK.md
course\PROGRESS.md
course\export-transcripts.mjs
course\transcripts\session-3.md
```

> Result:
```
1	---
2	name: course-user-goal
3	description: User is taking a 10-lesson Claude Code CI/CD course using the todo app in SampleApp; where the course files live
4	metadata:
5	  node_type: memory
6	  type: project
7	  originSessionId: c15fde1b-1130-4224-861a-77c0146668d6
8	  modified: 2026-11-14T21:57:59.453Z
9	---
10	
11	The user is following `course/SYLLABUS.md` (10 lessons, about 5 hours) by building a todo app (Node + Express + React + SQLite + Vitest) from `SPEC.md`, aiming to ship it through GitHub Actions to Render. Progress is in `course/PROGRESS.md`. As of 2026-11-14 lessons 1-2 are done and lesson 3 (tests as the check) is in progress: step 1 done, step 2 (plant a bug, see if Claude catches it) awaits the user's choice of bug.
12	
13	**Why:** the user wants to reproduce what they le
… [truncated 181 chars]
```

> **Tool:** Read {"file_path":"c:\\Repositories\\SampleApp\\course\\SYLLABUS.md"}

> Result:
```
1	# Claude Code in 5 hours
2	
3	You build one app (a todo web app, Node + Express + Vitest) and ship it through GitHub Actions to a live URL. Each lesson is about 30 minutes: a goal, steps, a check, and the key facts. Facts are from code.claude.com docs.
4	
5	| # | Lesson | Min |
6	|---|---|---|
7	| 1 | Basics: talk, approve, undo | 20 |
8	| 2 | Specific prompts, spec, build the app | 35 |
9	| 3 | Tests as the check | 30 |
10	| 4 | Git and GitHub | 30 |
11	| 5 | CLAUDE.md and context | 25 |
12	| 6 | Permissions and hooks | 35 |
13	| 7 | Subagents and review | 30 |
14	| 8 | GitHub Actions with Claude | 40 |
15	| 9 | Deploy | 35 |
16	| 10 | Headless, cost, wrap-up | 20 |
17	| | **Total** | **300** |
18	
19	---
20	
21	## 1. Basics (20 min)
22	**Goal:** operate a session safely.
23	**Do:**
24	
… [truncated 8479 chars]
```

> **Tool:** Read {"file_path":"c:\\Repositories\\SampleApp\\course\\PLAYBOOK.md"}

> Result:
```
1	# Claude Code playbook
2	
3	Copy this file into any new project. Updated after each lesson. Lessons done: 1, 2, 3, 4, 5, 6.
4	
5	## Lesson 1: Operate a session safely
6	
7	- `Shift+Tab` cycles permission modes: Manual (asks before edits and commands), Accept edits, Plan (no edits), Auto (safety classifier, default in VS Code).
8	- `Esc` mid-run stops the task. Everything done so far is kept.
9	- `/rewind` (or Esc twice) restores earlier file edits.
10	- **Gotcha:** `/rewind` only restores files edited with Claude's file tools. Files changed by shell commands, deploys and database changes are not restored. Git is the real safety net (lesson 4).
11	- Auto mode can block commands it judges too broad (e.g. killing every `node` process). Target the one process you started instead.
12	
13	## L
… [truncated 10902 chars]
```

> **Tool:** Bash {"command":"git status -sb && git branch -a && ls .claude .claude/agents 2>&1"}

> Result:
```
Exit code 2
## main...origin/main
  chore/hooks
  chore/remove-scratch-files
  docs/add-claude-md
  docs/pr-template
* main
  remotes/origin/chore/hooks
  remotes/origin/main
ls: cannot access '.claude/agents': No such file or directory
.claude:
hooks
settings.json
```

> **Tool:** Bash {"command":"git switch -c chore/reviewer-agent && mkdir -p .claude/agents"}

> **Tool:** Write {"file_path":"c:\\Repositories\\SampleApp\\.claude\\agents\\reviewer.md","content":"---\nname: reviewer\ndescription: Reviews changes against SPEC.md. Use before opening a PR.\ntools: Read, Grep, Glob\n---\nCompare the changed files to the spec. Report only gaps that affect correctness. Skip style.\n"}

> Result:
```
Switched to a new branch 'chore/reviewer-agent'
```

> Result:
```
File created successfully at: c:\Repositories\SampleApp\.claude\agents\reviewer.md (file state is current in your context — no need to Read it back)
```

## Claude

Lesson 7 is started. I did step 1: I created the reviewer agent on a new branch, `chore/reviewer-agent`, because `main` is protected. The file is [.claude/agents/reviewer.md](.claude/agents/reviewer.md). It has read-only tools (Read, Grep, Glob), so it can't edit anything.

**Step 2 needs a refresh first.** Subagent files are usually loaded when a session starts. If the new agent doesn't show up, run `/agents` or restart the session. Then ask:

> have the reviewer check the app against SPEC.md

When the review comes back, look for two things. First, whether it only reports correctness gaps and skips style, as the "skip style" line asks. Second, whether it tried to edit anything. It shouldn't be able to.

**Step 3** is `/code-review` on a branch diff. It needs a diff to look at, and right now this branch only adds the agent file. Two options:
- Run it on this small diff, which is quick but not much to review.
- Make a small change on a branch first, such as a spec feature or a planted bug, so the review has something real to find. A planted bug would repeat the lesson 3 idea, now with a reviewer in place of the tests.

Do you want to try the reviewer first, or choose the step 3 change now?

## You

how to do a step 2

## Claude

**Step 2: run the reviewer**

1. **Make Claude Code see the new agent.** Agent files are read at session start. Either:
   - type `/agents` and check that `reviewer` is listed (it may pick the file up there), or
   - start a fresh session with `/clear`, or restart the extension, if it isn't listed.

2. **Send this prompt in the chat:**
   ```
   have the reviewer check the app against @SPEC.md
   ```
   Claude will hand the job to the `reviewer` subagent. You'll see it appear as a subagent/Task call in the transcript. It works in its own fresh context and returns only a summary.

3. **Check the result against "Done when":**
   - It returned findings (even "no gaps found" counts, but look at whether it actually read the code).
   - It only reports correctness gaps, with no style nitpicks.
   - It can't edit files. To prove this, you can add: `ask the reviewer to fix whatever it finds`. It should say it has no edit tool.

**Tips**
- If Claude does the review itself instead of delegating, name the agent explicitly: `use the reviewer subagent to ...`.
- Compare its findings with what you know. The lesson 3 delete-by-position bug was fixed, so a good reviewer shouldn't flag it. A false alarm like that would show it isn't reading carefully.

You can do this yourself now, or tell me to run it and I'll report what comes back.

## You

<local-command-caveat>The command below was run directly in Claude Code, not sent to you as a request, and its output goes straight to the user. It's recorded here as context for later messages.</local-command-caveat>

## You

<command-name>/agents</command-name>
            <command-message>agents</command-message>
            <command-args></command-args>

## You

The /agents wizard has been removed.

## Claude

The `/agents` wizard is gone, so the file in `.claude/agents/` is the only setup. I'll try calling the reviewer directly.

> **Tool:** Agent {"description":"Review app against SPEC.md","subagent_type":"reviewer","prompt":"Check the app against SPEC.md (at c:\\Repositories\\SampleApp\\SPEC.md). Read the server and client source and report only gaps that affect correctness. Skip style."}

> Result:
```
Agent type 'reviewer' not found. Available agents: claude, claude-code-guide, Explore, general-purpose, Plan, statusline-setup
```

## Claude

The reviewer isn't registered yet. The agent list is loaded when the session starts, and I created the file after that.

**To fix it:** start a new session. Run `/clear` first. If `reviewer` still isn't found after that, restart the VS Code extension or open a new chat tab.

Then send this in the new session:
```
have the reviewer check the app against @SPEC.md
```

The new session should have `reviewer` in its list of available agents. If it doesn't, check that the file is at `.claude/agents/reviewer.md` in the project root and that the frontmatter starts with `---` on the first line.

I could also run a general-purpose subagent with the same instructions now. That wouldn't test your reviewer file, and it wouldn't have the read-only restriction, so I'd skip it. Want me to wait for you to restart?
