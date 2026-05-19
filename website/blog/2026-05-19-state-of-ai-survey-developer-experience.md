---
slug: /2026-05-19-state-of-ai-survey-developer-experience
canonical_url: https://dfberry.github.io/blog/2026-05-19-state-of-ai-survey-developer-experience
custom_edit_url: null
sidebar_label: "2026.05.19 State of AI Survey: Developer Experience"
title: "Developer Experience Insights from the State of AI Survey"
description: "What the State of AI survey's 7,000+ respondents reveal about model providers, local AI, agent frameworks, and the gaps that will shape next year's report — through the lens of a developer who lives these tools daily."
draft: false
tags:
  - AI
  - Developer Experience
  - State of AI
  - SLM
  - Agents
  - DevBox
  - Developer Tools
updated: 2026-05-19 07:00 PST
keywords:
  - state of ai survey
  - developer experience ai
  - devographics state of ai
  - local AI SLM
  - small language models
  - ollama local models
  - azure ai foundry
  - ai agents frameworks
  - squad cli agents
  - model context protocol MCP
  - huggingface models
  - langchain langgraph
  - devbox jetify
  - dev containers ai
  - ai developer environment tooling
---

# Developer Experience Insights from the State of AI Survey

<!-- IMAGE PROMPT: Watercolor illustration, warm muted tones. White female with pink hair standing on hilltop, hands in pockets, looking at panoramic landscape of glowing AI nodes and floating clouds. Laptop peeking from backpack. Sky pale gold to violet. Dusty amber sage teal, no text -->
![Watercolor illustration of a developer surveying an AI landscape of models, clouds, and tools from a hilltop desk](./media/2026-05-19-state-of-ai-survey/hero.png)

I love the [State of AI survey](https://2026.stateofai.dev/) results put together by Devographics. I participate every year and I genuinely look forward to [the results](https://2026.stateofai.dev/en-US/metadata/#past_surveys) — wondering how closely my own experience lines up with the industry, and what signals I can find to affirm or change direction. This year's report is based on over 7,000 respondents and there's a lot to dig into. I'm going to call out a few areas I find most interesting, but please explore it yourself — the data rewards time.

## Model Providers vs. Models vs. Runtime Location

You can read a lot into how a survey is designed, not just the results. One area I've been focusing heavily on in the last six months of my own development is what I call *model value* — using the right model for the right purpose.

Most survey respondents (and most headlines) are focused on cloud models from the big-name vendors. [Anthropic](https://www.anthropic.com/) and [OpenAI](https://openai.com/) are obvious winners in that category, and the survey backs that up clearly. But I'm interested in extending that conversation to include model catalogs and model runtime location. That means places like [HuggingFace](https://huggingface.co/), [NVIDIA](https://www.nvidia.com/ai/), [Ollama](https://ollama.ai/), and [Azure AI Foundry](https://learn.microsoft.com/azure/ai-studio/what-is-ai-studio).

This isn't because I work at Microsoft — though I do appreciate where Foundry is going, especially its commitment to making the full breadth of the model ecosystem accessible in one place. It's because I genuinely appreciate the diversity that comes from having hundreds of models with different strengths, sizes, and licenses available to me. They all have value.

I also appreciate that I can do real work on my local machine with a downloaded [small language model (SLM)](https://en.wikipedia.org/wiki/Small_language_model) and not worry about token costs. That's not a fallback strategy — that's a workflow. Tools like [Azure Foundry Local](https://learn.microsoft.com/azure/foundry-local/what-is-foundry-local) make it straightforward to run these models on your own hardware. For certain tasks: summarization, local code review, quick drafts, the SLM on my laptop is fast, free, and private.

The survey supports the idea of local AI, though it's tucked in a back corner under **[Usage: Local AI](https://2026.stateofai.dev/en-US/usage/#ai_running_locally)** — you have to go looking for it. I expect that section to grow substantially. As more developers want to maximize the compute they already own and reduce API spend, they'll branch out into other model providers and runtime locations beyond the cloud. Local-first isn't fringe thinking anymore.

**My prediction:** Next year's survey will have more questions that clearly differentiate model vendor, model provider, model runtime, and model cost. These are four distinct dimensions and right now they're blurred together.

## Risk, Reward, and the Agents Question

The survey also asked for opinions on broader concerns — whether AI poses an existential risk, whether people are worried about job security. I found those questions interesting but not surprising in their results. What will be interesting is how those answers shift next year as the technology matures and the hype cycle normalizes.

The section I'm most confident will grow and evolve is **[Agents and Assistants](https://2026.stateofai.dev/en-US/coding-agents-assistants/#coding_agents_assistants_experience)**. "Agents" can mean a lot of things depending on who you ask. In my own use and development, an agent is something that completes well-defined work autonomously — not a chatbot, not a suggestion engine, but a teammate with a scope.

A year ago, that meant [LangChain](https://www.langchain.com/) and [LangGraph](https://www.langchain.com/langgraph). Those are still valid tools. But now the agent framework landscape includes many more options, including the [GitHub Copilot SDK](https://github.com/github/copilot-sdk), which I've been using heavily.

One of my favorite tools in this space is [Squad](https://www.npmjs.com/package/@bradygaster/squad-cli) — a team of AI agents, each with different expertise and a different work surface, collaborating to help me complete work. Squad isn't just a productivity tool. It's changed how I *think* about AI and how I interact with it. I went from asking an AI a question to managing an AI team with defined roles. That shift in mental model matters.

**My prediction:** Next year's survey will have significantly more questions about agent frameworks — not just "do you use agents" but what frameworks, what patterns, what governance.

## New Tools Adopted from AI's Demands

Here's something the survey doesn't capture yet but I see every day: AI hasn't just changed *how* I write code — it's changed *what tools I need* to write code.

Take [Dev Containers](https://containers.dev/) as the clearest example. Instead of installing tools locally and hoping versions stay consistent, I define my entire development environment as a Docker container — declarative, reproducible, isolated. I run these containers as development environments on my own compute. Every project gets exactly the dependencies it needs, and nothing bleeds between them.

I didn't adopt Dev Containers because it was trendy. I adopted them because AI agents need consistent, predictable environments — and they need compute that doesn't stop. When you have multiple agents running builds concurrently, or a cloud agent like [GitHub Copilot](https://docs.github.com/en/copilot/get-started/what-is-github-copilot) provisioning its own environment from scratch, you need something better than "I hope the right version of Go is on PATH." A `devcontainer.json` defines exactly what's available, every time, no drift. The agent gets the same environment I do.

The same pattern extends to [DevBox](https://learn.microsoft.com/azure/dev-box/) — the key difference is where the compute lives and whether it shuts down. Dev Containers run on my own machine, always available, always under my control. DevBox moves the environment to cloud compute that can be spun up and torn down on demand. Both solve the same core problem — declarative, reproducible environments that agents can parse and modify — but the tradeoff is local persistence versus elastic cloud resources. These aren't tools I sought out for their own sake — they're tools that became necessary because the work exposed the fragility of manually-managed environments.

**My prediction:** Next year's survey will start asking about developer environment tooling in the context of AI — not just "what IDE do you use" but "how do you manage environments for AI-assisted development?" The infrastructure layer is shifting underneath us, and the tools we adopt next will be shaped by what AI needs to function well alongside us.

## What's Missing: The Survey's Blind Spots

This is the part I think about every year with Devographics surveys — the sections I expected to find but didn't. A few stand out.

**Fundamentals: MCPs, skills, and pipelines.** [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) has become the connective tissue of modern AI development — it's how tools talk to models, how context flows between systems, how you compose AI capabilities. It wasn't in the survey. Skills and pipeline composition weren't either. These are core developer experience concerns right now.

**Thought leadership and learning sources.** Who are developers reading and listening to in order to keep up? What communities are they in? Is large language model / small language model the only path people see toward AGI, or are there other architectures getting attention? These questions would reveal a lot about how the community sees the next few years.

**Security.** AI in the developer space has huge and immediate [security implications](https://learn.microsoft.com/azure/ai-services/openai/concepts/red-teaming) — prompt injection, model poisoning, data exfiltration through context, supply chain concerns with models themselves. This deserves its own section in a developer survey.

**My prediction:** Next year's report will address most of these gaps. I've seen Devographics do exactly this with previous surveys — State of JS, State of CSS — where year two and three add the depth that year one reveals is missing. The State of AI survey is following the same natural progression, and that's a good thing.

---

If you haven't read the [State of AI survey](https://2026.stateofai.dev/) yet, carve out an hour. Look at the cross-tabs, read the opinions section, and notice what questions they asked and didn't ask. The shape of the survey tells you as much as the answers do.

I'll be participating again next year and hoping to see my predictions validated — or proven wrong, which is honestly just as useful.
