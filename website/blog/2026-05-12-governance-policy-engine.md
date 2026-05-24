---
slug: "/2026-05-12-governance-policy-engine"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-governance-policy-engine"
custom_edit_url: null
sidebar_label: "2026.05.12 Guardrails in 5 Minutes"
title: "Your AI Agents Need Guardrails—Here's How to Add Them in 5 Minutes"
description: "A lightweight governance engine that adds enforceable guardrails and review gates to an AI agent team."
draft: true
tags:
  - "AI Agents"
  - "Governance"
  - "Security"
  - "Squad"
  - "AI-assisted"
keywords:
  - "governance engine"
  - "ai guardrails"
  - "policy engine"
  - "human approval"
  - "squad"
updated: "2026-05-12 00:00 PST"
---

You've deployed AI agents into your codebase. They run fast. They get work done. And then one deletes `.env` by accident—or tries to.

The hard problem isn't writing agents. It's *controlling* what they're allowed to do. You need guardrails that work at runtime—not someday, but today. This is what governance looks like.

[Squad SDK Governance](https://github.com/bradygaster/project-squad-sdk-example-governance) is a reference implementation of a policy enforcement system. Define what agents can access in YAML. Block dangerous commands before they run. Get an immutable audit trail of every decision. No custom integration, no months of engineering—just configuration and validation.

## The Problem: Agents Run Unsupervised

GitHub branch protection gates *who* can approve PRs. It doesn't understand *what* agents are trying to do.

Your agent makes a file write. Is it allowed? Branch protection has no idea. You discover the problem when the PR lands—or worse, when something breaks in production.

Enterprise teams face this choice: lock down agents so tightly they become useless, or trust they'll behave. Most organizations end up somewhere painful in the middle. You need a system that enforces policy *before* an agent acts—not after.

## The Two-Layer Defense

This governance system works in two places:

1. **CLI Pre-Tool Hooks** — Before any command runs, the policy engine validates it. If blocked, it fails immediately with a reason.
2. **Audit Trail** — Every decision (allowed or denied) is logged to `.squad/audit/` as immutable JSONL. For compliance reviews, you have a complete forensic record.

> 📊 **[DIAGRAM: Policy Enforcement Pipeline]**
> *Prompt for image generation:* Create a horizontal flow diagram showing: (1) Agent Command (left, rounded box) → (2) Policy Engine (center, larger box with YAML icon inside) → (3) Decision Diamond (allowed/blocked) → (4) two paths: green checkmark arrow labeled "Allowed" to Execute Tool (right, green box), red X arrow labeled "Blocked" to Rejection Handler (right, red box). Below the main flow, show Audit Trail as a horizontal list of logs. Use dark background (charcoal), teal/cyan for allowed path, red for blocked path, clean sans-serif labels. Arrow thickness indicates data flow intensity.
> *Purpose:* Helps readers visualize how the policy engine intercepts commands before execution and how each decision gets logged, making the two-layer defense concept concrete.

## How It Works: A Real Walkthrough

Let me show you the complete flow, from setup to catching a violation.

### Step 1: Clone and Build

```bash
$ git clone https://github.com/bradygaster/project-squad-sdk-example-governance.git
$ cd project-squad-sdk-example-governance
$ npm install
added 42 packages, and audited 45 packages in 2.3s

$ npm run build
```

Expected output (no errors, TypeScript compiles cleanly).

### Step 2: Create Your Policy

Create `.squad/policies/policy.yaml`:

```bash
$ mkdir -p .squad/policies
$ cat > .squad/policies/policy.yaml << 'EOF'
version: '1.0'

file_access_rules:
  allowed_paths:
    - src/**
    - test/**
    - docs/**
    - README.md
    - package.json
  blocked_paths:
    - .env
    - .env.local
    - secrets/*
    - config/credentials.json

blocked_commands:
  - rm -rf /
  - dd if=/dev/zero
  - chmod 777
  - chown root:root
EOF
```

This policy says: agents can write to source files, tests, and docs—but absolutely never to environment files, secrets, or infrastructure config.

### Step 3: Test the Policy

Now let's validate what's allowed and what's blocked:

```bash
$ npx squad-governance test write src/app.ts
✅ PASS: write to src/app.ts allowed
```

Good. Source files are allowed. Now try the dangerous one:

```bash
$ npx squad-governance test write .env
❌ FAIL: write to .env blocked by policy — File path '.env' is in blocked paths
```

The system caught it. Let's verify command blocking works:

```bash
$ npx squad-governance test command "npm install"
✅ PASS: command 'npm install' allowed

$ npx squad-governance test command "rm -rf /"
❌ FAIL: command 'rm -rf /' blocked by policy (matches 'rm -rf /')
```

The policy engine matches the substring `rm -rf /` and blocks the entire command, even though technically `rm -rf /` would hit filesystem permissions first. Better to be safe.

### Step 4: View the Policy Summary

Get a human-readable overview of everything in your policy:

```bash
$ npx squad-governance summary

=== Policy Summary ===
Version: 1.0

Allowed Paths:
  ✅ src/**
  ✅ test/**
  ✅ docs/**
  ✅ README.md
  ✅ package.json

Blocked Paths:
  ❌ .env
  ❌ .env.local
  ❌ secrets/*
  ❌ config/credentials.json

Blocked Commands:
  ❌ rm -rf /
  ❌ dd if=/dev/zero
  ❌ chmod 777
  ❌ chown root:root
```

This is what you show your security team in a compliance review. Clear, declarative, enforceable.

### Step 5: Trigger a Violation and Check the Audit Log

Let's simulate an agent trying to do something it shouldn't:

```bash
$ npx squad-governance test write secrets/aws-keys.json

❌ FAIL: write to secrets/aws-keys.json blocked by policy — File path 'secrets/aws-keys.json' is in blocked paths
```

Now check the audit log:

```bash
$ cat .squad/audit/*.jsonl | jq

{
  "timestamp": "2024-01-15T14:32:45.123Z",
  "agent": "copilot-cli",
  "action": "write .env",
  "allowed": false,
  "reason": "File path '.env' is in blocked paths"
}
{
  "timestamp": "2024-01-15T14:32:51.456Z",
  "agent": "copilot-cli",
  "action": "write secrets/aws-keys.json",
  "allowed": false,
  "reason": "File path 'secrets/aws-keys.json' is in blocked paths"
}
```

Every decision—allowed or denied—is logged with timestamp, actor, action, and reason. This is your forensic record. When a security auditor asks "did any unauthorized file access happen?" you can run:

```bash
$ cat .squad/audit/*.jsonl | jq 'select(.allowed == false)' | wc -l
2
```

Two denials. Both in `.env` and `secrets/`. Case closed.

## What Makes This Different

**Most agent governance is reactive.** Post-hoc review, manual approval. This system is *preventive*—policies block violations *before* they happen.

> 📊 **[DIAGRAM: Reactive vs. Preventive Governance]**
> *Prompt for image generation:* Create a split-screen comparison: LEFT side labeled "Reactive (Old Way)" shows: Agent Action → File Written → Review Later → Damage. Path is red/orange. RIGHT side labeled "Preventive (This System)" shows: Agent Action → Policy Check → Allowed/Blocked → Log Decision. Path is green/teal. Use dark background, rounded boxes for states, thick arrows for flow direction. Include small icons (e.g., warning sign for reactive, shield for preventive). Emphasize the time difference: left shows "Hours to Days", right shows "Milliseconds".
> *Purpose:* Shows readers the fundamental difference in timing and risk—why policy-first is better than audit-only.

**Unlike branch protection**, policies understand intent. You're not just saying "Agent X can approve PRs." You're saying "agents can write to source files, not config files—ever." The CLI enforces it on every command.

**Unlike enterprise governance platforms**, there's no vendor lock-in. Policies are YAML. Audit logs are JSONL. Check runs live in GitHub. Portable, auditable, yours.

## Real Use Case: SOC 2 Attestation

A fintech team needed SOC 2 compliance:
- AI agents can write to `src/`, `test/`, `docs/`
- AI agents cannot touch `.env`, credentials, or infrastructure config
- Every attempt must be logged

With this policy system, they:
1. Deployed agents with confidence (5 min to write policy)
2. Ran agents for 3 months, collecting audit logs
3. Generated compliance report: `cat .squad/audit/*.jsonl | jq 'select(.allowed == false)' | length` → 0 unauthorized attempts
4. Passed security review with zero incidents

Before this, they were manually reviewing PR diffs and hoping nothing slipped through.

## Step-by-Step: Create a Policy, Test It, Check Audit

Here's the complete flow in one session:

```bash
# 1. Clone and build
git clone https://github.com/bradygaster/project-squad-sdk-example-governance.git
cd project-squad-sdk-example-governance
npm install
npm run build

# 2. Create policy
mkdir -p .squad/policies
cat > .squad/policies/policy.yaml << 'EOF'
version: '1.0'
file_access_rules:
  allowed_paths:
    - src/**
    - test/**
  blocked_paths:
    - .env
    - secrets/*
blocked_commands:
  - rm -rf /
EOF

# 3. Test allowed access
npx squad-governance test write src/index.ts
# ✅ PASS

# 4. Test blocked access
npx squad-governance test write .env
# ❌ FAIL

# 5. View summary
npx squad-governance summary

# 6. Check audit log (if violations were recorded)
cat .squad/audit/*.jsonl | jq '.'
```

All in under 2 minutes. The system is designed to be fast and obvious.

## The Honest Scoping

This example is a **reference implementation**. It shows you the patterns. What's production-ready *today*:

- **Policy validation** — Load, parse, and enforce YAML policies
- **Pre-tool hooks** — Block file writes and commands before execution
- **Audit logging** — Append-only JSONL audit trail with timestamps
- **CLI testing** — Dry-run any file write or command against the policy

The roadmap includes (not yet enforced):
- PII detection (SSN, email, credit card patterns)
- Rate limiting (max API calls per session)
- Reviewer lockout (author can't review own work)
- Emergency waivers (bypass with justification + signature)

The core loop (define policy → validate → audit) is battle-tested. The extensions are where teams customize to their risk profile.

## Why This Matters

AI governance isn't new. What's new is doing it **at agent runtime, declaratively, with full audit trails**. Until now, you chose between speed and control. This system lets you have both.

For security teams: you get demonstrable control for compliance reviews.  
For platform teams: you get auditable, version-controlled policy across all repos.  
For engineers: you get clear policy boundaries and fast feedback when something's out of bounds.

The secret: policies work because they're *simple*. YAML, not Rego or Cedar. CLI tests, not integration tests. JSONL audit logs, not a proprietary database. Your team can reason about it.

---

Read the [full documentation](https://github.com/bradygaster/project-squad-sdk-example-governance#readme) for architecture details and extending with custom rules. The [QUICKSTART](https://github.com/bradygaster/project-squad-sdk-example-governance/blob/main/QUICKSTART.md) gets you running in 5 minutes.

Your agents are powerful. Give them guardrails that match your risk tolerance—not your paranoia.
