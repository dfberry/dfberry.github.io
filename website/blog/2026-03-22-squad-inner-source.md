---
slug: /2025-squad-inner-source-collaboration
canonical_url: https://dfberry.github.io/blog/2026-03-22-squad-inner-source
custom_edit_url: null
sidebar_label: "Squad: Project Collaboration"
title: "Squad: Accelerating Project Collaboration with Agentic Teams"
description: "How Brady Gaster's Squad uses GitHub Copilot CLI agents to enable faster, broader project collaboration through team ceremonies and skills."
published: false
tags:
  - GitHub Copilot
  - GitHub Copilot CLI
  - Projects
  - Developer Experience
  - AI-Assisted Development
  - Agentic Workflows
  - Open Source
updated: 2026-03-22 00:00 PST
---

# Squad Gives Every Contributor a Team That Already Knows the Codebase

When you clone a repo — to fix a bug, add a feature, or extend it for your own purposes — you usually get code and a README. If you're lucky, there's a CONTRIBUTING.md. What you don't get is the context — why decisions were made, how the team works, what the conventions actually are in practice.

[Brady Gaster's Squad](https://github.com/bradygaster/squad) provides the context for a contributor to be successful in open source or inner source projects. It runs on GitHub Copilot CLI, and it commits the team's context directly into the repo.

<!-- truncate -->

![A labyrinth of colorful doors and tangled vines representing contributor friction in an unfamiliar codebase](./media/2026-03-22-squad-inner-source/01-friction-wall.png)

## What Squad is

Squad is an agentic virtual team that lives in your repo as a committed `.squad/` directory. Each squad member (agent) has a charter (role description), and a history (persistent memory). The team knows who handles what and tracks what the team has deliberated.

Brady's framing: "Not a chatbot wearing hats." What that means in practice: each squd agent has a specialization, bounded scope and a memory that persists across sessions — not a single prompt with personas bolted on.

Here's what the `.squad/` directory contains:

- **Agent charters** — each agent's role and scope
- `routing.md` — who handles what
- `decisions.md` — what the team has deliberated
- `ceremonies.md` — structured checkpoints like design reviews and retrospectives
- `history.md` per agent — what each agent has learned about the project
- `.squad/skills/{name}/SKILL.md` — reusable playbooks for common tasks

Skills are community-contributed. When you commit `.squad/` to your repo, you're sharing not just your team setup but any skills your team has built. Contributors who clone inherit those too.

An squad member's directory starts with a charter. Over time the charter and history grows: 

A charter can include:

- **Identity** — the agent's role, expertise, and working style
- **What I Own** — the specific concerns this agent is responsible for (architecture decisions, code review, release management, etc.)
- **How I Work** — operating principles: proposal-first changes, reviewer lockout rules, what compounds over time
- **Boundaries** — explicit list of what this agent handles and what it doesn't, so work routes correctly
- **Model** — which AI model to use for this agent's tasks

Brady's `flight` charter, for example, says Flight owns architecture and code review, operates proposal-first for meaningful changes, and enforces reviewer rejection lockout. That's the contract any contributor gets when they clone — they know exactly what Flight will and won't take on before they ask.

## What you get when you clone

I'm writing this from the contributor's seat, not the repo owner's seat. Brady wrote about [building Squad](https://github.com/bradygaster/squad). Tamir Dresher wrote about [scaling it across an enterprise](https://tamirdresher.com/2026/03/12/scaling-ai-part2-collective). This is what it looks like to clone a repo that already has `.squad/` committed.

You `git clone` a repo. You find the `.squad/` directory described above. You run `squad`. You have a team that already knows the codebase — and that context travels with the clone.

That context — why the auth flow works a particular way, what naming conventions to follow, which files to avoid — is the part that documentation almost never captures. It may be locked in the heads of whoever built the thing. Here, it's committed to the repo.

## You don't have to read the docs to get started

New contributors spend hours reading docs before they can ask the first useful question. They scan the README. They check issues. They post in Discord and wait two days for an answer that half-answers the question. By the time they have enough context to open a PR, they've spent more time on onboarding than on the actual contribution.

When `.squad/` is committed, you clone and ask. The agents already know the codebase. They know why the auth flow works the way it does, what naming conventions mean, which files to avoid. You're not querying a static document. You're talking to something that has accumulated knowledge about this specific project.

You clone. You run `squad`. You ask the agent your question. You get an answer from something that's actually worked in the repo — not from a README written two years ago. The back-and-forth that normally happens in issues or Slack happens inside your editor instead.

The first hour of a contribution feels different. You're not looking for context. You already have it.

## Your first PR fits the project by default

You spend a week building a feature. You open a PR. You get a wall of review comments — not about the code, but about the approach. Wrong naming convention. Decision reversed six months ago. Pattern the team doesn't use anymore. The code works. The direction was wrong. "Good work, wrong direction."

This happens because you were working without the project's context. You built something reasonable. You just didn't know what "reasonable" meant for this specific codebase.

When you work with agents that already know `routing.md`, `decisions.md`, and the agent histories, your code ends up aligned with the project's patterns. Not because you read a style guide. Because the squad you used already knew those patterns. The PR fits because the squad you cloned already fits.

Your first PR doesn't have to look like a first PR. It can look like a contribution from someone who already knows the project. Because the team you used does.

## Check your approach before you build it

When you're planning a contribution, the hard part isn't writing the code. It's knowing whether your approach fits the project's decisions and patterns. You can spend a day building something only to get a PR review that says "good work, wrong direction."

With `.squad/` committed, you can describe your approach to the squad before writing a line of code and find out if it holds up — because `decisions.md` has already captured what the team deliberated, and the agents know the patterns. You're validating against the project's actual history, not a README.

## Experimenting with a squad already in place

When a repo ships with `.squad/`, experimenting is cheap. You don't have to justify an idea from a blank slate. The team is already loaded — conventions, patterns, past decisions all in place.

You can throw an idea at the squad and ask if it makes sense. You don't spend an hour loading context first. You just try it.

The barrier to "let me just try this" is lower. You ask them if an approach holds up. You iterate fast.

This is different from resuming interrupted work. This is starting something new, uncertain, exploratory — and having the team already there to help you pressure-test it.

![A contributor exploring ideas freely in a luminous tropical workspace, representing the low barrier to experimentation when a Squad team is already in place](./media/2026-03-22-squad-inner-source/04-contributor-success.png)

## The documentation that doesn't go stale

READMEs drift. Wikis drift. The doc says the service uses JWT, the codebase switched to session tokens eight months ago. Nobody updated it because nobody owns the documentation. It gets updated when someone remembers, which is after a new contributor gets confused by it.

The problem isn't effort. It's coupling. Documentation that lives outside the workflow drifts because it's not part of the workflow. Nobody reviews the wiki when they merge a PR.

`decisions.md` is version-controlled and lives in the repo. It gets updated when decisions are made, as part of the same PR. It doesn't drift because it's not separate from the work. It is the work. When you clone, you get documentation that reflects what the team actually decided, not what they intended to document.

The last time it was updated is the last time a real decision was made. That's the only documentation that stays current.

## The playbooks are already there

Every team discovers the same patterns. How to handle auth edge cases. How to structure tests. How to communicate breaking changes to downstream teams. That knowledge usually lives in one person's head and a chat thread that nobody can find.

`.squad/skills/` is committed and versioned. Playbooks travel with the clone. When you clone a repo that has skills set up, you inherit everything the team has already figured out.

Once a skill is committed, every contributor inherits it.

## The process is committed, not negotiated

Cross-team contributions stall before a line of code is written. "How do you run design reviews here?" "Who needs to sign off before I submit?" "Do you do retrospectives, and if so, when?" Legitimate questions. But you're spending contribution time on process questions the team already answered.

`ceremonies.md` commits the process. Design reviews, retrospectives, approval checkpoints — all defined and inherited. When you clone, you know how the team works.

No chat messages asking about the review process. No waiting for someone to walk you through the workflow. You cloned it.

## The guardrails are in the repo

In regulated environments and large orgs, contributors don't always know what they're not allowed to do. Security patterns, compliance constraints, governance requirements — tribal knowledge. You find out about them in code review, after you've already built the thing the wrong way.

Because `decisions.md` captures governance decisions — strict typing requirements, security patterns, constraints on external dependencies — the agents already know the guardrails. When you work with the squad, you're working within them automatically.

You find out before the PR, not during it.

## For open source maintainers

Brady set his standards once. How decisions get made. Which naming conventions to use. How the review process works. What patterns to follow. That all lives in `.squad/` — committed, versioned, part of the repo. Flight, the team lead, is the agent who holds those conventions. You don't have to ask Brady what Flight already knows.

I cloned bradygaster/squad and ran `squad`. I was working with Flight's conventions and routing rules — the standards Flight set as lead. When I made changes, they aligned with those standards because the squad I was using already knew them. I didn't have to read a style guide. I didn't have to ask which agent handles what. The team I inherited had that context.

My PR looked like it came from someone who already knew the project. Because the squad I used already did know it. Brady reviews a conforming contribution instead of explaining the same conventions again. The standards travel with the code. Skills work the same way. The [`external-comms`](https://github.com/bradygaster/squad/tree/main/.squad/skills/external-comms) skill handles community response workflows — PAO wrote it and owns it. It ships in `.squad/`. Every contributor who clones inherits PAO's communication playbooks without having to ask.

![A luminous bridge of tropical flowers and circuit patterns connecting two team villages, representing how Brady's standards and conventions automatically travel with cloned repos—contributors conform without friction](./media/2026-03-22-squad-inner-source/03-inner-source-bridge.png)

## For teams sharing codebases across groups

In larger orgs, platform teams publish projects that other teams contribute back to. The code part usually works fine. The knowledge part doesn't. Institutional knowledge stays with the three people who built the original service.

When a team commits their `.squad/` to a shared project, a contributor cloning for the first time gets:

- The ceremonies already defined
- The routing rules already set
- Agent memory that already knows the edge cases and naming conventions

The `.squad/` files travel with the repo through normal `git clone` and fork operations. No special Squad setup required. The team comes along with the code.

READMEs and wikis go stale because nobody owns them. The `.squad/` files don't — they're version-controlled and updated as part of the work.

## Every InnerSource contribution costs less than the last

In InnerSource programs, contributing teams re-learn the same patterns every time they contribute to a platform repo. Each contribution starts from scratch — reading docs, pinging the platform team on Slack, figuring out conventions that haven't changed since the last contribution. The overhead is constant regardless of how many times you've done it.

When `.squad/` is committed, that changes. Agent memory accumulates. Decisions get recorded. The squad gets better at knowing this specific codebase over time. A team that contributed once has a head start on the second contribution.

The re-learning cost doesn't just go down for your team. It goes down for every team that clones. The knowledge compounds across contributors.

Each contribution to a repo with a committed squad makes the next one cheaper. That's what version-controlled institutional knowledge actually means in practice.

## When you come back to a contribution after a break

Most contributions don't happen in one sitting. You open a PR, get feedback, come back three weeks later, and have to reconstruct everything — re-read the issue, re-read the diff, try to remember where you left off.

Each agent's `history.md` is persistent state. When you come back, the agent remembers what it was working on, what decisions were made mid-contribution, and what was left open. You resume from where you stopped instead of starting from scratch.

## What stays when contributors leave

Most open source projects lose knowledge when contributors move on. The person who knew why that decision was made is gone. The README is two years stale. The architecture makes sense to no one still active.

When `.squad/` is committed, the team's accumulated knowledge stays in the repo. Decisions are recorded. Agent histories capture the edge cases and patterns. Someone new who clones the repo six months after the original contributors left still gets a working team with context about the project.

The knowledge isn't locked inside anyone's head. It's committed.

![A glowing record of knowledge preserved in a tropical garden setting, representing the institutional memory that stays in the repo when contributors move on](./media/2026-03-22-squad-inner-source/05-ceremonies-circle.png)

## Your PR can improve the squad, not just the code

When you contribute to a repo with `.squad/`, your PR doesn't have to be code only. If you found a pattern that should be remembered, you can add it to an agent's `history.md`. If you ran into an edge case the team should know about, add it to `decisions.md`. If you built something reusable, write a skill.

The `.squad/` files are part of the repo. They're versioned, they're reviewed in PRs, they travel with the codebase. A contribution that improves the team infrastructure is as valuable as a contribution that improves the code.

You leave the project better than you found it. Not just the code — the team.

## A concrete example: committed `.squad/` in practice

My blog repo has a Squad team: Mirabel (lead), Isabela (writer), Dolores (editor), Julieta (SEO), and Luisa (full-stack TS dev). Each one has a charter and accumulated history about this blog — its Docusaurus setup, its structure, its audience. This post was drafted by Isabela. Julieta handled the SEO front matter. Dolores edited it. Luisa will open the PR.

The useful part isn't that AI drafted this. It's that the team's context is version-controlled and committed to the repo. If a guest author clones this blog repo someday, they run `squad` and get a team that already knows how this blog works — the conventions, the voice, the publishing workflow. They don't have to ask me.

![A radiant gift box overflowing with scrolls, banners, and glowing crystals, symbolizing the committed Squad directory that travels with every cloned repo—conventions, routing, history, and skills all included](./media/2026-03-22-squad-inner-source/02-squad-gift.png)

## What to do next

- **Try Squad:** [github.com/bradygaster/squad](https://github.com/bradygaster/squad)
- **See a real example:** Look at the `.squad/` directory in [this blog's repo](https://github.com/dfberry/dfberry.github.io) — it's the actual team that drafted this post
- **For OSS maintainers:** Consider committing your `.squad/` directory. Contributors get the team context along with the code.

---

*Images generated with Stable Diffusion XL — tropical magical-realism palette.*
