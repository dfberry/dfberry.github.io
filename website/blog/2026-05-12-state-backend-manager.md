---
slug: "/2026-05-12-state-backend-manager"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-state-backend-manager"
custom_edit_url: null
sidebar_label: "2026.05.12 State Backend Manager"
title: "Tired of .squad/ Noise in Your Git History? Move State to a Cleaner Backend"
description: "A design sketch for moving noisy repo state into a cleaner backend while keeping agent coordination intact."
draft: true
tags:
  - "AI Agents"
  - "State Management"
  - "Squad"
  - "Developer Workflow"
  - "AI-assisted"
keywords:
  - "state backend"
  - "agent state storage"
  - "git noise"
  - "squad state"
  - "developer workflow"
updated: "2026-05-12 00:00 PST"
---

Squad stores all team state in `.squad/` — decisions, orchestration logs, configurations. This works fine until you're managing dozens of agents across multiple repos. Then `.squad/` commits become your main source of git noise: noisy diffs, merge conflicts on shared decision files, constant churn that makes history hard to read.

At enterprise scale, this becomes unbearable: merge conflicts on shared decision files when multiple teams work in parallel, git noise making blame, bisect, and log reading painful, compliance issues where teams need to audit AI decision logs separately from source code, branch protection failures because `.squad/` files changed even though no actual code changed.

I built a state backend manager to solve this. [squad-state-backend](https://github.com/bradygaster/project-squad-sdk-example-state-backend) lets you move state off the filesystem, onto git-notes, orphan branches, or external repos. Or anywhere else you want it. The framework handles migration, verification, and retention policies.

## The Problem: .squad/ at Scale

Imagine this. You have 30 repos, each with a `.squad/` directory. Decisions are constantly being logged, orchestration history is growing, agent configs are being updated. Every session, `.squad/` changes. Most teams ignore it and let it commit. A few teams try to gitignore it, but then they lose state across machines.

At enterprise scale, this becomes unbearable:

- **Merge conflicts** on shared decision files when multiple teams work in parallel
- **Git noise** makes blame, bisect, and log reading painful
- **Compliance issues** — some teams need to audit AI decision logs separately from source code
- **Branch protection failures** — CI gates trigger because `.squad/` files changed, even though no actual code changed
- **Slow clones** — large `.squad/` directories bloat repository size
- **Stale state** — teams on different branches have divergent decisions, causing confusion

The core problem: state lives in the same place as code, but it's a different concern. Source code is permanent and revisioned. State is ephemeral and audit-focused. Mixing them creates friction.

Teams ask: "Can state live somewhere else?" The answer should be yes. Today it's not obvious how.

## The Solution: Pluggable State Backends

The Squad SDK was designed with pluggable backends in mind, but users never got an easy way to use them. The state backend manager changes that.

It exposes a simple interface: every backend implements the same read/write/list/delete operations. That means you can:

1. Check what backend you're using
2. Migrate between backends (with verification)
3. Verify state integrity after migration
4. Set retention policies (auto-archive old logs)

The framework ships with a simulated demo for testing. Production versions would integrate real git-notes, orphan branches, or external repos.

> 📊 **[DIAGRAM: Backend Architecture Comparison]**
> *Prompt for image generation:* A 3-column comparison layout showing: (1) "Filesystem Backend" with file icon and ".squad/" label (dark background, red accent) — "Pro: Simple, Con: Noise in git history"; (2) "Git-Notes Backend" with git branch icon (blue accent) — "Pro: Clean history, Con: Complex"; (3) "Orphan Branch Backend" with layered boxes icon (teal accent) — "Pro: Isolated state, Con: Multiple branches". Add arrows showing bidirectional migration paths between columns with dotted lines labeled "migrate". Show state files (8 files, 2KB) flowing through each. Dark background overall, colored accents per backend.
> *Purpose:* Visually compares backend tradeoffs side-by-side—readers instantly understand pros/cons of filesystem vs. git-notes vs. orphan without reading dense text.

## Setup

```bash
# Clone the repository
git clone https://github.com/bradygaster/project-squad-sdk-example-state-backend.git
cd project-squad-sdk-example-state-backend

# Install and build
npm install && npm run build
```

Verify setup:

```bash
npm run test
```

Expected: All tests pass (✓).

## Check Current Backend Status

See what backend is currently active and verify its health:

```bash
npx squad-state status
```

Expected output:

```
Backend: filesystem
Files: 8
Size: 2,048 bytes
Last Write: 2024-01-15 10:15:00
Healthy: yes
Integrity: valid
```

This tells you:
- **Backend**: Currently using filesystem (`.squad/`)
- **Files**: 8 state files tracked
- **Size**: Total size of state data
- **Last Write**: When state was last modified
- **Healthy**: Yes = no errors detected
- **Integrity**: Valid = all files are readable and parseable

## Verify State Integrity

Before migrating or trusting your state, always verify it's clean:

```bash
npx squad-state verify
```

Expected output:

```
✓ All checks passed.
All checks passed. 8 files validated.
```

The verification process checks:
- JSON validity (all files parse correctly)
- Required files exist (nothing is missing)
- No corruption (checksums match)
- No orphaned data (no unreferenced files)

If state is corrupted or missing files, this will tell you:

```
❌ Validation failed: 2 issues found

  • Missing file: .squad/decisions.md
    Fix: Check if file was deleted or corrupted

  • Invalid JSON: .squad/agents/alice.json
    Error: Unexpected end of JSON input
    Fix: Restore from backup or delete and recreate
```

**Never migrate broken state.** Fix or restore first.

## Migrate Between Backends

This is the real power. You can move state from filesystem to git-notes with a single command:

```bash
npx squad-state migrate filesystem git-notes
```

Expected output:

```
Migration complete: 8 files transferred from filesystem to git-notes (2048 bytes, 35ms)
```

What happens behind the scenes:

1. **Pre-flight checks** — Verify source backend is healthy
2. **Export** — Read all files from source backend, serialize with metadata
3. **Transfer** — Write serialized state to target backend
4. **Import verification** — Confirm all files arrived intact
5. **Post-flight checks** — Verify target backend is healthy
6. **Checksum confirmation** — Ensure source and target have identical data

If anything fails, the migration aborts and your source backend is unchanged:

```
❌ Migration failed at step "Import verification"
   Error: Target backend write failed (permission denied)
   
Source backend unchanged: filesystem (8 files, 2048 bytes)
No data was moved.
```

## Real Walkthrough: Full Migration Pipeline

Here's how to safely migrate from filesystem to git-notes:

**Step 1: Check current backend**

```bash
npx squad-state status
```

Output:
```
Backend: filesystem
Files: 8
Size: 2,048 bytes
Last Write: 2024-01-15 10:15:00
Healthy: yes
Integrity: valid
```

> 📊 **[DIAGRAM: Safe Migration Flow with Verification Gates]**
> *Prompt for image generation:* A sequential flowchart showing: (1) "Status Check" (green checkmark) → (2) "Verify Integrity" (shield icon, blue) → (3) "Dry Run" (play button icon, teal) → (4) "Execute Migration" (arrow icon, bold blue) → (5) "Verify After" (shield icon) → (6) "Confirm New Backend" (checkmark, green). Add red "ABORT" arrows from steps 2, 3, 5 labeled "if failed". Show data flowing through as "8 files, 2KB" beside migration arrows. Dark background, blue/teal/green accents for stages, clear step numbering.
> *Purpose:* Visually emphasizes the safety gates built into the migration process—readers understand that the system won't blindly move state without pre/post verification.

**Step 2: Verify state is clean**

```bash
npx squad-state verify
```

Output:
```
✓ All checks passed.
All checks passed. 8 files validated.
```

**Step 3: Simulate migration (dry-run)**

Before committing to the change:

```bash
npx squad-state migrate filesystem git-notes --dry-run
```

Output:
```
Dry run: Would transfer 8 files from filesystem to git-notes (2048 bytes)
No changes made. Re-run without --dry-run to execute.
```

**Step 4: Execute migration**

```bash
npx squad-state migrate filesystem git-notes
```

Output:
```
Migration complete: 8 files transferred from filesystem to git-notes (2048 bytes, 35ms)
```

**Step 5: Verify after migration**

Run integrity check on the new backend:

```bash
npx squad-state verify
```

Output:
```
✓ All checks passed.
All checks passed. 8 files validated.
```

**Step 6: Confirm new backend is active**

```bash
npx squad-state status
```

Output:
```
Backend: git-notes
Files: 8
Size: 2,048 bytes
Last Write: 2024-01-15 10:15:30
Healthy: yes
Integrity: valid
```

State has been successfully moved. The filesystem backend is now unused (you can safely delete `.squad/` if desired).

## Setting Retention Policies

Configure automatic archival of old logs:

```bash
npx squad-state retain --max-age 30
```

Expected output:

```
Retention policy set: max age 30 days, archive to .squad/archive
```

This configures the system to automatically archive logs older than 30 days. What happens:

1. Every 24 hours, the retention archiver runs
2. Finds all files modified >30 days ago
3. Moves them to `.squad/archive/`
4. Keeps recent logs in active state

Your state directory stays lean and readable. Old audit history is preserved (not deleted) for compliance.

Check policy status:

```bash
npx squad-state retain --status
```

Output:

```
Retention Policy
────────────────────────────
  Max age: 30 days
  Archive location: .squad/archive
  Last run: 2024-01-15 09:00:00
  Files archived: 12
  Space freed: 4,096 bytes
```

## Honest Scoping

**What this does:**
- Check backend status and health
- Migrate between backends (filesystem ↔ git-notes ↔ orphan branches ↔ external)
- Verify state integrity before/after migration
- Set retention policies and auto-archive old logs
- Prevent data loss with pre/post-flight checks

**What this doesn't do:**
- Implement real git-notes backend (example uses simulated filesystem directories)
- Implement real orphan-branch backend (same)
- Implement external repository backend (same)
- Handle conflicts between divergent backends
- Encrypt state (you need to do that yourself)

This example is production-ready for demonstrations and testing. For production use, you'd need to implement the real git backends (requires `nodegit` or `isomorphic-git`).

## Architecture

The framework has three layers:

```
┌────────────────────────────────────────────┐
│  CLI Commands Layer                        │
│  status, migrate, verify, retain           │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────┴───────────────────────┐
│  Orchestration Layer                       │
│  Migrator, StatusInspector, Archiver       │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────┴───────────────────────┐
│  Core Service Layer                        │
│  BackendResolver, StateExporter,           │
│  StateImporter, IntegrityChecker           │
└────────────────────┬───────────────────────┘
                     │
┌────────────────────┴───────────────────────┐
│  Backend Implementations                   │
│  Filesystem, GitNotes, OrphanBranch        │
└────────────────────────────────────────────┘
```

## Why This Matters

**For compliance teams:** State can live in an audited, encrypted repository separate from source code. Decision logs are archived with legal holds.

**For large repos:** Migrate to git-notes and stop polluting git history. Every `.squad/` commit disappears from `git log --oneline`.

**For open-source projects:** Contributor experience improves. No more `.squad/` noise in the main branch history.

**For multi-tenant setups:** External backend lets different teams have isolated state without sharing git repos.

## Next Steps

1. **Test with simulated backends.** Run migrations in this demo to understand the flow.
2. **Build real backends.** Implement git-notes or orphan-branch backends for your infrastructure.
3. **Set retention policies.** Decide how long to keep active logs vs. archive.
4. **Integrate with CI/CD.** Automate backend verification on every pull request.

## Get Started

```bash
# Clone and setup (5 minutes)
git clone https://github.com/bradygaster/project-squad-sdk-example-state-backend.git
cd project-squad-sdk-example-state-backend
npm install && npm run build

# Check current backend (1 minute)
npx squad-state status

# Verify state is healthy (1 minute)
npx squad-state verify

# Migrate to git-notes (simulated demo) (1 minute)
npx squad-state migrate filesystem git-notes

# Verify after migration (1 minute)
npx squad-state verify

# Set retention policy (1 minute)
npx squad-state retain --max-age 30
```

Ten minutes later, you have a working state backend manager. Then extend it with real git-notes or orphan-branch implementations for your infrastructure. Or use it as a template to build custom backends for your specific needs.

The result: cleaner git history, fewer merge conflicts, and state management that scales with your team size.
