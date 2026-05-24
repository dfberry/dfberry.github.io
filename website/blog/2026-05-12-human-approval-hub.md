---
slug: "/2026-05-12-human-approval-hub"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-human-approval-hub"
custom_edit_url: null
sidebar_label: "2026.05.12 Human Approval Hub"
title: "AI Agents Propose, Humans Approve. Build the Inbox That Keeps You in the Loop"
description: "A human-approval hub concept for collecting review requests from autonomous agents in one place."
draft: true
tags:
  - "AI Agents"
  - "Human in the Loop"
  - "Workflow"
  - "Squad"
  - "AI-assisted"
keywords:
  - "human approval"
  - "approval inbox"
  - "human in the loop"
  - "agent escalation"
  - "squad"
updated: "2026-05-12 00:00 PST"
---

Squad agents work autonomously. They create pull requests, propose architecture decisions, flag budget overruns, request policy waivers. But approval requests scatter across GitHub notifications, email, and buried `.squad/decisions/inbox/` directories. By the time a human finds a pending request, the agent has been blocked for hours.

Engineering leads waste time context-switching between notification systems. Agents sit blocked waiting for answers that never come. You have autonomous agents trapped behind approval bottlenecks.

I built an approval hub that centralizes everything. [squad-approval](https://github.com/bradygaster/project-squad-sdk-example-approval) is a unified inbox for all agent proposals requiring human sign-off—with threaded context, priority sorting, automatic escalation, and audit trails for compliance.

## The Problem: Scattered Approvals, Blocked Agents

When Squad agents run, they don't just execute code. They propose decisions: "Should we use JWT for auth?" or "Should we enable stricter linting?" These decisions require human judgment. But without a central approval point, humans miss requests.

The fragmentation is real:
- GitHub PRs create notifications (which pile up and get buried)
- Decisions go into `.squad/decisions/inbox/` (which humans rarely check)
- Important escalations might be in Teams or email
- No single place to see what's pending and what the priority should be

The result: agents block waiting for approval. Hours turn into days. Team velocity drops because humans can't find decisions to make.

Meanwhile, compliance teams need audit trails. "Who approved what and when?" The scattered system doesn't answer that.

## The Solution: A Single Approval Inbox

The approval hub provides a unified interface for all agent proposals. One command shows all pending items, sorted by urgency (stale items surface first). Approve or reject with reasoning. Every decision is logged with timestamp and context for compliance.

The architecture is simple: agents create approval items → items go into a queue → humans review and approve/reject → results are logged and communicated back to waiting agents.

> 📊 **[DIAGRAM: Approval Request Flow]**
> *Prompt for image generation:* A horizontal swimlane diagram with two rows: "Agent" and "Hub". Show: (1) Agent box sends "Propose Decision" arrow to (2) Queue box (labeled "Inbox" in teal) → (3) Human Review box with stopwatch icon (showing "⏱ 1h stale alert") → (4) Decision point (Y/N diamond in blue) → split to (5a) "Approved ✓" or (5b) "Rejected ✗" → (6) Notify Agent (callback arrow). Dark background, teal/blue accent colors, clear lane separation with dashed lines, timestamp labels.
> *Purpose:* Shows the end-to-end decision lifecycle including the stale-item escalation—readers understand both the happy path (propose → approve → proceed) and the bottleneck prevention (stale alerts).

## Setup

```bash
# Clone the repository
git clone https://github.com/bradygaster/project-squad-sdk-example-approval.git
cd project-squad-sdk-example-approval

# Install and build
npm install && npm run build

# Make the CLI globally available
npm link
```

Verify setup:

```bash
npm test
```

Expected: 30+ tests pass (✓).

## Create Your First Approval Request

```bash
squad-approval create --type decision --title "Use JWT for auth" --agent keaton --reason "Auth decision needed"
```

Expected output:

```
✓ Created approval: decision-1705328000000
  Type:  decision
  Title: Use JWT for auth
  Created: 2024-01-15T10:30:00.123Z
```

The system assigns a unique ID and timestamps it. The agent now knows where to check for a response.

## List Pending Approvals

```bash
squad-approval list
```

Expected output:

```
ID                        Type               Title                              Age
─────────────────────────────────────────────────────────────────────────────────
decision-1705328000000    decision           Use JWT for auth                   1m
decision-1705327900000    policy-waiver      Disable lint rule                  15m
pr-42                     github-pr          feat: webhooks                      2m

Total: 3 pending approvals
```

Items are sorted by stale detection (oldest first, so 15m gets prioritized). Each one shows:
- **ID**: Unique identifier for this approval
- **Type**: What kind of approval (decision, PR, policy waiver, etc.)
- **Title**: What's being asked
- **Age**: How long it's been pending (stale items ≥1 hour get escalated)

> 📊 **[DIAGRAM: Approval Queue Priority Sorting]**
> *Prompt for image generation:* A table mockup showing 3 rows with visual urgency indicators. Row 1: "decision-1705328..." (1m age, green indicator dot) at bottom. Row 2: "decision-1705327..." (15m age, orange indicator dot) highlighted in light teal box at top. Row 3: "pr-42" (2m age, green dot). Add a legend: "Green = <1h, Orange = stale (≥1h)". Use monospace font for IDs, dark background, teal borders for the urgent row. Arrow pointing to the stale row labeled "ESCALATED".
> *Purpose:* Visually reinforces that the system surfaces oldest/stale items first, making the prioritization strategy obvious.

## Taking Action: Approve

```bash
squad-approval approve decision-1705328000000 --reason "Looks good"
```

Expected output:

```
✓ Approved: Use JWT for auth
  By: cli-user
  At: 2024-01-15T10:30:45.123Z
  Reason: Looks good
```

The approval is logged with your name, timestamp, and reasoning. Agents waiting for this approval get notified immediately.

## Taking Action: Reject

```bash
squad-approval reject decision-1705327900000 --reason "Disable lint rule for now. Reconsider after performance tests complete"
```

Expected output:

```
✗ Rejected: Disable lint rule
  Reason: Disable lint rule for now. Reconsider after performance tests complete
  By: cli-user
  At: 2024-01-15T10:31:10.456Z
```

Rejections are logged with full reasoning so the agent understands why and can revise the proposal if needed.

## View Queue Status

```bash
squad-approval status
```

Expected output:

```
Approval Queue Status
──────────────────────────────
  Pending:   3
  Approved:  5
  Rejected:  1
  Expired:   0
  Total:     9

Stale items (>1 hour):  1
  • pr-42 (2h, requesting feature branch merge)
```

This gives you a quick snapshot. 3 items need your attention. 1 has been waiting 2 hours and is escalating (meaning an agent has probably already complained about the delay).

## Real Walkthrough: Decision Pipeline

Here's the full flow with realistic scenarios:

**Step 1: Agent proposes decision**

```bash
squad-approval create --type decision \
  --title "Migrate to TypeScript strict mode" \
  --agent alice \
  --reason "Improves type safety, catches bugs earlier"
```

**Output:**
```
✓ Created approval: decision-1705400000000
  Type:  decision
  Title: Migrate to TypeScript strict mode
  Requested by: alice
  Created: 2024-01-15T14:30:00.000Z
```

**Step 2: List shows it's pending**

```bash
squad-approval list
```

**Output:**
```
ID                        Type               Title                              Age
─────────────────────────────────────────────────────────────────────────────────
decision-1705400000000    decision           Migrate TypeScript strict mode     1m

Total: 1 pending approval
```

**Step 3: After 1 hour, system flags as stale**

```bash
squad-approval status
```

**Output:**
```
Approval Queue Status
──────────────────────────────
  Pending:   1
  Stale:     1 (>1 hour)

⚠️  decision-1705400000000 is stale (61m). Agent may escalate.
```

An alert goes out (to Ralph or your notification system). This prevents silent blocks.

**Step 4: Human reviews and approves**

```bash
squad-approval approve decision-1705400000000 \
  --reason "Good idea. Phase rollout: alpha → beta → production"
```

**Output:**
```
✓ Approved: Migrate TypeScript strict mode
  Phase: alpha (start with one team)
  By: engineering-lead
  At: 2024-01-15T15:35:22.789Z
```

**Step 5: Agent gets notification and proceeds**

The agent checks its inbox, sees the approval, and starts the migration.

## What Makes This Different

Most approval systems are designed for human-to-human workflows (code review, manager sign-off). This is designed for human-AI workflows where agents are proposing decisions and waiting for approval to proceed.

**Priority sorting matters.** Items are automatically sorted by age and escalation status. An approval waiting 2+ hours surfaces first. This makes the queue actionable instead of overwhelming.

**Timeout enforcement matters.** Approval requests expire after 24 hours (configurable). If an agent is waiting indefinitely, that's a problem. Expiry forces humans to either approve, reject, or actively defer.

**Escalation via Ralph matters.** Squad's Ralph monitor can be configured to send notifications when approvals age. After 1 hour of waiting, alerts escalate. No more silent blocks.

**Audit trails matter.** Every approval/rejection is logged with timestamp, who made the decision, and reasoning. For regulated teams, this is compliance—you can answer "who approved this?" with exact citations.

## Honest Scoping

**What this does:**
- Centralize approval requests from agents in one place
- Sort by priority (stale first)
- Provide approval/rejection workflow with audit trails
- Auto-escalate stale items after N hours
- Auto-expire items after 24 hours

**What this doesn't do:**
- Enforce approvals (agents can proceed anyway—it's advisory)
- Send notifications automatically (you integrate that yourself with Ralph or comms)
- Handle conditional logic (e.g., "approve if tests pass, auto-reject if coverage drops")
- Multi-level approvals (one person approves, not a workflow)

## Extending It

The system has adapters for capturing approvals from multiple sources:

- **GitHub** — Capture PRs with `needs-approval` label
- **Decisions** — Monitor `.squad/decisions/inbox/` for pending decisions
- **ADO** — Monitor Azure DevOps escalations

You can add custom sources by implementing the `ApprovalSource` interface.

Send notifications through Teams, Slack, or email when approvals change state using the `NotificationDispatcher`.

## Next Steps

1. **Set up integration.** Connect Ralph to escalate stale items.
2. **Configure timeouts.** Adjust approval window from default 24 hours if needed.
3. **Add notification channels.** Route approvals to Teams or email so your team sees them.
4. **Build approval policies.** Some decisions auto-approve (low risk), others require human review.

## Get Started

```bash
# Clone and setup (5 minutes)
git clone https://github.com/bradygaster/project-squad-sdk-example-approval.git
cd project-squad-sdk-example-approval
npm install && npm run build && npm link
npm test

# Create your first approval (1 minute)
squad-approval create --type decision --title "Enable strict mode" --agent smith --reason "Testing strategy"

# List pending (1 minute)
squad-approval list

# Approve or reject (1 minute)
squad-approval approve <id> --reason "Let's do it"

# Check status (1 minute)
squad-approval status
```

Nine minutes later, you have a working approval inbox. Then extend it to capture from GitHub PRs, ADO items, or your own custom sources. The hub keeps humans in the loop and agents unblocked.
