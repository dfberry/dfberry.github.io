---
slug: /2026-04-17-choosing-multi-agent-patterns-copilot-sdk
canonical_url: https://dfberry.github.io/blog/2026-04-17-choosing-multi-agent-patterns-copilot-sdk
custom_edit_url: null
sidebar_label: "2026-04-17 Choosing multi-agent patterns in Copilot SDK"
title: "Two Ways to Build Multi-Agent Systems in Copilot SDK — and When Each One Wins"
description: "The Copilot SDK gives you two patterns for multi-agent work: in-session agents and session-per-agent. I compared them side-by-side using Squad as the real-world example, and worked out when each pattern is the right call."
published: false
tags:
  - GitHub Copilot
  - AI agents
  - Copilot SDK
  - multi-agent patterns
  - Squad
keywords:
  - copilot sdk customAgents
  - session-per-agent pattern
  - multi-agent architecture
  - CustomAgentConfig
  - copilot cli custom agent
  - agent coordination patterns
updated: 2026-04-17 00:00 PST
---

# Two Ways to Build Multi-Agent Systems in Copilot SDK — and When Each One Wins

<!-- Bellingham prompt: A split-scene illustration of Bellingham Bay. Left side: a single fishing boat with multiple crew members swapping roles (one person puts down a net, picks up a radio). Right side: a fleet of separate boats spread across the bay, each with one specialist, all coordinating via radio tower on shore. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

> Part 4 of a series. Previously: [Exploring Copilot CLI Session Management](/blog/2026-04-15-session-storage-decision-guide), [When Session Data Lies](/blog/2026-04-16-when-session-data-lies), and [Agent Coordination in Copilot CLI](/blog/2026-04-17-agent-coordination-copilot-sdk).

I've been building with [Squad](https://github.com/bradygaster/squad) — an AI team framework built on top of Copilot CLI — and I kept bumping into an architectural question that I think every agent builder will eventually face: **when you need multiple agents, do you put them in the same session or give each one their own?**

The Copilot SDK supports both patterns. But it doesn't tell you when to pick which. So I dug in.

## The Two Patterns

The Copilot SDK (`@github/copilot-sdk`) gives you two fundamentally different ways to work with multiple agents. They look similar in config but behave very differently at runtime.

### Pattern 1: In-Session Agents (`customAgents[]`)

You pass an array of agent configurations when creating a session:

```typescript
const session = await client.createSession({
  customAgents: [
    {
      name: "security-reviewer",
      prompt: "You are a security expert. Review code for vulnerabilities...",
      tools: ["grep", "view", "glob"],
    },
    {
      name: "performance-reviewer",
      prompt: "You are a performance engineer. Analyze code for bottlenecks...",
      tools: ["grep", "view", "powershell"],
    },
  ],
});
```

The SDK provides RPC methods to switch between them:

```typescript
await session.agent.list();          // see available agents
await session.agent.select("security-reviewer");  // activate one
await session.agent.deselect();      // go back to default
```

What's happening under the hood: the platform swaps the system prompt and tool scope. The conversation history stays the same. It's one person switching between different instruction manuals — same desk, same memory, one task at a time.

The `CustomAgentConfig` interface is straightforward:

```typescript
interface CustomAgentConfig {
  name: string;
  displayName?: string;
  description?: string;
  tools?: string[] | null;    // null = all tools
  prompt: string;
  mcpServers?: Record<string, MCPServerConfig>;
  infer?: boolean;            // available for model inference
}
```

### Pattern 2: Session-Per-Agent

You create a separate session for each agent:

```typescript
const securitySession = await client.createSession({
  model: "claude-sonnet-4",
  systemMessage: {
    content: securityCharterPrompt,
  },
  tools: securityTools,
});

const performanceSession = await client.createSession({
  model: "claude-haiku-4.5",  // cheaper model for this task
  systemMessage: {
    content: performanceCharterPrompt,
  },
  tools: performanceTools,
});

// Run in parallel
const [securityResult, perfResult] = await Promise.allSettled([
  securitySession.send({ prompt: "Review this PR for vulnerabilities" }),
  performanceSession.send({ prompt: "Analyze this PR for bottlenecks" }),
]);
```

Each agent gets its own context window, its own model, its own conversation history. They're a team of people in separate offices who communicate through a shared whiteboard.

## What Squad Actually Does

Squad chose Pattern 2 — session-per-agent — and built an orchestration layer on top. Here's how it works concretely.

### The Adapter Layer

Squad imports exactly one thing from the Copilot SDK: the `CopilotClient` class. Everything else is wrapped behind an adapter:

| SDK Concept | Squad Wrapper | What Squad Adds |
|---|---|---|
| `CopilotClient` | `SquadClient` | Connection lifecycle, auto-reconnect, error recovery, OpenTelemetry tracing |
| `CopilotSession` | `CopilotSessionAdapter` → `SquadSession` | Event name normalization, unsubscribe tracking |
| `SessionConfig` | `SquadSessionConfig` | Stable interface that won't break when the SDK updates |

This adapter layer is a design decision worth noting. Squad mirrors the SDK's `CustomAgentConfig` type in its own `SquadCustomAgentConfig` — it's nearly a 1:1 copy — but uses it as a compilation target, not a runtime mechanism.

### Charter Compilation

Each Squad agent has a `charter.md` file that defines their identity, expertise, and boundaries. At spawn time, the charter compiler transforms this into a system prompt:

```
charter.md + team.md + routing.md + decisions.md
    → compileCharter()
    → SquadCustomAgentConfig { name, prompt, tools }
    → createSession({ systemMessage: { content: prompt } })
```

The charter isn't just a prompt — it includes team context (who else is on the team), routing rules (what work goes where), and active decisions (conventions the team has agreed on). Every agent starts with shared situational awareness.

### Session Lifecycle

Each agent goes through a managed lifecycle:

```
spawning → active → idle → error → destroyed
```

The `AgentLifecycleManager` handles:
- **Spawning**: charter compilation → model selection → session creation → initial task
- **Model selection**: per-agent, based on task type (a reviewer might get a different model than a coder)
- **Session pool**: max 10 concurrent sessions, 5-minute idle timeout, 30-second health checks
- **Error isolation**: one agent crashing doesn't take down others
- **Parallel execution**: `Promise.allSettled()` so failures don't short-circuit the batch

### Cross-Agent Communication

Since agents can't see each other's conversations, Squad uses two mechanisms:

1. **Shared files**: `decisions.md`, agent `history.md` files, orchestration logs — all committed to git with `merge=union` strategy so branches combine cleanly
2. **EventBus**: real-time event aggregation across all sessions, giving the coordinator visibility into what every agent is doing

This is the most important difference from the SDK pattern. In-session agents share context implicitly (same conversation). Session-per-agent systems need explicit communication channels.

## Side-by-Side Comparison

| Dimension | In-Session (`customAgents[]`) | Session-Per-Agent |
|---|---|---|
| **Context** | Shared — all agents see the full conversation | Isolated — each agent has private history |
| **Parallelism** | None — one agent active at a time | Full — agents work simultaneously |
| **Models** | Same model for all agents in the session | Different model per agent |
| **Failure** | One failure affects the whole session | Failures are isolated |
| **Communication** | Implicit (shared conversation) | Explicit (files, events, messages) |
| **Context limits** | Shared window fills up fast with many agents | Each agent manages its own limits |
| **Overhead** | Low — just config on session creation | Higher — session pool, event bus, lifecycle management |
| **Resume** | One session to resume | Multiple sessions to track and resume |

## When Each Pattern Wins

### Use In-Session Agents When...

**Agents share context and take turns.** The key signal is that each agent needs to see what the previous one said or did.

**Persona switching.** "Explain this code like I'm a beginner" → "Now review it as a security expert." The security expert benefits from seeing the beginner explanation — it reveals which parts the user found confusing.

**Guided workflows.** A multi-stage wizard where each stage builds on the last: gather requirements → generate code → review the generated code. Stage 3 needs the full history of stages 1 and 2. Breaking these into separate sessions means re-explaining everything.

**Specialized lenses.** Different ways to look at the same artifact in a single conversation. A documentation writer and a code reviewer analyzing the same PR — the reviewer's comments inform what the writer emphasizes.

**Lightweight delegation.** "Ask the SQL expert about this query" as a quick sub-task within a larger conversation. The SQL expert sees the surrounding context, answers, and you continue.

**Chatbot personalities.** A support bot that can switch between friendly, technical, and escalation modes. Same conversation, different tone. The `infer` flag on `CustomAgentConfig` is designed for exactly this.

The pattern: **one conversation, multiple perspectives.** Low overhead. Shared memory is a feature, not a limitation.

### Use Session-Per-Agent When...

**Agents work independently and need isolation.** The key signal is that agents would get in each other's way if they shared context.

**Parallel workstreams.** Frontend, backend, and test code being written simultaneously. These don't need to see each other's chain-of-thought — they need to see each other's *output* (the actual files). Running them in parallel cuts wall-clock time proportionally.

**Different model needs.** A cheap fast model for linting and formatting. An expensive reasoning model for architecture decisions. A code-generation model for implementation. The SDK's `customAgents[]` uses one model for all of them — session-per-agent lets you right-size.

**Long-running tasks.** One agent doing a 30-minute codebase refactor shouldn't block another from answering a quick question about the README. Separate sessions mean separate timelines.

**Adversarial review.** A code reviewer shouldn't see the author's reasoning process — just the code. Shared context would leak intent, making the review less independent. Squad's reviewer lockout protocol depends on this isolation.

**Failure isolation.** If one agent hits a rate limit, runs out of context, or crashes, the others keep working. In a shared session, one agent's failure can corrupt the conversation for everyone.

**Scale.** Ten agents sharing one context window would burn through tokens fast — each agent's output becomes input for the next. Ten separate sessions means ten independent context budgets.

The pattern: **multiple conversations, coordinated outcomes.** More infrastructure to build, but each agent is autonomous.

## The Gray Area

Some scenarios genuinely could go either way. Here's how I'd decide:

| Scenario | In-Session | Session-Per-Agent | Deciding Factor |
|---|---|---|---|
| Code review + apply fix | ✅ Reviewer sees code, fixer sees feedback | ✅ Blind review before revealing intent | Do you want independent review? |
| Q&A with domain experts | ✅ Quick switching, shared thread | ✅ Experts need deep independent research | How deep does each expert need to go? |
| Multi-file refactor | Stretches one context fast | ✅ Parallelize across files | How many files? |
| Chatbot with modes | ✅ Natural fit, shared conversation | Overkill for mode switching | Is it really "agents" or just prompt switching? |
| Document generation | ✅ If sequential (outline → draft → edit) | ✅ If parallel (each chapter independently) | Sequential or parallel? |
| CI/CD pipeline agents | One agent can't block while another runs | ✅ Each stage runs independently | Always session-per-agent |

**The deciding question: Do the agents need to see each other's thinking, or just each other's output?**

- If **thinking** → in-session agents (shared context is the point)
- If **output** → session-per-agent (isolation is the point)

## What's Missing from the SDK for Both Patterns

Having built with both (well, having studied both — Squad built the session-per-agent side), there are gaps:

### For In-Session Agents
- **No agent-to-agent messaging.** Agent A can't say "hey agent B, what do you think?" — only the user or coordinator can switch agents. There's no `agent.delegateTo("other-agent", message)`.
- **No agent memory boundaries.** When you switch agents, the new agent sees everything. Sometimes you want compartmentalization within a shared session.
- **No lifecycle hooks per agent.** `SessionHooks` fire for the session, not per-agent. You can't run custom logic when switching *to* a specific agent.

### For Session-Per-Agent
- **No built-in coordination primitive.** The SDK gives you sessions. Everything else — pools, event buses, shared state, lifecycle management — is yours to build. Squad built all of this.
- **No cross-session context sharing.** If agent A discovers something agent B needs, there's no SDK-level mechanism to share it. Squad uses git-committed files. Others might use a database or message queue.
- **No session grouping.** You can't tell the SDK "these 5 sessions are part of one logical task." Each session is independent. The coordinator pattern is entirely user-space.

### For Agent Builders in General
- **No standard charter format.** Squad invented `.charter.md` with specific sections (identity, expertise, boundaries). There's no SDK convention for this. Every framework will invent its own.
- **No agent discovery.** The `customAgents[]` array is static at session creation. There's no dynamic "find me an agent that can handle X" mechanism.
- **No cost attribution per agent.** Token usage is per-session. For in-session agents, you can't easily attribute cost to each agent's turns.

## What I'd Build Next

If I were starting a multi-agent system on Copilot SDK today, here's the decision tree I'd follow:

```
Do agents need shared conversation context?
├── Yes → Use customAgents[]
│   └── Do they need to run in parallel?
│       ├── No → You're done, customAgents[] is perfect
│       └── Yes → You need session-per-agent despite the context need
│           (copy relevant context between sessions explicitly)
│
└── No → Use session-per-agent
    └── How many agents?
        ├── 2-3 → Simple Promise.allSettled(), lightweight
        ├── 4-10 → Build a session pool with health checks
        └── 10+ → You need an event bus and probably a queue
```

And regardless of pattern, I'd build the adapter layer first. Squad's approach of wrapping `CopilotClient` behind stable interfaces saved them from SDK breaking changes. The SDK is pre-1.0 and moving fast — your agent code shouldn't have to move with it.

## The Bottom Line

The Copilot SDK gives you the building blocks for both patterns. `customAgents[]` is the quick path when agents share a conversation. Session-per-agent is the scalable path when agents need autonomy. The SDK doesn't push you toward either one — which is both its strength (flexibility) and its gap (no guidance).

Squad chose session-per-agent because its agents are autonomous specialists who need to work in parallel, use different models, and review each other's work without seeing each other's reasoning. That's the right call for a team simulation. If I were building a conversational assistant that occasionally calls on specialists, I'd start with `customAgents[]` and only graduate to session-per-agent when I hit the walls.

The walls, when you hit them, are always the same: parallelism, isolation, or model diversity. If you need any of those, you need separate sessions. If you don't, keep it simple.

---

*This is part of a series on building with the Copilot SDK. The patterns here are based on `@github/copilot-sdk@^0.1.32` and [Squad](https://github.com/bradygaster/squad) — both are pre-1.0 and evolving. The architectural tradeoffs, though, will outlast any specific API shape.*
