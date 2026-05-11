---
slug: /2026-05-12-adopting-hve-core
canonical_url: https://dfberry.github.io/blog/2026-05-12-adopting-hve-core
custom_edit_url: null
sidebar_label: "2026.05.12 Adopting HVE Core"
title: "Adopting HVE Core: Individual Discipline Meets Team Orchestration"
description: "I thought I had to choose between hve-core's RPI methodology and Squad's team orchestration. Turns out they operate at different layers — and installing hve-core as a CLI plugin means every Squad agent inherits research discipline without changing any infrastructure."
draft: true
tags:
  - GitHub Copilot
  - HVE Core
  - Squad
  - RPI Methodology
  - Context Engineering
  - AI assisted
  - Tutorial
updated: 2026-05-12 11:00 PST
keywords:
  - hve-core adoption
  - rpi methodology
  - squad orchestration
  - copilot cli plugins
  - context engineering
  - hypervelocity engineering
  - github copilot
  - multi-agent systems
  - copilot collections
---

# Adopting HVE Core: Individual Discipline Meets Team Orchestration

<!-- Hero image: A workshop floor showing two complementary workbenches — one with precision measuring tools organized in drawers (individual discipline), the other with a project board mapping team coordination. Both lit by Pacific Northwest morning light through high windows. Watercolor style. -->

You don't have to choose between individual discipline and team orchestration. They operate at different layers.

That's the insight I landed on after spending a week investigating [microsoft/hve-core](https://github.com/microsoft/hve-core) — Microsoft's prompt engineering library for GitHub Copilot. I run a multi-project operations hub with 30+ Squad agents managing 8 projects across 30+ repos. When I first saw hve-core's **RPI methodology** (Research → Plan → Implement → Review), my immediate reaction was "this competes with Squad's parallel fan-out." It doesn't. hve-core provides individual-level discipline; Squad provides team-level coordination. Installing hve-core as a CLI plugin means every agent spawn inherits RPI discipline — research before implementing — without touching any Squad infrastructure.

This post is my investigation into how hve-core fits into a sophisticated multi-agent setup, what I adopted, what I skipped, and how the two systems complement each other rather than conflict.

## What is HVE Core?

HVE stands for "Hypervelocity Engineering" — Microsoft's internal prompt engineering discipline for GitHub Copilot, now [open-sourced and available as a CLI plugin](https://github.com/microsoft/hve-core). The name comes from the idea that software development velocity is constrained not by typing speed but by **how much time we spend investigating before we're ready to implement**. LLMs collapse that investigation time, but only if we structure the work correctly. That's what hve-core provides: structure.

Here's the inventory:

| Component | Count | What It Does |
|-----------|-------|-------------|
| **Agents** | 49 | Specialized roles (task-researcher, task-planner, task-implementor, task-reviewer, memory, dt-coach) |
| **Instructions** | 102 | Auto-applied coding conventions (activate based on file type, no manual loading) |
| **Prompts** | 63 | Reusable templates for commits, PRs, common tasks |
| **Skills** | 11 | Self-contained packages with scripts and guidance |
| **Collections** | 11+ | Curated bundles (flagship=41 artifacts, all=221 artifacts, plus ADO, security, coding-standards, design-thinking, data-science, project-planning, github, jira, gitlab) |

The core philosophy is **RPI**: Research → Plan → Implement → Review. It's a structured phase separation designed to counteract the LLM's inability to distinguish between investigating and implementing. As humans, we know the difference. LLMs don't — they treat "research this codebase" and "modify this codebase" identically unless you give them structural cues. RPI forces the research phase first, then carries findings forward through artifacts (files, not chat history).

## How I Discovered HVE Core

I stumbled across hve-core while investigating context engineering patterns for my recent [context window optimization work](https://dfberry.github.io/blog/2026-05-06-tuning-up-copilot-context). I'd just cut my context usage from 52% to 13% by scoping the Azure MCP plugin, and I was curious whether there were other established patterns for managing LLM context at scale. Hve-core showed up in a GitHub search for "copilot context engineering" — not as a solution to my specific problem, but as a comprehensive framework that addressed the same underlying concern: **how do you structure work for an LLM so the signal-to-noise ratio stays high?**

What caught my attention wasn't the agent count or the instruction library (though both are impressive). It was the **explicit `/clear` discipline**. The hve-core methodology treats context window management as a first-class concern. Between RPI phases, you `/clear` the chat. Mid-phase, you `/compact`. Cross-session, you `/checkpoint`. These aren't suggestions — they're built into the workflow. The system assumes the LLM's recency bias will drown your instructions in implementation tokens unless you actively manage the ratio.

I'd been solving similar problems in my HQ repo — just solved them differently. This was a chance to compare approaches and see what I could borrow.

## The Layered Architecture Insight

The breakthrough came when I realized hve-core and Squad operate at **different abstraction layers**:

- **hve-core (individual layer)**: How a single agent approaches a task — research before acting, carry context through files, manage the conversation window
- **Squad (team layer)**: How multiple agents coordinate — who owns what, how decisions propagate, how to parallelize independent work

These aren't competing systems. They're complementary. Here's the comparison:

| Question | HVE Core Answer | Squad Answer |
|----------|----------------|--------------|
| How should an agent tackle a complex task? | RPI: Research → Plan → Implement → Review | Squad doesn't prescribe this — it spawns the agent and waits for results |
| How do multiple agents coordinate? | HVE doesn't address multi-agent orchestration | Squad: charters define ownership, decisions.md propagates team state |
| How do you prevent context window bloat? | Explicit `/clear`, `/compact`, `/checkpoint` discipline | Squad: skills on-demand, worktrees isolate branches |
| How do agents learn from past work? | Memory agent + session artifacts | Squad: agent history.md + shared decisions.md + skills |
| What conventions apply to this file? | 102 auto-applied instructions based on file type | Squad: agent charters encode domain conventions |

Neither system does what the other does. That's the opportunity.

<!-- Architecture diagram: Two-layer system. Bottom layer shows an individual agent following RPI workflow (research → plan → implement → review with /clear between phases). Top layer shows Squad's team orchestration (PM agent fanning out to 5 specialized agents, results converging back). Layers connected by dotted line labeled "CLI plugin inheritance". PNW color palette: evergreen, slate blue, fog gray. -->

*Individual discipline (hve-core) flows up into team orchestration (Squad) without friction. The CLI plugin makes it automatic.*

## What I Tried First (And What Surprised Me)

My initial instinct was to clone the hve-core repo into my `.copilot/skills/` directory and reference specific agents as needed. That's how I've integrated other frameworks — bring the files local, adapt the patterns, fold them into the existing structure.

**That was the wrong approach for hve-core.**

Here's what surprised me: hve-core is designed as a **CLI plugin**, not a file-based skill library. The distinction matters. When you install it via `copilot plugin install hve-core@hve-core`, everything in the hve-core library becomes available to every Copilot CLI session — including every agent spawn. You don't load instructions manually. You don't import agents one at a time. The plugin system handles discovery and scoping automatically.

I spent half a day trying to cherry-pick individual agents into my skills directory before I realized the plugin model was fundamentally different. The hve-core team built it to be **zero-config at the repo level**. Nothing goes in your repo. Nothing needs git-tracked. You install it once per machine, and it's available everywhere.

For a multi-project hub like mine, that's transformative. I can experiment with hve-core in one project without committing the infrastructure to version control. If it works, it propagates to every project automatically. If it doesn't, I uninstall and nothing's littered across 30+ repos.

## The RPI Methodology vs Squad's Fan-Out

Let me dig into the core methodology difference, because this is where I initially thought there was a conflict.

### RPI: Research → Plan → Implement → Review

The hve-core thesis is: **AI can't tell the difference between investigating and implementing.** If you say "add auth to this API," the LLM will start modifying files before it understands the codebase. If you say "research how auth works in this codebase, then propose a plan," you get a different outcome — one where the agent gathers context first.

RPI formalizes that discipline:

1. **Research phase**: Spawn `task-researcher` agent. Gather context, understand constraints, identify dependencies. Output: research artifact (file or `/checkpoint`)
2. **Plan phase**: Spawn `task-planner` agent. Load research artifact. Propose approach, identify risks, estimate scope. Output: plan artifact
3. **Implement phase**: Spawn `task-implementor` agent. Load plan artifact. Make changes. Output: implementation
4. **Review phase**: Spawn `task-reviewer` agent. Load implementation. Check for correctness, security issues, missed requirements. Output: approval or rework

Between phases, you **`/clear`** the chat. Each phase starts fresh with only the artifact from the previous phase. This controls context window bloat and prevents the LLM from anchoring too heavily on early conversation turns.

### Squad: Parallel Fan-Out with Ownership

Squad takes a different approach. When you invoke Squad with a task ("squad, run a content audit"), the **coordinator agent** (a PM-level agent) decomposes the work and fans out to specialists:

1. **Coordinator analyzes task** → identifies which agents are needed
2. **Parallel spawn** → launches multiple agents simultaneously (e.g., content-quality, seo-analyzer, accessibility-checker)
3. **Concurrent execution** → each agent works independently on its domain
4. **Results convergence** → coordinator collects outputs, synthesizes recommendations
5. **Human decision** → you review, approve, or redirect

The key difference: **Squad optimizes for parallelism**. If three agents can work simultaneously without blocking each other, Squad launches all three at once. RPI optimizes for **sequential discipline** — finish research before planning, finish planning before implementing.

### Where They Complement Each Other

Here's the realization: **Squad tells you who does the work. RPI tells each agent how to do it.**

When Squad spawns an agent, that agent can follow RPI internally:
- Research: "What files do I own? What's changed recently? What conventions apply?"
- Plan: "What's the smallest change that addresses this request?"
- Implement: Make the change
- Review: "Did I follow the conventions? Did I miss edge cases?"

The coordinator doesn't need to know the agent is following RPI. The agent just does better work because it's following a structured methodology.

<!-- Before/after diagram: LEFT SIDE shows Squad spawning 3 agents → all three immediately start implementing (chaos, conflicting changes). RIGHT SIDE shows same 3 agents, but each internally follows RPI (research → plan → implement → review). Clean, parallel execution with better outcomes. -->

*Adding individual discipline doesn't slow down parallel execution — it improves the quality of what each thread produces.*

## Context Engineering Alignment

One reason hve-core resonated is that I'd already been solving the same context problems — just differently. Here's the side-by-side comparison:

### Context Window Management

**My approach (before hve-core):**
- Scoped Azure MCP namespaces to reduce always-loaded tools from 50+ to 24
- Cut agent instructions file size through reference extraction
- Optimized 117 skills from 413K tokens to 143K (65% reduction)
- Used worktrees to isolate branches and prevent LLM confusion

**HVE Core approach:**
- Explicit `/clear` between RPI phases to reset context window ratio (system prompt dominates again)
- `/compact` mid-phase when conversation gets long (preserves key context, drops redundancy)
- `/checkpoint` to save session state for cross-session resume (artifact-based, not history-based)
- Instructions auto-apply based on file type (you only load what's relevant for current files)

**The overlap:** Both systems treat context window as a constrained resource that requires active management. We both prioritize **signal-to-noise ratio** over raw capability. My instinct was to optimize what's always-loaded. HVE's instinct is to periodically reset the window. Both work. They're not mutually exclusive.

### Artifact-Based Context Transfer

This is where hve-core taught me something new. I'd been using `/checkpoint` occasionally, but I didn't have a systematic discipline around it. Hve-core makes artifact transfer **structural**:

- End of research phase → checkpoint
- End of plan phase → checkpoint
- End of implementation → checkpoint
- Each checkpoint is a **named file** that the next phase explicitly loads

The advantage: the next agent doesn't need to skim 200 turns of conversation to find the key insight. It loads a 2-page artifact that contains only what matters.

I've started applying this pattern to Squad workflows. When an agent completes investigative work, I ask it to write findings to `.squad/artifacts/{date}-{topic}.md` instead of just reporting verbally. The next agent in the sequence loads that file. Cleaner handoffs, less repetition.

### Collection-Based Scoping

Hve-core's **collections** system is conceptually similar to my skill scoping work, but the granularity is different:

**HVE Collections** (install what you need for this project):
- `flagship` (41 artifacts) — the core methodology
- `all` (221 artifacts) — everything
- `coding-standards` — language-specific conventions
- `security` — OWASP, secure coding patterns
- `design-thinking` — requirements gathering, user stories
- `ado` / `github` / `jira` / `gitlab` — platform-specific workflows

**My Skills** (117 skills, on-demand):
- Domain-specific (azure-ai-tools, data-plus-ai, content-generation)
- Language-specific SDK review skills (java, python, go, .net, typescript, rust)
- Workflow skills (blog-publishing, pr-review, issue-triage)

The conceptual model is the same: **group related capabilities, load only what's relevant**. Hve-core makes this a plugin-level decision (install collections per machine). I make it a repo-level decision (commit skills to `.copilot/skills/`). Both valid. The tradeoff:
- Plugin approach: Zero repo bloat, but every dev on the team needs to configure plugins identically
- Repo approach: Version-controlled, guaranteed consistency, but files live in every repo

For my solo HQ repo, the plugin model is cleaner. For team repos, I'd probably stick with committed skills for consistency.

## Which HVE Core Pieces I Actually Use Daily

I installed the full hve-core plugin three weeks ago. Here's what stuck:

### 1. The RPI Discipline (Used Frequently)

I don't spawn the literal `task-researcher`, `task-planner`, `task-implementor` agents by name. But I've internalized the **phase separation**:

**Before hve-core:**
> "Copilot, add pagination support to the content audit skill."

**After adopting RPI:**
> "Research: What pagination patterns exist in other skills? Which dependencies handle this? Where does the audit skill currently bottleneck?"
>
> _[Copilot responds with findings]_
>
> "/clear"
>
> "Plan: Based on the research, propose a pagination approach for the content audit skill. Constraints: must work with existing MCP calls, should batch results in chunks of 50."
>
> _[Copilot proposes approach]_
>
> "Implement: Apply the pagination plan to `.copilot/skills/content-audit/SKILL.md`."

The explicit phase breaks produce better results. The `/clear` between phases keeps the context window tight. I've stopped getting implementations that ignore constraints mentioned early in the conversation.

### 2. Auto-Applied Instructions (Always Active)

The 102 coding instructions activate based on file type. I don't manually load them. They just apply. Examples:
- Python files → PEP 8, type hints, docstrings
- TypeScript → strict mode, prefer `const`, explicit return types
- Markdown → sentence-case headings, no orphan links
- YAML → 2-space indent, quote strings with special chars

This replaced about 15 of my language-specific skills. I still keep domain-specific skills (e.g., how to review Azure SDK samples), but generic language conventions now come from hve-core.

### 3. The Memory Agent (Occasionally)

The `memory` agent is designed to extract learnings from a session and store them as persistent artifacts. I use it sporadically — maybe once a week after a particularly gnarly debugging session. It asks questions like:
- "What did you discover that wasn't documented?"
- "What pattern should apply to future similar tasks?"
- "What misconception did you bring into this session?"

The output goes into `.squad/agents/{agent-name}/history.md` or `.squad/decisions.md`, depending on whether it's agent-specific or team-wide. This bridges the gap I identified in my [session storage investigation](https://dfberry.github.io/blog/2026-04-16-session-storage-decision-guide) — extracting meaning from the raw session transcript.

### 4. Design Thinking Collection (For Requirement Gathering)

I installed the `design-thinking` collection specifically for the `dt-coach` agent. It's designed for early-stage work — when you have a fuzzy problem statement and need to clarify requirements before building anything. I use it for:
- Refining vague requests into actionable tasks
- Breaking down large epics into minimal viable slices
- Identifying unstated assumptions in requirements

This replaced my own `requirements-analysis` skill, which was doing the same thing but with less structure.

### 5. Explicit `/clear`, `/compact`, `/checkpoint` (Frequently)

I'd used these commands sporadically before hve-core. Now they're **habitual**:
- `/clear` at the end of every RPI phase
- `/compact` when I notice the conversation history getting long and Copilot starts repeating itself
- `/checkpoint` after any significant discovery or decision that I might need to reference in a future session

The discipline matters more than the commands themselves. Hve-core taught me to treat context management as part of the workflow, not an emergency measure when things break.

## What I Skip

Not everything in hve-core fits my workflow. Here's what I don't use:

### 1. Named Agent Spawns (Rarely Use)

Hve-core provides 49 agents with specific roles: `task-researcher`, `task-planner`, `code-reviewer`, `security-auditor`, `performance-optimizer`, etc. I rarely invoke them by name. Squad already has domain-specific agents with overlapping responsibilities. Spawning both feels redundant.

**What I do instead:** Use the RPI methodology with my existing Squad agents. The **approach** transfers; the agent names don't matter.

### 2. The Full `all` Collection (Too Heavy)

The `all` collection includes 221 artifacts — agents, instructions, prompts, and skills across every domain hve-core supports. That's overkill for my setup. I installed:
- `flagship` (41 artifacts) — core RPI methodology
- `coding-standards` — language conventions
- `design-thinking` — requirements work

I explicitly skipped:
- `ado` — I don't use Azure DevOps
- `jira` / `gitlab` — not in my workflow
- `security` — Squad has an adversarial security reviewer agent that covers this
- `data-science` — not my domain

**Takeaway:** Collections are modular. Install what fits your work. The plugin system makes it easy to add/remove collections without polluting your repo.

### 3. The Prompts Library (Marginal Value for Me)

Hve-core includes 63 reusable prompts — templates for commits, PRs, standup reports, retrospectives, etc. These are well-written, but I already have established patterns:
- Commit messages: conventional commits format, enforced via git hooks
- PR descriptions: Squad's scribe agent generates these automatically
- Standup reports: `/chronicle standup` handles this

If I were onboarding a new developer or standardizing team practices, the prompts library would be valuable. For solo work on an established workflow, it's redundant.

### 4. Language-Specific Instructions I Don't Use

Hve-core has instructions for 15+ languages. I work primarily in TypeScript, Python, PowerShell, and Bash. The Ruby, Rust, Go, C#, Java instructions sit unused. No harm — they only activate when I touch files in those languages — but they're effectively dormant.

## Honest Assessment: What's Valuable, What's Missing

### What's Valuable

**The RPI discipline is the killer feature.** Everything else is negotiable, but the Research → Plan → Implement → Review structure with explicit `/clear` between phases has measurably improved the quality of agent output. I'm getting fewer "this implementation ignores constraints" moments. I'm spending less time backtracking to explain context the agent already saw 50 turns ago.

**Auto-applied instructions reduce cognitive load.** I no longer think "did I load the TypeScript conventions?" when opening a `.ts` file. They just apply. Small win, but it compounds over dozens of daily agent spawns.

**Collections as plugins = zero repo bloat.** I can experiment with hve-core across all my projects without committing infrastructure. If it doesn't fit, I uninstall cleanly. No residue.

### What's Missing

**No multi-agent orchestration story.** Hve-core assumes a single agent working sequentially through RPI phases. It doesn't address how multiple agents coordinate in parallel. That's Squad's domain. I expected this — hve-core is individual methodology, not team orchestration — but it's worth naming explicitly. If you're running 30+ agents across 8 projects, hve-core gives you individual discipline but doesn't replace your orchestration layer.

**No integration with Copilot CLI session storage.** I wanted hve-core's `memory` agent to query `/chronicle` data or read from `~/.copilot/session-store.db`. It doesn't. The memory agent asks you questions and writes artifacts, but it doesn't analyze past session patterns. That integration would close the loop I described in my [session storage investigation](https://dfberry.github.io/blog/2026-04-16-session-storage-decision-guide). Maybe a future enhancement.

**No repo-specific customization for plugins.** If I install the `coding-standards` collection, it applies globally to every project. I can't say "use Python type hints in repo A but skip them in repo B." That's fine for universal conventions but limiting for project-specific styles. The workaround: layer project-specific instructions in `.github/copilot-instructions.md` to override plugin defaults.

**Instructions aren't versioned per-project.** When hve-core updates its instruction library, every project inherits the new version immediately. No staging, no gradual rollout. For solo work, that's fine. For team repos, you'd want a way to pin plugin versions or gate updates.

## Setup Section

Here's how to adopt hve-core into a Copilot CLI workflow. I'll walk through both the basic setup and how to layer it onto an existing Squad orchestration.

### Prerequisites

- [GitHub Copilot CLI](https://githubnext.com/projects/copilot-cli) installed and authenticated
- Node.js 18+ (for plugin system)
- Optional: [Squad CLI](https://github.com/bradygaster/squad) if you're using multi-agent orchestration

### Install HVE Core Plugin

The simplest path:

```bash
copilot plugin install hve-core@hve-core
```

This installs the `flagship` collection (41 artifacts) — the core RPI methodology. To verify:

```bash
copilot plugin list
```

You should see `hve-core@hve-core` in the active plugins list.

### Install Additional Collections

If you need domain-specific collections:

```bash
# Coding standards for all languages
copilot plugin install hve-core@hve-core --collection coding-standards

# Design thinking for requirements work
copilot plugin install hve-core@hve-core --collection design-thinking

# Security patterns
copilot plugin install hve-core@hve-core --collection security
```

Each collection is modular. Install only what you use.

### Configure for Multi-Project Hub

If you're running a multi-project operations hub like mine:

1. **Install globally** — the plugin applies to all projects automatically
2. **Layer project-specific instructions** — use `.github/copilot-instructions.md` in each repo to add project-specific conventions
3. **Test in one project first** — adopt RPI discipline in a single project, validate it works, then roll out to others

**Project-specific instruction example:**

```markdown
<!-- .github/copilot-instructions.md -->

# Project-Specific Conventions

This project uses HVE Core's RPI methodology but overrides these conventions:

- **Python:** Use Black formatter (120 char line length) instead of PEP 8 default
- **Commit messages:** Conventional commits + Jira ticket references
- **Skills:** Load `.copilot/skills/azure-ai-tools/` for Azure-specific guidance
```

The plugin instructions apply first, then project-specific instructions layer on top.

### Integrate with Squad

If you're using Squad for multi-agent orchestration:

**No changes needed to Squad infrastructure.** The hve-core plugin loads automatically when Squad spawns agents. Each agent inherits the RPI discipline and auto-applied instructions.

**Optional: Add artifact directories to Squad structure**

Create a directory for RPI artifacts:

```bash
mkdir -p .squad/artifacts
```

Add to `.squad/.gitignore`:

```
artifacts/
```

This keeps research/plan artifacts session-local (not committed) but available for handoffs within a session.

**Optional: Configure memory agent to write to Squad history**

After a session with the hve-core `memory` agent, direct its output to Squad's knowledge base:

> "Memory agent: summarize learnings and write to `.squad/decisions.md` if team-wide, or `.squad/agents/{agent-name}/history.md` if agent-specific."

This bridges hve-core's memory capture with Squad's persistent knowledge.

### Test the Integration

Run a simple task with RPI phases:

```bash
copilot chat
```

```
Research: What files in this repo touch authentication?

/clear

Plan: Propose a structure for adding OAuth support. Constraints: must support GitHub and Google providers.

/clear

Implement: Add OAuth support following the plan.

/clear

Review: Check the implementation for security issues and missed edge cases.
```

If each phase produces focused output without repeating previous phase details, the integration works.

## Where to Go from Here

I've been running hve-core + Squad together for three weeks. The layered model works — individual discipline flows up into team orchestration without friction. Here's what I'm exploring next:

### 1. Automate Artifact Handoffs

Right now, I manually `/checkpoint` at the end of each RPI phase and tell the next agent to load the artifact. I want to script this:

```powershell
# research-to-plan.ps1
copilot chat "Research: $task" | Out-File .squad/artifacts/research-$timestamp.md
copilot chat --resume "Load .squad/artifacts/research-$timestamp.md. Plan: $task."
```

The goal: one command that spawns the researcher, captures output, spawns the planner, and passes the artifact forward. Removes the manual handoff.

### 2. Feed `/chronicle` into Memory Agent

The hve-core `memory` agent asks me questions to extract learnings. I want it to also **query** `/chronicle improve` data for behavioral patterns:

- Which agents got spawned but produced no value? (refine charters)
- Which files always get touched together? (update agent ownership)
- Which skills get loaded but never applied? (deprecate during reskill)

This would close the loop: Copilot observes behavior → memory agent analyzes patterns → Squad encodes improvements.

### 3. Collection Customization

I'm experimenting with creating a **custom collection** specific to my HQ repo's conventions:

- Squad-specific agent spawning patterns
- Repo routing rules (which agent owns which repo)
- HQ infrastructure conventions (worktrees, repos.json, ambient config)

The hve-core plugin system supports custom collections. I could version-control this collection separately and install it via `copilot plugin install my-hq-collection@path/to/repo`. That would make HQ conventions portable without committing them to every project.

### 4. Progressive Rollout to Team Repos

My HQ repo is solo work. I also maintain team repos (azure-ai-tools, content, data-plus-ai). For those, I'm considering:

- **Start with `flagship` collection only** — introduce RPI discipline without overwhelming the team
- **Add `coding-standards` incrementally** — one language at a time, with team buy-in
- **Skip domain collections** — let each team decide which collections fit their workflow

The goal: prove value in individual work, then expand based on demand.

<!-- Closing image: A single bridge spanning Deception Pass at sunrise. On one shore, precision tools (individual discipline). On the other, a project board (team coordination). Morning light suggests new possibilities. Watercolor style. -->

*The bridge exists now. What you build on it is up to you.*

## What Actually Changed

The biggest change isn't tooling — it's **workflow cadence**. Before hve-core, I'd spawn an agent with a fuzzy request and course-correct mid-implementation. Now I pause to research first, clarify the plan, then implement. The extra upfront time is offset by less backtracking.

The second change is **context hygiene**. I `/clear` regularly now. I `/checkpoint` after discoveries. I treat the context window as a workspace that needs tidying, not an append-only log. That mindset shift came from hve-core's explicit guidance.

The third change is **less cognitive load on language conventions**. I used to mentally track "did I load the TypeScript skill?" or "should I manually explain Python type hints?" Now those conventions auto-apply. Small win, but compounding.

What didn't change: Squad's orchestration structure, my repo architecture, my git workflow. Hve-core layered on top without requiring infrastructure rewrites. That's the key — **it's additive, not invasive**.

## Related Reading

If you're exploring similar territory:

- [Copilot CLI Context Window: How I Cut Token Usage from 52% to 13%](https://dfberry.github.io/blog/2026-05-06-tuning-up-copilot-context) — my context optimization investigation
- [Optimizing Copilot Skills: 65% Token Reduction Across 117 Skills](https://dfberry.github.io/blog/2026-05-11-tuning-up-copilot-skills) — skill token reduction patterns
- [Exploring Copilot CLI Session Management to Improve Squad](https://dfberry.github.io/blog/2026-04-16-session-storage-decision-guide) — session storage as Squad knowledge source
- [microsoft/hve-core GitHub repo](https://github.com/microsoft/hve-core) — official docs, agent catalog, collection definitions
- [Squad CLI GitHub repo](https://github.com/bradygaster/squad) — multi-agent orchestration framework

---

*How do you structure multi-agent workflows? Have you tried layering individual methodology onto team orchestration? I'm always curious how others approach this. Reach out if you're experimenting with similar patterns.*
