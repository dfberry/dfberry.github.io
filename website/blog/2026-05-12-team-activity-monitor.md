---
slug: "/2026-05-12-team-activity-monitor"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-team-activity-monitor"
custom_edit_url: null
sidebar_label: "2026.05.12 Mission Control Dashboard"
title: "What Are Your AI Agents Actually Doing? Build a Mission Control Dashboard"
description: "A proposal for a live dashboard that makes long-running agent activity easier to monitor and debug."
draft: true
tags:
  - "AI Agents"
  - "Observability"
  - "Dashboard"
  - "Squad"
  - "AI-assisted"
keywords:
  - "agent observability"
  - "mission control dashboard"
  - "workflow monitoring"
  - "squad dashboard"
  - "ai agents"
updated: "2026-05-12 00:00 PST"
---

Your Squad team runs multi-step workflows. Right now, they disappear into logs.

You don't know which agents are idle, which are stuck, whether cost is spiraling. If an agent hangs for 10 minutes, you find out when someone checks the logs. If budget burns $100 in a session, you see the bill next month.

This is the observability problem. [Squad SDK Team Activity Monitor](https://github.com/bradygaster/project-squad-sdk-example-monitor) is a reference implementation of a terminal UI that surfaces it all in real-time. Not logs. Not dashboards buried three clicks deep. A live, updating dashboard in your terminal showing agent status, work items, decisions, and cost—with stuck detection that alerts you within 30 seconds.

## The Problem: Multi-Agent Workflows Are Black Boxes

When a single engineer runs a job, logs are fine. When 3–5 agents run in parallel, with one triggering another, context scatters across multiple log streams. Team leads see nothing. Engineers debug by luck.

Here's the experience right now:
- Agent running. Are they working or stuck? Check logs. Scroll. Grep. 10 minutes of context-gathering.
- Three agents running in parallel. Which one finished first? Check logs. Parse timestamps. Reconstruct order.
- Budget burned $47 this session. Why? Check logs. Maybe some telemetry exists. Maybe not.

This delays decision-making. You detect stuck agents minutes too late. You notice cost overruns after they happen.

## What a Real-Time Dashboard Changes

Squad Monitor displays agent status, work item assignments, decisions, and event timeline—all updating live:

> 📊 **[DIAGRAM: Dashboard Data Flow]**
> *Prompt for image generation:* Create a vertical data flow diagram: (1) Top: Multiple Agent boxes (Agent-01, Agent-02, Agent-03) sending events upward → (2) Middle: EventBus/Collector hub (central processing point, teal circle with radiating arrows) → (3) Bottom: 4 dashboard sections side-by-side (Agents Table, Work Items Table, Decisions Feed, Timeline View), each showing sample data. Use dark background (charcoal), teal/cyan connectors, light text. Show data flowing down from collectors to each dashboard section. Include labels for "Real-time Events", "Aggregation", "Rendering". Purpose: visualize how live data streams from agents through collection to dashboard display.
> *Purpose:* Helps readers understand how disparate agent events get unified into a single live dashboard—the core architecture of the monitoring system.

```
╔═══════════════════════════════════════════════════════╗
║       TEAM ACTIVITY MONITOR DASHBOARD                 ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║ AGENTS                                                ║
║ ┌──────────┬───────────┬──────────┬────────────────┐ ║
║ │ Agent ID │ State     │ Duration │ Current Task   │ ║
║ ├──────────┼───────────┼──────────┼────────────────┤ ║
║ │ Agent-01 │ working   │ 2.3s     │ Analyzing code │ ║
║ │ Agent-02 │ idle      │ 45.1s    │ -              │ ║
║ │ Agent-03 │ completed │ 12.4s    │ ✓ Done         │ ║
║ └──────────┴───────────┴──────────┴────────────────┘ ║
║                                                       ║
║ WORK ITEMS                                            ║
║ #42 Fix auth tests        [Agent-01] In Progress     ║
║ #41 Add token validation  [Agent-02] Open            ║
║                                                       ║
║ DECISIONS                                             ║
║ • 14:32:15 [Agent-01] Strategy: iterative_refine    ║
║ • 14:32:08 [Agent-03] Decision: code_review         ║
║                                                       ║
║ TIMELINE (last 50 events)                             ║
║ 14:32:45 → Agent-01 transitioned to working          ║
║ 14:32:30 → Decision made: Code review strategy       ║
║ 14:32:15 → Work item #42 updated to in_progress    ║
║ 14:32:00 → Agent-03 completed work                   ║
║                                                       ║
║ 💰 Cost: $0.42 | Rate: 150 tokens/min | Budget: $50 ║
║ 🟢 Agents: 3 healthy | ⚠️ Stuck: 0 | 🔴 Failed: 0   ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

Updates every 1–3 seconds. You see instantly when an agent stalls, when an issue gets reassigned, when cost per minute exceeds your threshold.

## How to Set It Up

```bash
$ git clone https://github.com/bradygaster/project-squad-sdk-example-monitor.git
$ cd project-squad-sdk-example-monitor
$ npm install
added 42 packages, and audited 45 packages in 2.3s

$ npm run build
# TypeScript compiles cleanly to dist/

$ npm test
✓ src/core/eventbus-collector.test.ts (5 tests)
✓ src/core/monitor-collector.test.ts (4 tests)
✓ src/collectors/work-item-collector.test.ts (3 tests)
...
Test Files  12 passed (12)
     Tests  28 passed (28)
```

It works out of the box. No configuration files. No manual setup. The dashboard runs until you press Ctrl+C.

## Step 1: Start the Live Dashboard

```bash
$ npx squad-monitor start

╔════════════════════════════════════════════════════════════╗
║              TEAM ACTIVITY MONITOR DASHBOARD                ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║ AGENTS                                                     ║
║ ┌─────────────┬──────────┬──────────┬─────────────────┐   ║
║ │ Agent ID    │ State    │ Duration │ Current Task    │   ║
║ ├─────────────┼──────────┼──────────┼─────────────────┤   ║
║ │ Agent-001   │ working  │ 2.3s     │ Analyzing file  │   ║
║ │ Agent-002   │ idle     │ 45.1s    │ -               │   ║
║ │ Agent-003   │ completed│ 12.4s    │ ✓ Done          │   ║
║ └─────────────┴──────────┴──────────┴─────────────────┘   ║
```

The dashboard refreshes every 3 seconds. Each row shows:
- **Agent ID** — Unique agent identifier
- **State** — `working` (actively running), `idle` (waiting), `completed` (done), or `failed` (error)
- **Duration** — Seconds in current state
- **Current Task** — What the agent is doing right now

An agent idle for 5+ minutes triggers a stuck alert—useful for detecting hangs.

## Step 2: Watch the Work Items Section

```
WORK ITEMS
┌──────┬──────────────────────┬─────────────┬──────────┐
│ ID   │ Title                │ Assignee    │ Status   │
├──────┼──────────────────────┼─────────────┼──────────┤
│ #42  │ Fix login validation │ Agent-001   │ In Prog  │
│ #41  │ Add token validation │ Agent-002   │ Open     │
└──────┴──────────────────────┴─────────────┴──────────┘
```

This correlates **what work is happening** with **which agent is doing it**. You see instantly if an issue is stalled with an idle agent, or moving fast with an active one.

## Step 3: Read the Decisions Feed

```
DECISIONS
• 14:32:15 [Agent-001] Strategy: iterative_refine
• 14:32:08 [Agent-003] Decision: refactor_module_A
• 14:31:45 [Agent-002] Decision: add_integration_test
```

A feed of choices agents made during the session. Helps you understand agent reasoning without reading transcripts. Useful for post-session review: "Why did the agent choose strategy X?"

## Step 4: Check the Timeline

```
TIMELINE (last 50 events)
14:32:45 → Agent-001 transitioned to working
14:32:30 → Decision made: Code review strategy
14:32:15 → Work item #42 updated to in_progress
14:32:00 → Agent-003 completed work
14:31:50 → Agent-002 transitioned to idle
```

Every significant event in order. Agent transitions (idle → working → done), decisions made, work item updates, errors and alerts. This is your audit trail for the session.

## Step 5: Monitor Cost and Health

```
💰 Cost: $0.42 | Rate: 150 tokens/min | Budget: $50.00
🟢 Agents: 3 healthy | ⚠️ Stuck: 0 | 🔴 Failed: 0
```

**Cost section** shows:
- Running total of tokens spent (how much has this session cost?)
- Burn rate per minute (is cost accelerating?)
- Budget remaining (will we exceed the limit?)

**Health section** shows:
- Number of healthy agents (working normally)
- Circuit breaker status (rate limits triggered?)
- Failed agents (did anyone crash?)

If cost per minute exceeds your threshold or an agent fails, this is where you see it *immediately*, not in a bill review next month.

## For CI or Scripting: One-Time Snapshot

Capture one snapshot and exit (useful for CI or piping to a file):

```bash
$ npx squad-monitor snapshot > session-snapshot.txt
$ cat session-snapshot.txt

╔════════════════════════════════════════════════════╗
║      TEAM ACTIVITY MONITOR DASHBOARD               ║
╠════════════════════════════════════════════════════╣
║ AGENTS                                             ║
║ ┌──────────────┬─────────┬──────────┬─────────────┐║
║ │ Agent ID     │ State   │ Duration │ Current Task│║
│ │ Agent-001    │ working │ 2.3s     │ Testing     │║
...
```

Now share with the team: `curl -X POST -d @session-snapshot.txt hooks.slack.com/...`

## Real-World Example: SRE Incident Triage

Your SRE team runs incident diagnostics with 4 specialist agents working in parallel:
- Agent-Platform checks infrastructure
- Agent-Database checks queries and schema
- Agent-API checks logs and error rates
- Agent-Coordination synthesizes findings

> 📊 **[DIAGRAM: Multi-Agent Parallel Diagnostics Timeline]**
> *Prompt for image generation:* Create a swimlane diagram (4 horizontal lanes, one per agent) showing time progression left-to-right (0s to 30s). Each agent starts from the left, shows active work as a colored bar (progress indicator), and ends with a completion marker. Agent-Database completes at 8s (short bar, green), Agent-Platform at 2min (longest bar, teal), Agent-API at 12s (medium bar, blue), Agent-Coordination at 18s (medium bar, purple). Overlay: show the on-call engineer symbol appearing at 5s. Use dark background, color-coded swim lanes, dotted line at current time. Label each agent's role. Include annotation: "Monitor surfaces all 4 in real-time instead of sequential log review".
> *Purpose:* Shows readers how parallel diagnostics reduce total triage time compared to sequential investigation—making the real-world value concrete.

**Old way:** SRE waits for all logs to finish, manually greps for diagnostics, calls a meeting.

**With the monitor:**
- SRE sees all 4 agents running in real-time
- Agent-Database finishes first (8 sec)—database is healthy
- Agent-Platform is still working at 2 min—likely the problem area
- Agent-API done (12 sec)—API error rate spiked recently
- Agent-Coordination done (18 sec)—has synthesized findings

SRE scans the dashboard, sees the pattern, and can start investigating platform infrastructure while Agent-Platform is still working. Real-time feedback beats end-of-run summary—especially at 2 AM.

## Dashboard Sections Explained

| Section | Shows | Why it matters |
|---------|-------|---------------|
| **AGENTS** | Live status of each agent running in this session | Know which agents are idle, working, or done without checking logs |
| **WORK ITEMS** | GitHub or Azure DevOps issues assigned to agents | See which issue is being worked on, by whom, and its status |
| **DECISIONS** | Chronological decisions made by agents | Understand agent reasoning and strategy without reading transcripts |
| **TIMELINE** | All session events in order | Audit trail for debugging, compliance, and post-session review |
| **COST** | Running total, burn rate, budget remaining | Catch cost overruns in real-time, not on next month's bill |
| **HEALTH** | Agent health, circuit breaker, rate limits | Immediate alert if agents are rate-limited or failing |

## Three Commands That Show Real Power

```bash
# Start the monitor (live updating, Ctrl+C to stop)
npx squad-monitor start

# (While it's running in one terminal, start an agent workflow in another)
# Watch the monitor update—agents transition from idle to working

# Capture one snapshot for Slack
npx squad-monitor snapshot | tee session-snapshot.txt
# Share with team: "Here's what we were doing at 2:47 PM"
```

Stuck detection works automatically. If an agent doesn't change state for 5 minutes, the dashboard shows an alert. Team lead sees it, kills the run, unblocks the team. No manual investigation needed.

## The Honest Scoping

This is a **Phase 1 MVP**—a terminal UI prototype with simulated data. The rendering patterns, collectors, and formatting are all tested and production-ready. But the data sources are simulated.

When [Squad SDK](https://github.com/bradygaster/squad) releases stable runtime APIs (EventBus, CostTracker, RalphMonitor), this example upgrades to **live data** automatically. The collector interfaces are already designed for that transition.

What's real today:
- Terminal rendering with ANSI formatting
- Event collection and aggregation
- Timeline building and filtering
- Cost tracking and health indicators
- Stuck detection (5-minute idle alert)

What's simulated:
- Agent lifecycle events (ready to swap when SDK exposes EventBus)
- Work item fetching (ready for GitHub/ADO adapters)
- Decision recording (ready for Squad state integration)

The core patterns are battle-tested. The data plumbing is where you'll customize when integrating with your real Squad infrastructure.

## Why Build This Yourself

Generic dashboards (Grafana, Datadog) show CPU and memory. This shows *agent semantics*—the things that matter for AI workflows: which agent is working on what issue, what decisions it made, whether it's stuck or done.

It's built *for the problem*, not retrofitted.

You can extend it. Add custom collectors. Wire in real-time Slack notifications. Build a web UI on top. Add multi-repo aggregation. The architecture supports it because it's designed as a foundation, not a finished product.

---

Clone the [repo](https://github.com/bradygaster/project-squad-sdk-example-monitor), run the setup, and try it with your own workflows. The [quickstart](https://github.com/bradygaster/project-squad-sdk-example-monitor/blob/main/QUICKSTART.md) gets you running in 5 minutes.

Your agents are working. Now see what they're actually doing.
