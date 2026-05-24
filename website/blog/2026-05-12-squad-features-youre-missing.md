---
slug: "/2026-05-12-squad-features-youre-missing"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-squad-features-youre-missing"
custom_edit_url: null
sidebar_label: "2026.05.12 Squad Features"
title: "My Favorite Squad Features (And Why They Matter)"
description: "A tour of ten Squad capabilities that most changed how I think about running AI agent teams."
draft: true
tags:
  - "AI Agents"
  - "Squad"
  - "Developer Workflow"
  - "GitHub Copilot"
  - "AI-assisted"
keywords:
  - "squad features"
  - "agent orchestration"
  - "tiered memory"
  - "ai team workflow"
  - "copilot cli"
updated: "2026-05-12 00:00 PST"
---

[Squad](https://github.com/bradygaster/squad) ships with a lot. More than most people use. That's not a problem — it means there's depth here. Here are 10 features I find genuinely interesting — the ones that changed how I think about agent orchestration. Not the flashy parts. The actually clever parts.

## 1. Generic Scheduler (`schedule.json`)

What makes this interesting is how flexible it is. Most schedulers lock you into a fixed task model — cron jobs or webhooks, pick one. Squad's scheduler treats tasks as first-class primitives with their own routing logic, retry strategies, and provider backends.

You define recurring tasks in `.squad/schedule.json`:

```json
{
  "schedules": [
    {
      "id": "ralph-heartbeat",
      "name": "Ralph Work Monitor",
      "enabled": true,
      "trigger": { "type": "interval", "intervalSeconds": 300 },
      "task": { "type": "script", "command": "squad ralph watch --duration 30s" },
      "providers": ["local-polling"],
      "retry": { "maxRetries": 1, "backoffSeconds": 5 }
    }
  ]
}
```

Four trigger types: `interval`, `cron`, `event`, `startup`. Four task types: `script`, `copilot`, `workflow`, `webhook`. Two providers: `local-polling` (runs while your terminal is open) and `github-actions` (generates workflow files for 24/7 execution).

```bash
squad schedule init          # Create default schedule
squad schedule list          # See all tasks
squad schedule status        # Check last/next run times
squad schedule run <id>      # Trigger manually
squad schedule watch         # Start the local polling loop
squad schedule init-ci       # Generate GitHub Actions workflows
```

The thing I keep coming back to: the same `schedule.json` can run locally during active work and scale to CI with a single flag. No rewrite. No format translation.

**Learn more:** `docs/features/generic-scheduler.md` in the Squad repo.

## 2. Two-Pass Issue Scanning (72% fewer API calls)

This one's clever because it respects the real problem: GitHub API rate limits force you to choose between responsiveness (scan often, hydrate less) and thoroughness (scan less, hydrate everything). Two-pass mode gives you both.

Ralph's default scan hydrates every issue — fetching comments, labels, assignees, timeline. Most aren't actionable. Two-pass does a lightweight list scan first, then only hydrates issues that pass your filter (roughly 30% of the total).

```bash
squad watch --two-pass
```

The result: 72% reduction in API calls per cycle. If you're running Ralph every 5 minutes, this compounds fast.

**Learn more:** `packages/squad-sdk/templates/skills/ralph-two-pass-scan/SKILL.md`

## 3. Tiered Agent Memory (20-55% context reduction)

What makes this interesting is that it solves a real scaling problem: context size grows linearly with session history, but not all context matters for every decision. Tiered memory lets agents declare what they actually need.

The system partitions context into three explicit levels:

| Tier | What's in it | Size | When to include |
|------|-------------|------|----------------|
| **Hot** | Current session context | ~2-4 KB | Always |
| **Cold** | Summarized history | ~8-12 KB | When agent needs past decisions |
| **Wiki** | Durable reference docs | Variable | When agent needs team standards |

Spawn options:

```bash
# Default: hot only
squad spawn backend-dev "fix the auth bug"

# Include summarized history
squad spawn backend-dev "fix the auth bug" --include-cold

# Include reference docs too
squad spawn backend-dev "fix the auth bug" --include-cold --include-wiki
```

Real measurements from the Squad team: 20-55% context reduction from a baseline of 34-74 KB per spawn, depending on tiers included. That matters when you're spawning dozens of agents.

**Learn more:** `packages/squad-sdk/templates/skills/tiered-memory/SKILL.md`

## 4. Economy Mode

What I like about this: it respects intent. You can say "spend less" without losing the ability to say "this specific task needs the expensive model." Most cost optimization tools are all-or-nothing. Economy mode is layered.

Economy mode shifts coordinator-selected model choices to cheaper alternatives (gpt-4.1, gpt-5-mini) but never overrides explicit model requests. If you say you need claude-opus for a code review, that runs on claude-opus. If you say "use economy mode," the coordinator picks cheaper models for the tasks where you don't care.

```bash
# Per-session
squad economy on

# Or in conversation
"use economy mode"
"save costs"
```

**Learn more:** `packages/squad-sdk/templates/skills/economy-mode/SKILL.md`

## 5. Orchestration Logging

Here's what's clever: you get a full audit trail of why the coordinator made each routing decision, and what happened as a result. Every spawn is logged — not by you, automatically, invisibly.

Each log entry captures:

- Why this agent was chosen (routing rationale)
- What files the agent was authorized to touch
- What the agent produced
- Whether the output was accepted

This is useful for debugging orchestration bugs without adding tracing code. And if you're in a regulated environment, you have your decision audit trail ready.

**Learn more:** `templates/orchestration-log.md`

## 6. `squad nap --deep`

This is the garbage collector for your team memory. Over time, `.squad/decisions.md` and agent history files grow. Context balloons. `squad nap --deep` does aggressive compression — archiving stale decisions, trimming history files, reclaiming context space.

```bash
# Preview what would change
squad nap --deep --dry-run

# Actually compress
squad nap --deep
```

The thing I appreciate: it's safe. Dry-run first, you see exactly what gets archived, then commit. And archived decisions stay searchable — they're not deleted, just moved out of the hot path.

**Learn more:** Constraint tracking docs in the Squad repo for details on decision management.

## 7. Personal Squad

Personal Squad lets your agent configuration follow you. Your team's squad lives in the repo. Your personal squad lives at `~/.squad/` — ambient configuration that works regardless of which project you're in.

```bash
squad personal init    # Create personal workspace
squad personal list    # See your personal agents
squad personal use     # Activate personal squad
squad personal remove  # Remove it
```

This is useful if you have a preferred router, or you've tuned agent model choices to your style — you don't have to re-tune those settings for every project.

> **Note:** Personal Squad is currently experimental and may change in future releases.

**Learn more:** CHANGELOG v0.9.0 entries. Integration docs are still being written.

## 8. Cross-Squad Orchestration

What makes this interesting: squads aren't isolated. If you have multiple squads across repos, they can discover each other and delegate work. It's like a distributed system where each repo's squad knows what the others are capable of.

```bash
squad discover                              # List discoverable squads
squad delegate my-other-squad "update the SDK docs"  # Create cross-squad issue
```

Discovery happens via `.squad/manifest.json` — each squad publishes its capabilities. Delegation creates an issue in the target repo with the `squad` label, which the target squad's Ralph picks up normally.

**Learn more:** `docs/features/cross-squad-orchestration.md`

## 9. Circuit Breaker + Cooperative Rate Limiting

Here's the problem this solves: if you run multiple Ralph instances, GitHub API rate limits become a coordination problem. You need to predict limits before you hit them, and recover gracefully when you do.

Squad's solution is a full state machine persisted to `.squad/ralph-circuit-breaker.json`, coordinating across instances:

1. **Traffic Light** — Green/yellow/red based on remaining quota
2. **Token Pool** — Shared quota pool across instances
3. **Predictive Circuit Breaker** — Opens the circuit BEFORE you hit 429, using exponential cooldown (CLOSED → OPEN → HALF-OPEN states)
4. **Priority Retry Windows** — Higher-priority tasks get first access after cooldown
5. **Resource Epoch Tracking** — Auto-recovers quota from crashed agents
6. **Cascade Dependency Detection** — Prevents one failing API from cascading to others

The persistence is elegant: even if your terminal closes, the next Ralph run knows exactly where the circuit stood.

**Learn more:** `templates/ralph-circuit-breaker.md` and `templates/cooperative-rate-limiting.md`

## 10. Machine Capability Discovery

What I appreciate here: the framework adapts to hardware, not the other way around. At session start, Squad auto-detects available tools, models, and hardware. Agents self-route based on `needs:*` labels matched against discovered capabilities.

This means the same squad configuration works on a laptop with 8 GB RAM and a CI runner with 64 GB — agents adapt to what's actually available.

**Learn more:** CHANGELOG v0.9.0. Template at `templates/machine-capabilities.md`.

---

## What Makes This Different

All 10 of these features are fully implemented. All ship with Squad. What sets Squad apart isn't any single feature — it's the combination.

You get autonomous agent routing (the coordinator picks the right agent without you specifying). Persistent decision memory (your team's decisions inform future work). Human-in-the-loop governance (agents propose, you approve). Built-in scheduling, cost awareness, API rate limiting, and capability discovery.

That combination means you get real autonomy without giving up control. And the deeper you dig, the more depth there is — these 10 are the ones that grabbed me, but there's plenty more to find.

**Start here:**
- If you're running Ralph on a schedule, begin with `squad schedule init` and test `squad nap --deep --dry-run`. You'll recover context and gain API efficiency immediately.
- If you work across multiple branches, try `squad externalize` (see our [v0.9 update](/blog/2026-05-12-whats-new-in-squad-v09) for details). It's a mode switch, not a commitment.
- If you're new to Squad, pick one feature that solves your immediate problem and build from there.

The depth is worth exploring.
