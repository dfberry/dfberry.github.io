---
slug: /2026-05-08-worktree-trick-multi-project-ai-teams
canonical_url: https://dfberry.github.io/blog/2026-05-08-worktree-trick-multi-project-ai-teams
custom_edit_url: null
sidebar_label: "2026.05.08 Worktree Trick"
title: "The Worktree Trick: How I Run 40 AI Agents Across 8 Projects Without Losing My Mind"
description: "Two months of failed experiments taught me that the best way to manage multi-project AI agent teams is the oldest tool in git's toolbox — worktrees — paired with a centralized hub."
draft: true
tags:
  - AI Agents
  - Git Worktrees
  - Squad
  - Developer Experience
  - AI-assisted
keywords:
  - git worktrees
  - ai agents
  - multi-project management
  - copilot cli
  - squad framework
  - developer productivity
---

# The Worktree Trick: How I Run 40 AI Agents Across 8 Projects Without Losing My Mind

<!-- IMAGE: [type: diagram]
Description: A PNW river delta viewed from above — one main channel (the hub) splitting into multiple distributaries (worktrees), each finding its own path to the sea. The distributaries share the same water (skills, decisions) but each flows independently. Annotate the main channel as "project-dina hub" and distributaries as individual worktrees: "blog-requirements," "docdb-article," "azure-mcp," "content-gen-cli."
Purpose: Visual metaphor connecting the centralized-brain-distributed-execution architecture to Pacific Northwest geography, anchoring Dina's regional voice
Suggested placement: before the opening paragraph
-->

I stopped asking the AI to manage workspace state. That's the whole trick.

For two months I tried architecturally ambitious approaches — unified squads, per-project squads, sub-coordinators, distributed skill systems — all trying to teach LLMs how to switch branches, route work, and stay on task. None of it worked reliably. Here's what I discovered: the thing that actually solved it was removing that burden entirely. I create a git worktree *before* I launch Copilot CLI. One command, in my regular terminal. The session starts already in the right place, with the right branch, and no decisions left to make about where to work.

This post covers three layers: the problem I hit (multi-project chaos), the approaches I tried and abandoned, and the architecture I landed on. Let me walk through how I got here.

## What I'm working with

If you're running more than a few AI agents, you'll hit the same coordination wall I did. Understanding the scale helps explain why the simple solutions broke first.

I'm a senior content developer at Microsoft. I manage documentation and tooling across 8 active projects, 20+ repos, and a [Squad](https://github.com/bradygaster/squad) team of 40+ AI agents — PMs, engineers, adversarial reviewers, fact-checkers. The agents have names like Harper-pm-data and Casey-pm-content-repos and Ferris-eng-rust, because when you have 40 agents, "Avery" means absolutely nothing. (I stole this naming convention from how ops teams name microservices — more on that later.)

The hub repo is called `project-dina`. It's the single brain for everything — one `squad.agent.md`, one `decisions.md`, one shared skill library. Physical repo clones live flat under `./repos/`. A file called `repos.json` maps each repo to its project, its auth method, its PM agent, and its sweep config. Think of it as a routing table for work.

Getting to this architecture took three attempts and two failed experiments. My perspective: the failures taught me more than the solution did.

<!-- IMAGE: [type: mermaid]
Description: Top-down flowchart showing the three approaches as a progression with decision nodes. Start node "Multi-project AI agents" flows to "Approach 1: Same directory" with outcome "FAILED: context bleed, branch chaos" flowing to decision diamond "Try isolation?" then to "Approach 2: Per-project squads" with outcome "FAILED: skill duplication, no shared brain" flowing to decision diamond "Combine strengths?" then to "Approach 3: Hub + worktrees" with outcome "WORKS: shared brain + isolated workspaces". Use red for failed nodes, green for the working solution, yellow for decision diamonds.
Purpose: Give readers the full journey at a glance so they understand this post is about the investigation, not just the answer
Suggested placement: before Approach 1 section
-->

## Approach 1: Put everything in one directory (Early April 2026)

The simplest approach reveals the core problem fastest. I started here because I thought the AI could handle branch management. It can't — at least not reliably.

I started simple. One Squad, one repo, work on everything from the same checkout.

It collapsed almost immediately.

The core problem was context bleed. An agent working on DocumentDB content accidentally referenced Azure SQL patterns. Agents committed directly to main instead of branches — I literally put "all changes always go through a PR regardless of the repo" in all-caps in my instructions. Branch switching turned chaotic. An agent landed on the wrong branch, and a PR picked up commits from completely unrelated work.

I found myself constantly redirecting: "No, that's the wrong repo." "No, switch branches first." "No, don't commit there." I spent more time babysitting than I would have spent doing the work myself.

In one session I finally said it out loud: *"I'm having to be too interactive and redirecting across all projects and repos — how do I improve how I work so that you need less direction?"*

The answer wasn't a better prompt. It was a better architecture.

## Approach 2: Give each project its own squad (Mid-April 2026)

When a shared workspace fails, the instinct is to isolate everything. That instinct is half right — isolation solves context bleed but creates a new problem that's equally painful.

If one squad couldn't handle multiple projects, maybe each project needed its own squad.

I spun up child squads: `mcp-doc-generation`, `ai-dev-tools-squad`, `content-maintenance`, `typespec-agent-squad`. Each had its own sub-coordinator, its own agents, its own config.

Context isolation was perfect. Context *duplication* was a nightmare.

Every squad needed its own `decisions.md`. Skills that worked everywhere — YAML validation, PR workflow rules, Acrolinx compliance checks — had to be manually copied to every squad. When I updated a skill in one place, the others went stale. I found myself sending messages like *"can you copy the m365 mcp from your mcp.json to all subsquads?"* — which tells you everything about the overhead.

The deeper question was coordination. I asked my agents: *"How will the project PMs work with the individual repos they're responsible for — create PRs on those individual repos and spin up separate loops, or what? How do we make sure nothing is dropped, everything is logged, and the goal is reached instead of a different goal?"*

Nobody had a clean answer. Because there isn't one — not when you've fragmented your team's brain across five repositories.

The per-project model scales linearly in the wrong direction. Every new project means another squad to configure, another set of skills to maintain, another `decisions.md` that might contradict the others. At 8 projects, it's untenable.

## Approach 3: Combine a central hub with git worktrees (Late April / May 2026)

Here's what I discovered: the solution takes the shared brain from Approach 1 and the isolation from Approach 2, but shifts *where* the isolation happens. Instead of isolating entire squads, I isolate workspaces.

<!-- IMAGE: [type: mermaid]
Description: Architecture diagram with project-dina as a central node labeled "Hub (single brain)" containing sub-nodes for squad.agent.md, decisions.md, and skills/. From the hub, four branches extend outward to worktree nodes labeled "blog-requirements worktree," "docdb-article worktree," "azure-mcp worktree," and "content-gen-cli worktree." Below the hub, a repos.json node connects via arrows to downstream repo boxes: internal-repo-1, internal-repo-2, internal-repo-3, personal-repo-1. Annotate the hub-to-worktree connections as "shared config" and the repos.json-to-repo connections as "routing."
Purpose: Show how the hub serves as the central brain while worktrees provide isolated execution environments, and repos.json routes to downstream repos
Suggested placement: before the worktree layout code block
-->

One central Squad in `project-dina` — the same single brain from Approach 1 — but with a critical difference: I create git worktrees *before* entering Copilot CLI.

Here's my actual worktree layout right now:

```
C:/Users/diberry/project-dina                   [squad/enable-worktrees]            ← main checkout
C:/Users/diberry/data-plus-ai/docdb-article-2-3 [data-plus-ai/docdb-article-2-3]    ← worktree
C:/Users/diberry/project-dina-azure-mcp-10      [content-gen-10]                    ← worktree
C:/Users/diberry/project-dina-blog-requirements  [dfberry-blog/requirements]         ← worktree
C:/Users/diberry/project-dina-content-gen-cli   [decision/mcp-namespace-definition] ← worktree
```

That `git worktree list` output shows five active workstreams running simultaneously. Each worktree is a separate directory on disk, locked to a single branch, with the full hub config (agents, skills, decisions) available.

A clarification that tripped me up at first: these are worktrees of the *hub repo* — not copies of every downstream product or content repo. The worktree gives each session its own branch, its own instructions, its own decisions and routing context. The actual product and content repos stay mapped through `repos.json` and cloned under `./repos/`. The worktree isolates the *orchestration layer*, not the target repos themselves.

When I start a Copilot CLI session in a worktree, the LLM is already "in" the right branch. No switching to manage. The default path leads to the right place.

This is the key insight: **the LLM doesn't need to manage branches if you give it a workspace that's already on the right branch.**

Most of the problems from Approach 1 become much harder to hit — context bleed, branch confusion, accidental commits to main all require the agent to actively work against the worktree's defaults. And the problems from Approach 2 disappear entirely — skills are shared automatically from the hub, decisions live in one file, and there's exactly one squad to maintain.

<!-- IMAGE: [type: mermaid]
Description: Side-by-side comparison using two subgraphs. Left subgraph "Before (Babysitting Loop)" shows a cycle: "Start session" → "Agent picks wrong branch" → "Human redirects" → "Agent picks wrong repo" → "Human redirects" → "Agent commits to main" → "Human redirects" → loops back to start, with a frustrated emoji or red color. Right subgraph "After (Worktree Flow)" shows a linear flow: "Create worktree" → "cd into directory" → "Start Copilot CLI" → "Assign agent" → "Review PR" → "Done", with green color. No loop, no redirects.
Purpose: Make the daily workflow improvement visceral — show the babysitting loop the reader wants to escape versus the linear flow they can achieve
Suggested placement: after the "key insight" paragraph
-->

The daily workflow change was immediate. Before: "No, wrong repo. No, switch branches first. No, don't commit there." After: create worktree, `cd` into it, start Copilot CLI, assign agent, review PR. Four steps, no redirecting.

## Face the real effort: managing the framework itself

The worktree trick solved the workspace problem. But I want to be radically honest about what it *didn't* solve — because if you stop at "just use worktrees," you'll hit the next wall within a week. The real work shifts from fighting the AI to maintaining the system around it.

### Staff your agent roster like a team

Without regular roster hygiene, you end up with ghost agents consuming context and muddying routing. This is people-management work wearing a technical mask.

At 40+ agents, I manage a team roster. Agents get added for new domains, stale ones linger after projects wrap up, and over time I notice two agents doing roughly the same thing. I did a major consolidation pass — merging redundant agents, collapsing overlapping domains, renaming everyone to include their role and domain in the name (`Avery` → `Avery-pm-content-gen`). That rename cascaded into updating GitHub labels, routing tables, and casting registries. This is not a "set it and forget it" system. It's staffing.

### Curate skills through a confidence lifecycle

The difference between "worked once" and "reliably correct" is the difference between a tip and a skill. Without a confidence lifecycle, your skill library becomes a junk drawer of one-off patterns.

<!-- IMAGE: [type: mermaid]
Description: State diagram showing the skill confidence lifecycle. Three states: "Low confidence" (new/untested), "Medium confidence" (validated in 2-3 contexts), "High confidence" (reliable across projects). Transitions: Low→Medium labeled "repeated successful use," Medium→High labeled "human review + cross-project validation," High→Medium labeled "context drift / edge case found," Medium→Low labeled "repeated failures." Add a note on the Human→High transition: "Nobody else is going to do it."
Purpose: Show that skill maturity isn't automatic — it requires deliberate human judgment at each transition
Suggested placement: before the paragraph about skill curation
-->

Skills pile up naturally as agents learn patterns, but I started encoding the project name in the skill folder to separate project-specific patterns from generic ones. Even then, there's a confidence lifecycle — a skill starts at low confidence, gets validated through repeated use, and eventually earns high confidence. Advancing a skill through that lifecycle takes human judgment. Nobody else is going to do it.

### Keep the routing table honest

When your routing table goes stale, agents guess instead of looking things up. One stale entry can send a PR to the wrong repo — and you won't catch it until review.

`repos.json` maps 20+ repos to projects and PM agents. When I consolidated an internal repo into a different project, the routing table needed updating, the PM agent scope needed adjusting, and orphaned issues needed re-labeling. This is project management work — the framework just makes it explicit instead of implicit.

### Prune decisions before they become wallpaper

A decisions file that agents skim past is worse than no decisions file — it creates false confidence that conventions are being followed.

`decisions.md` is the greatest strength and the biggest maintenance burden. Over time it grows into a massive file that agents skim past rather than internalize. I archive entries older than 30 days, deduplicate, and periodically do a junk-drawer cleanup to keep it actionable. Without curation, decisions accumulate but stop influencing behavior. This is a recurring cost, not a one-time fix.

### Close the gap between "I have agents" and "agents do work"

<!-- IMAGE: [type: mermaid]
Description: Pipeline diagram showing the "Ralph, go" aspiration. Linear flow from left to right: "Human says 'go'" → "Issue triage (auto)" → "Agent routing (auto)" → "Execution (agent)" → "PR created (agent)" → "Human review" → "Merge." The human appears only at the first and second-to-last steps. Nodes between human touchpoints are labeled "automated." Add a dashed box around the automated section labeled "The gap to close."
Purpose: Visualize the end-state automation goal and make clear where the human stays in the loop — only at activation and review
Suggested placement: before the "Ralph, go" paragraph
-->

The ultimate goal is one command → auto-triage → route to the right agent → execute → open PR → review → merge. Getting there requires meaningful issue labels, triage rules in routing, auto-assignment patterns, and agents that genuinely know their scope without being told. Each iteration gets closer. But the gap between "I have agents" and "agents do work without me" is filled with exactly this kind of infrastructure. The "Ralph, go" aspiration is still aspirational.

### Accept that cross-project awareness is unsolved

Even the best architecture can't give you a mental model of everything in flight. This is the frontier — and it's honest to say nobody has cracked it yet.

Even with the hub model, knowing what's happening across all 8 projects simultaneously is hard. I use daily briefs, orchestration logs, and session history, but the mental model of "what's in flight right now" still lives partly in my head. No framework I've seen has fully cracked multi-project awareness yet.

The honest summary: the hub + worktrees architecture moved the hard work from "fighting the AI about branches and context" to "maintaining the system that makes the AI productive." That's a better class of problem. Boring and that's good. But it's still a problem, and it's ongoing.

## Compare the trade-offs

Every approach solves some problems and creates others. This table captures my experience — not theoretical scores, but what I actually hit across two months of iteration.

<!-- IMAGE: [type: mermaid]
Description: Comparison table rendered as a Mermaid flowchart with three columns (Same Directory, Squad per Project, Hub + Worktrees) and rows for key dimensions. Use color coding: red nodes for failures (❌), green for successes (✅), yellow for partial (🟡). Dimensions to include: Context isolation, Shared skills, Shared decisions, Agent confusion, Setup overhead, Cross-project coordination, Scaling, PR workflow. This is a visual alternative to the markdown table for readers who scan.
Purpose: Provide a scannable visual comparison of the three approaches across key dimensions, reinforcing that no approach is free
Suggested placement: before the trade-off markdown table
-->

| Dimension | Same directory | Squad per project | Hub + worktrees |
|-----------|---------------|-------------------|-----------------|
| Context isolation | ❌ Bleed everywhere | ✅ Perfect | ✅ Branch-level |
| Shared skills | ✅ Automatic | ❌ Must copy everywhere | ✅ Automatic from hub |
| Shared decisions | ✅ One file | ❌ Fragmented | ✅ One file |
| Agent confusion | ❌ Wrong branches | ✅ Clean | ✅ Clean |
| Setup overhead | ✅ Minimal | ❌ Heavy (N squads) | 🟡 Moderate |
| Cross-project coordination | ❌ Manual redirecting | ❌ No shared brain | ✅ Hub coordinates |
| Workspace discipline | ❌ Must manage branch state | ✅ No switching needed | ✅ No switching needed |
| Scaling | ❌ Collapses at 5+ projects | 🟡 Linear overhead | ✅ Scales well |
| PR workflow | ❌ Commits to main | ✅ Clean | ✅ Each worktree = one PR |

The hub + worktrees model has real costs beyond that 10-second setup command. Worktrees accumulate — you need a cleanup habit or your disk fills up with stale branches. Branch names need to be meaningful because they *are* your task identifiers; `fix-stuff-3` helps no one. And `decisions.md` requires curation — without occasional pruning, it becomes a junk drawer that agents skim past instead of reading. These are maintenance costs, not architectural ones, but they're real.

## Six things I learned the hard way

These lessons didn't come from documentation — they came from wasted sessions and frustrated redirecting. Each one represents a problem I had to hit before I understood the fix.

**1. Domain-encode your agent names.** When I had 40 agents named things like "Avery" and "Morgan," I couldn't remember who did what. Renaming them to `Avery-pm-content-gen` and `Morgan-eng-typespec` made the entire system legible at a glance. The naming convention is `{name}-{role}-{domain}`. It sounds bureaucratic. It saves real time.

**2. Create a routing table, not a mental model.** `repos.json` maps every repo to its project, its owning PM agent, its auth type, and its sweep config. When an agent needs to know which project owns a repo, it looks it up instead of guessing. When *I* need to know, I look it up instead of remembering. Externalize the routing.

**3. Let skills accumulate, not duplicate.** In the hub model, when any agent learns a new skill — YAML validation, Rust SDK patterns, Acrolinx compliance — it's immediately available to every project. In the per-project model, skills are siloed. Over two months, the hub accumulated 15+ shared skills that would otherwise be fragmented across 8 separate squads.

**4. One `decisions.md` changes everything.** When you have one canonical decisions file, agents don't make the same mistake twice. "We use relative URLs, never absolute, in Microsoft Learn content." "All PRs must target the `-pr` (internal) repo, never the public mirror." Decisions propagate automatically because every session reads the same file.

**5. The "too interactive" problem is a design smell.** If you're constantly redirecting agents, the architecture is wrong. The goal is to say "Ralph, go" and have work happen. That requires auto-triage, domain-aware routing, and agents that know their scope without being told every time. If you're babysitting, fix the structure — not the prompts.

**6. Make workspace setup a gate.** Don't ask the LLM to choose a branch or switch context. Give it a directory where the correct branch and instructions are already true. If the workspace is wrong, no amount of prompting fixes it reliably. If the workspace is right, you barely need prompts at all. This is arguably the central takeaway from two months of iteration.

## Where to start

If you're managing more than a couple of projects with AI agents, here's what I'd try:

1. **Start with one hub repo.** Put your squad config, skills, and decisions here. This is your single brain.
2. **Put repos.json at the root.** Map every repo you work on to a project. Include the PM agent who owns it.
3. **Use worktrees for isolation.** Before starting a Copilot CLI session, run `git worktree add ../my-task-dir my-branch`. Work in the worktree directory. The LLM inherits the right branch automatically.
4. **Name agents with their domain.** `{name}-{role}-{domain}`. You'll thank yourself at agent 15.
5. **Log decisions centrally.** Every decision, every convention, every "don't do this" — one file, read by every session.
6. **Make workspace setup the gate.** If the directory is wrong, the session is wrong. Get this right first.

The surprising thing isn't that AI agents need structure. It's that the structure that works best is one of the oldest tools in git's toolbox — worktrees — combined with one of the oldest patterns in systems design: a centralized brain with distributed execution.

The LLM doesn't need a smarter prompt. It needs a workspace where the right thing is the default.

How do you handle multi-project AI coordination? I'm genuinely curious — let me know what patterns you've found.
