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

When you clone a repo — to fix a bug, add a feature, or extend it for your own purposes — you usually get code and a README. What you don't get is the context — why decisions were made, how the team works, what the conventions actually are in practice.

[Brady Gaster's Squad](https://github.com/bradygaster/squad) provides the context for a contributor to be successful in open source or inner source projects. It runs on GitHub Copilot CLI, and it commits the team's context directly into the repo.

<!-- truncate -->

![A brightly painted seaplane up in the sky gliding toward a colorful tropical dock over turquoise water with coral pennants, representing the excitement and uncertainty of approaching an unfamiliar codebase](./media/2026-03-22-squad-inner-source/01-friction-wall.png)

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

Skills are community-contributed. When `.squad/` is committed to a repo, you get the team setup, expertise, and playbooks the team has built. Contributors who clone, inherit those too.

Each member's charter defines their role, responsibilities, operating principles, and boundaries — so requests route correctly and contributors know what each agent handles. The _Squad_ repo owner's `flight` charter, for example, owns architecture and code review, operates proposal-first for meaningful changes, and enforces reviewer rejection lockout. That's the house policy any contributor gets when they clone.

![A vibrant resort welcome hamper overflowing with illustrated maps, golden keys, and tropical fruit at a painted hotel door, magenta and teal ribbons, representing the full team setup and playbooks that come with every clone](./media/2026-03-22-squad-inner-source/02-squad-gift.png)

## Validate before you build — and experiment freely

When you're planning a contribution, the hard part isn't writing the code. It's knowing whether your approach fits the project before you're invested in it. Think of it as asking for directions before you book your trip, not halfway through.

### Without squad

Experimenting in an unfamiliar repo without guidance is like wandering a foreign city without a local to ask. You don't know if that street is a dead end. You don't know if someone already tried this route and gave up. So you hedge — spend an hour reading issues, post a question, wait two days for a reply that half-answers it. By the time you've loaded enough context to feel confident, the curiosity has cooled. Most experiments never start. Not because they were bad ideas — because the cost of finding out was too high.

### With squad

Describe your approach to the squad before writing a line of code. The agents know `decisions.md`, the patterns, and what the team already tried. You validate against the project's actual history, not a README. It's like asking a local instead of retracing the same wrong streets. Throw any idea at the squad and find out in minutes whether it holds up. The barrier to "let me just try this" is lower. You iterate fast.

![A cheerful traveler leaning over maps spread across a bright hotel lobby table surrounded by tropical plants and gold tilework, representing how contributors can plan and validate their approach with the squad team before writing a line of code](./media/2026-03-22-squad-inner-source/04-contributor-success.png)

## Your first PR fits the project by default

The review comments that sting most aren't about bugs — they're about direction. Wrong pattern, reversed decision, convention nobody wrote down. Here's how that happens, and why it doesn't have to. With squad, it's like having the local map before you start wandering.

### Without squad

You spend a week building a feature. You open a PR. You get a wall of review comments — not about the code, but about the approach. The code works. The direction was wrong. 

That's the wrong-district problem. You walked confidently for an hour. Then you found out you were in the wrong part of town the whole time. The effort was real. The orientation wasn't.

This happens because you were working without the project's context. You built something reasonable. You just didn't know what "reasonable" meant for this specific codebase.

### With squad

When you work with agents that already know `routing.md`, `decisions.md`, and the agent histories, your code ends up aligned with the project's patterns. Not because you read a style guide. Because the squad you used already knew those patterns. The PR fits because the squad you cloned already fits.

![A smiling traveler whose illustrated map matches the colorful neighborhood perfectly, locals waving from painted doorways, teal and coral buildings in warm golden light, representing how squad aligns your first PR with the project's existing patterns](./media/2026-03-22-squad-inner-source/06-first-pr-fits.png)

## The guardrails are already there

Every project has rules that aren't in the README — compliance constraints, security patterns, governance requirements. You usually find out about them after you've already written the wrong thing.

### Without squad

Security patterns, compliance constraints, governance requirements — tribal knowledge. You find out about them in code review, after you've already built the thing the wrong way. It's like discovering the beach is private property after you've already set up your towel.

### With squad

Because `decisions.md` captures governance decisions — strict typing requirements, security patterns, constraints on external dependencies — the agents already know the guardrails. When you work with the squad, you're working within them automatically.

You find out before the PR, not during it.

![A painted beach entrance with cheerful boundary signs in magenta and gold, a traveler pausing to read before stepping forward, turquoise water and palm trees beyond, representing how squad surfaces guardrails before you build the wrong thing](./media/2026-03-22-squad-inner-source/07-guardrails.png)

## What you inherit when you clone

Process knowledge — how the team works, who signs off, what ceremonies exist — rarely travels with the code. It stays in chat threads and people's heads.

### Without squad

Cross-team contributions stall before a line of code is written. "How do you run design reviews here?" "Who needs to sign off?" Legitimate questions — but you're spending contribution time on process the team already answered.

### With squad

`ceremonies.md` commits the process. Design reviews, retrospectives, approval checkpoints — all defined and inherited. `.squad/skills/` commits the playbooks. When you clone, you know how the team works — like a hotel card that tells you breakfast hours and checkout time before you've even unpacked.

![A traveler receiving an ornate illustrated welcome booklet at a golden hotel front desk, warm amber lobby glow and teal and coral tilework behind them, representing how ceremonies and process knowledge travel with every clone](./media/2026-03-22-squad-inner-source/08-what-you-inherit.png)

## Who benefits most

**Open source maintainers:** The repo owner's standards — naming conventions, review process, decision history — live in `.squad/`, committed and versioned. The house rules travel with every clone. I cloned the Squad repo and ran `squad`. My changes aligned with Flight's conventions without reading a style guide. The repo owner reviews a conforming PR instead of explaining the same conventions again.

**InnerSource and platform teams:** In larger orgs, institutional knowledge stays with the three people who built the original service. When a team commits `.squad/` to a shared project, contributors inherit the ceremonies, routing rules, and agent memory that already knows the edge cases. The lay of the land comes with the reservation. The team comes along with the code.

![A flower-covered arched footbridge connecting two colorful island resorts over bright turquoise water in golden morning light, representing how the repo owner's standards and patterns travel across team and org boundaries](./media/2026-03-22-squad-inner-source/03-inner-source-bridge.png)

## Knowledge compounds over time

The biggest hidden cost isn't the first contribution — it's the fourth one, when someone has to re-learn everything they figured out the first time.

### Without squad

Contributors re-learn the same patterns every time they contribute to a repo. It's like a business traveler who stays at the same hotel four times a year but can never remember where the gym is. The knowledge just didn't carry over.

### With squad

When `.squad/` is committed, agent memory accumulates, decisions get recorded, and the squad gets better at knowing this specific codebase over time. A team that contributed once has a head start on the second contribution. Someone who clones the repo six months after the original contributors left still gets a working team with context. The knowledge isn't locked inside anyone's head. It's committed.

![Three hotel staff in a sunlit lobby passing a golden key and journal to a smiling newcomer in magenta and emerald uniforms, representing how institutional knowledge is preserved and passed on rather than lost when contributors move on](./media/2026-03-22-squad-inner-source/05-ceremonies-circle.png)

## What to do next

- **Try Squad:** [github.com/bradygaster/squad](https://github.com/bradygaster/squad)


---

*Images generated with Stable Diffusion XL — tropical magical-realism palette.*
