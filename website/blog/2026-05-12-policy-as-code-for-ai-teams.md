---
slug: "/2026-05-12-policy-as-code-for-ai-teams"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-policy-as-code-for-ai-teams"
custom_edit_url: null
sidebar_label: "2026.05.12 Policy as Code"
title: "Policy as Code for AI Agent Teams"
description: "A practical model for turning agent guardrails into versioned, testable policy instead of scattered prompts."
draft: true
tags:
  - "AI Agents"
  - "Governance"
  - "Squad"
  - "Security"
  - "AI-assisted"
keywords:
  - "policy as code"
  - "ai agent governance"
  - "agent guardrails"
  - "review gates"
  - "squad"
updated: "2026-05-12 00:00 PST"
---

Your AI agents follow instructions written in markdown. Charters, routing rules, copilot-instructions.md — all prose. What happens when an agent ignores them?

Nothing. There's no enforcement. An agent can `git add .` even though your instructions say "never do that." There's no audit log when it happens. You find out when something breaks.

I spent a week designing a policy layer for [Squad](https://github.com/bradygaster/squad) and similar AI agent frameworks. Here's what I came up with and what four specialist reviewers told me was wrong with it.

## The Problem

After using Squad for a few weeks, I noticed these gaps:

1. **No enforcement.** Instructions are advisory. Agents usually follow them. Usually.
2. **No audit trail.** When an agent makes a bad decision, there's no log of what happened or why.
3. **Policy is scattered.** Rules live in `copilot-instructions.md`, agent charters, `decisions.md`, `ceremonies.md`, and `.gitattributes`. No single file to point at.
4. **No inheritance.** Org-wide policies ("never commit secrets") must be copy-pasted into every repo.
5. **No adopter guidance.** New teams don't know which decisions to make. They discover policies after something goes wrong.

## Three Tiers

The core idea is a three-tier policy model:

```
┌─────────────────────────────────────────────────────┐
│  Tier 1: Platform Policies (hard block)             │
│  Enforced by: Squad CLI middleware                   │
│  Override: Nobody                                    │
├─────────────────────────────────────────────────────┤
│  Tier 2: Team Policies (soft block)                 │
│  Enforced by: Coordinator                            │
│  Override: Human can waive with justification         │
├─────────────────────────────────────────────────────┤
│  Tier 3: Agent Preferences (advisory)               │
│  Enforced by: Agent reads at session start            │
│  Override: Agent adapts per context                   │
└─────────────────────────────────────────────────────┘
```

**Tier 1** is git safety, file access controls, secret scanning, MCP allowlists. Non-negotiable. If an agent tries to `git add .`, the CLI blocks it before the command runs.

**Tier 2** is review gates, human approval requirements, PR scope rules, reviewer lockout. The coordinator checks these before spawning agents. A human can waive with `/policy waive <rule> --scope pr`.

**Tier 3** is agent-specific preferences — test coverage thresholds, max function length, review pipeline order. Agents read these at session start and adapt.

## The Policy File

Everything lives in `.squad/policy.yaml`:

```yaml
version: 1
kind: squad-policy

platform:
  git:
    staging: explicit-only          # blocks git add . / git add -A
    force-push: deny
    branches-protected: [main, live, release/*]
    max-files-per-commit: 20
  
  files:
    deny-write:
      - "*.env"
      - ".squad/policy.yaml"       # agents can't weaken their own policy
      - ".github/hooks/**"         # agents can't modify enforcement
      - ".squad/audit-log/**"      # agents can't tamper with audit
    deny-delete:
      - ".squad/policy.yaml"
      - ".squad/decisions.md"
  
  secrets:
    scan-before-commit: true
    provider: built-in              # built-in | github-secret-scanning | detect-secrets
  
  mcps:
    allowlist: [github, jira, confluence, datadog, slack, pagerduty]
  
  rate-limits:
    max-violations-per-session: 10  # auto-terminate after 10 blocks

team:
  review:
    required-passes: [security-review, code-review]
    human-approval-required: [deploy, merge-to-protected-branch]
    reviewer-lockout: true          # author can't review own work
    waiver-authorized: ["CODEOWNERS"]
    waiver-scope: per-pr
  
  scope:
    max-pr-files: 20
    separate-infra-and-product: true
  
  audit:
    storage: local                  # local (gitignored) | external
    rotation-days: 30

agent-preferences:
  tester:
    coverage-threshold-percent: 80
    require-integration-tests: true
  lead:
    review-pipeline: [security-review, code-review]
```

## Enforcement Points

Policy is checked at six points in the agent lifecycle:

| When | What's checked | What happens on violation |
|------|---------------|-------------------------|
| Session start | Load + merge policy chain. Validate schema. | Session won't start if policy is invalid |
| Pre-tool-use | File access, git commands, MCP calls | CLI blocks the action with actionable error |
| Pre-commit | Secret scan, file count, staging method | Commit is rejected |
| Pre-PR | Scope, reviewer lockout, required passes | PR creation blocked or flagged |
| Coordinator routing | Agent enabled? Scope within boundaries? | Agent not spawned |
| Post-action | Audit log entry | Logged to `.squad/audit-log/` |

Error messages include what was blocked, why, what to do instead, and whether a waiver is available:

```
❌ Blocked: git add .
   Rule: platform.git.staging = explicit-only
   Tier: 1 (platform)
   Fix:  Stage files individually: git add path/to/file.ts
   Waive: Not waivable (Tier 1)
```

## What Four Reviewers Told Me Was Wrong

I ran the PRD through four specialist reviews — Security, Architecture, Product/UX, DevOps/CI. They found 7 critical issues and 12 warnings.

### The critical ones:

**Policy files weren't write-protected.** The original schema had `deny-write` for `.github/agents/**` but not for `.squad/policy.yaml`. An agent could edit its own policy to remove restrictions. Fixed by adding policy files, hooks, and audit logs to `deny-write`.

**Secret scanning was regex-only.** A single regex pattern misses AWS keys (`AKIA...`), GitHub PATs (`ghp_...`), JWTs, PEM keys, and hundreds of other known formats. Fixed by adding a `provider` field that supports `github-secret-scanning` and `detect-secrets` pattern databases.

**Hook scripts lived in the repo.** The enforcement mechanism (`.github/hooks/`) was just a JS file in the repo. An agent with file-write access could replace it with a no-op, bypassing ALL Tier 1 enforcement. Fixed by shipping hooks as versioned GitHub Actions instead of repo files.

**Audit logs were writable by agents.** If agents can write to `.squad/audit-log/`, they can forge entries or hide violations. Fixed by making audit the CLI's responsibility and defaulting to local gitignored storage.

**No CI integration spec.** The PRD said "GitHub Action" but never defined exit codes, status checks, or a reusable workflow. Fixed by specifying `squad-policy-gate` with tiered exit codes: Tier 1 → `exit 1`, Tier 2 → `exit 78` (warning), Tier 3 → annotation.

**Enforcement depended on VS Code Agent Hooks.** Agent Hooks are a VS Code preview feature. They don't work in CLI or CI. Fixed by designing enforcement as Squad CLI middleware first, with hooks as an optional enhancement.

**The setup wizard asked 9 questions.** Product reviewer called this "an adoption cliff." New users won't know the answers. Fixed by shipping pre-populated defaults with a zero-question `--quick` mode.

### The architecture feedback:

The Architecture reviewer pointed out that "most restrictive wins" is underspecified for non-boolean fields. What does "most restrictive" mean for an MCP allowlist? Intersection? Union? A number field like `max-files-per-commit`? Min?

Fixed by defining per-field merge strategies:

```yaml
_merge_strategies:
  "platform.mcps.allowlist": intersection
  "platform.git.max-files-per-commit": min
  "platform.git.branches-protected": union
  "team.storage.mode": override
  "team.agents.enabled": intersection
  "team.review.required-passes": union
```

## What's Next

The PRD defines 5 phases:

| Phase | What ships | Enforcement level |
|-------|-----------|------------------|
| **0** (done) | Prose-based policy in markdown | Advisory |
| **1** | JSON Schema, `squad policy init/show/doctor`, CI gate | Schema validation |
| **2** | Squad CLI middleware, pre-commit hooks, audit logging | Tier 1 hard enforcement |
| **3** | Coordinator enforcement, waiver system, Cedar/OPA for conditional rules | Tier 2 soft enforcement |
| **4** | Org-level inheritance via GitHub API | Full policy chain |
| **5** | Agent Governance Toolkit integration (optional) | Enterprise-grade |

Phase 0 is already done — the adopter decisions, git safety rules, and PR templates I built for my docs squad template are the prose version of this policy layer.

Phase 1 is where the machine-readable `policy.yaml` and CLI tooling get built. That's what I'm working on next.

---

The full PRD currently lives in a private planning repo. If you're building AI agent teams and thinking about governance, the three-tier model is a good starting point — even if you only implement it in markdown.
