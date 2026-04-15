---
slug: /2026-04-15-session-storage-decision-guide
canonical_url: https://dfberry.github.io/blog/2026-04-15-session-storage-decision-guide
custom_edit_url: null
sidebar_label: "2026-04-15 Copilot CLI + Squad session management"
title: "Session Management with Copilot CLI and Squad: Two Memory Systems, One Workflow"
description: "Copilot CLI and Squad each manage session data differently. Learn how to use them together so your AI agents remember what matters across sessions."
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

# Session Management with Copilot CLI and Squad: Two Memory Systems, One Workflow

When you run Squad on Copilot CLI, your agents have access to two independent memory systems. Understanding how they work together is the difference between agents that start fresh every session and agents that build on what came before.

This post covers the practical side: what each system remembers, what it forgets, and how to configure them so your workflow compounds over time.

## Two Memory Systems

### Copilot CLI: What Happened

Copilot CLI records every session — your prompts, the agent's responses, tool calls, file changes, and checkpoints. This data powers:

- **`/resume`** — pick up where you left off in any previous session
- **`/chronicle`** — generate standup reports, get personalized tips, improve your custom instructions
- **`session_store_sql`** — agents can query your session history ("what did I work on last week?", "have I touched this file before?")

Session data lives in `~/.copilot/session-state/` as files and in `~/.copilot/session-store.db` as a structured SQLite database. When cloud sync is enabled, agents can also query a cloud-backed DuckDB store that works across devices.

**What Copilot remembers:** Everything that happened in every session — the full transcript.

**What it doesn't do:** Extract meaning. Copilot stores the raw conversation, not the conclusions you drew from it.

### Squad: What the Team Knows

Squad's memory is different. It's not a transcript — it's distilled knowledge, stored as markdown files in your repo:

| What | File | Purpose |
|------|------|---------|
| Team decisions | `.squad/decisions.md` | Shared brain — every agent reads this |
| Agent memory | `.squad/agents/{name}/history.md` | Personal learnings per agent |
| Skills | `.squad/skills/{name}/SKILL.md` | Repeatable tasks with everything needed to execute |
| Session state | `.squad/sessions/*.json` | Resume data (gitignored by default) |
| Scribe logs | `.squad/log/*.md` | Session summaries (gitignored by default) |

**What Squad remembers:** Decisions, patterns, preferences, and skills — the things that should change how agents behave next time.

**What it doesn't do:** Record the full conversation. That's Copilot's job.

## How They Work Together

The two systems complement each other:

| Question | Where to look |
|----------|--------------|
| "What did I do last Tuesday?" | Copilot — `session_store_sql` or `/chronicle standup` |
| "What did the team decide about auth?" | Squad — `.squad/decisions.md` |
| "Have I worked on this file before?" | Copilot — `session_store_sql` (session_files table) |
| "How do we run a content audit?" | Squad — `.squad/skills/content-audit/SKILL.md` |
| "What went wrong last time I tried this?" | Copilot — session transcript via `/resume` |
| "What does this agent know about TypeSpec?" | Squad — `.squad/agents/{name}/history.md` |

The pattern: **Copilot is your diary. Squad is your playbook.**

Copilot tells you what happened. Squad tells you what to do about it. When an agent corrects a mistake, that correction lives in Squad's decisions or history — not buried in a Copilot transcript that nobody will re-read.

## Making the Most of Both

### 1. Let Squad Extract the Signal

After a productive session, the important outputs get promoted automatically:
- **Decisions** go to `.squad/decisions.md` (via Scribe merging the inbox)
- **Learnings** go to each agent's `history.md`
- **Reusable patterns** become skills in `.squad/skills/`

You don't need to manually copy insights from Copilot's session history into Squad files — Squad agents do this as part of their workflow. But you can nudge it: *"That pattern we just used — make it a skill"* or *"Add that to decisions."*

### 2. Use `/chronicle` to Improve Squad

Copilot's `/chronicle improve` analyzes your session history to find where agents struggled or needed correction, then suggests improvements to your custom instructions. Use this to feed back into Squad:

- Run `/chronicle improve` periodically
- Take the suggestions and apply them to agent charters or team directives
- This creates a feedback loop: Copilot finds the pattern, Squad encodes it permanently

### 3. Use `session_store_sql` for Context

When starting work on something you've touched before, agents can query Copilot's session history for context:

```
"Before starting, check session_store_sql for any previous sessions 
that touched these files. Summarize what was done and any issues."
```

This gives agents a head start without you having to remember and re-explain.

### 4. Use Squad for Cross-Agent Memory

Copilot's session history is per-user. Squad's memory is per-team. When Agent A discovers something that Agent B needs to know, Squad's shared files make that happen:

- Scribe writes cross-agent updates to affected agents' `history.md`
- Decisions in `decisions.md` are read by every agent at spawn time
- Skills are shared — any agent can use any skill

## The Gitignore Decision

Squad gitignores session-related files by default. Here's what that means and when to change it:

| File | Default | Change when |
|------|---------|-------------|
| `.squad/sessions/` | Gitignored | Commit if you need session transcripts in git (training repos, research) |
| `.squad/log/` | Gitignored | Commit if you want Scribe's summaries as an audit trail |
| `.squad/orchestration-log/` | Gitignored | Commit if you want agent routing history preserved |
| `.squad/decisions.md` | **Committed** | Never gitignore — this is the team's shared brain |
| `.squad/agents/*/history.md` | **Committed** | Never gitignore — this is each agent's knowledge |
| `.squad/skills/` | **Committed** | Never gitignore — these are your reusable patterns |

**The recommended hybrid:** Keep sessions gitignored, but commit Scribe's logs for a lightweight audit trail. Remove `.squad/log/` and `.squad/orchestration-log/` from `.gitignore` to enable this.

> ⚠️ **Compliance note:** If your org requires audit trails of AI interactions, git may not be the right system of record — it lacks retention controls, redaction support, and legal hold capabilities. Check your requirements before treating committed sessions as a compliance solution.

## Under the Hood: What Copilot CLI Is Actually Doing

For the curious: Copilot CLI's session storage is more layered than the docs describe. I dug into the source code and found three feature flags controlling behavior:

- **`SESSION_STORE`** (staff/experimental) — enables the local SQLite store that powers `/chronicle`
- **`CLOUD_SESSION_STORE`** (off by default) — routes `session_store_sql` to a cloud DuckDB API instead of local SQLite
- **`REMOTE_SESSION_EXPORT`** — syncs sessions to GitHub's cloud for cross-device access

The startup prompt that asks "where to store session data" sets a config key (`storeSessionsRemotely`) that controls cloud sync — but this isn't documented anywhere. The [official docs](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/chronicle) say everything is local because for most users (those without staff or experimental flags), it is.

If you have `"staff": true` or `"experimental": true` in your `~/.copilot/config.json`, you're getting the full feature set. If not, enable experimental mode with `/experimental on` to get `/chronicle` and the local session store.

## The Bottom Line

Use both memory systems intentionally:

- **Copilot** handles the raw history. Let it. Don't try to replicate session transcripts in Squad files.
- **Squad** handles the distilled knowledge. Invest here — decisions, history, and skills are what compound.
- **Feed insights from Copilot back into Squad** via `/chronicle improve`, directives, and skill creation.
- **Start with the default gitignore.** The valuable stuff is already being committed. Relax later if you need session trails.

Your agents get smarter not because they remember every conversation, but because the important conclusions persist in the right place.
