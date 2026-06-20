---
slug: /2026-06-20-squad-first-impressions
authors: [dfberry]
date: 2026-06-20
image: ./media/2026-06-20-squad-first-impressions/watercolor-1-hero.png
canonical_url: https://dfberry.github.io/blog/2026-06-20-squad-first-impressions
custom_edit_url: null
sidebar_label: "2026.06.20 Squad First Impressions"
title: "Squad: RememberingMulti-Agent Orchestration"
description: "First impressions of Squad, the multi-agent orchestrator for GitHub Copilot. What changes when you stop asking one AI generalist for everything and start directing a team of specialist agents instead."
draft: true
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
---
Squad was captivating because it immediately provided more than Copilot. Copilot uses the model to fullfil the request. Copilot can vary based on the context and prompt but its the same model. [Squad](https://bradygaster.github.io/squad/), the first time I used it, brought a team of specialists to the request and the answer was so much better. 

When I talk to other Squad users, that's also their first Aha moment. The specialists produced better results. 

I ran my first Squad workflow on a docs task I'd already done with a single Copilot agent. The output was so much more complete I went back to check that it was the same prompt. I consider Squad a multi-agent orchestrator. It lets me run specialists on the same task instead of asking one generalist to do everything.

 This post came out of a coworker asking me, "Why Squad?"

![Watercolor illustration of a sunlit woodworking workshop with a team working on projects.](./media/2026-06-20-squad-first-impressions/2026-06-20-squad-first-impressions-watercolor-1-hero.png)

## One Copilot generalist vs. a team of specialists

Before Squad, my workflow was: open Copilot, ask it everything. It covers a lot of ground. Code, docs, PR review, debugging. But it's still one perspective.

When I ran Squad on that same task, the answer came back with fewer blind spots. It didn't just sound smarter. It covered angles the generalist missed.

That's when I started thinking about what agents I need on my Squad team. There were the obvious agents for any project but as some of my project became more unique, I created agents that would have expertise and opinions (what does good code look like). Now I have a team of ~30 agents. 

## I'm directing now, not doing

When I use Squad, I'm not the person doing the work. I'm the person directing the Squad. The Squad coordinate picks the team to build the thing I need. I set the standards and make the judgment calls. I can direct at a high level with a plan or direct at a lower level with a specific task. 

I'm constantly ask Squad how can it make better overall decisions and I direct it less.

## Why BUILD and REVIEW should use separate agents

The BUILD team and the REVIEW team need to be two different groups. I didn't start there. My first Squad runs were about getting better output from specialists than I was getting from one generalist.

The separate review team came later. Eventually I had eight reviewers, each assigned to look for a different kind of mistake. That made the pattern reusable. One reviewer looks for security problems, another checks facts, another tries to break the logic. I don't want eight nods. I want eight different objections. They worked together to update and improve the code until all 8 agreed. 

![Watercolor illustration team examining the same cabinet](./media/2026-06-20-squad-first-impressions/watercolor-2-build-review.png)

A single generalist reviewing its own output gives me self-consistency. That's not the same thing as complete and correct output.

## "Did it finish?" is the wrong question

Before Squad, I was asking: *Did it work? What needs to change? Is this done?*

With Squad, the real question becomes: **How can it do more consistently?**

Who else should look at this? What assumption did the build team make that needs pressure-testing? What would the performance engineer say if I added them to the review?

I'm not just relieved something exists. I'm figuring out how to make it better.

## Try it once, with the same task

I picked something I'd normally hand to one Copilot agent and ran it twice — once with a BUILD team, once with a different REVIEW team. I saw what the REVIEW team caught. That's exactly why Squad is interesting to me. It changes the job from working with a generalist to running a better process with my Squad agents. I want to see how far that goes.

## Management skills

Now that I have a team of agents, my ability to manage them at a higher level is critical. I think in terms of plans and processes. This means projects have to be defined and continue to be updated and refined. The Squad builds to the plan, reviews to the plan, and both the Squad and I know when done its. 

Each project moves from manual steps to a more complete plan. The plan is implemented more consistently each time. Now, I'm moving to a project agent which can manage the plan for me. I still review, but the clear and specific output in the plan means Squad can review its own work. As my confidence in the project agent improves, now I'm looking at automating the project agent. That's a natural progression. 



---
