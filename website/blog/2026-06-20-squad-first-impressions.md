---
slug: /2026-06-20-squad-first-impressions
authors: [dfberry]
date: 2026-06-20
image: ./media/2026-06-20-squad-first-impressions/2026-06-20-squad-first-impressions-watercolor-1-hero.png
canonical_url: https://dfberry.github.io/blog/2026-06-20-squad-first-impressions
custom_edit_url: null
sidebar_label: "2026.06.20 Why Squad?"
title: "Why Squad?"
description: "Why Squad feels different from GitHub Copilot: my first impression of its multi-agent workflow, and why build teams, review teams, skills, and quality gates improve results."
tags:
  - Squad
  - AI Agents
  - GitHub Copilot
  - multi-agent
updated: 2026-06-20 00:00 PST
keywords:
  - squad copilot
  - multi-agent orchestration
  - github copilot agents
  - specialist agents
  - copilot agent team
  - squad cli
  - agentic development
  - squad first impressions
  - squad vs copilot
  - build and review agents
---
If you already use GitHub Copilot, the real question is simple: why would Squad feel different enough to change your workflow?

The first time I used [Squad](https://bradygaster.github.io/squad/), I got a result that was noticeably better than what I got from a single Copilot chat. It was the same task and basically the same intent, but the coverage was better.

That was the moment it clicked for me: Squad is a multi-agent orchestrator. Instead of asking one AI generalist to do everything, I can route the same task through specialists with clear roles.

This post came from a coworker asking me, "Why Squad?"

![Watercolor illustration of a sunlit woodworking workshop with a team working on projects.](./media/2026-06-20-squad-first-impressions/2026-06-20-squad-first-impressions-watercolor-1-hero.png)

<!-- truncate -->

## Why Squad feels different from Copilot

Before Squad, my workflow was simple: open Copilot and ask one agent for everything. That works well for plenty of tasks, but it is still one perspective.

When I ran Squad on the same docs task, the output came back with fewer blind spots. It was not just more polished. It covered angles the generalist missed.

That pushed me to design my own team. I started with obvious roles like builder, reviewer, and debugger, then added project-specific specialists with strong opinions about quality. I now run with about 30 agents.

## I am directing now, not doing

With Squad, my job shifts from doing the task to directing the process.

I set the plan, the constraints, and the definition of done. Squad coordinates which agents should build, review, challenge assumptions, and test. Sometimes I direct at a high level with goals and standards. Sometimes I assign specific work.

I ask Squad to make better decisions with less intervention from me.

## Why build and review should be separate teams

For me, the biggest quality jump came from separating build and review.

At first, I only wanted better output than one generalist could produce. Later, I built a dedicated review team where each reviewer had a different job:

- One reviewer hunts for security risks.
- One checks factual correctness.
- One stress-tests logic and edge cases.
- One reviews performance tradeoffs.

I do not want eight approvals. I want eight different objections.

I also want those objections resolved through agent collaboration, not by pulling me into every pass. Just like a real PR review, reviewers should send issues back to build, build should improve the work, and the review should run again until everyone agrees the bar is met.

![Watercolor illustration of a team examining the same cabinet from different angles](./media/2026-06-20-squad-first-impressions/2026-06-20-squad-first-impressions-watercolor-2-build-review.png)

A single generalist reviewing its own output gives me consistency with itself. That is not the same as complete and correct.

For this process, done means reviewer consensus after iterative fixes. If reviewers still disagree, the PR is not done.

## "Did it finish?" is the wrong question

Before Squad, I asked:

- Did it work?
- What needs to change?
- Is it done?

With Squad, the better question is: **How can this be more consistently correct?**

Who else should review this? Which assumptions need pressure testing? What would a performance engineer challenge? What would a security reviewer reject?

That changes my role. I am not just relieved that something exists. I am trying to improve the system that produces it.

## Try this once with the same task

If you are curious, run a simple experiment:

1. Pick a task you already gave to one Copilot agent.
2. Run it again with a build team.
3. Then run a separate review team on that output.
4. Compare what the review team catches.

That comparison is why Squad is interesting to me. I care less about getting one answer and more about running a process that catches weak spots before I ever see the final output. That is the core difference in Squad vs. Copilot for me.

## Management becomes the core skill

Once you have a team of agents, management becomes the multiplier.

I think in terms of plans, process, and quality gates. Projects need clear definitions and constant refinement. Squad builds to the plan, reviews against the plan, and makes quality visible.

Each project moves from manual execution toward a repeatable process. For me, the next step is a project-level agent that manages implementation of that plan by treating skills as atomic process definitions. It can chain those skills together, enforce quality gates between phases, and produce reports that show what was supposed to happen, what actually happened, and whether the completion criteria were met.

## Summary

Squad changed how I work. What mattered was not getting a slightly better answer from one agent. What mattered was getting a repeatable multi-agent process. Separate build and review teams, explicit skills, quality gates, and shared reports create a clearer path to "done" with less guesswork. Copilot helps me generate; Squad helps me run the work.



---
