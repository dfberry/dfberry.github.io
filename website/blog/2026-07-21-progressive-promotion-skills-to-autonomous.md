---
slug: /2026-07-21-progressive-promotion-skills-to-autonomous
date: 2026-07-21
canonical_url: https://dfberry.github.io/blog/2026-07-21-progressive-promotion-skills-to-autonomous
custom_edit_url: null
sidebar_label: "2026.07.21 Progressive promotion"
title: "From Natural Language to Autonomous Actions: A Progressive Promotion Model"
description: "Build AI automation that starts as a cheap skill, hardens into an MCP tool, then promotes to autonomous agent—without rewriting anything at each stage. A practical architecture for cost-effective AI pipelines."
tags:
  - AI
  - Architecture
  - Copilot CLI
  - MCP
  - Skills
  - Agents
  - Automation
keywords:
  - progressive promotion model
  - ai automation lifecycle
  - mcp tools
  - copilot skills
  - autonomous agents
  - prompt caching
  - ai cost optimization
  - skill to agent pipeline
  - model context protocol
  - copilot cli autonomous
  - ai development lifecycle
  - determinism extraction
---

<!-- Watercolor image prompt (hero):
"Watercolor illustration, warm earth tones, soft peach and cream palette.
A pink-haired girl sitting at a workbench with five nesting matryoshka dolls
in front of her, each progressively larger. The smallest doll is labeled with
a tiny scroll (skill), the next has gears visible inside (MCP), the next has
small legs as if it can walk on its own (agent), and the largest has wings
and is lifting off the table (autonomous). Warm lamplight, scattered papers
and tools on the desk, soft watercolor washes, gentle ink outlines."
-->

![A pink-haired girl examining nesting dolls that grow from a small scroll to a winged figure, watercolor illustration](./media/2026-07-21-progressive-promotion-skills-to-autonomous/watercolor-01-hero.png)

I built forty skills that worked. Then I realized they were all dead ends.

Each skill had a script inside it that did real work—calling APIs, generating reports, creating pull requests. The scripts were good. The problem was where they lived: locked inside one skill, invisible to everything else, with no way to reuse them or let them run on their own.

This post documents the architecture I landed on: a progressive promotion model where work starts as a natural language skill, hardens into typed MCP tools, and promotes to fully autonomous execution—without rewriting anything at each stage.

---

## The mistake I kept making

The natural development path felt right:

1. Write a skill (natural language instructions for the LLM)
2. Notice that part of the skill is deterministic (same inputs → same outputs every time)
3. Extract that logic into a script inside the skill
4. Done

Step 4 is the mistake. The script works, but it is trapped. No other skill can call it. No agent can use it. No CI pipeline can run it. If I want the same logic somewhere else, I copy-paste.

After forty skills, I had forty isolated scripts with no typed contracts, no shared interfaces, and no way to promote any of them to autonomous execution.

<!-- Watercolor image prompt (dead-end):
"Watercolor illustration, warm earth tones, soft peach and cream palette.
A pink-haired girl standing at a crossroads in a garden. The left path leads
to a stone wall covered in vines (dead end). The right path opens to a
rolling landscape with a distant village. She's looking at the wall, holding
a small box (a script). At her feet are many identical small boxes stacked
up against the wall. Warm lamplight filtering through trees, soft watercolor
washes, gentle ink outlines."
-->

![A pink-haired girl at a garden crossroads, with boxes stacked against a dead-end wall, watercolor illustration](./media/2026-07-21-progressive-promotion-skills-to-autonomous/watercolor-02-dead-end.png)

## The four layers

The fix is to put each concern in its own layer:

| Layer | What it does | Who uses it |
|-------|-------------|-------------|
| **Script** | The actual logic (API calls, file operations, data transforms) | Everything below |
| **MCP tool** | Typed interface around the script (JSON input → JSON output) | Skills, agents, CI, other tools |
| **Skill** | Natural language orchestration (when to call which tool, in what order) | Human-driven sessions |
| **Agent** | Autonomous driver (same skill logic, but it decides when to run) | Cron, webhooks, event triggers |

The script is the logic. The MCP tool is the interface. The skill is the orchestration. The agent is the driver.

```mermaid
%%{init: { "theme": "base", "themeVariables": { "fontFamily": "Inter, ui-sans-serif", "primaryColor": "#f5e6d3", "primaryTextColor": "#3d2817", "primaryBorderColor": "#d4896b", "lineColor": "#c9956b", "secondaryColor": "#fdf4e8", "tertiaryColor": "#f9ead8", "background": "#fef9f5" } } }%%
graph TD
    A["📜 Script<br/><i>The logic</i>"] --> B["🔧 MCP Tool<br/><i>Typed interface</i>"]
    B --> C["💬 Skill<br/><i>Orchestration</i>"]
    B --> D["🤖 Agent<br/><i>Autonomous driver</i>"]
    B --> E["⚙️ CI/CD<br/><i>No LLM needed</i>"]

    style A fill:#f9ead8,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style B fill:#f5e6d3,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style C fill:#fdf4e8,stroke:#b8836f,stroke-width:3px,color:#3d2817
    style D fill:#fdf4e8,stroke:#b8836f,stroke-width:3px,color:#3d2817
    style E fill:#fdf4e8,stroke:#b8836f,stroke-width:3px,color:#3d2817
```

Build the script once. Wrap it in a typed tool once. Then change only the driver as you promote from interactive to autonomous.

---

## How work naturally evolves

I did not start with this architecture. I watched the pattern emerge across dozens of skills and then named it.

### Phase A: Exploration

A new skill starts with the LLM doing everything inline. The instructions say something like "query the GitHub API for recent releases, then compare against our changelog." The LLM reasons through each step. It works, but it is slow and expensive—because the LLM is re-deriving the same logic every time.

### Phase B: Determinism emerges

After a few runs, I notice: step 2 is always the same. Same API call, same parsing, same output format. The LLM is not adding judgment here. It is following a mechanical procedure.

This is the signal. When you catch yourself writing the same tool calls and parsing steps into skill instructions for the third time, you are looking at determinism that should be extracted.

### Phase C: Extract to MCP (not script-in-skill)

This is the key decision point. The deterministic logic becomes a typed MCP tool—not a script inside the skill.

```mermaid
%%{init: { "theme": "base", "themeVariables": { "fontFamily": "Inter, ui-sans-serif", "primaryColor": "#f5e6d3", "primaryTextColor": "#3d2817", "primaryBorderColor": "#d4896b", "lineColor": "#c9956b", "secondaryColor": "#fdf4e8", "tertiaryColor": "#f9ead8", "background": "#fef9f5" } } }%%
graph LR
    subgraph "❌ Wrong path"
        W1["Skill"] --> W2["Script-in-skill"] --> W3["Trapped forever"]
    end
    subgraph "✅ Right path"
        R1["Skill"] --> R2["Script"] --> R3["MCP Tool"] --> R4["Skill calls tool"]
    end

    style W1 fill:#f9ead8,stroke:#d4896b,stroke-width:2px,color:#3d2817
    style W2 fill:#f9ead8,stroke:#d4896b,stroke-width:2px,color:#3d2817
    style W3 fill:#fef9f5,stroke:#b8836f,stroke-width:2px,color:#4a3428
    style R1 fill:#f5e6d3,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style R2 fill:#f5e6d3,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style R3 fill:#f5e6d3,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style R4 fill:#f5e6d3,stroke:#d4896b,stroke-width:3px,color:#3d2817
```

The skill now says "call `detect_releases`" instead of embedding the detection logic. The tool has a JSON input schema, a JSON output schema, and error handling. It is independently testable. Any consumer—another skill, an agent, a CI pipeline—can call it.

### Phase D: Promote to agent

When the skill has run reliably for a while and I want it to run without me, I promote it. The agent uses the same MCP tools. The only difference is who drives: me (interactive) or the agent (autonomous).

```mermaid
%%{init: { "theme": "base", "themeVariables": { "fontFamily": "Inter, ui-sans-serif", "primaryColor": "#f5e6d3", "primaryTextColor": "#3d2817", "primaryBorderColor": "#d4896b", "lineColor": "#c9956b", "secondaryColor": "#fdf4e8", "tertiaryColor": "#f9ead8", "background": "#fef9f5" } } }%%
graph TB
    subgraph MCP["🔧 MCP Server (built once)"]
        T1["detect_releases"]
        T2["generate_metadata"]
        T3["analyze_impact"]
    end

    subgraph Interactive["💬 Phase C: Skill drives"]
        S["You say: 'sync releases'"]
        S --> T1
        T1 --> T2
        T2 -->|"⏸ You approve PRs"| T3
    end

    subgraph Autonomous["🤖 Phase D: Agent drives"]
        AG["Cron: daily 8am"]
        AG --> T1
        T1 --> T2
        T2 -->|"📱 Teams notification"| T3
    end

    style MCP fill:#fef9f5,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style Interactive fill:#fef9f5,stroke:#b8836f,stroke-width:2px,color:#3d2817
    style Autonomous fill:#fef9f5,stroke:#b8836f,stroke-width:2px,color:#3d2817
    style T1 fill:#f5e6d3,stroke:#d4896b,stroke-width:2px,color:#3d2817
    style T2 fill:#f5e6d3,stroke:#d4896b,stroke-width:2px,color:#3d2817
    style T3 fill:#f5e6d3,stroke:#d4896b,stroke-width:2px,color:#3d2817
    style S fill:#fdf4e8,stroke:#b8836f,stroke-width:2px,color:#3d2817
    style AG fill:#fdf4e8,stroke:#b8836f,stroke-width:2px,color:#3d2817
```

The MCP server does not change. The tools do not change. The scripts do not change. Only the driver changes.

---

## Why MCP tools instead of scripts-in-skills

The decision to extract into MCP rather than keep scripts inside skills comes down to three things:

### Reusability

A script inside `echo-release-detection/scripts/detect.ps1` is only callable by the echo-release-detection skill. An MCP tool called `detect_releases` is callable by any skill, any agent, any CI pipeline, and any future tool that speaks the MCP protocol.

### Typed contracts

A script takes string arguments from a shell command. An MCP tool has a JSON input schema and a JSON output schema. The LLM knows exactly what to send and what to expect back. No parsing surprises.

### Prompt caching

This is the cost argument that started this whole investigation. Burke Holland's [prompt caching video](https://www.youtube.com/watch?v=TYOhNRp5n7Y) made the math clear: MCP tool definitions live in the system prompt prefix and get cached at a 50-90% discount. Agent spawns create fresh uncached context windows every time.

| What | Token cost | Cache behavior |
|------|-----------|----------------|
| Skill instructions | ~0 (loaded on invocation) | Part of system prompt (cached) |
| MCP tool definitions | ~400-1600 (when enabled) | Part of system prompt (cached) |
| Agent spawn | ~10-25K per invocation | Fresh context window (uncached) |

Building determinism as MCP tools instead of agent spawns makes the system cheaper by 90%+ per invocation.

---

## The decision point

When you find yourself writing a script inside a skill, ask one question:

> Will anything other than this skill ever need to call this logic?

- If **yes** → MCP tool immediately
- If **maybe someday** → MCP tool (you will thank yourself later)
- If **truly never** (one-off, will be deleted) → script-in-skill is fine

For my portfolio of forty skills, the answer was almost always yes.

---

## What promotion looks like in practice

I have a content pipeline called Echo that detects new SDK releases, generates documentation metadata, and produces content impact reports. It ran as a Squad agent—a fresh ~25K token context window every invocation.

After extracting to MCP + skill:

| Before (agent) | After (skill + MCP) |
|----------------|-------------------|
| ~25K uncached tokens | ~1-2K uncached tokens |
| Squad coordinator + agent spawn | Skill in cached system prompt |
| Two context windows | Zero new context windows |
| Scripts locked in agent | Tools callable by anything |

The scripts did not change. The structured output envelopes they already produced turned out to be valid MCP tool responses—same JSON schema, different transport.

```
Before:  Script → JSON file → next skill reads file from disk
After:   Script → JSON → MCP protocol → any consumer receives it directly
```

That was an accidental validation. I had already built toward MCP without knowing it. The structured-output spec I wrote a month earlier was the MCP response contract.

---

## The cost model across stages

<!-- Watercolor image prompt (cost ladder):
"Watercolor illustration, warm earth tones, soft peach and cream palette.
A pink-haired girl climbing a spiral staircase in a tower. Each landing has
a different scene: the bottom landing shows her talking to a small glowing
orb (interactive), the middle landing shows the orb walking on its own
with small legs (autonomous), and the top landing shows the orb has
transformed into a bird flying out an open window (CI/CD). The staircase
has price tags hanging from the railings, getting smaller as she climbs
higher. Warm lamplight through tower windows, soft watercolor washes."
-->

![A pink-haired girl climbing a tower staircase with price tags getting smaller at each level, watercolor illustration](./media/2026-07-21-progressive-promotion-skills-to-autonomous/watercolor-03-cost-ladder.png)

Each promotion stage changes the driver but keeps the same tools. The cost changes because the driver changes:

| Stage | Per-run cost | Who drives | What changes |
|-------|-------------|-----------|-------------|
| **Skill + MCP** | ~1-2K uncached tokens | You, interactively | Cheapest. Tools cached. Only I/O is new. |
| **Agent + MCP** | ~5-10K uncached tokens | Agent, autonomously | Agent charter is a fresh window, but tools stay cached. |
| **CI/CD** | 0 tokens | GitHub Action | No LLM at all for deterministic steps. |
| **Agent spawn (old way)** | ~25K uncached tokens | Squad coordinator | Two fresh windows every time. Expensive. |

The progression is not just about autonomy. It is also about cost reduction. As work hardens, it needs less LLM reasoning per run, until the final stage needs no LLM at all.

---

## Context occupation: the hidden cost of MCP

MCP tools are cheap per-token (cached), but they occupy context window space every turn they are enabled—even when unused. A 4-tool server adds ~600-1600 tokens to every conversation.

The fix is grouping and toggling:

| Strategy | How it works |
|----------|-------------|
| **Group by workflow** | Combine related tools into one server (`content-pipeline-mcp` for all content tools) |
| **Toggle per task** | Enable the server when doing content work, disable when doing email |
| **Skill as entry point** | The skill reminds you to enable the MCP if it is off |

The optimal architecture: **skill triggers workflow** (zero idle cost) → **skill activates MCP tools** (cost only when needed) → **tools do I/O** (cheap cached calls). The skill justifies the MCP's presence.

---

## Running autonomously with Copilot CLI

Once a skill is promoted to an agent, I need to run it without a human session. Copilot CLI supports this today:

```bash
# Simplest autonomous run
copilot -p "Run the echo pipeline" --yolo --silent

# With specific agent and model
copilot -p "Execute" \
  --agent echo-pipeline \
  --autopilot --no-ask-user \
  --yolo --silent \
  --model gpt-4o

# Sealed sandbox: only specific tools available
copilot -p "Sync releases" \
  --additional-mcp-config @workflows/echo-sync/mcp-config.json \
  --available-tools='content-pipeline-mcp/*' \
  --no-ask-user --autopilot --silent
```

The key flags:

| Flag | What it does |
|------|-------------|
| `-p "prompt"` | Non-interactive mode (exits after completion) |
| `--agent name` | Use a specific `.agent.md` file |
| `--autopilot` | Agent continues without asking permission |
| `--no-ask-user` | Disable all user questions |
| `--yolo` | Approve all tools, paths, and URLs |
| `--available-tools='...'` | Only these tools exist (sealed sandbox) |
| `--silent` | Output only the agent's response |

For CI/CD, authenticate with a fine-grained PAT:

```bash
COPILOT_GITHUB_TOKEN=github_pat_xxx copilot -p "Run pipeline" \
  --agent echo-pipeline --yolo --silent --no-auto-update
```

---

## The sealed sandbox

<!-- Watercolor image prompt (sandbox):
"Watercolor illustration, warm earth tones, soft peach and cream palette.
A pink-haired girl placing a small clockwork automaton inside a glass bell
jar on her desk. Inside the jar are exactly three small tools laid out
neatly. Outside the jar, the desk is covered with dozens of other tools
and gadgets, but the jar has a clear boundary. The automaton inside is
reaching for one of the three tools. A small card next to the jar reads
'SEALED'. Warm lamplight, soft watercolor washes, gentle ink outlines."
-->

![A pink-haired girl placing an automaton inside a sealed glass bell jar with exactly three tools, watercolor illustration](./media/2026-07-21-progressive-promotion-skills-to-autonomous/watercolor-04-sandbox.png)

When something runs autonomously, the context must be fully specified at launch and immutable during execution. The agent gets exactly the tools it needs—nothing more, nothing less.

A sealed sandbox manifest specifies:

1. **Identity** — who the agent is
2. **Available tools** — exhaustive list (nothing else exists)
3. **Execution plan** — exact steps, no deviation
4. **Error handling** — complete rules, no improvisation
5. **Output routing** — where results go
6. **Boundaries** — hard constraints (violation = immediate exit)

Copilot CLI implements this through `--available-tools` and the `"tools"` allowlist in MCP config:

```json
{
  "mcpServers": {
    "content-pipeline": {
      "command": "node",
      "args": ["./mcp-servers/content-pipeline/index.js"],
      "tools": ["detect_releases", "generate_metadata", "analyze_impact"]
    }
  }
}
```

The MCP server might have twenty tools. The agent only sees three.

---

## Industry validation

I looked for a canonical name for this pattern. There is not one yet. But the progression shows up everywhere:

```mermaid
%%{init: { "theme": "base", "themeVariables": { "fontFamily": "Inter, ui-sans-serif", "primaryColor": "#f5e6d3", "primaryTextColor": "#3d2817", "primaryBorderColor": "#d4896b", "lineColor": "#c9956b", "secondaryColor": "#fdf4e8", "tertiaryColor": "#f9ead8", "background": "#fef9f5" } } }%%
graph LR
    subgraph "This model"
        A1["Skill"] --> A2["MCP Tool"] --> A3["Agent"] --> A4["CI/CD"]
    end
    subgraph "Anthropic"
        B1["Augmented LLM"] --> B2["Workflows"] --> B3["Agents"]
    end
    subgraph "Autonomous vehicles"
        C1["L0: No automation"] --> C2["L2: Partial"] --> C3["L4: High"] --> C4["L5: Full"]
    end
    subgraph "SRE"
        D1["Runbook"] --> D2["Automation"] --> D3["Self-healing"]
    end

    style A1 fill:#f5e6d3,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style A2 fill:#f5e6d3,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style A3 fill:#f5e6d3,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style A4 fill:#f5e6d3,stroke:#d4896b,stroke-width:3px,color:#3d2817
    style B1 fill:#fdf4e8,stroke:#b8836f,stroke-width:2px,color:#3d2817
    style B2 fill:#fdf4e8,stroke:#b8836f,stroke-width:2px,color:#3d2817
    style B3 fill:#fdf4e8,stroke:#b8836f,stroke-width:2px,color:#3d2817
    style C1 fill:#f9ead8,stroke:#d4896b,stroke-width:2px,color:#3d2817
    style C2 fill:#f9ead8,stroke:#d4896b,stroke-width:2px,color:#3d2817
    style C3 fill:#f9ead8,stroke:#d4896b,stroke-width:2px,color:#3d2817
    style C4 fill:#f9ead8,stroke:#d4896b,stroke-width:2px,color:#3d2817
    style D1 fill:#fef9f5,stroke:#b8836f,stroke-width:2px,color:#4a3428
    style D2 fill:#fef9f5,stroke:#b8836f,stroke-width:2px,color:#4a3428
    style D3 fill:#fef9f5,stroke:#b8836f,stroke-width:2px,color:#4a3428
```

| Source | Their pattern | The mapping |
|--------|--------------|-------------|
| Anthropic, "Building Effective Agents" | Start simple, promote complexity | Augmented LLM → Workflows → Agents |
| Claude Agent SDK | Permission modes as autonomy dial | `plan` → `acceptEdits` → `dontAsk` |
| MCP Skills Working Group | Progressive disclosure | Tools → Skills → Agents |
| SAE J3016 (autonomous vehicles) | L0–L5 autonomy levels | Human-in-loop → human-on-loop → human-out-of-loop |
| SRE | Runbook → Automation → Self-Healing | Manual → scripted → autonomous |
| LangGraph | `interrupt()` architecture | Remove interrupts = autonomous |

Nobody has published a named, concrete "Skill → MCP → Agent → CI" promotion model with extraction checklists and validation gates at each stage. The pattern exists. The implementation guide does not—until now.

---

## The rule going forward

> When determinism emerges from a skill, it goes directly to an MCP tool. Scripts-in-skills are a prototype stage, not a destination.

The question is not "should I use skills or agents?" It is "where is this work on the promotion ladder?" and "what driver does it need right now?"

| If the work is... | Use... |
|-------------------|--------|
| Still being figured out | Skill (exploration, cheap) |
| Deterministic and repeatable | MCP tool (typed, reusable) |
| Needs to run without you | Agent (autonomous driver) |
| Fully deterministic, no judgment needed | CI/CD (no LLM at all) |

---

## What's next

<!-- Watercolor image prompt (horizon):
"Watercolor illustration, warm earth tones, soft peach and cream palette.
A pink-haired girl standing on a hilltop at sunrise, looking out over a
landscape where small automatons are walking along paths between villages.
Each village has a different banner (one with gears, one with scrolls,
one with wings). The paths between them are well-worn and clear. She's
holding a notebook and smiling. Warm sunrise light, soft watercolor
washes, gentle ink outlines, pastoral feeling."
-->

![A pink-haired girl on a hilltop watching automatons travel between villages, watercolor illustration](./media/2026-07-21-progressive-promotion-skills-to-autonomous/watercolor-05-horizon.png)

Echo is the pilot. Once the content-pipeline MCP server wraps Echo's three scripts and the `/echo-sync` skill drives them interactively, I will validate the token savings and then promote to autonomous.

Then Finn. Then the reporting tools. Then the forty others, one at a time.

The architecture is not a migration plan. It is a development philosophy: start flexible, harden the parts that stabilize, make them reusable through typed interfaces, and change only the driver when you need more autonomy.

Build the logic once. Wrap it once. Then let anything drive it.
