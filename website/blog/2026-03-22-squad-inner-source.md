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

When you clone a repo, you usually get code and a README. If you're lucky, there's a CONTRIBUTING.md. What you don't get is the context — why decisions were made, how the team works, what the conventions actually are in practice.

[Brady Gaster's Squad](https://github.com/bradygaster/squad) fixes that. It runs on GitHub Copilot CLI, and it commits the team's context directly into the repo.

<!-- truncate -->

![A labyrinth of colorful doors and tangled vines representing contributor friction in an unfamiliar codebase](./media/2026-03-22-squad-inner-source/01-friction-wall.png)

## What Squad is

Squad is an agentic virtual team that lives in your repo as a committed `.squad/` directory. Each agent has a role, a charter, and a persistent memory file (`history.md`). The team shares a `routing.md` that defines who handles what and a `decisions.md` that tracks what the team has deliberated.

Brady's framing: "Not a chatbot wearing hats." Each agent has a defined scope and accumulates context over time. They aren't stateless prompts.

Here's what the `.squad/` directory contains:

- **Agent charters** — each agent's role and scope
- `routing.md` — who handles what
- `decisions.md` — what the team has deliberated
- `ceremonies.md` — structured checkpoints like design reviews and retrospectives
- `history.md` per agent — what each agent has learned about the project
- `.squad/skills/{name}/SKILL.md` — reusable playbooks for common tasks

Squad ships with two built-in skills:
- `humanizer` — enforces communication tone (warm openings, active voice, empathy markers)
- `external-comms` — handles community workflows (issue triage, response templates, confidence flagging)

## What you get when you clone

I'm writing this from the contributor's seat, not the repo owner's seat. Brady wrote about [building Squad](https://github.com/bradygaster/squad). Tamir Dresher wrote about [scaling it across an enterprise](https://tamirdresher.com/2026/03/12/scaling-ai-part2-collective). This is what it looks like to clone a repo that already has `.squad/` committed.

You `git clone` a repo. You find a `.squad/` directory. Inside:

- Agents with charters explaining what they do and why
- `decisions.md` showing what the team has already figured out
- `history.md` files showing what each agent has learned about this specific codebase
- Ceremonies defined — no need to negotiate how design reviews work
- Skills already set up for how this team communicates

You run `squad`. You have a team that already knows the codebase.

That context — why the auth flow works that way, what naming conventions to follow, which files the developer agent avoids — is the part that documentation almost never captures. It's usually locked in the heads of whoever built the thing.

![A radiant community gathering where each figure glows with their unique skill, representing the squad gift cloned with every repo](./media/2026-03-22-squad-inner-source/02-squad-gift.png)

## For teams sharing codebases across groups

In larger orgs, platform teams publish projects that other teams contribute back to. The code part usually works fine. The knowledge part doesn't. Institutional knowledge stays with the three people who built the original service.

When a team commits their `.squad/` to a shared project, a contributor cloning for the first time gets:

- The ceremonies already defined
- The routing rules already set
- Agent memory that already knows the edge cases and naming conventions

The `.squad/` files travel with the repo through normal `git clone` and fork operations. No special Squad setup required. The team comes along with the code.

READMEs and wikis go stale because nobody owns them. The `.squad/` files are version-controlled and updated as the team works — they stay current because they're part of the workflow, not separate from it.

![A luminous bridge of tropical flowers and circuit patterns connecting two team villages, representing project knowledge flow across teams](./media/2026-03-22-squad-inner-source/03-inner-source-bridge.png)

## For open source maintainers

A lot of OSS maintainer burnout comes from onboarding overhead. Same questions get answered over and over. PRs miss conventions. Issues get filed by people who didn't understand the project's scope.

Committing `.squad/` doesn't eliminate that, but it helps. Here's how the `external-comms` skill works in practice:

1. A new contributor files an issue
2. The skill scans for unanswered items and classifies the response type
3. It drafts a reply using the matching template
4. The maintainer reviews the draft and flags it: 🟢 high / 🟡 medium / 🔴 needs review
5. The maintainer types `pao approve`
6. The contributor gets a prompt, on-brand response

Same pattern works for frustrated bug reports or questions that are really feature requests. The maintainer reviews instead of drafts from scratch every time.

![A contributor standing in a blooming garden surrounded by glowing skill badges, celebrating a successful first contribution](./media/2026-03-22-squad-inner-source/04-contributor-success.png)

## When you come back to a contribution after a break

Most contributions don't happen in one sitting. You open a PR, get feedback, come back three weeks later, and have to reconstruct everything — re-read the issue, re-read the diff, try to remember where you left off.

Each agent's `history.md` is persistent state. When you come back, the agent remembers what it was working on, what decisions were made mid-contribution, and what was left open. You resume from where you stopped instead of starting from scratch.

## I'm using Squad on this blog

My blog repo has a Squad team: Isabela (writer), Dolores (editor), Julieta (SEO), Luisa (publisher), and a developer agent. Each one has a charter and accumulated history about this blog — its Docusaurus setup, its structure, its audience.

This post was drafted by Isabela, my writer agent. Julieta handled the SEO front matter. Dolores edited it. Luisa will open the PR.

The useful part isn't that AI drafted this. It's that the team's context is version-controlled and committed to the repo. If a guest author clones this blog repo someday, they run `squad` and get a team that already knows how this blog works — the conventions, the voice, the publishing workflow. They don't have to ask me.

![An aerial view of a ceremonial circle in a tropical garden, representing the Squad team ceremonies that come with every clone](./media/2026-03-22-squad-inner-source/05-ceremonies-circle.png)

## What to do next

- **Try Squad:** [github.com/bradygaster/squad](https://github.com/bradygaster/squad)
- **See a real example:** Look at the `.squad/` directory in [this blog's repo](https://github.com/dfberry/dfberry.github.io) — it's the actual team that drafted this post
- **For OSS maintainers:** Consider committing your `.squad/` directory. Contributors get the team context along with the code.

---

*Images generated with Stable Diffusion XL — tropical magical-realism palette.*
