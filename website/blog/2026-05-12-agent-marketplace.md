---
slug: "/2026-05-12-agent-marketplace"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-agent-marketplace"
custom_edit_url: null
sidebar_label: "2026.05.12 Agent Marketplace"
title: "Stop Rebuilding Agents from Scratch. Package, Share, and Install Them."
description: "A marketplace approach for packaging reusable agents so teams can publish, install, and update them like software."
draft: true
tags:
  - "AI Agents"
  - "Marketplace"
  - "Reuse"
  - "Squad"
  - "AI-assisted"
keywords:
  - "agent marketplace"
  - "reusable agents"
  - "package agents"
  - "agent distribution"
  - "squad"
updated: "2026-05-12 00:00 PST"
---

Your team builds a security reviewer agent. It works well. It gets better as you tune it.

Then another team needs a similar agent. They rebuild it. Six weeks of tuning lost. Your organization has 2 security agents now—identical twins that drift apart over time.

This happens because agent sharing isn't standardized. There's no way to package an agent, vet it, and install it. So teams hoard their work instead of amplifying it.

[Squad SDK Agent Marketplace](https://github.com/bradygaster/project-squad-sdk-example-marketplace) is a reference implementation of a private agent registry. Define agents with manifests. Scan for security issues. Publish to a registry. Install verified agents in seconds. No build-it-yourself infrastructure, no manual vetting—just configuration and CLI commands.

## The Problem: Agents Are Trapped in Repos

You've invested in building specialized agents:
- Security reviewer (detects vulns, flags risky patterns)
- Documentation auditor (checks completeness and freshness)
- Accessibility checker (scans for A11y compliance)

Each took 30–50 hours to build and tune. They solve real problems.

But they're locked in one repo. When another team needs the same capability, they either:
1. Recreate it (wasting time)
2. Copy the code (manual sync, divergence)
3. Hope to find it someday (tribal knowledge)

No organization does this intentionally. It's just the default when there's no infrastructure for sharing.

## How the Marketplace Works: A Complete Walkthrough

### Step 1: Clone and Build

> 📊 **[DIAGRAM: Marketplace Publish-to-Install Flow]**
> *Prompt for image generation:* Create a horizontal flow showing 3 phases: (1) LOCAL DEVELOPMENT (left): Developer box → Package (tar.gz icon) → Scan (shield icon checking code) → Risk assessment indicator (green/red). (2) REGISTRY (center): GitHub private repository icon with multiple agent versions listed. (3) CONSUMER (right): Install command → Extract → Dependencies resolved → Agent in .squad/agents/. Use dark background, teal/cyan accents, arrows showing progression. Include version pinning concept: show multiple versions (1.0.0, 1.1.0, 2.0.0) in registry with selection arrow. Bottom: show security scanning details (hardcoded secrets detector, dangerous imports detector).
> *Purpose:* Gives readers the big picture of how agents move from local development through security scanning to a shared registry, then install safely in other repos.

```bash
$ git clone https://github.com/bradygaster/project-squad-sdk-example-marketplace.git
$ cd project-squad-sdk-example-marketplace
$ npm install
added 42 packages, and audited 45 packages in 2.3s

$ npm run build
$ npm link
# Makes squad-marketplace available globally

$ npm test
✓ src/manifest/validator.test.ts (4 tests)
✓ src/security/scanner.test.ts (6 tests)
Test Files  5 passed (5)
     Tests  23 passed (23)
```

Everything builds and tests pass. You're ready to publish your first agent.

### Step 2: Package Your Agent

Your agent lives in a directory with two files:

```
my-security-agent/
├── manifest.json
└── charter.md
```

Create `manifest.json`:

```json
{
  "name": "security-reviewer",
  "version": "1.0.0",
  "author": "security-team",
  "description": "Automated security code review",
  "skills": {
    "code-analyzer": "^1.5.0",
    "vulnerability-scanner": "^2.0.0"
  },
  "config": {
    "timeout": 60000,
    "maxTokens": 4000,
    "temperature": 0.2
  }
}
```

Create `charter.md` (a readme, really):

```markdown
# Security Reviewer Agent

Performs automated security code review with pattern detection for common vulnerabilities.

## Capabilities
- Detects hardcoded secrets (API keys, credentials)
- Flags risky imports (eval, exec, dynamic requires)
- Checks authentication flows for weakness
- Scans for SQL injection patterns

## Permissions
- Read-only access to codebase
- Cannot modify files
- No network access
```

Now package it:

```bash
$ squad-marketplace package examples/sample-agent
Packaged → sample-agent-1.0.0.tar.gz (874 bytes)
```

Done. You have a `.tar.gz` with metadata and checksum.

### Step 3: Scan for Security Issues

Before publishing, verify the agent is safe:

```bash
$ squad-marketplace scan examples/sample-agent

Agent   : sample-agent
Risk    : LOW
Approved: true
No issues found.
```

The scanner detects:
- Hardcoded credentials (AWS keys, API tokens)
- Dangerous imports (`eval`, `exec`, shell injection)
- Network risks (unexpected calls to external APIs)
- Pattern violations (overprivileged roles)

It exits with code 0 (safe) or 1 (scan failed). CI integration is straightforward—fail the build if scan exits with 1.

Let's see what a failed scan looks like. Add a hardcoded secret to charter:

```bash
$ sed -i 's/charter.md/charter.md\nAPI_KEY = ghp_super_secret_token/' examples/sample-agent/charter.md

$ squad-marketplace scan examples/sample-agent

Agent   : sample-agent
Risk    : HIGH
Approved: false

Found 1 issue:

❌ SECURITY ISSUE: Hardcoded Credential Pattern
   File: charter.md
   Match: ghp_super_secret_token
   Severity: CRITICAL
   Remediation: Remove hardcoded secrets. Use environment variables.
```

The scan caught it. Now remove the secret and re-scan:

```bash
$ git checkout examples/sample-agent/charter.md
$ squad-marketplace scan examples/sample-agent

Agent   : sample-agent
Risk    : LOW
Approved: true
No issues found.
```

### Step 4: Publish to Your Registry

Set your GitHub registry details (a private repo you control):

```bash
$ export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
$ export GITHUB_REGISTRY_OWNER=your-org
$ export GITHUB_REGISTRY_REPO=my-agent-registry

$ squad-marketplace publish sample-agent-1.0.0.tar.gz
Published sample-agent@1.0.0

✅ Published to https://github.com/your-org/my-agent-registry
   Version: 1.0.0
   Size: 874 bytes
   Risk: LOW
```

The agent lands in your private registry. No build pipeline, no Docker images, no complexity. Just GitHub as the backend.

### Step 5: Install Verified Agents

Another team installs it:

```bash
$ squad-marketplace install sample-agent@1.0.0
Installed sample-agent@1.0.0 → .squad/agents/sample-agent

✓ Extracted files
✓ Resolved dependencies
✓ Updated metadata
```

Agent is now available to their squad. Dependencies get resolved. Versions stay pinned.

### Step 6: List Available Agents

```bash
$ squad-marketplace list

Registry (3 agent(s)):
  security-reviewer@1.0.0  by security-team  (2024-01-15)
  docs-auditor@1.2.0       by docs-team      (2024-01-14)
  a11y-checker@2.0.0       by platform-team  (2024-01-10)
```

Everyone can see what's available. Publish dates, versions, authors. Clear ownership.

## Two Commands That Show Real Power

```bash
# Full lifecycle in one session
squad-marketplace package ./my-agent
squad-marketplace scan ./my-agent
squad-marketplace publish my-agent-1.0.0.tar.gz

# Install it elsewhere
squad-marketplace install my-agent@1.0.0

# Verify it's installed
ls -la .squad/agents/my-agent/
# Should show manifest.json and charter.md
```

That's it. No manual downloading, no file juggling, no trusting someone's GitHub fork. You get the exact version someone published, scanned, and approved.

## Real Use Case: Scale Your Expertise

A platform team builds a database runbook agent that diagnoses and suggests fixes for common database issues. It takes 30 hours to get right—query analysis, performance tuning, escalation paths.

> 📊 **[DIAGRAM: Agent Reuse Multiplier Effect]**
> *Prompt for image generation:* Show a vertical timeline (left side: months 0-3) with milestones: Month 0—single platform team box (large, green). Month 1—platform team + 4 adopter team boxes (all same size, teal), connected by dotted lines from platform team. Month 2—platform team + 8 adopter boxes. Month 3—platform team + 12 adopter boxes. Each adopter box includes small icons indicating "using 1 agent". Center annotation: show hours saved column (Month 1: ~600 hours saved, Month 2: ~1200 hours saved, Month 3: ~1800 hours saved). Bottom: show single publish-and-upgrade cycle (one arrow up from platform team) distributing improvements to all 12 teams. Use dark background, grow graph concept with green/teal boxes, thin connecting lines.
> *Purpose:* Visualizes the organizational leverage of sharing—one investment multiplies across teams, with updates flowing to all instantly.

They publish it to the marketplace.

Now 12 teams can `install database-diagnostician` instead of calling an on-call DBA or writing custom diagnostics. The platform team maintains one source of truth. All 12 teams get bug fixes and improvements automatically when they upgrade.

Timeline:
- **Day 1:** Platform team publishes `database-diagnostician@1.0.0`
- **Day 2:** Team A installs it, uses it for production incident triage
- **Week 1:** Team B, C, D install it. Saves each 20+ hours of development
- **Month 1:** Platform team finds a bug, publishes `@1.0.1`. All 12 teams upgrade in seconds
- **Month 3:** 12 teams have provided feedback. Platform team publishes `@2.0.0` with better heuristics

The platform team's expertise—30 hours of tuning and debugging—gets multiplied across the organization. That's the leverage.

## The Trust Model

**Authentication:** Only your org can access your registry (private GitHub repo).

**Verification:** Every published agent is scanned for credentials and unsafe patterns before the publish command even succeeds.

```bash
$ squad-marketplace publish my-agent-1.0.0.tar.gz

Scanning for security issues...
Risk: LOW ✅

Checking GitHub credentials...
✓ GITHUB_TOKEN valid
✓ Registry writable

Publishing...
Published my-agent@1.0.0
```

**Publisher accountability:** You know who published each agent and when.

**Version pinning:** When you install `security-reviewer@1.0.0`, you get exactly that version forever. No surprise breaking changes when someone publishes 2.0.

```bash
$ squad-marketplace list

security-reviewer@1.0.0  by security-team  (2024-01-15)
security-reviewer@2.0.0  by security-team  (2024-01-20)
# Both versions are available; install which you want
```

## Why Not Just Use npm?

npm is designed for open-source. This is designed for private, enterprise use:

| Aspect | npm | Marketplace |
|--------|-----|-----------|
| **Access Control** | Everyone | Only your org |
| **Security Scanning** | None (by default) | Built-in: detects credentials, dangerous patterns |
| **Publisher Verification** | No | Yes: you know who published |
| **Dependency Resolution** | npm semver | Agent-specific skill dependencies |
| **Hosting** | npm registry (third-party) | Your GitHub repo (you control) |

You *could* use npm. But then you're mixing public packages with private agents. You're relying on npm's scanning. You're trusting some random maintainer's security posture.

The marketplace is built for the enterprise constraint: *private, verified, auditable*.

## The Honest Scoping

This is a **reference implementation**. It shows patterns for packaging, security scanning, and registry-backed distribution. It's production-ready for the core loop (package → scan → publish → install).

What's real today:
- Manifest validation and versioning
- Security scanning (hardcoded credentials, dangerous imports)
- Package extraction and tar/gzip operations
- GitHub-backed registry (push/pull agents via GitHub repos)
- Version pinning and semver resolution
- Audit trail of who published what and when

What's planned but not yet enforced:
- Advanced security rules (PII detection, SQL injection patterns in agent configs)
- Trust scoring (how many teams use this agent, uptime)
- Preview sandboxes (try agents before installing)
- Web UI for browsing and installing agents
- Deprecation warnings (agent marked as obsolete)

The core—the workflow that matters today—is solid. The roadmap extensions are where teams customize.

## Getting Started: 5 Steps

```bash
# 1. Clone and setup
git clone https://github.com/bradygaster/project-squad-sdk-example-marketplace.git
cd project-squad-sdk-example-marketplace
npm install && npm run build && npm link

# 2. Create your first agent
mkdir my-test-agent && cd my-test-agent

cat > manifest.json << 'EOF'
{
  "name": "my-test-agent",
  "version": "1.0.0",
  "author": "your-name",
  "description": "A test agent",
  "skills": {},
  "config": {}
}
EOF

cat > charter.md << 'EOF'
# My Test Agent
A simple demonstration agent.
EOF

# 3. Package it
cd ..
squad-marketplace package my-test-agent
# → my-test-agent-1.0.0.tar.gz

# 4. Scan it
squad-marketplace scan my-test-agent
# → Risk: LOW, Approved: true

# 5. Set up registry and publish
export GITHUB_TOKEN=ghp_...
export GITHUB_REGISTRY_OWNER=your-org
export GITHUB_REGISTRY_REPO=my-agent-registry

squad-marketplace publish my-test-agent-1.0.0.tar.gz
# → Published my-test-agent@1.0.0
```

Done. Your first agent is in the registry.

Now install it elsewhere:

```bash
squad-marketplace install my-test-agent@1.0.0
# → Installed my-test-agent@1.0.0 → .squad/agents/my-test-agent
```

Check it:

```bash
ls .squad/agents/my-test-agent/
# manifest.json
# charter.md
```

Your agent is ready to use across teams.

## Why This Matters

Specialized agents are becoming organizational assets. A good security reviewer saves your team hours. A solid documentation auditor catches staleness before readers see it. An accessibility checker prevents compliance issues.

Right now, those assets stay hidden. They're built once, tuned in one repo, and forgotten everywhere else. Nobody knows they exist. Teams rebuild instead of reuse.

A marketplace changes that. It makes agents discoverable, shareable, and governed. It solves the "not invented here" problem by making "invented here and available everywhere" the default.

For your organization:
- One team invests in building a great agent
- 10 other teams benefit immediately
- The original team gets 10 testers and feedback loops
- Your best ideas scale

---

Read the [repo](https://github.com/bradygaster/project-squad-sdk-example-marketplace) and the [quickstart](https://github.com/bradygaster/project-squad-sdk-example-marketplace/blob/main/QUICKSTART.md) to get your first agent published.

Your specialized knowledge should multiply, not repeat. Build once, share everywhere.
