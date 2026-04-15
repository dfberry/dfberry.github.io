---
slug: /2026-04-15-session-storage-decision-guide
canonical_url: https://dfberry.github.io/blog/2026-04-15-session-storage-decision-guide
custom_edit_url: null
sidebar_label: "2026-04-15 Copilot CLI session storage guide"
title: "How Copilot CLI Session Storage Actually Works — What I Found in the Source Code"
description: "I dug into the Copilot CLI source to understand session storage. Here's what the feature flags, config keys, and undocumented prompts actually do."
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

# How Copilot CLI Session Storage Actually Works — What I Found in the Source Code

When I first set up Copilot CLI, it asked me where I wanted to store my session data. I picked an option and moved on. Later, when I tried to understand what that choice actually did, I couldn't find any documentation — not in the [official docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/chronicle), not in the CLI help, not anywhere online.

So I read the source code. Here's what I found.

## What the Docs Say

The [official GitHub docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/chronicle) describe session storage as straightforward:

- Sessions are stored locally in `~/.copilot/session-state/`
- A local SQLite database (`session-store.db`) powers `/chronicle` and session queries
- *"All session data is stored locally... Nothing is uploaded or shared beyond the normal AI model interactions."*

That's it. No mention of cloud storage. No mention of a startup prompt asking where to store data. No mention of the `session_store_sql` tool that agents use to query your history.

## What the Source Code Reveals

I dug into the minified source at the Copilot CLI npm package (`@github/copilot`). Here's what's actually going on.

### Three Feature Flags

Session storage is controlled by three feature flags with different rollout states:

| Flag | Default | What it does |
|------|---------|-------------|
| `SESSION_STORE` | `"staff-or-experimental"` | Enables the local SQLite session store for cross-session history, file tracking, and search |
| `CLOUD_SESSION_STORE` | `"off"` | Routes session store queries to a cloud DuckDB API instead of local SQLite, with local fallback |
| `REMOTE_SESSION_EXPORT` | (gated) | Enables syncing session data to GitHub's cloud for cross-device access and `/remote` steering |

### The Config Key: `storeSessionsRemotely`

In `config.json`, there's an optional boolean field: `storeSessionsRemotely`. This controls whether sessions are exported to GitHub's cloud. The startup prompt you see on first launch likely sets this value — but it doesn't appear in the config after you answer it, and the field isn't documented anywhere.

Related config fields include `exportSessions` and `steerableSessions`, which control whether sessions can be shared to GitHub and steered remotely.

### How It All Connects

Here's the chain:

1. **Local session files** (`~/.copilot/session-state/`) — always created. Full conversation record. Powers `/resume`.

2. **Local SQLite store** (`session-store.db`) — enabled by `SESSION_STORE` flag (staff + experimental users). Powers `/chronicle`, cross-session queries, and search. If you're not staff or experimental, this may not exist.

3. **Cloud DuckDB store** — enabled by `CLOUD_SESSION_STORE` flag (**off by default**). When active, `session_store_sql` queries go to a cloud analytics API instead of local SQLite, with local fallback. This is what lets agents ask "what did I do last week?" across sessions.

4. **Remote session export** — controlled by `storeSessionsRemotely` config + `REMOTE_SESSION_EXPORT` flag. Syncs session data to GitHub for cross-device access and the `/remote` slash command.

### Why It Works for Me (and Maybe Not for You)

My `config.json` has `"staff": true`. That means:
- `SESSION_STORE` is enabled (staff-or-experimental)
- The cloud features are likely enabled via server-side flag overrides
- The `session_store_sql` tool works because my sessions are being synced

If you're a regular Copilot user without staff access, you may have a different experience:
- `SESSION_STORE` requires experimental mode (`/experimental on`)
- `CLOUD_SESSION_STORE` is off by default
- `session_store_sql` may query local SQLite or return nothing

### The Undocumented Startup Prompt

When Copilot CLI first launches, it may ask where you want to store session data. This prompt:
- Is not documented in the official docs
- Sets `storeSessionsRemotely` and/or related config fields
- The impact depends on which feature flags are enabled for your account
- Your answer may enable `REMOTE_SESSION_EXPORT`, which controls cloud sync

The docs say everything is local because, for most users, it is. The cloud features exist but are gated behind feature flags that most users don't have yet.

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

| Layer | What | Where | Gated by |
|-------|------|-------|----------|
| Session files | Full conversation record | `~/.copilot/session-state/` (local) | Always on |
| Local session store | Structured metadata (SQLite) | `~/.copilot/session-store.db` | `SESSION_STORE` flag (staff/experimental) |
| Cloud session store | Session metadata (DuckDB) | GitHub cloud API | `CLOUD_SESSION_STORE` flag (off by default) |
| Remote export | Cross-device sync | GitHub cloud | `storeSessionsRemotely` config + `REMOTE_SESSION_EXPORT` flag |
| Squad committed memory | Decisions, history, skills | `.squad/` in repo (committed) | Always on (it's your markdown) |
| Squad session state | Session transcripts, logs | `.squad/` in repo (gitignored) | Always on (gitignore policy is your choice) |

## The Bottom Line

Copilot CLI's session storage is more complex than the docs suggest — and less configurable than the startup prompt implies. The actual behavior depends on feature flags that vary by account type (staff, experimental, or general availability).

If you're a staff or experimental user, you're getting cloud-synced session queries via `session_store_sql` and possibly cross-device session access. If you're a regular user, your sessions are local-only and `/chronicle` may be your only cross-session tool.

The one decision that's fully in your control is **Squad's gitignore policy**: which squad-generated files should be committed vs. kept local. Start with the default. Relax it later if you need committed session trails.

Both systems work together when cloud features are enabled: Copilot's `session_store_sql` gives agents memory across sessions. Squad's `.squad/` files give agents memory across the team. When cloud features aren't available, Squad's repo-based memory becomes even more important — it's the only cross-session persistence your agents have.
