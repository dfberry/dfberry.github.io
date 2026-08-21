---
slug: /2026-08-21-maintaining-ai-slop-over-2-years
date: 2026-08-21
canonical_url: https://dfberry.github.io/blog/2026-08-21-maintaining-ai-slop-over-2-years
custom_edit_url: null
sidebar_label: "2026.08.21 AI slop maintenance"
title: "Maintaining AI Slop Over 2 Years"
description: "A practical field guide for growing an AI-generated project over a two-year window."
tags:
  - ai
  - maintenance
  - software quality
  - technical debt
  - workflows
keywords:
  - ai slop maintenance
  - long term ai quality
  - maintainable ai outputs
  - ai generated code debt
  - two year maintenance plan
---

# Maintaining AI slop over 2 years

Two years ago seems like decades in the world of AI. _AI slop_ wasn't a term I was familiar with, and the project I started with AI was meant to be short-lived—a stopgap until systems and people caught up to support the work. 

![Woman on road littered with debris](./media/2026-08-21-maintaining-ai-slop-over-2-years/hero-2.png)

## Stage 1 - time-savings over process design

Because it was meant to be a short-term solution, I didn't care about the what or how as much as the output and time savings. I didn't spend much time on it and certainly didn't _architect_ it in any meaningful way. It was a markdown file - a prompt.

Back then, there was little concern for context size and the only harnesses were custom-made or 3rd party like LangChain. 

It read source code and output what I asked it to based on my ever-growing prompt file. I fiddled with it when I had time but usually just took the output and made manual edits as needed. 

## Stage 2 - shifting sands of source code

There were a few bumps in the road that caused the prompt file to sputter and halt. The related source code repo moved. That was just one place in the prompt file - an easy change. Then the source code repo completely refactored into a monorepo - that was much harder. The prompt file was looking at specific folders, files, classes and property names. A much bigger change to the prompt file. And of course, I still had other things to do. 

Then the source project became much more popular and the feature set grew. Lots of changes and additions. This resulted in a short cycle of my wondering if AI, or my prompt file needed another rewrite. 

At this point, I thought regex and a script might be faster. Leave any LLM decision/transition until later. 

This was becoming an experiment in how to gain efficiency in a rapidly changing AI world. 

## Stage 3 - back to reality

While I was considering shifting to a code-based solutions, the source repo created a CLI to reveal its features. That was exactly what I needed: a dependable input to my process. 

The AI SDKs had also progressed, so instead of regex and a script, I switched to .NET and the OpenAI SDK for chat completions. This time I designed the process deliberately, and Copilot Chat in VS Code was available, which helped accelerate development.

This time the architecture, project structure, maintainability, and testability were top considerations as I was still relying on _this thing_ to help me. 

There were a few iterations of this but it was beginning to hum along. 

## Stage 4 - the infrastructure

Since I only had the OpenAI resource in Azure, I kept it live and never shut it down. However, I used keys instead of managed identity—not because I didn't know the best practices, but simply because I lacked the time to implement them. 

I was doing a lot of Bicep work, not an expert but not a newbie either, so cooking up the `./infra` and `azure.yml` for Azure Developer CLI wasn't hard. Adding the RBAC roles for managed identity helped. And then finally I had that repeatable infrastructure I told everyone else they should have. 

## Stage 5 - monkey on the keyboard

The underlying project repo had matured significantly, the source code had stabilized, and _my system_ was working well for its purpose too. However, as _AI slop_ became an industry term, the underlying project matured alongside the industry specs it supported but my project had not. 

I managed the project in chat one turn at a time, and the .NET app generated the output. However, every change to the system required several to many turns, redirections, and re-runs. AI kept making the same mistakes, and I spent my time minute by minute watching the output to see when it went off track. I needed a better process—a process to manage the process. 

## Stage 6 - hiring a squad

It was around this time I started working with Brady Gaster's Squad. Having a team of agents accelerated progress and caught issues and inconsistencies I hadn't been able to spot before. I onboarded Squad to the repo and had them take on much of the work. 

## Stage 7 - industry grows up

While I was learning Squad's inner workings, `SKILL.md` and `agent.md` specifications emerged. I dug into skills first to impose structure on my manual process management. I used WAZA and other frameworks to understand context size, triggers, and evaluations. 

Building and maintaining skills locally gave me practical understanding of task boundaries, debugging, and chaining. Working with these units of AI many times a week gave me opportunities to fail.

## Stage 8 - leaving Squad behind

Squad is an amazing build and maintenance platform. However, I need skills that succeed independently. The plugin specification is now available, so I took my chained skills, wrapped them in an orchestrating agent to manage gates between skills and human review, and packaged everything as a plugin.  

## Stage 9 - the agent and the app

What about the .NET app? It's now used only when the agent determines it needs that full pipeline. The agent and skills handle most of the work. 

## Conclusion 

You'll likely continue to hear a lot about AI slop. Just like any industry, AI is maturing and developing better specifications and expectations. Look for them and try them out.

Focus on the fundamentals available at the time. Build with principles and practices that support them. Grow with industry specifications that enable better results.  
