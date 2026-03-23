---
slug: /2025-squad-inner-source-collaboration
canonical_url: https://dfberry.github.io/blog/2026-03-22-squad-inner-source
custom_edit_url: null
sidebar_label: "Squad: Project Collaboration"
title: "Squad: Accelerating Project Collaboration with Agentic Teams"
description: "How the Squad tool uses GitHub Copilot CLI agents to enable faster, broader project collaboration through team ceremonies and skills."
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

Think about arriving in a foreign city for the first time. You have the map app. Maybe you grabbed a brochure at the airport. But neither tells you which neighborhoods locals actually eat in, which bus goes where on weekends, or why everyone avoids the shortcut through the park. That knowledge lives with people who know the place.

When you clone a repo — to fix a bug, add a feature, or extend it for your own purposes — you usually get code and a README. If you're lucky, there's a CONTRIBUTING.md. What you don't get is the context — why decisions were made, how the team works, what the conventions actually are in practice.

[Brady Gaster's Squad](https://github.com/bradygaster/squad) provides the context for a contributor to be successful in open source or inner source projects. It runs on GitHub Copilot CLI, and it commits the team's context directly into the repo.

<!-- truncate -->

![A brightly painted seaplane gliding toward a colorful tropical dock over turquoise water with coral pennants, representing the excitement and uncertainty of approaching an unfamiliar codebase](./media/2026-03-22-squad-inner-source/01-friction-wall.png)

## What Squad is

Think of Squad as the resort staff committed to the repo. Not a single chatbot wearing different hats — more like a concierge who knows the layout, a activities director who runs the itinerary, a front desk that remembers every returning guest. Each staff member has a specific role, a bounded area of responsibility, and a memory that carries over from one stay to the next.

That staff lives in your repo as a committed `.squad/` directory. Each squad member (agent) has a charter — their job description — and a history — what they've learned about this particular property. Each agent has a specialization, bounded scope, and a memory that persists across sessions.

Here's what checks in with you when you clone:

- **Agent charters** — each staff member's role, scope, and working style
- `routing.md` — who handles what request
- `decisions.md` — the house rules and decisions the team has already made
- `ceremonies.md` — structured checkpoints: design reviews, retrospectives, approval rounds
- `history.md` per agent — what each staff member has learned about this specific project
- `.squad/skills/{name}/SKILL.md` — the hotel's service playbooks, written by staff who've done the work

Skills are community-contributed. When `.squad/` is committed to a repo, you getnot just the team setup but the playbooks the team has built. Contributors who clone inherit those too.

Each staff member's charter grows over time. A charter can include:

- **Identity** — the agent's role, expertise, and working style
- **What I Own** — specific responsibilities (architecture decisions, code review, release management)
- **How I Work** — operating principles: proposal-first changes, reviewer lockout rules, what compounds over time
- **Boundaries** — what this agent handles and what it doesn't, so requests route correctly
- **Model** — which AI model to use for this agent's tasks

The _Squad_ repo owner's `flight` charter, for example, says Flight owns architecture and code review, operates proposal-first for meaningful changes, and enforces reviewer rejection lockout. That's the house policy any contributor gets when they clone — they know exactly what Flight will and won't take on before they ask.

## What you get when you clone

You `git clone` a repo. You find the `.squad/` directory described above. In a terminal, you run `squad` with `copilot --agent squad --yolo --autopilot`. You have a team that already knows the codebase — and that context travels with the clone.

### Without squad

The README is a tourist brochure — written for strangers, enough to get you oriented, not enough to get you anywhere useful. They scan it anyway. They check issues. They post in the right discussion and wait two days for an answer that half-answers the question. By the time they have enough context to open a PR, they've spent more time on onboarding than on the actual contribution.

### With squad

When `.squad/` is committed, you clone and ask. The agents aren't tourist brochures. They're the concierge who's been at the hotel for years — the one who knows which recommendations are actually good, not the ones on the laminated card in the drawer. They know why the auth flow works the way it does, what naming conventions mean, which files to avoid. You're not querying a static document. You're talking to something that has accumulated knowledge about this specific project.

The first contribution feels different. You're not looking for context. You already have it.

## Validate your approach before you build

When you're planning a contribution, the hard part isn't writing the code. It's knowing whether your approach fits the project's decisions and patterns before you're invested in it.

### Without squad

Ask the concierge before you book the day trip. You can go research it yourself — spend an hour reading reviews and then find out it's closed on Tuesdays. Or you ask someone who already knows the terrain. 

### With squad

With `.squad/` committed, you describe your approach to the squad before writing a line of code and find out if it holds up — because `decisions.md` has already captured what the team deliberated, and the agents know the patterns. You're validating against the project's actual history, not a README.

## Try new things

When a repo ships with `.squad/`, experimenting is cheap. You don't have to justify an idea from a blank slate. The team is already loaded — conventions, patterns, past decisions all in place.

### Without squad

Experimenting in an unfamiliar repo without guidance is like wandering a foreign city without a local to ask. You want to try something — a new approach, a shortcut you think might work. But you don't know the neighborhood. You don't know if that street is a dead end or if it leads somewhere useful. You don't know if someone already tried this route and gave up.

So you hedge. You spend an hour reading issues trying to figure out if your idea is reasonable. You post a question and wait two days for a reply that half-answers it. By the time you've loaded enough context to feel confident trying something, the curiosity has cooled. The idea felt cheaper before you knew how much it would cost to validate.

Most experiments never start. Not because they were bad ideas — because the cost of finding out was too high.

### With squad

You can throw an idea at the squad and ask if it makes sense. You don't spend an hour loading context first. You just try it.

The barrier to "let me just try this" is lower. You ask them if an approach holds up. You iterate fast.

![A cheerful traveler leaning over maps spread across a bright hotel lobby table surrounded by tropical plants and gold tilework, representing how contributors can plan and validate their approach with the squad team before writing a line of code](./media/2026-03-22-squad-inner-source/04-contributor-success.png)

## Your first PR fits the project by default

You spend a week building a feature. You open a PR. You get a wall of review comments — not about the code, but about the approach. Wrong naming convention. Decision reversed six months ago. Pattern the team doesn't use anymore. The code works. The direction was wrong. "Good work, wrong direction."

That's the wrong-district problem. You walked confidently for an hour. Then you found out you were in the wrong part of town the whole time. The effort was real. The orientation wasn't.

This happens because you were working without the project's context. You built something reasonable. You just didn't know what "reasonable" meant for this specific codebase.

When you work with agents that already know `routing.md`, `decisions.md`, and the agent histories, your code ends up aligned with the project's patterns. Not because you read a style guide. Because the squad you used already knew those patterns. The PR fits because the squad you cloned already fits.

Your first PR doesn't have to look like a first PR. It can look like a contribution from someone who already knows the project. Because the team you used does.

## The guardrails are already there

In regulated environments and large orgs, contributors don't always know what they're not allowed to do. Security patterns, compliance constraints, governance requirements — tribal knowledge. You find out about them in code review, after you've already built the thing the wrong way.

Because `decisions.md` captures governance decisions — strict typing requirements, security patterns, constraints on external dependencies — the agents already know the guardrails. When you work with the squad, you're working within them automatically.

You find out before the PR, not during it.

## What you inherit when you clone

Every team discovers the same patterns. How to handle auth edge cases. How to structure tests. How to communicate breaking changes to downstream teams. That knowledge usually lives in one person's head and a chat thread that nobody can find.

`.squad/skills/` is committed and versioned. Playbooks travel with the clone. When you clone a repo that has skills set up, you inherit everything the team has already figured out. Once a skill is committed, every contributor inherits it.

Cross-team contributions stall before a line of code is written. "How do you run design reviews here?" "Who needs to sign off before I submit?" "Do you do retrospectives, and if so, when?" Legitimate questions. But you're spending contribution time on process questions the team already answered.

`ceremonies.md` commits the process. Design reviews, retrospectives, approval checkpoints — all defined and inherited. When you clone, you know how the team works. No chat messages asking about the review process. No waiting for someone to walk you through the workflow. You cloned it.

## When you come back to a contribution after a break

Most contributions don't happen in one sitting. You open a PR, get feedback, come back three weeks later, and have to reconstruct everything — re-read the issue, re-read the diff, try to remember where you left off.

Each agent's `history.md` is persistent state. When you come back, the agent remembers what it was working on, what decisions were made mid-contribution, and what was left open. You resume from where you stopped instead of starting from scratch.

## Your PR can improve the squad, not just the code

When you contribute to a repo with `.squad/`, your PR doesn't have to be code only. If you found a pattern that should be remembered, you can add it to an agent's `history.md`. If you ran into an edge case the team should know about, add it to `decisions.md`. If you built something reusable, write a skill.

The `.squad/` files are part of the repo. They're versioned, they're reviewed in PRs, they travel with the codebase. A contribution that improves the team infrastructure is as valuable as a contribution that improves the code.

You leave the project better than you found it. Not just the code — the team.

## For open source maintainers

The repo owner set their standards once. How decisions get made. Which naming conventions to use. How the review process works. What patterns to follow. That all lives in `.squad/` — committed, versioned, part of the repo. Like a hotel's house rules printed in the welcome booklet, they travel with every clone. Flight, the team lead, is the agent who holds those conventions. You don't have to ask the repo owner what Flight already knows.

I cloned bradygaster/squad and ran `squad`. I was working with Flight's conventions and routing rules — the standards Flight set as lead. When I made changes, they aligned with those standards because the squad I was using already knew them. I didn't have to read a style guide. I didn't have to ask which agent handles what. The team I inherited had that context.

My PR looked like it came from someone who already knew the project. Because the squad I used already did know it. The repo owner reviews a conforming contribution instead of explaining the same conventions again. The standards travel with the code. Skills work the same way. The [`external-comms`](https://github.com/bradygaster/squad/tree/main/.squad/skills/external-comms) skill handles community response workflows — PAO wrote it and owns it. It ships in `.squad/`. Every contributor who clones inherits PAO's communication playbooks without having to ask.

![A flower-covered arched footbridge connecting two colorful island resorts over bright turquoise water in golden morning light, representing how the repo owner's standards and patterns travel across team and org boundaries](./media/2026-03-22-squad-inner-source/03-inner-source-bridge.png)

## For teams sharing codebases across groups

In larger orgs, platform teams publish projects that other teams contribute back to. The code part usually works fine. The knowledge part doesn't. Institutional knowledge stays with the three people who built the original service.

When a team commits their `.squad/` to a shared project, a contributor cloning for the first time gets:

- The ceremonies already defined
- The routing rules already set
- Agent memory that already knows the edge cases and naming conventions

The `.squad/` files travel with the repo through normal `git clone` and fork operations. No special Squad setup required. The team comes along with the code.

## Knowledge compounds over time

In InnerSource programs, contributing teams re-learn the same patterns every time they contribute to a platform repo. It's like a business traveler who stays at the same hotel four times a year but can never remember where the gym is. The hotel hasn't changed. The knowledge just didn't carry over. Each contribution starts from scratch — reading docs, pinging the platform team on Slack, figuring out conventions that haven't changed since the last contribution. The overhead is constant regardless of how many times you've done it.

When `.squad/` is committed, that changes. Agent memory accumulates. Decisions get recorded. The squad gets better at knowing this specific codebase over time. A team that contributed once has a head start on the second contribution. The re-learning cost doesn't just go down for your team. It goes down for every team that clones. The knowledge compounds across contributors. Each contribution to a repo with a committed squad makes the next one cheaper. That's what version-controlled institutional knowledge actually means in practice.

Most open source projects lose knowledge when contributors move on. The person who knew why that decision was made is gone. The README is two years stale. The architecture makes sense to no one still active.

When `.squad/` is committed, the team's accumulated knowledge stays in the repo. Decisions are recorded. Agent histories capture the edge cases and patterns. Someone new who clones the repo six months after the original contributors left still gets a working team with context about the project. The knowledge isn't locked inside anyone's head. It's committed.

![Three hotel staff in a sunlit lobby passing a golden key and journal to a smiling newcomer in magenta and emerald uniforms, representing how institutional knowledge is preserved and passed on rather than lost when contributors move on](./media/2026-03-22-squad-inner-source/05-ceremonies-circle.png)

## A concrete example: committed `.squad/` in practice

My blog repo has a Squad team: Mirabel (lead), Isabela (writer), Dolores (editor), Julieta (SEO), and Luisa (full-stack TS dev). Each one has a charter and accumulated history about this blog — its Docusaurus setup, its structure, its audience. This post was drafted by Isabela. Julieta handled the SEO front matter. Dolores edited it. Luisa will open the PR.

The useful part isn't that AI drafted this. It's that the team's context is version-controlled and committed to the repo. If a guest author clones this blog repo someday, they run `squad` and get a team that already knows how this blog works. It's like checking in and being handed a welcome kit that already has your preferences loaded — not a generic brochure, but something that knows this specific place. The conventions, the voice, the publishing workflow are already there. They don't have to ask me.

![A vibrant welcome hamper overflowing with maps and golden keys at a painted resort door with magenta ribbons, representing the Squad directory that greets every contributor at clone time](./media/2026-03-22-squad-inner-source/02-squad-gift.png)

## What to do next

- **Try Squad:** [github.com/bradygaster/squad](https://github.com/bradygaster/squad)
- **See a real example:** Look at the `.squad/` directory in [this blog's repo](https://github.com/dfberry/dfberry.github.io) — it's the actual team that drafted this post
- **For OSS maintainers:** Consider committing your `.squad/` directory. Contributors get the team context along with the code.

---

*Images generated with Stable Diffusion XL — tropical magical-realism palette.*
