---
slug: /2026-04-15-session-storage-decision-guide
canonical_url: https://dfberry.github.io/blog/2026-04-15-session-storage-decision-guide
custom_edit_url: null
sidebar_label: "2026-04-15 Copilot CLI session storage guide"
title: "Where Should Your AI Agent Sessions Live? A Decision Guide for Copilot CLI Session Storage"
description: "Compare cloud, local, and repo session storage options for GitHub Copilot CLI. Find the right fit for your AI agent workflow and Squad memory system."
published: false
tags:
  - GitHub Copilot
  - AI agents
  - session management
  - developer workflow
  - Squad
  - Copilot CLI
keywords:
  - copilot cli session storage
  - ai agent memory
  - squad session management
  - github copilot cli setup
  - agent session persistence
updated: 2026-04-15 00:00 PST
---

# Where Should Your AI Agent Sessions Live? A Decision Guide for Copilot CLI Session Storage

When you set up Copilot CLI, it asks you a question that seems simple: **where do you want to store your sessions?** The three choices are cloud, local, or repo. For most developers, this is a quick pick-and-move-on moment. But if you're running Squad, this decision has real consequences for how your team remembers, recovers, and collaborates.

This post breaks down what each option actually means for Squad users, when to commit session files vs. gitignore them, and how Copilot's session storage interacts with Squad's own memory system.

## The Three Storage Options

### Cloud

Copilot syncs your session history to GitHub's cloud. Sessions persist across machines. The `session_store_sql` tool (DuckDB queries over your session history) works fully.

### Local

Sessions stay in `~/.copilot/` on your machine. Private, fast, never leaves your device. But `session_store_sql` returns empty results — agents querying your session history get nothing back.

### Repo

Sessions are stored inside the repository you're working in. They travel with the code. They're visible to anyone who clones the repo (unless gitignored). They're auditable in the commit log.

## Why This Matters for Squad

Squad has its own memory system — and it's entirely repo-based:

| Squad Memory | File | Committed to Git? |
|-------------|------|-------------------|
| Team decisions | `.squad/decisions.md` | ✅ Yes |
| Agent memory | `.squad/agents/{name}/history.md` | ✅ Yes |
| Skills | `.squad/skills/{name}/SKILL.md` | ✅ Yes |
| Session files | `.squad/sessions/*.json` | ❌ Gitignored by default |
| Scribe logs | `.squad/log/*.md` | ❌ Gitignored by default |
| Orchestration logs | `.squad/orchestration-log/*.md` | ❌ Gitignored by default |

Wait — Squad gitignores its own session files? Yes. And this is a deliberate design choice that tells you something important about how Squad thinks about sessions vs. knowledge.

## The Key Distinction: Sessions vs. Knowledge

Squad draws a sharp line:

**Knowledge** (decisions, history, skills) is **committed**. It's the team's institutional memory. It compounds. It's portable. When you clone the repo, you get the full team brain.

**Sessions** (conversation transcripts, orchestration logs, checkpoints) are **gitignored**. They're runtime state — useful for resume and debugging, but not part of the permanent record. They're noisy, they're large, and they contain the messy process of getting to a result, not the result itself.

This is why `squad init` automatically adds these to `.gitignore`:

```gitignore
.squad/orchestration-log/
.squad/log/
.squad/decisions/inbox/
.squad/sessions/
```

The important outputs of a session — decisions made, learnings captured, skills extracted — get promoted to committed files. The raw session data stays local.

## How Copilot's Storage Interacts with Squad's Memory

Here's where it gets interesting. Copilot CLI has its own session store (`~/.copilot/session-store.db`) that's completely independent of Squad's `.squad/sessions/`. They serve different purposes:

| | Copilot CLI Store | Squad Session Store |
|---|---|---|
| **What's stored** | Full conversation (every turn, checkpoint, file refs) | Shell message history (for resume) |
| **Where** | `~/.copilot/` or cloud or repo | `.squad/sessions/` |
| **Queryable by agents** | Yes, via `session_store_sql` | Yes, via file read |
| **Used for** | Cross-session queries, session recovery skill | Squad shell `/resume` command |
| **Compaction recovery** | Checkpoints in Copilot's store | `.squad/sessions/{id}.json` checkpoint |

When you choose "repo" for Copilot's storage, both stores end up in the repo — but in different directories with different purposes.

## Decision Guide: Which Storage Option to Choose

### Cloud Session Storage

- You work across multiple machines (laptop, desktop, codespace)
- You want `session_store_sql` to work (agents can query "what did I do last week?")
- You want Squad's `session-recovery` skill to find interrupted sessions
- Your org allows sending conversation content to GitHub's cloud
- You're a solo developer who values convenience

**Squad impact:** Full feature set. `session_store_sql` works, session recovery works, cross-device resume works. Squad's own `.squad/` memory is unaffected (it's always in the repo regardless).

### Repo Session Storage

- You want everything in one place — code, squad state, and session history
- You're working on a team and want session history to be shared or auditable
- You want session data to be portable via `git push` without cloud dependency
- You want git-auditable session history (who ran what, when)
- Your org restricts cloud storage but allows repo-based storage

**Squad impact:** Sessions live alongside `.squad/` files — natural fit for Squad's "everything in git" model. But you need to make a gitignore decision (see below). `session_store_sql` behavior depends on whether Copilot indexes repo-stored sessions the same way — verify this works in your setup.

### Local Session Storage

- Security policy prohibits both cloud and repo storage of conversation content
- You're on a single machine and don't need cross-device resume
- You don't need `session_store_sql` queries
- You're working on a public repo and don't want session transcripts exposed

**Squad impact:** Minimal. Squad's core memory (decisions, history, skills) is unaffected. You lose `session_store_sql` queries and the session-recovery skill. Squad's own `.squad/sessions/` still works for resume (it's independent of Copilot's store).

## The Gitignore Decision

If you choose repo storage, you face a second question: **should session files be committed or gitignored?**

### Gitignore Sessions (Default — Start Here)

This is Squad's default behavior. `squad init` gitignores `.squad/sessions/` automatically.

**Why this is the default:**
- Session files are large (full conversation transcripts)
- They contain the messy process, not the clean result
- They may contain sensitive content (API keys in error messages, file contents, personal preferences)
- They create noisy git diffs on every session
- The valuable outputs (decisions, history, skills) are already committed separately

**When to keep the default:**
- Public repos (never commit sessions to public repos)
- Repos with many contributors (session noise drowns signal in diffs)
- When sessions contain sensitive data
- When you're not sure (start gitignored, relax later if needed)

### Commit Sessions (Intentional Choice)

Remove `.squad/sessions/` from `.gitignore` if you want session transcripts in git.

**When this makes sense:**
- Private team repos where transparency matters
- Compliance requirements that need full audit trails of AI interactions
- Training/onboarding repos where session history is part of the curriculum
- Research projects where the process matters as much as the result

**What to watch for:**
- Repo size grows fast — each session is a full conversation transcript
- Review your sessions before committing — they may contain content you don't want in git history permanently
- Consider a `.squad/sessions/.gitkeep` with a README explaining why sessions are tracked
- Set up a cleanup policy — archive sessions older than N days

### Hybrid: Commit Logs, Gitignore Sessions

A middle ground that works well for many teams:

```gitignore
# Keep raw sessions local
.squad/sessions/

# But commit Scribe's summaries (remove these from .gitignore)
# .squad/log/
# .squad/orchestration-log/
```

This gives you:
- Clean, human-readable session summaries in git (Scribe's logs)
- Raw session data stays local (not committed)
- Audit trail without the noise

To do this, remove `.squad/log/` and `.squad/orchestration-log/` from your `.gitignore`. Scribe's logs are concise markdown summaries — much smaller and cleaner than raw session files.

## Summary: The Decision Matrix

| Scenario | Copilot Storage | Gitignore Sessions? |
|----------|----------------|-------------------|
| Solo dev, multiple machines | Cloud | Yes (default) |
| Solo dev, single machine | Repo or Local | Yes (default) |
| Private team, transparency needed | Repo | No — commit them |
| Private team, compliance required | Repo | No — commit, plus commit Scribe logs |
| Public repo | Cloud or Local | Yes — never commit sessions to public repos |
| Enterprise, security-restricted | Local | Yes (default) |
| Hybrid (recommended for most teams) | Cloud or Repo | Gitignore sessions, commit Scribe logs |

## The Bottom Line

Squad's memory system is designed to extract the signal (decisions, history, skills) from the noise (raw sessions) and commit only the signal. That's why sessions are gitignored by default — the important stuff is already being saved.

Copilot's session storage adds a convenience layer on top: cross-device resume, session queries, recovery from interruptions. Choose the storage option that fits your workflow, knowing that Squad's core memory is unaffected by your choice.

If you're unsure: **start with cloud storage and the default gitignore.** You get full Copilot features, Squad's memory works perfectly, and sessions stay out of your git history. Relax the gitignore later if you need committed session trails.
