---
title: "The Instructions vs Skills Distinction: Governance vs Execution"
authors: [dfberry]
date: 2026-05-31
slug: /2026-05-31-instructions-versus-skills
tags: [copilot, governance, skills, repo-instructions, architecture]
description: "When to put guidance in repo instructions vs skills — a practical decision framework for Copilot-powered teams."
keywords:
  - instructions
  - skills
  - governance
  - execution
  - repository-patterns
  - copilot
image: /blog/media/2026-05-31-instructions-vs-skills/hero.png
---

When I look at repos that manage agents and skills, I keep noticing the same pattern: governance rules do not stay in the instruction layer. They get pushed down into skills. A repo starts with a clean distinction in theory, then practical pressure takes over. It feels easier to tuck a rule into the skill that already handles PRs, releases, reviews, or docs updates than to keep the governance layer separate and durable.

That leak creates a mess fast. Policy gets buried inside execution, contributors have to hunt through step-by-step workflow files to figure out what is actually required, CI can only enforce the rules that escaped into the right place, and every workflow tweak risks rewriting what should have been a stable repo expectation. The instructions-versus-skills distinction only matters if you keep the layers separate. Once rules get pushed into skills, you lose both layers.

So I kept pulling on one simple question: when does guidance belong in repo instructions, and when does it belong in a skill?

<!-- truncate -->

## Build the mental model

The cleanest model I found is this: **instructions constrain behavior; skills produce behavior**.

Repo instructions are the guardrails that shape every interaction. They are ambient. They sit in the background like shop rules posted above the bench: use this style, follow this architecture, require these approvals, don't skip these checks. They tell Copilot what "good" looks like before any specific task begins.

Skills are different. They are invoked capabilities. A skill is more like picking up a jig, checklist, or specialty tool when the work calls for it. It exists to *do* something repeatable: create a PR, summarize CI failures, triage issues, draft release notes, or run a multi-step review.

My perspective: if instructions are the Cascades in the distance — fixed, always shaping the weather — skills are the trails you choose for today's hike. Both matter. They just solve different problems.

| Layer | Question it answers | Behavior model | Best for |
| --- | --- | --- | --- |
| Repo instructions | "How do we operate in this repo?" | Passive, always-on | Rules, conventions, expected outcomes |
| Skills | "What reusable thing should happen now?" | Active, invoked when relevant | Workflows, procedures, tool-backed execution |

## Use a decision framework instead of guessing

The practical test is boring, and boring is good. Before I place any Copilot guidance, I ask four questions:

1. **Should this apply all the time?** If yes, it leans toward instructions.
2. **Does it read like a rule or expectation?** If yes, it belongs in instructions.
3. **Does it require ordered steps, tools, or output generation?** If yes, it belongs in a skill.
4. **Would I ever want to call this only on demand?** If yes, it probably belongs in a skill.

The questions sound cleaner than real repos feel, so I keep a few messy cases around to pressure-test them.

### Test the messy cases

- A PR template with required sections plus a note like "if this is a hotfix, add the emergency label" is mixed. The required sections are instruction material. The branching label logic belongs in a skill or automation.
- A linter config that sets repo rules but also shells out to custom validation is mixed too. The rules stay in config. The shell step is execution, so I want that script or skill to stand on its own.
- A docs checklist that says "update screenshots when UI changes" looks simple until the exceptions show up. The durable expectation belongs in instructions. The conditional screenshot workflow is skill territory.

None of that is perfectly tidy. Sometimes the first draft is a mixed artifact and the framework only tells me where to cut it apart. That's still useful. I don't need a universal law. I need a way to stop hiding rules inside procedures just because they showed up in the same file first.

### Put durable rules in repo instructions

Repo instructions should hold the durable governance layer: coding standards, architectural boundaries, PR naming conventions, review expectations, security constraints, documentation requirements, and the definition of done.

A PR guidance block usually looks more like this:

```md
# .github/copilot-instructions.md

## Pull Request Guidelines
- Use format: [area]: short description
- Include: summary, testing notes, and docs impact
- Request review from CODEOWNERS
- Do not suggest merging until CI passes
- Use the pr-lifecycle skill when creating or updating pull requests
```

This works because the file describes expectations, not choreography. It doesn't try to walk Copilot through twenty steps. It tells the agent what standards must be true whenever PR work comes up.

Good instruction content usually has these traits:

- It is always applicable or path-scoped in a predictable way.
- It describes outcomes, not button clicks.
- It stays stable even if tooling changes.
- It is short enough to remain readable and enforceable.

If I change GitHub templates, CI jobs, or branch automation later, the governance may stay the same. That's the signal that the content belongs in instructions.

### Put executable workflows in skills

Skills should own the operational layer. If something needs steps, tools, branching logic, templates, or generated artifacts, I move it into a skill.

At repo level, it usually looks more like this:

```text
.copilot/skills/pr-lifecycle/
├── SKILL.md
├── templates/pr-description.md
└── scripts/check-pr-readiness.sh
```

Inside the skill, I keep the file focused on execution:

```md
# PR Lifecycle Manager

## When to use
- Creating a new pull request
- Updating a pull request after review
- Checking whether a pull request is ready to merge

## Capabilities
- Draft PR title and description from git diff
- Validate required sections and linked work items
- Summarize failing CI checks
- Prepare merge notes or release notes
```

That belongs in a skill because it executes actions on behalf of the user. It may call tooling. It may collect context. It may follow a sequence. None of that is reliably enforced by passive instructions alone.

A good skill is procedural without being bloated. It should tell the agent when to use it, what inputs it needs, what outputs it should create, and where deeper references live. That's the same pattern I keep coming back to in Copilot repos: **instructions define the lane; skills drive the truck**.

### Use the split pattern when both are true

A lot of teams get stuck because the real answer is not "instructions or skills." It's both, split on responsibility.

If a topic has both governance and execution, split it this way:

| If the content says... | Put it in... | Why |
| --- | --- | --- |
| "PRs must include testing notes" | Repo instructions | It's an always-on rule |
| "Generate testing notes from changed files" | Skill | It's an action |
| "Two approvals are required" | Repo instructions | It's policy |
| "Check approval state before merge" | Skill | It's a workflow step |
| "Use squash merge" | Repo instructions | It's the expected outcome |
| "Prepare the squash merge summary" | Skill | It's execution |

That split keeps the rule visible and the workflow callable without turning one artifact into a junk drawer.

The tradeoff is that you now maintain two layers instead of one. I still think that's the right time investment. The layers change at different speeds, and treating them as one thing hides that reality instead of simplifying it.

## See the precedent in public repos

I don't think these repos prove a universal law, and they are not solving exactly the same problem. Pre-commit is about hook lifecycle. ESLint is about rule discovery and enforcement. What I care about here is repo governance for human-plus-agent work. Even so, I kept finding teams that learned a similar separation independently: durable guidance in one place, task-specific execution in another.

### OpenAI Agents Python says policies first, skills second

[openai/openai-agents-python](https://github.com/openai/openai-agents-python) makes the split very explicit. Its root `AGENTS.md` opens with **"Policies & Mandatory Rules"** and then a **"Mandatory Skill Usage"** section that tells the agent when `$code-change-verification` or `$pr-draft-summary` must run.

The execution layer lives in [`.agents/skills/`](https://github.com/openai/openai-agents-python/tree/main/.agents/skills). A concrete example is [`code-change-verification`](https://github.com/openai/openai-agents-python/tree/main/.agents/skills/code-change-verification), whose `SKILL.md` turns the policy into steps: run `make format`, then `make lint`, `make typecheck`, and `make tests`, or use the bundled script that does the sequence for you.

That rhymes with my framing: `AGENTS.md` defines the lane, and the skill handles the trip.

### Continue splits rules from review agents

[continuedev/continue](https://github.com/continuedev/continue) uses different words, but the architecture is the same. The governance layer lives in [`.continue/rules/`](https://github.com/continuedev/continue/tree/main/.continue/rules), where files like [`programming-principles.md`](https://github.com/continuedev/continue/blob/main/.continue/rules/programming-principles.md) contain statements such as **"Use functional programming paradigms whenever possible."**

The operational layer lives in [`.continue/agents/`](https://github.com/continuedev/continue/tree/main/.continue/agents). In [`test-coverage.md`](https://github.com/continuedev/continue/blob/main/.continue/agents/test-coverage.md), the repo doesn't restate style policy. It tells the agent what to do during review, including the wonderfully specific line **"Do NOT write tests yourself. The author knows the intended behavior best."**

Similar split, different vocabulary: rules stay ambient, agents carry the task logic.

### OpenHands keeps repo guidance at the root and release work in skills

[OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) follows the same pattern with root guidance plus task-specific skills. The repo-level guidance lives in [`AGENTS.md`](https://github.com/OpenHands/OpenHands/blob/main/AGENTS.md), while the executable playbooks live under [`.agents/skills/`](https://github.com/OpenHands/OpenHands/tree/main/.agents/skills).

A good example is [`update-sdk`](https://github.com/OpenHands/OpenHands/tree/main/.agents/skills/update-sdk). Its `SKILL.md` says it should be used when someone asks to **"update SDK," "bump SDK version,"** or **"prepare a release"**, then gets brutally concrete with a table showing whether the task changes 5, 6, or 3 files and the exact lockfile commands to run.

That is the same kind of separation I want in Copilot repos: repo guidance stays durable, and release choreography lives where an agent can actually invoke it.

### Next.js documents the boundary inside the skill itself

[vercel/next.js](https://github.com/vercel/next.js) is probably the most self-aware example I found. Its [`authoring-skills`](https://github.com/vercel/next.js/tree/canary/.agents/skills/authoring-skills) skill says it covers the relationship between **"always-loaded `AGENTS.md` and on-demand skills."**

It gets even more direct a few lines later: create a skill when content is **"Too detailed for AGENTS.md"** or **"Only relevant for specific tasks,"** and keep it in `AGENTS.md` when it's **"a one-liner rule or guardrail every session needs."** I stole that wording mentally because it says the whole thing without making it dramatic.

So even when the repo is teaching people how to author skills, it lands on the same boundary: guardrails in the ambient layer, procedures in the invoked one.

### Microsoft and Azure repos show the pattern in Copilot instruction files too

I also wanted examples from repos using Copilot instruction files directly, not just adjacent agent architectures. Microsoft has several public repos where the instruction layer is clearly being used as a governance surface for AI assistants working in complex systems and production codebases.

Here's the pairing I wanted to see in public: instruction files setting the expectations, then concrete agent or skill artifacts carrying the work.

- [Microsoft MCP Copilot Instructions](https://github.com/microsoft/mcp/blob/main/.github/copilot-instructions.md) — Governance rules for AI assistants working with the Model Context Protocol.
  - Skills: [`agentic-workflows`](https://github.com/microsoft/mcp/blob/main/.github/agents/agentic-workflows.agent.md) routes workflow creation, debugging, and upgrades, and the repo also keeps executable skills under `.github/agents/` plus `tools/**/skills/`.
- [Microsoft Waza Copilot Instructions](https://github.com/microsoft/waza/blob/main/.github/copilot-instructions.md) — Agent-specific rules and behavioral guidelines.
  - Skills: [`waza`](https://github.com/microsoft/waza/blob/main/skills/waza/SKILL.md) runs evals and benchmarks, [`waza-interactive`](https://github.com/microsoft/waza/blob/main/skills/waza-interactive/SKILL.md) handles conversational eval orchestration, and [`azd-publish`](https://github.com/microsoft/waza/blob/main/.github/skills/azd-publish/SKILL.md) owns the azd extension publish flow.
- [Azure SDK for JavaScript Copilot Instructions](https://github.com/Azure/azure-sdk-for-js/blob/main/.github/copilot-instructions.md) — Governance for AI assistants working on production JavaScript libraries.
  - Skills: [`archie`](https://github.com/Azure/azure-sdk-for-js/blob/main/.github/agents/archie.agent.md) for API and architecture review, [`dash`](https://github.com/Azure/azure-sdk-for-js/blob/main/.github/agents/dash.agent.md) for performance review, [`dexter`](https://github.com/Azure/azure-sdk-for-js/blob/main/.github/agents/dexter.agent.md) for dependency review, and [`scribe`](https://github.com/Azure/azure-sdk-for-js/blob/main/.github/agents/scribe.agent.md) for documentation review.

Those examples strengthen the same precedent from another angle: teams are publishing durable expectations in instruction files, then letting tools, workflows, and agent-specific routines handle execution elsewhere.

## How the flow actually wires: instruction → agent → skill → prompt

Looking deeper at those three Microsoft repos shows how the wiring actually works in practice. GitHub's [Copilot customization cheat sheet](https://docs.github.com/en/copilot/reference/customization-cheat-sheet) defines each layer clearly:

- **Custom instructions**: "Always-on context that automatically applies to every interaction within its defined scope"
- **Custom agents**: "Specialist persona with its own instructions, tool restrictions, and context"
- **Agent skills**: "Folder of instructions, scripts, and resources that Copilot loads when relevant to a task"

The flow is not instructions calling skills directly. Instructions invoke agents, which route to skills or external procedures. 

**Microsoft MCP**: The instruction file stays thin. It points to the `agentic-workflows` agent, which is a router. The agent doesn't execute — it dispatches. It says "if the user wants to create a workflow, load the specialized prompt from `gh-aw/create-agentic-workflow.md`." The actual step-by-step instructions live in those external prompt files.

**Microsoft Waza**: The instructions point to a `squad.agent.md` file, which is a *coordinator* that knows how to spawn other agents and skills. When azd-publish work is needed, the coordinator loads the `.github/skills/azd-publish/SKILL.md` file, which contains the release procedure: versioning rules, changelog steps, build verification, PR template. That skill is all *action*.

**Azure SDK for JavaScript**: The instructions reference a skill router (`sdk-workflow`), which then points to the actual reviewer agents (`archie` for API review, `dash` for performance, `dexter` for dependencies, `scribe` for docs). Each agent loads its own guidelines (e.g. `architecture-review-guidelines.md`), so the instructions don't repeat that knowledge.

The pattern in all three follows the same layering model that Copilot's documentation describes:

```
Custom instructions (always-on, repo-wide context)
    ↓
Custom agent (routing, dispatch logic, persona)
    ↓
Agent skill or external prompt (executable procedure, task-specific)
    ↓
LLM receives: repo context + agent logic + task-specific instructions + tool definitions
```

The instruction file is the *governance boundary*. The agent is the *orchestrator*. The skill is the *workflow*. Once you see that layering, the mistakes become obvious: if you put procedural steps in the instruction file, new contributors search there for answers instead of following the workflow. If you put governance rules only in the skill, CI can't enforce them without parsing procedural code. And if the agent tries to do both, it becomes a god object that breaks whenever either layer changes.

## Map the pattern to a real PR lifecycle

PR lifecycle management is where this distinction stops being philosophical and starts paying rent.

This is also where the failure modes get obvious fast. If I bury PR policy inside a long skill, a new contributor has to reverse-engineer which lines are rules and which lines are just one suggested sequence. If I bury the rule inside instructions instead, CI can still check for testing notes or required sections, but it cannot replay the workflow details that explain how to produce them. And once exceptions show up — docs-only changes, hotfix labels, screenshot updates — the all-in-one file turns into a negotiation instead of a guide.

When I model PR work, I treat repo instructions as the governance contract. They answer questions like:

- What should the PR title look like?
- Which sections are required in the description?
- Which approvals are mandatory?
- What merge strategy is allowed?
- What counts as done?

Those are repo-level truths. They should be visible whether a human is writing the PR manually, Copilot is drafting it, or a future automation layer picks it up.

Then I let the skill own the moving parts:

- Create the PR body from the diff
- Check for missing testing notes
- Summarize CI failures
- Update the PR after review comments
- Prepare merge or release notes

I keep the layering because long procedural text inside instructions rarely survives contact with reality. Instructions don't execute. They also don't enforce conditional rules well. "If the PR touches docs, then update screenshots unless the change is internal" is already skill territory.
The reverse mistake is just as common: teams put all PR rules in a skill because that's where the workflow feels tangible. The problem is that skills are not ambient. If nobody invokes the skill, nobody sees the rule. That's how you end up with one perfectly governed workflow and five side doors.

The split pattern fixes both failure modes. Governance stays central and durable. Operations stay modular and reusable. In workshop terms, the wall chart tells everyone how the shop runs; the specialized jig helps you cut the joint cleanly. One without the other is either bureaucracy or improvisation.

There's another reason I like this pattern: it scales with teams. Senior contributors can work from the governance layer because they already know the motions. Newer contributors or occasional collaborators can lean on the skill for the motions without missing the policy. That avoids over-regulation on one side and under-enforcement on the other. It also gives me a cleaner review question: am I changing the rule, or am I changing the way we carry it out?

## Avoid the anti-patterns early

The first anti-pattern is **procedural logic in instructions**. This usually starts with good intentions: people want consistency, so they paste an entire workflow into `.github/copilot-instructions.md`. The result is noisy guidance that is too long to be sharp and too passive to be dependable. Copilot may imitate pieces of it, but the artifact itself cannot execute, branch, recover, or verify.

The second anti-pattern is **rules hidden inside skills**. This feels tidy until someone works around the skill, uses a different skill, or simply forgets the name. Then the policy disappears. Rules only work when they are ambient.

The third anti-pattern is **ignoring context scope**. Repo instructions are for repository-wide or path-specific truth. Skills are for reusable capability. If the guidance depends heavily on a specific moment, tool state, or user request, I keep it out of instructions.

One useful gut check: if removing the content would make the repo less governed, it was probably instruction material. If removing it would only make a task slower or more manual, it was probably skill material.

## Wire the split into tooling

This is where the distinction stops being tidy architecture and starts helping automation.

Instructions are the easiest layer to lint and enforce because they read like policy. If the repo says PRs need testing notes, CI can check for testing notes no matter whether the PR body came from a human, a template, or a skill. The same goes for naming conventions, review requirements, documentation gates, and security constraints. The rules stay stable enough that automation can look for outcomes instead of trying to replay somebody's workflow.

Skills are the layer that makes invocation and orchestration possible. They can expose a clear trigger, gather inputs, call scripts, branch on state, and produce artifacts. OpenAI's `code-change-verification` skill is a clean example: the rule lives in `AGENTS.md`, but the skill can actually run the verification stack. OpenHands does the same thing for release work by turning an SDK bump into a named procedure with exact files and commands.

That's also why dfberry's repo structure keeps settling into `.github/skills/` and `.squad/`. I want the governance layer where I can review it, diff it, and eventually enforce it with policy checks. I want the execution layer where a person, a slash command, or an agent team can invoke it without dragging all of that procedural text into every session.

## Keep the one-line rule nearby

When I need a fast decision, I use the short version taped to the metaphorical tool cabinet: **If it reads like a rule, put it in instructions. If it reads like a workflow, put it in a skill.**

That sentence is simple enough to use in code review, repo design, or onboarding. It also keeps debates short, which is an underrated form of governance.

## Audit the repo you already have

If your repo already feels tangled, I wouldn't start by rewriting everything. I'd start with an audit.

### Ask these questions

- Which guidance is always supposed to apply?
- Which files contain numbered steps, branching logic, or tool commands?
- Which skills quietly contain policy that should be visible everywhere?
- Which instructions are so long they stopped being useful?
- Which repeated tasks still depend on team memory instead of a reusable skill?

### Start small and split one workflow

Pick one messy area — PRs are perfect for this — and separate it into two artifacts:

1. A slim instruction section with the rules.
2. A skill with the operational steps.

Then test whether the separation makes the repo easier to understand. In my experience, it usually does immediately. The instructions get shorter. The skill gets more actionable. New contributors stop guessing where to put things.

That's also where the time savings show up. You spend a little time on the split once, then stop re-explaining the same boundary every time someone adds a new automation.

If you're not sure where to start, look for the longest instruction file in the repo. Long instruction files are often carrying work they were never designed to carry. Split out the first workflow you find and leave the rule behind.

## Close the loop

I like this distinction because it scales without becoming dramatic. Instructions hold the governance layer. Skills hold the execution layer. Together they give Copilot a clearer operating model and teams a cleaner way to grow capability without losing control.

If you want to keep digging, [Exploring Copilot CLI Session Management to Improve Squad](https://dfberry.github.io/2026-04-16-session-storage-decision-guide) connects well with this one. I'm still interested in the same larger question underneath both posts: how do I make AI teams easier to govern without sanding off the parts that make them useful? Fun stuff!
