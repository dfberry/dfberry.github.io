---
slug: /2026-04-17-agent-coordination-copilot-sdk
canonical_url: https://dfberry.github.io/blog/2026-04-17-agent-coordination-copilot-sdk
custom_edit_url: null
sidebar_label: "2026-04-17 Agent coordination in Copilot SDK"
title: "Agent Coordination in Copilot CLI: What Custom Agents Like Squad Actually Are"
description: "I dug into what a 'custom agent' really means in Copilot CLI, how the SDK handles multiple agents, and what's possible — and missing — for agent builders."
published: false
tags:
  - GitHub Copilot
  - AI agents
  - Copilot SDK
  - agent coordination
  - Squad
keywords:
  - copilot cli custom agent
  - copilot sdk multiple agents
  - agent coordination patterns
  - multi-agent copilot
  - CustomAgentConfig
updated: 2026-04-17 00:00 PST
---

# Agent Coordination in Copilot CLI: What Custom Agents Like Squad Actually Are

<!-- Bellingham prompt: A harbor master's office on Bellingham Bay with a dispatch board showing boat assignments — each boat has a different specialty (crab, salmon, research vessel). Lines connect them to different zones on the water. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

> Part 3 of a series. Previously: [Exploring Copilot CLI Session Management](/blog/2026-04-15-session-storage-decision-guide) and [When Session Data Lies](/blog/2026-04-16-when-session-data-lies).

## The Question

I've been using [Squad](https://github.com/bradygaster/squad), an AI team framework built on top of Copilot CLI, and I realized I didn't fully understand *what Squad actually is* from Copilot's perspective. Is it a plugin? An extension? A session with a long system prompt? And when Squad spawns its team members — a lead, a tester, a backend dev — are those separate agents in Copilot's eyes, or just one agent pretending to be many?

I went digging into the Copilot SDK to find out. What I found has implications for anyone building agents on top of Copilot.

## Outline

### 1. What Is a Custom Agent in Copilot CLI?

**The file-based path:** Drop a `.github/agents/{name}.agent.md` file in your repo. It has YAML frontmatter (name, description) and a markdown body that becomes the system prompt. That's it — Copilot loads it automatically. Squad's entire coordinator is a single 84KB markdown file at `.github/agents/squad.agent.md`.

**The SDK path:** The `CustomAgentConfig` interface defines an agent programmatically:

```typescript
interface CustomAgentConfig {
  name: string;
  displayName?: string;
  description?: string;
  tools?: string[] | null;    // which tools this agent can use
  prompt: string;             // the system prompt
  mcpServers?: Record<string, MCPServerConfig>;  // agent-specific MCP servers
  infer?: boolean;            // available for model inference
}
```

**Key insight:** A custom agent is really just a named system prompt + a tool/MCP scope. There's no special runtime, no container, no sandboxing. The agent IS the prompt. Everything else — coordination, memory, boundaries — is up to you.

### 2. One Agent at a Time? What the CLI Actually Does

In the Copilot CLI TUI, it *appears* you can only use one agent at a time. You `@squad` to activate it, and Squad takes over. But the SDK tells a more nuanced story.

**The SDK exposes agent-switching RPC methods:**

```typescript
session.rpc.agent.list()        // list available agents
session.rpc.agent.getCurrent()  // which agent is active
session.rpc.agent.select(...)   // switch to a different agent
session.rpc.agent.deselect()    // go back to default
```

And `SessionConfig` accepts an **array** of agents:

```typescript
const session = await client.createSession({
  customAgents: [agentA, agentB, agentC],  // all loaded, one active
  onPermissionRequest: approveAll,
});
```

**So the platform supports multiple agents per session** — you register several, and the active one determines the system prompt and tool scope. The CLI TUI just doesn't expose the switching UI.

### 3. How Squad Does Multi-Agent: The Two Patterns

Squad doesn't use the `customAgents[]` array to load its team. Instead, it uses a fundamentally different pattern — **one Copilot session per team member.**

**Pattern A — Agent switching (SDK built-in):**
- Register multiple agents in one session
- Switch between them with `agent.select()`
- Shared context window, shared conversation history
- Like rotating who's at the helm of one boat

**Pattern B — Session-per-agent (Squad's approach):**
- Coordinator creates separate `CopilotClient.createSession()` calls per agent
- Each agent gets its own system prompt (compiled from their charter)
- Each has its own context window, own conversation history
- Parallel execution via `Promise.allSettled()`
- Like a fleet of specialist boats, each dispatched to different waters

**Why Squad chose Pattern B:**
- **Isolation** — a tester's context doesn't pollute the developer's context
- **Parallelism** — agents work simultaneously, not sequentially
- **Charter boundaries** — each agent's system prompt is their entire worldview
- **Error isolation** — one agent crashing doesn't take down the others

Squad wraps this in a `SessionPool` (max 10 concurrent, 5-min idle timeout, 30-sec health checks) and an `EventBus` that gives the coordinator visibility across all running sessions.

### 4. How Different Charters Produce Better Outcomes

This is the part that surprised me. Squad's agents aren't just "the same model with different titles." Their charters fundamentally change what they notice, what they produce, and what they challenge.

**Examples from real Squad interactions:**

- **A tester agent** catches edge cases a developer agent didn't consider — not because it's smarter, but because its charter says "think about what could go wrong" while the developer's says "make it work"
- **A docs agent** forces clearer API design — it can't explain a confusing interface, so it pushes back, and the design improves
- **A lead agent** notices architectural drift across multiple agents' outputs because its charter scopes it to "coherence across the whole system"

**The mechanism:** Each agent reads `.squad/decisions.md` before starting (shared team memory), but interprets its task through its charter's lens. Same information, different perspective. The charter acts as a cognitive filter — constraining what the agent pays attention to.

**What this means for agent builders:** The value isn't in having more agents. It's in having agents with *different cognitive scopes*. A system prompt that says "you are a security reviewer" produces genuinely different analysis than one that says "you are a performance engineer" — even on the same code, same model, same context.

### 5. What the SDK Gives You (and What's Missing)

**What's there — building blocks for coordination:**

| SDK Primitive | What it enables | How Squad uses it |
|---|---|---|
| `customAgents[]` | Multiple named agents per session | Not used — Squad prefers session-per-agent |
| `SystemMessageConfig` | Append or replace system prompts | Charter compilation per agent |
| `SessionHooks` | Pre/post tool use, session start/end, error handling, prompt interception | Governance layer (file guards, PII scrub, rate limits) |
| `Tool` registration | Custom tools with typed handlers | Agent-specific tool scoping |
| `mcpServers` per agent | Agent-specific external tool servers | Not yet used — opportunity |
| `InfiniteSessionConfig` | Auto-compaction for long sessions | Context management for long-running agents |
| `session.getMessages()` | Full event history of a session | Could enable cross-agent learning (not used today) |
| `client.listSessions()` | Browse/filter all sessions | Session pool management |

**What's missing — gaps I see for agent builders:**

1. **No agent-to-agent messaging.** Agents can't send messages to each other. Squad works around this with shared files (decisions.md, history.md), but there's no SDK primitive for "Agent A wants to tell Agent B something." You have to build your own mailbox.

2. **No shared tool state across sessions.** If Agent A's tool call produces data that Agent B needs, there's no built-in way to pass it. Squad uses the filesystem. The SDK could offer a shared key-value store scoped to a session group.

3. **No cross-session event streaming.** The SDK's `session.on()` only covers events within ONE session. Squad built its own `EventBus` to aggregate events across agent sessions. A built-in cross-session event subscription would make coordination much easier.

4. **No agent composition primitives.** You can't say "run Agent A, then feed its output to Agent B" declaratively. Squad's coordinator handles this imperatively in code. A pipeline/workflow abstraction would help.

5. **No charter-aware routing.** The SDK has no concept of "which agent is best suited for this task." Squad builds this with `routing.md` rules compiled into regex patterns. An SDK-level capability-matching system (agents declare capabilities, platform routes by match) would reduce boilerplate.

6. **No agent identity across sessions.** When Squad's tester agent runs in session X and then again in session Y, those are unrelated sessions from the SDK's perspective. There's no "this is the same agent, continuing its work." Squad tracks this in its own registry. The SDK could support named agent instances with persistent identity.

### 6. What I'd Tell an Agent Builder

If you're building a custom agent on Copilot CLI today:

**Start simple:** One `.agent.md` file gets you surprisingly far. Squad's entire coordinator — routing, casting, governance, memory — is a single markdown file. Don't over-engineer the agent registration.

**Choose your session model early:**
- **Single session + agent switching** — simpler, shared context, good for agents that take turns
- **Session-per-agent** — isolated, parallel, better for agents that work simultaneously on different things

**Invest in the charter, not the plumbing.** The biggest quality difference comes from well-scoped system prompts, not from clever orchestration. A tester agent with a great charter outperforms a generic agent with a sophisticated tool chain.

**Use hooks for governance, not coordination.** `SessionHooks` are great for guardrails (block dangerous tool calls, scrub PII, rate-limit). They're not designed for agent-to-agent communication — use shared state for that.

**Build your own coordination layer.** The SDK gives you sessions, tools, hooks, and events within a session. Everything above that — routing, shared memory, cross-agent communication, identity — is yours to build. Squad's ~15K lines of SDK code are mostly this coordination layer.

**Watch for platform evolution.** The `agent.list()`/`agent.select()` RPC methods and `customAgents[]` config suggest the platform is thinking about multi-agent scenarios. Features like cross-session events, agent pipelines, and capability-based routing may be coming. Build your coordination layer so it can delegate to the platform when those primitives arrive.

## The Bottom Line

<!-- Bellingham prompt: The fleet of specialist boats from the hero image now returning to harbor, each carrying different catch, the harbor master checking them in. Same palette, same style. -->

A custom agent in Copilot CLI is simpler than it looks — it's a named system prompt with a tool scope. The SDK gives you enough to build coordination on top (sessions, tools, hooks, events), but coordination itself is your responsibility. Squad's approach — session-per-agent with charter-driven specialization and file-based shared memory — is one valid pattern. It won't be the only one.

The most underappreciated part: **different charters produce genuinely different analysis.** Not because the model changes, but because the prompt changes what it pays attention to. That's the real value of multi-agent coordination — not parallelism, not scale, but *cognitive diversity applied to the same problem.*

<!-- Topics for expansion: benchmark charter diversity vs single-agent on real tasks, compare Pattern A vs Pattern B tradeoffs with data, explore MCP-per-agent for specialized tool access, investigate agent.select() for lightweight multi-agent without session overhead -->
