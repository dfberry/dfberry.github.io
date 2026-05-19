---
slug: /2026-05-24-interactive-agents-vs-generation-pipelines
canonical_url: https://dfberry.github.io/blog/2026-05-24-interactive-agents-vs-generation-pipelines
custom_edit_url: null
sidebar_label: "2026.05.24 Interactive Agents vs Generation Pipelines"
title: "Two Ways to Work with AI: Interactive Agents and Generation Pipelines"
description: "A year of working with AI agents taught me that interactive orchestration and autonomous pipelines solve fundamentally different problems — here's how I learned when to use each."
draft: true
tags:
  - AI Agents
  - GitHub Copilot
  - Squad
  - Content Generation
  - AI assisted
  - Investigation
updated: 2026-05-24 10:30 PST
keywords:
  - ai agent pipeline
  - interactive ai development
  - autonomous content generation
  - squad ai team
  - copilot agent orchestration
  - when to automate ai
  - ai maturity model
---

# Two Ways to Work with AI: Interactive Agents and Generation Pipelines

<!-- IMAGE PROMPT: Watercolor illustration, warm muted tones. Split scene: left side shows a person at a desk directing a small team of helpers (interactive work), right side shows a factory assembly line running autonomously with quality checkpoints. Pacific Northwest forest visible through windows. Soft morning light. -->

A year ago, I started experimenting with AI agents. Today I work with two completely different systems: an interactive agent team that I direct in real time, and an autonomous pipeline that generates documentation without me in the loop. They use the same underlying technology — large language models, structured prompts, validation steps — but they solve fundamentally different problems at fundamentally different maturity levels.

This is what I learned about when each approach works, when it doesn't, and how to know when you're ready to graduate from one to the other.

## The Two Systems

Here's the honest summary:

| | Interactive (Squad + Copilot) | Autonomous (Doc Generation Pipeline) |
|---|---|---|
| **Human involvement** | Every session, real-time | Design time only |
| **Validation** | I review, approve, course-correct | 8 specialized agents vote pass/fail |
| **Error handling** | I notice and fix | Pipeline catches or fails loudly |
| **Maturity** | High flexibility, lower consistency | High consistency, lower flexibility |
| **Best for** | Novel work, exploration, judgment calls | Repetitive, well-defined transformations |

Both use AI. Both produce real artifacts. But the trust models are completely different.

## Interactive Agents: Squad and Copilot CLI

My interactive setup is [Squad](https://github.com/bradygaster/squad-cli) — a coordinator that dispatches work to named AI agents. I say "Fenster, fix the error handling in index.js" and the coordinator spawns a specialized agent with the right context, charter, and history.

### What This Actually Looks Like

A typical session:

```console
$ copilot "work on issue #42 — the API timeout handling is wrong"
```

The coordinator reads the issue, checks routing rules, and spawns the right agent. I see:

```
🔧 Fenster — error handling in api/timeout.js
🧪 Hockney — writing regression tests
📋 Scribe — logging session
```

Three agents, working in parallel, producing artifacts I'll review in a few minutes.

### Why This Works for Exploratory Work

The key insight: **I'm always in the loop.** When Fenster proposes a fix that misses an edge case, I catch it. When Hockney writes tests that don't cover the real failure mode, I redirect. The agents are fast collaborators, not autonomous decision-makers.

This is where I spend most of my time:
- Blog posts (like this one — agents draft, I shape)
- PR reviews across multiple repos
- Architecture decisions where judgment matters
- Investigating unfamiliar codebases
- One-off tasks that don't repeat

### What I Learned the Hard Way

**Agents are only as good as their context.** Early on, I'd spawn agents with vague prompts and get vague results. The breakthrough was structured charters — each agent has a defined role, boundaries, and access to shared decisions. They don't freelance.

**History compounds.** Each agent accumulates learnings in a personal history file. After weeks of work, my testing agent knows our patterns well enough that its first attempt is usually right. That history took time to build.

**The coordinator shouldn't do work.** My biggest recurring mistake: trying to do the work inline instead of dispatching to the right specialist. The overhead of spawning an agent feels wasteful for small tasks, but the consistency of always routing through the system pays off.

## The Autonomous Pipeline: Content Generation

The [microsoft-mcp-doc-generation](https://github.com/diberry/microsoft-mcp-doc-generation) pipeline is a completely different animal. It takes structured input (tool definitions from the Azure MCP Server CLI) and produces complete documentation articles — with parameter tables, descriptions, prerequisites, and proper Microsoft Learn formatting.

### What This Actually Looks Like

No human in the loop during execution:

1. **Input:** CLI schema JSON defining tools, parameters, types
2. **Transform:** C# pipeline with template rendering, parameter extraction, namespace grouping
3. **Validate:** 8 specialized review agents evaluate each article independently
4. **Output:** Ready-to-PR markdown files with correct frontmatter, structure, and accuracy

The pipeline processes 40+ tool articles in a single run. Each article passes through the same validation gates. Every parameter is cross-referenced against the source schema.

### Why This Needed to Be Autonomous

I wrote the same style of documentation article dozens of times. Each one followed the same structure:
- Tool name and description
- Parameter table with types, required/optional status, descriptions  
- Prerequisites section
- Example usage
- Related content links

The judgment calls were already made — in the template design, in the validation rules, in the governing specifications. Individual articles don't need creative decisions. They need accurate, consistent transformation of structured data into structured prose.

### The Validation Stack That Makes It Work

This is where the maturity difference matters most. The pipeline has **8 independent review agents**, each checking a different dimension:

- **Accuracy:** Do parameters match the source schema exactly?
- **Completeness:** Are all required sections present?
- **Formatting:** Does it pass Microsoft Learn build validation?
- **Consistency:** Do similar tools use consistent language?
- **Structure:** Is the heading hierarchy correct?
- **Links:** Are cross-references valid?
- **Encoding:** Are special characters handled correctly?
- **Regression:** Did this change break previously-passing articles?

All 8 must approve before an article advances. No human override. If agent 6 catches a broken link, the article goes back for fixes regardless of whether the other 7 approved.

This level of validation was earned, not designed upfront. It grew from finding the same categories of bugs over and over in interactive sessions.

## The Maturity Journey: From Interactive to Pipeline

Here's the progression I actually lived:

### Phase 1: Pure Interactive (Months 1–3)

Everything was Copilot + me. I wrote documentation articles by hand with Copilot suggesting completions. Quality was inconsistent. I'd forget parameters, get formatting wrong, miss cross-references. Each article took 30–60 minutes.

**What I learned:** The work was repetitive enough to templatize, but I wasn't ready to trust a template yet because I didn't fully understand the patterns.

### Phase 2: Interactive with Squad (Months 4–6)

I introduced Squad. Now I could dispatch "write the docs for azure-redis tools" to an agent and get a first draft in minutes. But I still reviewed everything. The agents made the same mistakes I did — hallucinated parameters, inconsistent formatting, wrong prerequisite versions.

**What I learned:** Agents amplify your velocity but also amplify your blind spots. If you don't know what "correct" looks like, agents won't either.

### Phase 3: Codifying the Rules (Months 7–9)

The turning point. I started writing down what "correct" means:
- A governing spec for article structure
- Validation rules as executable checks (not prose guidelines)
- Source-of-truth references (the CLI JSON schema, not my memory)

This is the boring work that makes everything else possible. It's not glamorous. It's writing rules like "the resource-group parameter is only included when tools-list.json marks it required=True" and making sure they're testable.

**What I learned:** You can't automate judgment. But you can automate the 80% that isn't judgment — and then the remaining 20% becomes tractable for human review.

### Phase 4: Pipeline (Months 10–12)

With rules codified and validation agents proven through interactive use, I built the autonomous pipeline. The C# codebase handles template rendering, parameter extraction, and structural transformation. The 8-agent review council handles quality gating.

Now I spend my time on:
- Improving the templates when patterns change
- Adding new validation rules when I find new bug categories
- Reviewing the pipeline's output in bulk (spot-checking, not line-by-line)

**What I learned:** The pipeline is only as good as the spec it implements. When upstream tools change their schema, the pipeline adapts automatically. When the *meaning* of documentation changes (new conventions, different audience), that's still a human decision.

## When to Level Up: The Decision Framework

Here's my honest framework for when interactive work should become pipeline work:

### Stay Interactive When:

- **The work requires judgment** — architecture decisions, voice/tone, creative framing
- **The patterns aren't stable yet** — you're still figuring out what "good" looks like
- **Volume is low** — fewer than 10 similar artifacts don't justify pipeline investment
- **Context is unique** — each instance needs different thinking, not different data
- **You're still learning** — the interactive friction is teaching you something

### Graduate to Pipeline When:

- **You can write the spec** — you can describe "correct" without thinking about it
- **Validation is mechanical** — you can enumerate what to check without judgment
- **Volume justifies investment** — 20+ similar artifacts, or the same artifact regenerated repeatedly
- **Input is structured** — you have a reliable source of truth to transform from
- **Errors are categorical** — the same 5 bug types keep appearing, and you can write rules to catch them

### The Dangerous Middle Ground

The trap is building a pipeline too early. If your rules aren't stable, you'll spend more time fixing the pipeline than the pipeline saves. I know because I did this — twice.

The first attempt at automated doc generation (before the current pipeline) produced articles that looked right but had subtle accuracy problems. Parameters were plausible but fabricated. Descriptions were coherent but wrong. It took more time to catch those errors than to write the articles manually.

The fix wasn't better prompts. It was better validation — which I could only build after I'd manually reviewed enough articles to know what "wrong" looks like.

## What Both Systems Share

Despite their differences, both systems rely on the same foundations:

**Structured context.** Whether I'm spawning a Squad agent or running the pipeline, the AI gets explicit, scoped context. Not "write docs" but "transform this specific JSON schema into this specific template format following these specific rules."

**Earned trust.** Neither system started at its current capability. Squad agents accumulated history and got better. The pipeline accumulated validation rules and got more reliable. Trust was built through observed behavior, not assumed from capability.

**Human-designed boundaries.** In both cases, a human (me) decided what the AI is allowed to do. Squad agents have charters with explicit boundaries. The pipeline has governing specs with explicit rules. The AI doesn't decide its own scope.

**Failure visibility.** Both systems are designed to fail loudly. Squad agents that can't complete work say so. The pipeline's 8-agent review council rejects articles that don't pass. Silent failures are the enemy — and both systems were iteratively improved to eliminate them.

## The Honest Assessment

Interactive agents (Squad + Copilot) are where I do my best thinking-with-tools. The AI accelerates me but doesn't replace my judgment. I'll never fully automate this because the work is inherently novel.

The generation pipeline is where I do my best scaling-of-decisions. The judgment happened once, during design. Now it executes consistently at volume. I'll keep improving it, but the improvement is in the rules, not in per-article decisions.

A year in, the biggest lesson: **don't try to skip the interactive phase.** The pipeline works because I spent months doing the work manually, then with agents, then codifying what I learned. Each phase taught me something the next phase needed.

The boring path — interactive first, patterns second, automation third — is the path that actually works.

## What's Next

I'm watching for the moment when my interactive Squad sessions reveal new patterns stable enough to pipeline. Right now, blog writing is firmly interactive — every post is different enough that templates would constrain more than they'd help. But PR review patterns are getting repetitive enough that I can see a pipeline forming there.

The meta-lesson: watch your own work for repetition. When you catch yourself giving an agent the same instructions for the fifth time, that's not laziness — that's a spec trying to be born.

---

*The interactive agent sessions and pipeline work described here are from my projects [Squad CLI](https://github.com/bradygaster/squad-cli) and [microsoft-mcp-doc-generation](https://github.com/diberry/microsoft-mcp-doc-generation). Both are open source.*
