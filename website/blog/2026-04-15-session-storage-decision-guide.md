---
slug: /2026-04-15-session-storage-decision-guide
canonical_url: https://dfberry.github.io/blog/2026-04-15-session-storage-decision-guide
custom_edit_url: null
sidebar_label: "2026-04-15 Copilot CLI session storage guide"
title: "How Copilot CLI Session Storage Actually Works — and What It Means for Squad"
description: "Copilot CLI stores sessions locally and syncs metadata to the cloud. Learn how this interacts with Squad's memory system and when to commit vs. gitignore session files."
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

# How Copilot CLI Session Storage Actually Works — and What It Means for Squad

If you've used Copilot CLI and Squad together, you've probably noticed that agents can query your session history across sessions — asking things like "what did I work on last week?" and getting real answers back. But how does that actually work? Where does the data live? And how does it interact with Squad's own memory system?

This post breaks down what's actually happening under the hood, based on the [official GitHub docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/chronicle) and hands-on investigation.

## How Copilot CLI Stores Sessions

Copilot CLI stores session data in **two local structures** on your machine:

### Session Files

Every session is persisted as a set of files in `~/.copilot/session-state/{session-id}/`. This is a complete record — your prompts, Copilot's responses, tool invocations, file modifications, and checkpoints. This powers the `/resume` command and session recovery.

### Session Store (SQLite)

Copilot CLI also maintains a local SQLite database at `~/.copilot/session-store.db`. This is a structured subset of the session files, with tables for sessions, turns, checkpoints, file references, and commit/PR/issue links. This powers the `/chronicle` slash command and lets Copilot answer questions about your past work.

### Cloud Session Metadata

Behind the scenes, Copilot CLI also syncs session metadata to a cloud store. This is what powers the `session_store_sql` tool — a DuckDB-based query interface that agents (and Squad) use to search your session history. The cloud store contains tables like `sessions`, `turns`, `checkpoints`, `session_files`, `session_refs`, `events`, and `tool_requests`.

This cloud sync is **not a user-configurable setting** — it's a platform capability that happens automatically. The [official docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/chronicle) describe session data as "local and private," and state that "nothing is uploaded or shared beyond the normal AI model interactions." The cloud metadata store appears to operate as part of those normal interactions rather than as a separate upload.

> **Key takeaway:** You don't choose between cloud, local, or repo storage. Copilot CLI stores sessions locally and syncs metadata to the cloud automatically. There's no setting to change.

## What `session_store_sql` Actually Queries

When an agent calls `session_store_sql`, it's querying the cloud DuckDB store — not your local SQLite database. This has practical implications:

- **It works across devices.** If you use Copilot CLI on your laptop and then switch to your desktop, agents can query sessions from both.
- **It has a "personal" and "repository" scope.** Personal queries return your sessions; repository queries return all users' sessions in a repo.
- **The `repository` field is often NULL.** In my testing, 14 of 15 sessions had `repository: NULL` — even sessions run inside a git repo. Only Copilot coding agent sessions (triggered via GitHub issue assignment) reliably populate the repository field.
- **It's a metadata subset.** The cloud store doesn't contain full conversation transcripts — it has structured metadata, turns, and file references. The full session data stays local.

## Where Squad's Memory Fits In

Squad has its own memory system that's completely independent of Copilot's session store. It's entirely repo-based:

| Squad Memory | File | Committed to Git? |
|-------------|------|-------------------|
| Team decisions | `.squad/decisions.md` | ✅ Yes |
| Agent memory | `.squad/agents/{name}/history.md` | ✅ Yes |
| Skills | `.squad/skills/{name}/SKILL.md` | ✅ Yes |
| Session files | `.squad/sessions/*.json` | ❌ Gitignored by default |
| Scribe logs | `.squad/log/*.md` | ❌ Gitignored by default |
| Orchestration logs | `.squad/orchestration-log/*.md` | ❌ Gitignored by default |

### The Two Memory Systems

| | Copilot CLI Store | Squad Memory |
|---|---|---|
| **What's stored** | Full conversation history, tool calls, file refs | Decisions, agent learnings, skills, session state |
| **Where** | `~/.copilot/` (local) + cloud metadata | `.squad/` in the repo |
| **Queryable by agents** | Yes, via `session_store_sql` | Yes, via file read |
| **Persists across repos** | Yes (it's per-user, not per-repo) | No (it's per-repo) |
| **Controlled by you** | Partially (can delete local files) | Fully (it's markdown in your repo) |

These systems complement each other. Copilot's store tells agents "what happened in past sessions." Squad's store tells agents "what the team decided, learned, and knows how to do."

## The Key Distinction: Sessions vs. Knowledge

Squad draws a deliberate line between these:

**Knowledge** (decisions, history, skills) is **committed**. It's the team's institutional memory. It compounds over time. When you clone the repo, you get the team's distilled knowledge.

**Sessions** (conversation transcripts, orchestration logs, checkpoints) are **gitignored by default**. They're runtime state — useful for resume, debugging, and auditing the process that led to a result. They're large and may contain sensitive content.

This is a design tradeoff, not a universal truth. For some teams, raw transcripts are first-class artifacts — audit evidence, training material, prompt evaluation data. Squad's defaults optimize for low-noise repos and durable extracted knowledge. Your team may value different things.

This is why `squad init` automatically adds these to `.gitignore`:

```gitignore
.squad/orchestration-log/
.squad/log/
.squad/decisions/inbox/
.squad/sessions/
```

The important outputs of a session — decisions made, learnings captured, skills extracted — get promoted to committed files. The raw session data stays local.

## The Gitignore Decision

The one storage decision you actually make is: **should Squad's session-related files be committed or gitignored?**

### Gitignore (Default — Start Here)

This is Squad's default behavior and the right choice for most setups.

**Why this is the default:**
- Session files are large (full conversation transcripts)
- They may contain sensitive content (API keys in error messages, file contents, personal preferences)
- They create noisy git diffs on every session
- The valuable outputs are already committed separately (decisions, history, skills)

**When to keep the default:**
- Public repos (never commit sessions to public repos)
- Repos with many contributors
- When sessions contain sensitive data
- When you're not sure

### Commit Sessions (Intentional Choice)

Remove `.squad/sessions/` from `.gitignore` if you want session transcripts in git.

**When this makes sense:**
- Private team repos where transparency matters
- Training/onboarding repos where session history is part of the curriculum
- Research projects where the process matters as much as the result

**What to watch for:**
- Repo size grows fast
- Review sessions before committing — they may contain content you don't want in git history permanently
- Set up a cleanup policy — archive sessions older than N days

> ⚠️ **Compliance note:** If your org requires audit trails of AI interactions, committing sessions to git may seem like an obvious fit — but git is not designed for compliance record-keeping. It lacks retention controls, redaction support, access-control granularity, and legal hold capabilities. Check your compliance requirements before treating git as your system of record for AI transcripts.

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
- Raw session data stays local
- Audit trail without the noise

## Summary

| Layer | What | Where | You control it? |
|-------|------|-------|----------------|
| Copilot session files | Full conversation history | `~/.copilot/session-state/` (local) | Delete files to remove |
| Copilot session store | Structured metadata (SQLite) | `~/.copilot/session-store.db` (local) | `/chronicle reindex` to rebuild |
| Copilot cloud metadata | Session metadata (DuckDB) | GitHub cloud (automatic sync) | Not directly configurable |
| Squad committed memory | Decisions, history, skills | `.squad/` in repo (committed) | Full control — it's your markdown |
| Squad session state | Session transcripts, logs | `.squad/` in repo (gitignored by default) | Gitignore policy is your choice |

## The Bottom Line

Copilot CLI handles session persistence automatically — local files for full fidelity, cloud metadata for cross-session queries. You don't need to configure this.

The decision you actually make is about **Squad's gitignore policy**: what squad-generated files (logs, orchestration traces, session state) should be committed vs. kept local. Start with the default (gitignore everything except decisions, history, and skills). Relax it later if you need committed session trails.

Both systems work together: Copilot's `session_store_sql` gives agents memory across sessions. Squad's `.squad/` files give agents memory across the team.
