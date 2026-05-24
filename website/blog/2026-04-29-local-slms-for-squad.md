---
slug: "/2026-04-29-local-slms-for-squad"
canonical_url: "https://dfberry.github.io/blog/2026-04-29-local-slms-for-squad"
custom_edit_url: null
sidebar_label: "2026.04.29 Local SLMs for Squad"
title: "40 Agents, $0 Inference: Running Squad on Local Small Language Models"
description: "When you spawn 40+ agents daily on cloud models, tokens add up, so I investigated whether my AI team could run on local SLMs instead."
draft: true
tags:
  - "GitHub Copilot"
  - "AI Agents"
  - "Small Language Models"
  - "Cost Optimization"
  - "Squad"
  - "Copilot CLI"
  - "Local Inference"
  - "AI-assisted"
keywords:
  - "small language models"
  - "squad cli"
  - "local inference"
  - "ollama"
  - "copilot cli custom models"
  - "agent cost optimization"
  - "qwen phi llama"
updated: "2026-04-29 00:00 PST"
---

# 40 Agents, $0 Inference

<!-- IMAGE PROMPT (Hero): Watercolor illustration of a person standing in a workshop or garage overlooking Port of Bellingham. Twenty small wooden boats (each hand-built, unique) are tied to the dock below. Each boat has a small paper sail with a different task written on it. The person holds a wooden model of a boat and is studying it. Misty morning light, scattered tools on a workbench, Mount Baker barely visible in fog on the horizon. Soft grays, blues, deep greens. Pacific Northwest atmosphere. Editorial, contemplative. -->

I've been running [Squad](https://github.com/bradygaster/squad)—my human-led AI agent team—for a few months now. It's been exactly what I needed: I have 40+ agents, each with a charter and a skill set. Some days I'm at the terminal directing them live. Other days I delegate work through GitHub issues and review the PRs the next morning.

But I noticed something. Every agent spawn burns tokens. All cloud. Every spawn. Scribe writing a commit message? Cloud tokens. Ralph triaging a bug report? Cloud tokens. My PM agents routing tasks? Cloud tokens. Even the mechanical, pattern-based work—the kind that feels like it doesn't need a 30-billion-parameter model—it's all going up to the cloud.

Over a month, that's usually $15-40 in inference costs. Not huge. But it felt wasteful. ~60% of my spawns are doing work that feels like it should be cheap: status checks, log formatting, triage routing, documentation drafting. These are mechanical tasks. They don't need premium reasoning.

So I asked: **what if my AI team could run on my laptop instead?**

This post is my investigation into that question. Not a tutorial. Not a roadmap. It's an exploration: what I found, what works today, what's blocked, and what would need to change. It's messy. There are dead ends. But there are also paths forward.

## The opportunity

Small Language Models (SLMs)—models with 3-7 billion parameters—have gotten really good recently. Llama 3.2, Qwen 2.5 Coder, Phi-4 Mini, DeepSeek Coder V2. You can download them with Ollama and run them locally on a laptop with 8-16GB of RAM. No cloud account. No API key. No per-token meter running.

The inference cost is literally zero dollars after you download the model once.

Here's what they can do:
- **Llama 3.2 (3B)** — General tasks, summarization, simple classification. Quick on a modern laptop (~1.5s).
- **Qwen 2.5 Coder (7B)** — Code generation for simple tasks, boilerplate, templates. Better code understanding than you'd expect at that size.
- **Phi-4 Mini (3.8B)** — Structured writing, documentation, markdown generation. Surprisingly coherent for prose.

All of them work offline. All of them keep your code and docs on your machine. All of them run in seconds on consumer hardware.

The premise is simple: if I could route the mechanical 60% of my Squad work to these local models, I'd drop inference costs by half or more. And I'd get faster results on simple tasks (no 5-15 second cloud round-trip). Plus privacy—sensitive code or docs never leave the laptop.

## The gap: how Squad picks models today

Squad has a clean 4-layer model selection hierarchy. When an agent spawns, it resolves a model like this:

1. **Layer 0:** Override from `.squad/config.json` (persistent setting for this agent)
2. **Layer 1:** Override from the current session ("use Sonnet for everything today")
3. **Layer 2:** The agent's charter says it prefers a specific model
4. **Layer 3:** Task-aware auto-selection (code work → use Sonnet, writing → use Haiku, etc.)
5. **Default:** `claude-haiku-4.5` if nothing else matched

That hierarchy is elegant. But there's one problem: every model ID that comes out of this hierarchy is a platform catalog ID. `claude-sonnet-4.5`. `gpt-4o`. `gemini-2.0`. The Copilot CLI `task` tool accepts these IDs and resolves them server-side to cloud endpoints.

There's no way to say: "Actually, run this on `http://localhost:11434`."

There's no custom endpoint parameter. No provider config. No "BYOM" (Bring Your Own Model) support in the CLI's `task` tool. (VS Code Copilot Chat has it—custom providers pointing at localhost. But the CLI `task` tool doesn't.)

So even if you have Ollama running locally on port 11434, there's no way to wire it into Squad. You're stuck using cloud models.

That's the gap.

## What I tried: four paths forward

I spent a week investigating: Is there a way to make this work today? Or do we have to wait for platform changes?

### Path 1: The MCP Server Approach

MCP servers are already part of the Copilot CLI ecosystem. They expose tools that agents can call. What if I built an MCP server that wraps Ollama and exposes it as a set of tools—`slm_summarize`, `slm_classify`, `slm_generate_template`?

**How it would work:**
1. Create an MCP server that talks to Ollama on `localhost:11434`
2. Register it in `.copilot/mcp-config.json`
3. When an agent spawns, they get access to these MCP tools alongside their normal filesystem and git tools
4. Agent is running on a cloud model, but it can call the MCP tool for cheap subtasks

**Pros:** Works today. No platform changes. Agents gradually learn to use the local tool for things that don't need premium inference.

**Cons:** Agent is still on cloud (paying for the orchestration). MCP tools are synchronous text-in, text-out. Double inference pattern (cloud model decides to call local model). Doesn't save as much as true local routing would.

**Verdict:** This works. I could build it. It's Medium effort. But it's a workaround, not a solution.

### Path 2: The Skill + Shell Script Approach

Squad supports skills—markdown files that teach agents about capabilities. What if I created a skill that says: "For simple text generation tasks, you can call this shell script that queries Ollama directly"?

```powershell
$prompt = "Summarize this: ..."
$body = @{model="llama3.2:3b"; prompt=$prompt; stream=$false} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post `
  -Body $body -ContentType "application/json" | Select-Object -ExpandProperty response
```

**Pros:** Works today. Low effort. No infrastructure.

**Cons:** Hacky. Agents shelling out to curl/PowerShell for inference is not a clean pattern. Still paying for the cloud agent's context window. No streaming. Agents need to be "smart enough" to delegate correctly.

**Verdict:** This is pragmatic for now. But it feels like a Band-Aid.

### Path 3: Squad CLI Learns Local Models

This is the medium-term path. Squad's coordinator could be extended to understand local model providers. If `.squad/config.json` says `ollama: http://localhost:11434`, then when an agent resolves to `ollama:llama3.2:3b`, Squad could intercept the `task` spawn and run the agent prompt directly against the local endpoint using the OpenAI-compatible API.

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "models": ["llama3.2:3b", "qwen2.5-coder:7b"]
    }
  },
  "agentModelOverrides": {
    "scribe": "ollama:llama3.2:3b",
    "ralph": "ollama:llama3.2:3b"
  }
}
```

**Pros:** Clean. Solves the problem fully. 60% of spawns go local. Cost cut in half.

**Cons:** Requires Squad CLI changes. Requires either Squad to implement its own agent runtime (prompt + tool loop) OR the platform's `task` tool to accept custom endpoint URLs. The second option is higher-priority but out of Squad's control. Issue #987 on the Squad repo is related and getting attention—this would be a natural follow-up.

**Verdict:** This is the right architectural solution. But it's blocked on platform support.

### Path 4: LiteLLM Proxy

LiteLLM is a middleware that presents as an OpenAI-compatible endpoint and translates between different backends. You could run `litellm --model ollama/qwen2.5-coder --port 4000` locally, and it would be ready to accept API calls the moment the Copilot CLI platform supports custom endpoints.

**Pros:** Future-proof. When the platform adds endpoint support, you just plug in the URL.

**Cons:** It's entirely blocked on platform support. Today, it's just overhead. You're adding a translation layer for no benefit yet.

**Verdict:** Good to set up as preparation. But not a path forward today.

## What actually works: a phased approach

After the investigation, here's what I think makes sense:

### Right now (Phase 1)

**Do both of these:**

1. **Set up Ollama locally with the recommended models**
   ```bash
   ollama pull llama3.2:3b          # Lightest, general purpose (4GB RAM)
   ollama pull qwen2.5-coder:7b    # Best for code (8GB RAM)
   ollama pull phi4-mini            # Best for writing (6GB RAM)
   ```
   
   Use it as a parallel tool for quick tasks that don't need Squad's orchestration. Ask it questions. Use it for drafts. Keep Squad for multi-agent coordination and heavy code work.

2. **Create a Squad skill that teaches agents to use Ollama for subtasks**
   
   Create `.copilot/skills/local-slm/SKILL.md` that defines when agents can shell out to the local Ollama instance. Scribe uses it for formatting log entries. Ralph uses it for status reports. It saves cloud tokens on the mechanical stuff.

### When Squad issue #987 ships (Phase 2)

Build the MCP server that wraps Ollama as tools. Hook it into the task-category routing so the coordinator knows which categories can safely use local inference. Now agents can call tools instead of shell scripts.

### When the platform supports custom endpoints (Phase 3)

This is the unlock. Full integration via custom provider config in `.squad/config.json`. Squad coordinator routes mechanical agents directly to local models. Scribe, Ralph, all the PM agents—they run entirely local. Inference costs drop 60%. Nothing changes from the agent's perspective. They just run faster and cheaper.

## The math: what SLMs can actually handle

Not every agent can go local. Some tasks genuinely need better models. Here's the honest breakdown of my 40+ agents:

| Category | Examples | Can Use SLM? | Why / Why Not |
|----------|----------|-------------|---|
| **Mechanical ops** | Scribe (logging, merging), Ralph (triage) | ✅ Yes | File operations, pattern-based routing, no reasoning needed |
| **PM/Coordination** | Coordination agents (task routing, status) | ✅ Yes | Routing decisions, status generation, simple classification |
| **Docs/writing** | Content agents (content drafting) | ✅ Yes | Structured writing, markdown templates, prose generation |
| **Light code** | Template-focused agents | 🟡 Partial | Simple templates yes, complex logic probably no |
| **Heavy code** | Architecture and refactoring agents | ❌ No | Multi-file awareness, tool calling, deep reasoning needed |
| **Adversarial** | Review and edge-case agents | ❌ No | Requires deep understanding of implications |

**Key insight:** ~60% of my squad (17+ PM agents + Scribe + Ralph + some docs agents) could run on local SLMs TODAY if the routing existed. That's where the cost savings come from.

The 40% that stays cloud (code engineers, architects, adversarial reviewers)—that's the work that actually needs premium models. Those agents should stay on cloud.

## Open questions I'm still sitting with

1. **Tool calling:** Do Qwen 2.5 Coder and Phi-4 Mini support the structured tool-calling format that Squad agents use? If they don't, agents can't call filesystem tools. That's a hard blocker for some use cases.

2. **Context windows:** Squad spawn prompts (agent charter + history + decisions + the task) often exceed 4K tokens. Most SLMs max out at 8K-32K. Is that enough? I haven't tested yet.

3. **GitHub's roadmap:** Is BYOM (Bring Your Own Model) coming to Copilot CLI? Not just VS Code Chat—the CLI itself? This is the single biggest unlock. If GitHub says "we're adding custom endpoint support," this whole investigation becomes moot because Phase 3 arrives sooner.

4. **Squad CLI as its own runtime:** Could Squad implement a lightweight agent runtime for local models? (Prompt → tools → response loop, entirely local.) That would bypass the platform's `task` tool entirely and unlock full local execution. But it's a lot of scope.

## What I'd do next

If I'm building on this:

1. **Install Ollama locally and test it for a week.** Use it for ad-hoc tasks alongside Squad. See how the models feel.

2. **Create the local-slm skill and try it.** Get one agent (Scribe) delegating simple tasks to Ollama. Measure: does it work? How often does the agent make the right call to use local vs. cloud?

3. **Build the MCP server as a proof of concept.** Even if it's not the long-term solution, it proves the concept works and gives me something to show the Squad maintainers.

4. **Comment on Squad issue #987** with this investigation. The model-mapping config is adjacent to what we'd need for local endpoint support. Help the maintainers think through it.

5. **Track the platform roadmap.** When GitHub ships BYOM for Copilot CLI, that changes everything. That's the day Phase 3 becomes possible.

## The bigger picture

Here's what struck me most in this investigation: the tooling to do this exists. Ollama is solid. The models are good enough for 60% of the work. OpenAI-compatible APIs are a standard. Squad's architecture is clean enough to extend.

What's missing is *permission*. The platform doesn't let you point at localhost. The CLI's `task` tool won't accept custom endpoints. Squad CLI can't implement its own agent runtime without huge scope changes.

So it's not a capability problem. It's a design boundary. Someone decided: "Only platform catalog models." And that boundary is logical (easier to meter, monitor, secure). But it means local inference is blocked even though the technical pieces are there.

The investigation doesn't give me a workaround that feels elegant. The MCP server is Medium effort for Medium benefit. The skill approach works but feels hacky. Full integration is blocked.

But it's good to know the landscape. And it's worth commenting on issue #987, because when that ships, the groundwork for Phase 2 is laid. And when the platform eventually supports custom endpoints—because some team will want this, and the pressure will build—Phase 3 becomes straightforward.

In the meantime: Ollama running in the background, a skill for mechanical tasks, and cloud for the work that needs it. That's what Phase 1 looks like.

**What's your setup?** If you're running Squad or a similar agent team, are you thinking about local inference? Have you tried routing work to SLMs? I'd be curious what paths you've found.
