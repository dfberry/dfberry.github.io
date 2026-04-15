---
slug: /2026-04-15-session-storage-decision-guide
canonical_url: https://dfberry.github.io/blog/2026-04-15-session-storage-decision-guide
custom_edit_url: null
sidebar_label: "2026-04-15 Copilot CLI session storage guide"
title: "Where Should Your AI Agent Sessions Live? Session Storage for Copilot CLI and Squad"
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

# Where Should Your AI Agent Sessions Live? Session Storage for Copilot CLI and Squad

When you set up Copilot CLI, it asks you a question that seems simple: **where do you want to store your sessions?** The three choices are cloud, local, or repo. For most developers, this is a quick pick-and-move-on moment. But if you're running Squad, this decision has real consequences for how your team remembers, recovers, and collaborates.

This post breaks down what each option actually means for Squad users, when to commit session files vs. gitignore them, and how Copilot's session storage interacts with Squad's own memory system.

## The Three Storage Options

### Cloud

Copilot syncs your session history to GitHub's cloud. Sessions persist across machines. The `session_store_sql` tool (DuckDB queries over your session history) is enabled in this mode.

### Local

Sessions stay in `~/.copilot/` on your machine. Private and fast — not synced to cloud or repo, though local backup and sync tools may still access the files. But `session_store_sql` returns empty results — agents querying your session history get nothing back.

### Repo

Sessions are stored inside the repository working tree. If committed, they travel with the code and are visible to anyone who clones. If gitignored (the default), they stay local despite living in the repo directory. The distinction between storage location and git policy matters — see "The Gitignore Decision" below.

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

**Knowledge** (decisions, history, skills) is **committed**. It's the team's institutional memory. It compounds. It's portable. When you clone the repo, you get the team's distilled knowledge — though operational context from session transcripts won't be there unless you commit those too.

**Sessions** (conversation transcripts, orchestration logs, checkpoints) are **gitignored**. They're runtime state — useful for resume, debugging, and auditing the process that led to a result. They're large and may contain sensitive content, so Squad treats them as local by default. That said, this is a design tradeoff, not a universal truth: for some teams, raw transcripts are first-class artifacts (audit evidence, training material, prompt evaluation data). Squad's defaults optimize for low-noise repos and durable extracted knowledge — your team may value different things.

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

**Squad impact:** Best option for cross-device workflows. Enables `session_store_sql`, session recovery, and cross-device resume. Squad's committed artifacts (decisions, history, skills) work the same regardless of storage choice — they're always in the repo.

### Repo Session Storage

- You want everything in one place — code, squad state, and session history
- You're working on a team and want session history to be shared or auditable
- You want session data to be portable via `git push` without cloud dependency
- You want git-auditable session history (who ran what, when)
- Your org restricts cloud storage but allows repo-based storage

**Squad impact:** Sessions live alongside `.squad/` files in the repo working tree. Whether they're shared or auditable depends on your gitignore policy (see below), not just the storage choice. Note: `session_store_sql` is a cloud-backed feature — it queries cloud-synced session data, not local files. Choosing repo storage alone does not enable `session_store_sql`; you'd need cloud storage for that.

### Local Session Storage

- Security policy prohibits both cloud and repo storage of conversation content
- You're on a single machine and don't need cross-device resume
- You don't need `session_store_sql` queries
- You're working on a public repo and don't want session transcripts exposed

**Squad impact:** Squad's committed artifacts (decisions, history, skills) work normally. You lose `session_store_sql` queries and the session-recovery skill — those are real workflow features, not just nice-to-haves, so weigh that tradeoff. Squad's own `.squad/sessions/` still works for resume (it's independent of Copilot's store).

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
- Training/onboarding repos where session history is part of the curriculum
- Research projects where the process matters as much as the result

**What to watch for:**
- Repo size grows fast — each session is a full conversation transcript
- Review your sessions before committing — they may contain content you don't want in git history permanently
- Consider a `.squad/sessions/.gitkeep` with a README explaining why sessions are tracked
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
- Raw session data stays local (not committed)
- Audit trail without the noise

To do this, remove `.squad/log/` and `.squad/orchestration-log/` from your `.gitignore`. Scribe's logs are concise markdown summaries — much smaller and cleaner than raw session files.

## Summary: The Decision Matrix

| Scenario | Copilot Storage | Gitignore Sessions? |
|----------|----------------|-------------------|
| Solo dev, multiple machines | Cloud | Yes (default) |
| Solo dev, single machine | Repo or Local | Yes (default) |
| Private team, transparency needed | Repo | No — commit them |
| Private team, compliance required | Repo + dedicated audit tool | Consult compliance team — git alone may not meet retention/redaction requirements |
| Public repo | Cloud or Local | Yes — never commit sessions to public repos |
| Enterprise, security-restricted | Local | Yes (default) |
| Hybrid (recommended for most teams) | Cloud or Repo | Gitignore sessions, commit Scribe logs |

## The Bottom Line

Squad's memory system extracts the signal (decisions, history, skills) from the noise (raw sessions) and commits only the signal. That's why sessions are gitignored by default. This is one valid design tradeoff — it optimizes for low-noise repos and durable extracted knowledge. Teams that need raw transcripts for auditing, training, or reproducibility should adjust the defaults.

Copilot's session storage adds a convenience layer on top: cross-device resume, session queries, recovery from interruptions. Choose the storage option that fits your workflow, knowing that Squad's committed artifacts work the same regardless.

If you're unsure: **start with cloud storage and the default gitignore.** You get the broadest Copilot feature support, Squad's committed memory works as expected, and sessions stay out of your git history. Relax the gitignore later if you need committed session trails.
