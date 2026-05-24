---
slug: "/2026-05-12-incident-response"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-incident-response"
custom_edit_url: null
sidebar_label: "2026.05.12 Incident Response"
title: "When Production Breaks, Let Your Squad Team Help Triage"
description: "An incident-response pattern that lets specialized agents gather context and accelerate the first minutes of an outage."
draft: true
tags:
  - "AI Agents"
  - "Incident Response"
  - "DevOps"
  - "Squad"
  - "AI-assisted"
keywords:
  - "incident response"
  - "triage automation"
  - "on-call workflow"
  - "ai ops"
  - "squad"
updated: "2026-05-12 00:00 PST"
---

Your SRE team gets a page at 2 AM. Production is down. On-call engineer wastes the first 30 minutes doing the same thing every incident: gathering context.

Piecing together error logs. Checking which services went down. Asking which deployment happened in the last hour. Discovering that service A depends on service B and *that* is the actual problem.

This is context-gathering overhead. It's not fixing anything. It's just finding the problem. And it happens the same way every incident.

What if your Squad team helped? What if incidents went from "wait for human to gather context" to "AI agents gather context in parallel, surface the problem, suggest fixes"?

[Squad SDK Incident Response](https://github.com/bradygaster/project-squad-sdk-example-incident) is a reference implementation of an incident orchestration system. Parse incidents from GitHub issues. Route diagnostics through service-specific runbooks. Generate triage reports and post-mortems. All automated. All auditable. All giving your on-call engineer a head start instead of a blank slate.

## The Problem: Incident Triage Is Manual and Slow

Here's how it works today:

> 📊 **[DIAGRAM: Manual vs. Squad-Assisted Incident Response]**
> *Prompt for image generation:* Create a split-screen comparison: LEFT side "Manual Triage (Today)" shows: Alert → On-Call → SSH/Logs → Read Logs (⏰ 5min) → Check Service A (⏰ 5min) → Check Service B (⏰ 5min) → Find Recent Deploy (⏰ 5min) → Read Diff (⏰ 10min) → 30 min total (red line tracking time). RIGHT side "Squad-Assisted (New)" shows: Alert → On-Call + Squad Agents (parallel processes: Agent-A checks Service-A ⏰2min, Agent-B checks Service-B ⏰3min, Agent-C checks Deploy ⏰2min, Agent-Synthesis ⏰3min) = 10 min total (green line). Show both converging on "Implement Fix" (5min each, same). Emphasize: same human work at end, but 20min saved on investigation. Use dark background, red for manual path, teal/green for parallel path.
> *Purpose:* Shows readers the time advantage of parallelized diagnostics—the core business value proposition.

1. Alert fires. On-call engineer gets paged.
2. Engineer reads the alert. Checks logs. Finds nothing useful.
3. Engineer SSH's into prod. Checks service health. Finds service A is fine.
4. Engineer checks service B (dependency of A). *That's* unhealthy.
5. Engineer looks for recent changes. Finds deployment from 90 minutes ago.
6. Engineer reads the deployment diff. Finds N+1 query.
7. Engineer fixes or rolls back. Incident resolves.
8. Post-mortem happens 3 days later, rushed, incomplete.

Steps 1–6 are pure context-gathering. They happen in every incident. They take 30–45 minutes on average. Once context is clear, the fix takes 5 minutes.

You're paying SRE labor for investigation overhead, not for solving problems.

## How Squad Incident Response Works: Complete Walkthrough

### Step 1: Clone and Build

> 📊 **[DIAGRAM: Incident Orchestration Pipeline]**
> *Prompt for image generation:* Create a vertical orchestration flow: (1) Top: GitHub Issue / incident.json (input box, teal). (2) Below: Incident Intake box → Summary Generator → Diagnostics Router (decision node splitting to multiple runbooks). (3) Middle: 3 parallel runbook agents (API Runbook, Database Runbook, Cache Runbook), each showing diagnostic steps and findings. (4) Below: Triage Synthesizer (combining findings) → Fix PR Drafter. (5) Bottom outputs: Triage Report (red/orange if critical), Timeline (JSON icon), Post-Mortem Template (markdown icon). Use dark background, teal/cyan for key nodes, arrows showing data flow, parallel agents shown side-by-side. Timestamps on the left margin showing elapsed time at each stage (e.g., "0sec", "+2sec", "+10sec").
> *Purpose:* Gives readers the complete end-to-end orchestration—how an incident goes from GitHub issue to actionable triage report and post-mortem, all with timestamps.

```bash
$ git clone https://github.com/bradygaster/project-squad-sdk-example-incident.git
$ cd project-squad-sdk-example-incident
$ npm install
added 42 packages, and audited 45 packages in 2.3s

$ npm run build
$ npm run test:run
✓ src/summarizer-agent.test.ts (3 tests)
✓ src/incident-timeline.test.ts (4 tests)
Test Files  6 passed (6)
     Tests  18 passed (18)
```

Everything builds and tests pass.

### Step 2: Create an Incident Report

Create `incident.json` describing the problem:

```json
{
  "id": "incident-001",
  "title": "Production: API latency spike detected",
  "service": "api",
  "severity": "high",
  "description": "Started at 14:32 UTC. Latency went from 50ms to 500ms+. Orders endpoint completely unresponsive.",
  "createdAt": "2024-01-15T14:35:00Z",
  "labels": ["service:api", "severity:high"]
}
```

### Step 3: Create Service Runbooks

Create `skills/api-runbook.md`:

```markdown
# API Service Runbook

## What This Service Does
Primary REST API handling orders, payments, and user operations. Depends on database, cache, and payment gateway.

## Diagnostic Steps
1. Check API error logs for the last 5 minutes
2. Query metrics: request latency, error rate, CPU usage
3. Inspect recent deployments
4. Check database query performance
5. Check upstream service health (payment gateway, cache)

## Common Causes and Fixes
- If latency spike: check N+1 queries, scale horizontally, check database connection pool
- If error rate spike: check circuit breaker, inspect logs for specific error codes
- If CPU spike: check for infinite loops or memory leaks in recent deployment
```

Create `skills/database-runbook.md`:

```markdown
# Database Service Runbook

## Diagnostic Steps
1. Check database connection count
2. Check query performance (slow query log)
3. Check table locks and blocking queries
4. Check replication lag
5. Review recent schema changes

## Common Fixes
- If connection exhausted: scale connection pool, terminate idle connections
- If slow queries: add indexes, rewrite query to avoid N+1
- If replication lag: check network, reduce write volume
```

The system automatically discovers and loads all `.md` files from the `skills/` directory.

### Step 4: Run the Full Orchestration

```bash
$ npx squad-incident run incident.json

✅ Incident intake complete
   ID: incident-001
   Service: api
   Severity: high
   Description: Started at 14:32 UTC. Latency went from 50ms to 500ms+...

📋 Status: awaiting_approval

📝 Summary Generated:
   What: API latency spike - response time increased from 50ms to 500ms+
   Where: API service (orders-list endpoint)
   Severity: high
   Likely Cause: Recent deployment introduced N+1 query in batch ordering
   Affected Services: api, database

📅 Timeline entries: 7
   14:35:00 → Incident created
   14:35:15 → Summary generated
   14:35:45 → Diagnostics routed to API and Database agents
   14:36:30 → API diagnostics complete
   14:36:45 → Database diagnostics complete
   14:37:00 → Triage suggestions drafted
   14:37:15 → Post-mortem template generated

📄 Decisions: 2
   1. Route to API service runbook (high confidence)
   2. Route to Database service runbook (dependency check)

🔧 Draft PR: fix: resolve incident incident-001 — latency spike
   Branch: incident/incident-001-api-latency
   Description: Rollback batch ordering feature OR implement JOIN optimization

Done.
```

The orchestrator:
1. Parsed the incident JSON
2. Generated a summary (what, where, why)
3. Routed diagnostics through service-specific runbooks (in parallel)
4. Drafted triage suggestions
5. Recorded the timeline
6. Generated a post-mortem template

All in seconds instead of 30+ minutes.

### Step 5: Review the Generated Summary

```bash
$ cat incident-001-summary.json

{
  "what": "API latency spike: response time increased from 50ms to 500ms+",
  "where": ["api", "orders-list-endpoint"],
  "severity": "high",
  "likely_cause": "Recent deployment introduced N+1 query in batch ordering feature",
  "affected_services": ["api", "database"],
  "code_references": [
    "src/api/handlers/orders.ts:42-58"
  ],
  "timeline": [
    {
      "timestamp": "2024-01-15T14:32:00Z",
      "event": "Latency spike detected"
    },
    {
      "timestamp": "2024-01-15T14:32:15Z",
      "event": "Deployment: batch-ordering feature rolled out"
    }
  ]
}
```

This is what you show the on-call engineer. Machine-readable, no hunting required.

### Step 6: Review the Triage Report

```bash
$ cat incident-001-triage.md

# INCIDENT #001: Production API Latency

## DIAGNOSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: api
Root Cause: N+1 query in orders endpoint (batch ordering feature)
Affected: orders-list endpoint, database connection pool exhaustion
Severity: HIGH
Duration Estimate: 5-20 minutes to resolve

## DIAGNOSTICS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ API logs: 500ms response times across all orders requests
✓ Deployment: "Add batch ordering feature" merged 90 min ago
✓ Database: query count spike matches latency timeline
✓ Connection pool: Exhausted (max 100, current 98 connections)

## SUGGESTED ACTIONS (Human Review Required)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Option 1: Rollback (Fastest)
```
git revert abc1234 -m 1  # batch-ordering commit
git push origin main
# Deployment triggers auto-rollout
```
Estimated time: 2-3 min
Risk: Low (this is the change that caused it)
Verification: Check API latency metric returns to baseline

### Option 2: Implement Fix (Better Long-Term)
```
File: src/api/handlers/orders.ts line 42-58
Change: Add JOIN to prevent N+1 query
```
Estimated time: 15-20 min
Risk: Medium (requires testing; potential logic change)
Verification: Load test with 1000 concurrent requests

### Option 3: Scale Connection Pool
Increase from 100 to 200 connections in prod.
Estimated time: 5 min
Risk: Low (temporary relief; doesn't fix root cause)
Verification: Monitor connection usage; expect drop to 20-30

## RECOMMENDED PATH
1. Start with Option 1 (rollback) - fastest to restore service
2. Debug option 2 (fix) in staging - better permanent solution
3. Plan Option 3 (scale) - if option 2 needs more testing
```

This is the triage report the on-call engineer uses. Three options, risk/reward for each, clear next steps.

### Step 7: Check the Timeline

```bash
$ cat incident-001-timeline.json | jq

[
  {
    "timestamp": "2024-01-15T14:35:10",
    "action": "incident_created",
    "actor": "system",
    "details": "Incident #001 created from GitHub issue"
  },
  {
    "timestamp": "2024-01-15T14:35:15",
    "action": "summary_generated",
    "actor": "summarizer-agent",
    "details": "Identified N+1 query in batch ordering deployment"
  },
  {
    "timestamp": "2024-01-15T14:35:45",
    "action": "diagnostics_routed",
    "actor": "diagnostic-router",
    "details": "Routed to api and database runbooks"
  },
  {
    "timestamp": "2024-01-15T14:36:30",
    "action": "diagnostics_complete",
    "actor": "api-runbook",
    "details": "API agent confirmed N+1, suggested rollback or fix"
  },
  {
    "timestamp": "2024-01-15T14:37:00",
    "action": "triage_suggestions_drafted",
    "actor": "fix-pr-drafter",
    "details": "Generated 3 suggested actions"
  }
]
```

Append-only audit trail. Every decision, every step, every timestamp. For post-mortem review, compliance, and debugging.

### Step 8: Generate Post-Mortem

```bash
$ npx squad-incident postmortem incident.json

Generated: incident-001-post-mortem.md
```

Review it:

```bash
$ cat incident-001-post-mortem.md

# Post-Mortem: Production API Latency Spike

**Incident ID:** incident-001  
**Start Time:** 2024-01-15T14:32:00Z  
**End Time:** 2024-01-15T14:37:30Z  
**Duration:** 5 minutes 30 seconds  
**Severity:** HIGH  

## Executive Summary

Production API experienced latency spike affecting orders endpoint. Response times increased from 50ms to 500ms+. Root cause identified as N+1 query introduced in batch ordering feature deployment. Incident resolved via rollback.

## Root Cause

Batch ordering feature (commit abc1234) introduced a query loop that executed one query per order instead of batching. With 100+ concurrent requests, this exhausted the database connection pool.

## Impact

- **Services Affected:** API (orders endpoint), Database
- **Users Affected:** All orders placed during 5:30 window
- **Requests Failed:** ~2,300 orders timed out
- **Business Impact:** ~$8k in failed transactions

## Timeline

| Time | Event |
|------|-------|
| 14:32:00 | Latency spike detected by monitoring |
| 14:32:15 | Batch ordering feature deployment completed |
| 14:35:00 | On-call engineer paged |
| 14:35:30 | Context gathering started (manual investigation) |
| 14:36:30 | With Squad triage: Root cause identified (N+1 query) |
| 14:37:30 | Rollback initiated |
| 14:38:00 | Latency returned to baseline |

## What Went Wrong

1. **Insufficient load testing** — Feature was tested with 10 concurrent users; production has 100+
2. **No query analysis in CI** — N+1 queries not detected in code review
3. **No pre-deployment metrics** — Couldn't compare before/after performance

## Lessons Learned

1. Integration tests must simulate production concurrency (100+ concurrent users)
2. Code review should include query performance analysis for new database access patterns
3. Staging should have production-scale data and concurrency before feature rollout

## Action Items

- [ ] Add N+1 query detection to CI pipeline (Assign: Backend Lead) (Due: 2024-01-22)
- [ ] Implement integration tests for batch operations with 100+ concurrent users (Assign: QA) (Due: 2024-01-20)
- [ ] Add database query logging to staging environment (Assign: DevOps) (Due: 2024-01-18)
- [ ] Review and update load testing strategy (Assign: Performance Engineer) (Due: 2024-01-25)

## Follow-Up

Post-mortem published to Slack #incidents channel.
Action items tracked in JIRA epic INCIDENT-001.
Lessons learned added to runbook: skills/api-runbook.md
```

Done. A complete post-mortem, before the on-call engineer's shift ends.

## Real Use Case: 3 AM Incident

Incident fires. On-call engineer gets paged.

**Old way:**
- 30–45 min: Manual investigation (logs, metrics, dependencies)
- 5 min: Implement fix or rollback
- 3 days later: Rushed post-mortem

**With Squad Incident Response:**
- 10 sec: Parse incident from GitHub issue
- 2–3 min: Squad agents run diagnostics in parallel
- 5–10 min: On-call engineer reviews triage report and implements fix (agents did context-gathering; human does judgment)
- Post-mortem auto-generated same hour, before engineer's shift ends

Same total time spent, but the human spent it *fixing* instead of *searching*. The difference matters at 3 AM.

## Three Commands That Show the Value

```bash
# Full orchestration (intake → diagnostics → triage → post-mortem)
npx squad-incident run incident.json
# Takes 2–3 min, generates all outputs

# Just produce a summary
npx squad-incident summarize incident.json
# 30 sec, tells you what happened

# Generate post-mortem after incident resolves
npx squad-incident postmortem incident.json
# Creates markdown, ready to share with team
```

## The Honest Scoping

This is a **reference implementation**. It demonstrates patterns for incident orchestration. What's production-ready:
- Incident parsing from GitHub issues
- Service-specific runbook routing
- Timeline recording and decision logging
- Post-mortem generation with decision logging
- Triage suggestions with risk/reward analysis

What's not (yet):
- Multi-workspace routing (send diagnostics to different Slack channels)
- Real-time metrics integration (Datadog, New Relic)
- Auto-escalation (critical incidents → on-call)
- Automatic fix proposal (today: template-based suggestions, human review required)
- Incident correlation (detect related incidents)
- Auto-remediation (execute suggested fixes after approval)

The core loop works. The extensions are where teams customize to their operational model.

## Getting Started in 5 Minutes

```bash
# Clone and setup
git clone https://github.com/bradygaster/project-squad-sdk-example-incident.git
cd project-squad-sdk-example-incident
npm install
npm run build

# Use the example incident
npx squad-incident run examples/incident.json

# Review outputs
cat incident-001-summary.json | jq
cat incident-001-post-mortem.md
cat incident-001-timeline.json | jq
```

Create your own runbooks in `skills/`:

```markdown
# Cache Service Runbook

## Diagnostic Steps
1. Check cache hit rate and eviction count
2. Verify eviction policy settings
3. Check memory usage and capacity
4. Review recent configuration changes

## Common Fixes
- If cache churn: adjust TTL values
- If memory pressure: scale horizontally or increase capacity
- If misconfiguration: review deployment diff
```

The orchestrator discovers runbooks by service name and routes incidents accordingly.

## Why This Matters

On-call work is expensive. Not because engineers are expensive (they are), but because most of incident response is *automated investigation*—work that AI handles faster and better than humans.

Your Squad team can handle that part. They:
- Gather context in parallel (not sequentially)
- Check runbook procedures (from your playbook, not tribal knowledge)
- Log everything (audit trail for post-mortems)
- Surface findings to a human (who has context and judgment)

The human still makes the final call. But they make it with complete context in 5 minutes instead of searching for 45.

For SRE teams:
- On-call engineers resolve incidents faster
- Post-mortems are data-rich, not rushed
- Runbooks stay current (versioned alongside code)

For platform teams:
- Reference implementation you can extend
- Patterns for multi-agent orchestration
- Blueprint for other automation workflows

---

Read the [repo](https://github.com/bradygaster/project-squad-sdk-example-incident) and the [quickstart](https://github.com/bradygaster/project-squad-sdk-example-incident/blob/main/QUICKSTART.md).

Your on-call team shouldn't spend half an incident shift searching for the problem. Let your Squad help triage. Save human judgment for decisions.
