---
slug: /2025-squad-inner-source-collaboration
canonical_url: https://dfberry.github.io/blog/2026-03-22-squad-inner-source
custom_edit_url: null
sidebar_label: "Squad: Inner Source Collaboration"
title: "Squad: Accelerating Inner Source with Agentic Teams"
description: "How Brady Gaster's Squad uses GitHub Copilot CLI agents to enable faster, broader inner source collaboration through team ceremonies and skills."
published: true
tags:
  - GitHub Copilot
  - GitHub Copilot CLI
  - Inner Source
  - Developer Experience
  - AI-Assisted Development
  - Agentic Workflows
  - Open Source
updated: 2026-03-22 00:00 PST
---

Contributing to a codebase you didn't build has friction. Not because the code is bad — because the collaboration infrastructure isn't there. There's no shared understanding of how work moves, what the rules are, or what's already been figured out. Every contributor reinvents the wheel: builds their own working style, negotiates their own understanding of scope, discovers the same hard-won lessons the last person already learned.

That friction is what kills contributor momentum on both inner source platform libraries and open source projects. And [Brady Gaster's Squad](https://github.com/bradygaster/squad) is the first tool I've seen that addresses it directly.

<!-- truncate -->

## What Squad actually is

When you run `squad`, you might find Isabela drafting your pull request description, Julieta generating SEO metadata, and Dolores flagging a terminology inconsistency — all before you've written a single line. That's Squad in action: an agentic virtual team that lives in your repo as committed files. It runs on GitHub Copilot CLI. You define agents with roles — writer, editor, developer, SEO specialist, whatever your project needs — and each agent gets a charter and a persistent memory in `history.md`; the team shares a `routing.md` that defines who handles what. The team coordinates through a shared `decisions.md` file.

Brady's own framing: "Not a chatbot wearing hats." The distinction matters. Each agent has a defined scope, a point of view, and accumulated context about the project. They aren't stateless prompts. They remember.

The whole team lives in a `.squad/` directory that you commit to the repo like any other source file.

## What you inherit when you clone

When a maintainer commits their `.squad/`, contributors don't clone just code — they clone the collaboration infrastructure. Specifically, four things:

**Ceremonies** — the team rituals defined in `ceremonies.md`. Design reviews before multi-agent work. Retrospectives after failures. These are the structured checkpoints the team runs automatically — you inherit them, you don't invent your own.

**Rules** — what agents can and can't do, what belongs in a PR versus an issue, what the style and scope constraints are. These are pre-set in the routing rules. Not up for renegotiation on every contribution.

**Agent Memory** — the specialized knowledge accumulated in each agent's `history.md` file. If someone already solved how to handle a tricky pattern in this codebase, that solution is captured. You inherit it. The history files are the architecture doc you never got — why the blog is structured this way, why the developer agent avoids the config files, what decisions were made and why.

**Skills** — reusable patterns defined in `.squad/skills/{name}/SKILL.md`. These are team-wide playbooks for common problems. Brady's Squad ships with two: the `humanizer` skill enforces communication tone (warm openings, active voice, empathy markers), and the `external-comms` skill handles community workflows (issue triage, response templates, confidence flagging). When you clone the repo, you inherit not just the project's code style — you inherit its voice and engagement patterns.

None of this replaces reading the code. But it gives you the *reasoning* behind the code — which is the part that documentation almost never captures.

## The contributor's perspective

Most writing about Squad is from people who *own* the repo they're running it in. Brady wrote Squad (he's describing architecture). Tamir Dresher [scaled it across an enterprise team](https://tamirdresher.com/2026/03/12/scaling-ai-part2-collective) (he's describing organizational patterns).

I'm writing from a different seat: the contributor who clones a repo that already has a `.squad/` directory.

You `git clone` a repo. Inside, there's a `.squad/`. It has agents with charters. It has a `decisions.md` showing what the team deliberated. It has `history.md` files showing what each agent has learned.

You run `squad`. You have a team that already knows the codebase.

That's the institutional knowledge transfer that normally takes weeks of meetings and tribal knowledge extraction — compressed into a `git clone`.

## Inner source: friction at org scale

Inner source is the practice of applying open source contribution patterns inside an organization — platform teams publish libraries that consuming teams contribute back to. It works when knowledge flows upstream as freely as code does. It breaks when institutional knowledge is locked in the heads of the three people who built the original service.

Squad's `.squad/` directory maps directly onto this problem.

When a platform team commits their Squad configuration to their inner source repo, consuming teams can clone and immediately understand not just *what* the codebase does but *how the team thinks about it*. The ceremonies are defined. The rules are explicit. The skills are captured. Contributing teams don't spend weeks figuring out the right way to file an issue or structure a PR — they follow the patterns that are already there.

Think of a mobile team cloning the identity platform's repo for the first time. Without Squad, they'd spend a sprint reading Confluence pages and pinging the platform team on Slack. With Squad, the agent memory already knows the auth flow, the edge cases, and the naming conventions. The first PR comes from someone who never met the platform team.

Squad's upstream inheritance is git-native: the `.squad/` files travel with the repo through normal `git clone` and fork operations. No special Squad configuration required. The team comes along for free.

The institutional knowledge travels with the code. That's exactly what inner source needs to work at scale, and it's something that READMEs and wikis consistently fail to deliver because they go stale and nobody owns them.

## Open source: friction at maintainer scale

For open source maintainers, the problem is similar but the stakes are different.

OSS projects die from maintainer burnout, and a large part of that burnout is the cost of onboarding contributors. You answer the same questions. You review PRs that miss the conventions. You close issues filed by people who didn't understand the project's scope.

Committing your `.squad/` doesn't solve all of that. But it gives every contributor a team that already knows your project's ceremonies, rules, and accumulated skills. A motivated contributor can make a scoped, high-quality contribution faster — because the context they need isn't locked behind your calendar.

Take community engagement: a new contributor files their first issue. Instead of the maintainer manually triaging it, the `external-comms` skill scans for unanswered items, classifies the response type, and drafts a reply using the matching template. The maintainer reviews the draft, flags it with a confidence level (🟢 high / 🟡 medium / 🔴 needs review), and types `pao approve`. The contributor gets a warm, prompt response — and the maintainer's voice is institutionalized, not burned out. Same pattern for a frustrated bug report or a question that's really a feature request: the skill already knows how to handle it. The maintainer reviews, not reinvents.

The friction-reduction mechanism is the same as inner source. The stakes just shift from enterprise velocity to maintainer sanity.

## The interrupted contributor problem

Here's the one that doesn't get talked about enough.

Most contributions don't happen in one sitting. You open a PR, get feedback, come back three weeks later, and have completely lost the thread. You re-read the issue, re-read the diff, try to remember what you were thinking. The context cost is paid twice.

Squad's per-agent `history.md` is a persistent session. The agent remembers what it was working on, what decisions were made mid-contribution, what was left open. When you come back, you're not starting from memory — you're resuming from state.

This is a genuinely different relationship with an AI tool. Not a chatbot you prompt from scratch every session. A collaborator that was there when you left and is still there when you return.

## I'm using Squad on this blog right now

This post was drafted by Squad. My blog repo has a Squad team: Isabela (writer), Dolores (editor), Julieta (SEO), Luisa (publisher), and a developer agent. Each one has a charter and a history that knows this blog — its Docusaurus setup, its voice, its audience.

I didn't write this post from scratch. I asked Isabela — my writer agent — to draft it. Julieta handled the SEO front matter. Dolores edited it. Luisa will open the PR.

The meta-point isn't that AI wrote this. It's that the *team* has context about this blog that accumulates over time, version-controlled and sharable. When a guest author contributes someday, they can clone the repo, run `squad`, and have a team that already knows the blog's conventions, voice, and structure. The ceremonies are there. The rules are set. The skills are inherited — including the communication patterns that define how the blog engages its readers. A guest author doesn't just learn what to write; they inherit *how* to write it.

The collaboration friction doesn't disappear. But it collapses.

## What to do next

- **Try Squad:** [github.com/bradygaster/squad](https://github.com/bradygaster/squad)
- **See a real example:** Look at the `.squad/` directory in [this blog's repo](https://github.com/dfberry/dfberry.github.io) — it's the actual team that drafted this post
- **For OSS maintainers:** Consider committing your `.squad/` directory. You're not just shipping a tool. You're shipping the team that knows how to use it.

---

## Image prompts

*AI-generated image suggestions for this post. Use with Midjourney, DALL-E, or Stable Diffusion.*

The palette below mirrors the post's emotional arc: warm tropical colors for belonging and momentum, luminous particles for knowledge in motion, and deep magentas for the friction that dissolves when the right team shows up.

**Hero — The team is already there**
> A developer opens a laptop at an ornate desk adorned with luminous vines and tropical flowers, discovering three teammates already seated with screens glowing in deep magenta and teal. Golden light particles dance through warm candlelit air mixed with magical luminescence, botanical illustration style with vibrant magentas, golden yellows, and emerald greens.

**Concept — What you inherit**
> An ornately decorated repository folder blooms with layered knowledge scrolls, ceremony diagrams, and skill cards swirling in luminous trails of hot pink, emerald, and gold. Magical particle effects and glowing vines frame the composition. Saturated coral accents and turquoise shimmer create festival-like energy. Latin American folk art aesthetic with high-saturation tropical botanicals.

**Concept — Skills in transit**
> A vibrant git commit envelope travels through a magical network path, leaving shimmering gold particle trails and luminous skill tokens. Deep magenta and teal geometric shapes guide the motion. Rich indigo accents and glowing turquoise highlights create movement. Warm carnival lighting with cool magical luminescence. Luminous botanical illustration style suggesting momentum and transformation.

**Concept — Community response with human gate**
> A moderator at an ornately decorated desk reviews luminous drafts in a warm tropical office. Community voices wait as glowing elements framed by jade vines and coral flowers. Hot pinks, emerald greens, and golden amber glow from warm candlelight mixed with magical luminescence. Watercolor magical realism style with folk art botanical framing, calm and dignified.

**Concept — Friction dissolving**
> Two interlocking puzzle pieces with jagged edges dissolve into smooth surfaces, releasing luminous gold particles and magical light trails in deep magentas, teals, and rich indigo. Warm tropical golden light breaks through with glowing jade vines and saturated coral accents. Luminous botanical illustration style with high-saturation colors suggesting transformation and renewal.
