---
slug: /2026-04-17-remote-control-custom-agents-from-your-phone
canonical_url: https://dfberry.github.io/blog/2026-04-17-remote-control-custom-agents-from-your-phone
custom_edit_url: null
sidebar_label: "2026-04-17 Remote control custom agents from your phone"
title: "Remote Control Your Custom Agent from Your Phone with Copilot CLI --remote"
description: "Copilot CLI's --remote flag lets you steer any custom agent from your phone. Here's how to set it up, what to design for, and what I learned using it with Squad as a real-world example."
published: false
tags:
  - GitHub Copilot
  - AI agents
  - Copilot CLI
  - remote control
  - custom agents
  - mobile development
keywords:
  - copilot cli remote
  - copilot mobile
  - custom agent remote control
  - copilot phone
  - github mobile copilot
  - agent.md remote
updated: 2026-04-17 00:00 PST
---

# Remote Control Your Custom Agent from Your Phone

<!-- Bellingham prompt: A person sitting on a bench at Boulevard Park on Bellingham Bay, holding a phone showing a terminal-style interface. In the background, a laptop sits open on a picnic table with agents working (represented as small boats on the water, each with a different colored flag). Lines of light connect the phone to the boats. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

> Part 5 of a series. Previously: [Exploring Copilot CLI Session Management](/blog/2026-04-15-session-storage-decision-guide), [When Session Data Lies](/blog/2026-04-16-when-session-data-lies), [Agent Coordination in Copilot CLI](/blog/2026-04-17-agent-coordination-copilot-sdk), and [Two Ways to Build Multi-Agent Systems](/blog/2026-04-17-choosing-multi-agent-patterns-copilot-sdk).

I saw Pamela Fox's LinkedIn post about Copilot CLI remote control and immediately wondered: does this work with custom agents? If I've built my own `.agent.md` — with its own system prompt, tool scoping, and domain expertise — can I steer it from my phone the same way I'd steer base Copilot?

The `--remote` flag launched April 13, 2026. I tested it with [Squad](https://github.com/bradygaster/squad), a custom agent that coordinates an entire AI team through a single `.agent.md` file. But the takeaways apply to any custom agent you've built.

Short answer: yes, it works. The interesting part is how to design your agent to take advantage of it.

## What `copilot --remote` Actually Does

The `--remote` flag streams your CLI session to GitHub in real time. You get a link and a QR code. Open either one on your phone — through GitHub.com or GitHub Mobile — and you're looking at the same session, fully interactive.

```bash
copilot --remote
```

From your phone you can:
- Send messages and steering commands
- Switch between plan, interactive, and autopilot mode
- Approve or deny permission requests
- Respond to `ask_user` prompts
- Stop the session entirely

Everything stays in sync. What you type on your phone shows up in the terminal. What the agent does in the terminal shows up on your phone. Each session is private to the GitHub account that started it.

## Setting It Up

### Prerequisites

1. **Update Copilot CLI** — run `/update` in an existing session, or install the latest version
2. **GitHub repository** — your working directory needs to be a GitHub repo (remote sessions use GitHub's infrastructure)
3. **GitHub Mobile beta** (optional) — for the best mobile experience, join [iOS TestFlight](https://testflight.apple.com/join/NLskzwi5) or [Google Play beta](https://play.google.com/apps/testing/com.github.android)
4. **Enterprise/Business users** — an admin needs to [enable remote control policies](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-remote-access#administering-remote-access)

### Starting a Remote Session with Your Custom Agent

If you have a custom agent installed — whether it's Squad, a code reviewer, a docs generator, or anything else in `.github/agents/` — it's just:

```bash
# Navigate to your repo with the custom agent
cd my-project

# Start Copilot CLI with remote enabled
copilot --remote
```

Your custom agent loads from `.github/agents/your-agent.agent.md` the same way it always does. The `--remote` flag doesn't change agent discovery or loading — it adds the streaming layer on top.

Once the session starts, you'll see something like:

```
Remote session enabled
https://github.com/your-name/your-repo/tasks/abc123

Press Ctrl+E to show QR code
```

Scan the QR code with your phone, or open the link in a browser. You're in.

### Selecting Your Custom Agent Remotely

When you open the session on your phone, you're in the default Copilot agent. To switch to your custom agent, use the `/agent` command:

```
/agent my-agent
```

Now everything you type goes through your agent's system prompt and tool scope. If your agent is Squad, that means talking to a coordinator that fans out work to specialists. If it's a code reviewer, it means getting reviews shaped by your `.agent.md` instructions. Whatever you built — it works the same from your phone.

### Always-On Remote

If you want every session to be remotely accessible, add this to `~/.copilot/config.json`:

```json
{
  "remoteSessions": true
}
```

Now `copilot` (without `--remote`) still enables remote access. Use `copilot --no-remote` when you want a purely local session.

## The Workflow: Start, Walk Away, Steer

Here's the pattern that makes remote + custom agents useful. I'll use Squad as the example, but the workflow applies to any long-running custom agent.

### 1. Start a long-running task from your desk

```bash
copilot --remote
/agent squad
```

> "Team, refactor the authentication module to use the new token service."

With Squad, this fans out to multiple agents working in parallel. With a simpler custom agent, it might be a single long-running task — a codebase migration, a comprehensive review, a test suite expansion. The point is: work that takes longer than you want to sit and watch.

### 2. Walk away

Your agent keeps working. You don't need to be watching.

Keep the machine awake:

```
/keep-alive busy
```

The `busy` option prevents sleep only while Copilot is actively working. Once agents finish and the session is idle, your machine can sleep normally. Other options: `on` (never sleep), `8h` (sleep after 8 hours), `off` (normal behavior).

### 3. Check in from your phone

Open GitHub Mobile. Tap **Copilot**. Your session is listed under "Agent sessions." Tap to open.

You can see what the agent has done and steer the next steps:

```
What's the status of the auth refactor?
```

Or redirect:

```
Skip the profile page changes — focus on the login form first.
```

With Squad, these messages go to the coordinator, which routes them to the right specialist agent. With a simpler custom agent, you're talking directly to it.

### 4. Approve permissions from anywhere

If an agent needs to run a command or access a tool that requires permission, the request shows up on your phone. Approve or deny right there — no need to walk back to your desk.

### 5. Resume from a different machine

If you shut down the session, Copilot gives you a resume command:

```bash
copilot --resume=SESSION_ID --remote
```

Pick up right where you left off, from any machine with access to the repo.

## Designing Your Custom Agent for Remote Use

If you're building a custom agent, here's what I've learned about how `--remote` interacts with agent features.

### What works seamlessly

- **Agent discovery** — `.github/agents/*.agent.md` files load the same way locally and remotely. No changes needed.
- **Skills** — `.copilot/skills/` are available in remote sessions.
- **Tool access** — all tools your agent uses (grep, view, edit, powershell) work through the remote connection.
- **`ask_user` prompts** — these render on the phone and the user can respond. This is huge for agents that need human decisions mid-task.
- **Permission requests** — approval/denial flows work from the mobile UI.
- **Session continuity** — `--resume` preserves your agent's full conversation history.

### What to think about

- **Session length** — mobile connections may be intermittent. Use `/keep-alive` to ensure the host machine stays awake. The agent keeps working whether your phone is connected or not.
- **Output volume** — agents that produce a lot of terminal output (long diffs, verbose logs) can be hard to read on a small screen. Consider how your agent formats output if you expect mobile use.
- **Interaction design** — `ask_user` with structured forms (enums, booleans, multi-select) is much more phone-friendly than free-text questions. If your agent uses `ask_user` with a `requestedSchema`, the form renders as selectable options. That's way better than typing on a phone keyboard.
- **One agent at a time** — the Copilot CLI loads one custom agent per session. You switch with `/agent`. You can't have two custom agents active simultaneously in the same session. (Squad works around this by managing its own sessions internally via the Copilot SDK — see [Two Ways to Build Multi-Agent Systems](/blog/2026-04-17-choosing-multi-agent-patterns-copilot-sdk) for that pattern.)

### The `ask_user` opportunity

This is the thing I'm most excited about for agent builders. Before `--remote`, `ask_user` was a blocking call — the agent stops and waits, and you'd better be at your keyboard. Now it's a push notification on your phone. Your agent can be working through a complex task, hit a decision point, send you a structured question, and you tap your answer while waiting for coffee.

Design your agents with this in mind:

```typescript
// Phone-friendly: structured choices
ask_user({
  message: "The auth refactor found 3 breaking changes. How should I handle them?",
  requestedSchema: {
    properties: {
      approach: {
        type: "string",
        title: "Migration approach",
        enum: ["Fix all callers now", "Add deprecation warnings", "Create compatibility shim"],
        default: "Add deprecation warnings"
      }
    },
    required: ["approach"]
  }
});
```

One tap vs. typing a paragraph on a phone keyboard. Think about this when you're designing agent interaction points.

## Real-World Example: Squad as a Remote Custom Agent

To make this concrete, here's how this plays out with [Squad](https://github.com/bradygaster/squad) — a custom agent that coordinates an entire AI team through a single `.agent.md` file.

Squad is a good stress test for `--remote` because it's one of the more complex custom agents out there. When you tell Squad to do something, it doesn't just execute — it fans out work to specialist agents (frontend, backend, tester, lead) running in parallel, chains follow-up tasks, and manages cross-agent decisions through shared files.

From your phone, that looks like:

```
> Team, refactor the authentication module.

🏗️ Flight — reviewing requirements, defining API contract
⚛️ EECOM — updating frontend auth components
🔧 CAPCOM — creating new token service endpoint
🧪 FIDO — writing test cases from requirements
📋 Scribe — logging decisions
```

You can check in later, approve permissions, redirect work, or ask for status — all from the mobile UI. The coordinator handles routing your messages to the right specialist.

Interestingly, Squad also built its own remote control (`squad start --tunnel` and `squad rc --tunnel`) before the platform feature existed, using devtunnel + WebSocket. Now that `copilot --remote` is native, the platform version is simpler for most cases — zero setup, GitHub account auth, proper mobile app. Squad's tunnel approach still has value for custom UIs or team-roster-aware interfaces, but for day-to-day use, `--remote` is the easier path.

## What I'd Like to See Next

A few things that would make remote + custom agents even better:

1. **Agent-specific notifications** — "Your agent is waiting for input" as a push notification, not just visible when you open the session.

2. **Quick actions** — pre-defined response buttons based on common `ask_user` patterns. "Approve all", "Review first", "Skip" as persistent buttons rather than typing commands.

3. **Multi-session dashboard** — custom agents like Squad manage multiple sessions internally. Surfacing all of them in one mobile view would make remote steering much more useful.

4. **Bandwidth-aware output** — agents could detect they're being viewed remotely and adjust verbosity. Summary on mobile, full diff on desktop.

5. **Offline queue** — let me type responses while offline and deliver them when connectivity returns. The agent could continue working on non-blocked tasks while my response is queued.

## The Bottom Line

`copilot --remote` turns any custom agent into a mobile-accessible tool. Whether it's a simple code reviewer or a complex multi-agent coordinator like Squad, the pattern is the same: start the task at your desk, walk away, steer from your phone.

The setup is one flag. The interesting work is designing your agent's interaction points to be phone-friendly. Structured `ask_user` prompts, concise status updates, and clear decision points make the difference between an agent you can actually steer from your phone and one that requires a full keyboard.

I started a Squad session from my desk and approved permission requests from Fairhaven Coffee. But the same workflow works with any custom agent — a migration tool, a review bot, a docs generator. If your agent does work that takes longer than you want to sit and watch, `--remote` is worth adding to your workflow.

---

*This is part of a series on building with the Copilot SDK. Remote sessions launched April 13, 2026 in public preview via `copilot --remote`. Custom agent support works today with `.github/agents/*.agent.md` files. [Squad](https://github.com/bradygaster/squad) is one example of a custom agent framework that works with `--remote` out of the box.*
