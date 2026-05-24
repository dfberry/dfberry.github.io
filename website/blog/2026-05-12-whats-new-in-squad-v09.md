---
slug: "/2026-05-12-whats-new-in-squad-v09"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-whats-new-in-squad-v09"
custom_edit_url: null
sidebar_label: "2026.05.12 Squad v0.9"
title: "What v0.9 Quietly Got Right"
description: "A look at the v0.9 improvements that made Squad feel production-ready instead of merely interesting."
draft: true
tags:
  - "AI Agents"
  - "Squad"
  - "Release Notes"
  - "Developer Workflow"
  - "AI-assisted"
keywords:
  - "squad v0.9"
  - "agent framework release"
  - "production ai agents"
  - "copilot cli"
  - "developer workflow"
updated: "2026-05-12 00:00 PST"
---

If you read our [favorite Squad features post](/blog/2026-05-12-squad-features-youre-missing), you've seen the core capabilities — scheduling, two-pass scanning, tiered memory, economy mode, and the orchestration essentials. Here's what landed in v0.9 that shifts Squad from a capable agent framework to something you can run in production with genuine confidence.

These aren't flashy. They're engineering maturity — the kind of work that makes the difference between a tool you demo and a tool you deploy unsupervised.

## External Capability Loading

The problem: your automation needs are specific to your domain. Squad's core is general-purpose. You don't want to fork Squad. You want to extend it.

The solution: drop JavaScript files into `.squad/capabilities/` and Squad loads them dynamically, turning your local development environment into a custom automation platform. No restart between iterations.

```javascript
// .squad/capabilities/my-analyzer.js
module.exports = {
  name: 'my-analyzer',
  version: '1.0.0',
  canHandle: (issue) => issue.labels.includes('analyze-me'),
  execute: async (context) => { /* your logic */ }
};
```

**Concrete example:** Your team triages security vulnerabilities. You write a capability that calls the NVD API, scores issues by CVE severity, and auto-applies labels. It runs in Squad's watch mode without touching Squad's core code. When it's solid, you promote it.

Watch mode discovers and validates capabilities at startup.

**Learn more:** `packages/squad-sdk/external-loader.ts` and capability validation guide.

## PID Tracker + Orphan Cleanup

The problem: long watch sessions accumulate zombie processes. Eventually you hit "port already in use" on the 10th restart, and you don't know why.

The solution: Squad now tracks child process PIDs and cleans them up on exit — even across crashes. It's cross-platform and silent.

```bash
squad watch --duration 24h
# Press Ctrl+C
# All child processes automatically cleaned up
```

If something dies hard, `squad watch --health` shows you live PID status, uptime, and process tree.

**Concrete example:** You're running Squad in CI with parallel jobs. Without PID tracking, orphaned processes pile up after failed runs, eating memory and holding file locks. Each retry fails with "port in use." With the tracker, cleanup is automatic.

**Learn more:** `packages/squad-sdk/pid-tracker.ts` and watch mode guides.

## External State Storage

The problem: your `.squad/` directory normally lives in git. But when you switch branches, your orchestration state resets. If you context-switch frequently, that's friction.

The solution: `squad externalize` moves your state to `~/.squad/global/` — the same place personal Squad lives. Your state now survives branch switches and never appears in `git status`. And you can always bring it back.

```bash
squad externalize              # Move to global state
squad internalize              # Move back to repo-local
squad config set stateLocation 'external'  # Configure default
```

**Concrete example:** You're working across five branches a day — feature work, bug fixes, reviewing PRs. Every branch switch would reset your squad state if it's in-repo. Externalizing means your agent decisions, orchestration logs, and memory tiers persist regardless of which branch you're on.

**Learn more:** `packages/squad-sdk/state-backend.md` and CLI guide.

## Shell Injection Hardening

The problem: if you run Squad against untrusted GitHub data, you need defense in depth against injection attacks. Imagine a public repo where anyone can file issues — a crafted issue title like `"; rm -rf /; echo "` could escape into a shell command if you're using shell-interpolated execution.

The solution: all subprocess execution in Squad's scheduler and state backend now use `execFileSync` with input validators instead of shell-interpolated `execSync`. The string is just a string. You don't have to think about it.

**When you'd use this:** Running Squad in a multi-tenant environment, or against untrusted GitHub data. This is the difference between "hope nobody exploits us" and "we have a security perimeter."

**Learn more:** Security audit notes in the core docs.

## Watch Health Command

The problem: if you're running Squad in the background or on a remote machine, you don't know if things are working until something breaks. Your GitHub token expired at 2 AM, watch silently stopped processing issues, and you didn't find out until Monday.

The solution: `squad watch --health` gives you observability without logging into the machine.

```bash
squad watch --health
```

Returns:
- **PID** — Process ID (useful for manual troubleshooting)
- **Uptime** — How long watch has been running
- **Auth Account** — Which GitHub user is authenticated
- **Loaded Capabilities** — All detected capabilities (.squad/capabilities/ + built-in)
- **Auth Drift Detection** — Alerts if your GitHub token changed or permissions shifted

**Concrete example:** You're running watch in a tmux session on a remote CI runner. Health checks tell you if auth drifted without SSH'ing to the machine and tailing logs. You can pipe it into your monitoring system or just glance at it before you close your laptop.

**Learn more:** Watch mode CLI reference.

---

## The Pattern

These five features share a theme: they're about what happens when Squad runs unsupervised. External loading lets you extend it without forking. PID tracking and shell hardening keep it safe. External state keeps it portable. Health monitoring keeps it observable.

If you're running Squad interactively — a terminal open, eyes on output — you might never need these. But if you're running it in CI, in the background, or across a team, this is the infrastructure that makes it reliable.

**Start here:**
- If you're already using watch mode, run `squad watch --health` once and see what it reports.
- If you switch branches frequently, try `squad externalize` for a week.
- If you're building domain-specific automation, drop a `.js` file in `.squad/capabilities/` and prototype.

These features ship with v0.9. They're ready now.
