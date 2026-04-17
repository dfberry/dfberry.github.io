---
slug: /2026-04-17-understanding-any-repo-with-ai-tools
canonical_url: https://dfberry.github.io/blog/2026-04-17-understanding-any-repo-with-ai-tools
custom_edit_url: null
sidebar_label: "2026-04-17 Understanding any repo with AI tools"
title: "Understanding Any Repository: An AI-Powered Field Guide for Developers, PMs, and Open-Source Adopters"
description: "A practical guide to understanding unfamiliar codebases using Copilot CLI, Squad, Graphify, deep blame, and GitHub MCP — organized by what you need to know, not which tool to open."
published: false
tags:
  - GitHub Copilot
  - AI agents
  - Copilot CLI
  - repository understanding
  - developer tools
  - code archaeology
  - knowledge graphs
  - open source
keywords:
  - understand a codebase
  - copilot cli repo exploration
  - graphify knowledge graph
  - git deep blame
  - code archaeology
  - repository analysis
  - custom agents
  - squad ai team
updated: 2026-04-17 00:00 PST
---

# Understanding Any Repository: An AI-Powered Field Guide

<!-- Bellingham prompt (hero): A person standing at the edge of Whatcom Falls, looking down into the layered rock formations exposed by the waterfall — each geological stratum a different shade (slate blue, warm sage, charcoal) representing deeper levels of understanding. The top layer is smooth and obvious; the deepest layers show fossilized patterns and hidden structure. Translucent panels float around them showing a code graph, a git timeline, and a conversation thread. Mist rises from the falls. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

> Part 6 of a series. Previously: [Session Storage Decision Guide](/blog/2026-04-15-session-storage-decision-guide), [When Session Data Lies](/blog/2026-04-16-when-session-data-lies), [Agent Coordination in Copilot CLI](/blog/2026-04-17-agent-coordination-copilot-sdk), [Two Ways to Build Multi-Agent Systems](/blog/2026-04-17-choosing-multi-agent-patterns-copilot-sdk), and [Remote Control Custom Agents](/blog/2026-04-17-remote-control-custom-agents-from-your-phone).

---

You just cloned a repository you've never seen before. Maybe you're a developer picking up a teammate's project. Maybe you're a PM trying to understand what your team actually built. Maybe you're evaluating an open-source library before betting your product on it.

The question is always the same: **"What is this, and should I trust it?"**

There's now an ecosystem of AI-powered tools that answer that question at different depths — from a quick five-minute scan to forensic-level commit archaeology. But nobody has mapped out which tool to use when, what questions to ask at each level, or how these tools complement each other.

This is that map.

## The toolkit at a glance

Before we go deep, here's the landscape. Each tool occupies a different niche:

| Tool | What it does | Best for | Depth |
|---|---|---|---|
| **GitDiagram / RepoMapr** | Instant architecture diagrams from a GitHub URL | Evaluating repos before cloning — zero setup | Glance |
| **Copilot CLI** | Interactive Q&A with full repo context | Quick questions, code explanation, git history | Surface → Medium |
| **Copilot CLI `/fleet`** | Parallel multi-agent analysis across modules | Analyzing many areas simultaneously | Medium |
| **Sourcegraph Cody** | Cross-repo semantic search and code intelligence | "How is X handled across all our services?" | Medium → Deep |
| **Squad** (custom agent) | Multi-agent team with persistent memory and decisions | Deep architecture analysis, ongoing project understanding | Deep |
| **Graphify** | Builds a knowledge graph from code, docs, and media | Structure visualization, dependency mapping, cross-file relationships | Deep |
| **`dependency-cruiser`** | Module dependency analysis with rule enforcement | Circular deps, architectural violations (JS/TS) | Deep |
| **Deep blame** (`git blame -C -C -C`) | Line-level attribution tracing across renames and moves | "Why was this written?", "Who decided this?" | Forensic |
| **GitHub MCP** | Structured access to issues, PRs, commits, and workflows | Project history, decision archaeology, contributor patterns | Medium |
| **Copilot CLI session store** | Query past AI sessions across time and contributors | "What was worked on?", "What changed recently?" | Medium |

You don't need all of them for every repo. The guide below is organized by **how deep you need to go**.

---

<!-- Bellingham prompt (toolkit): A wooden toolshed at a Whatcom County farm stand, door open, revealing neatly organized tools on pegboard hooks — each tool labeled with a small tag (magnifying glass for "Copilot CLI", a nautical chart for "Graphify", a pickaxe for "deep blame", a ship radio for "GitHub MCP", a logbook for "session store"). Morning light streams through a dusty window. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

## Setting up the tools

### Copilot CLI

If you have GitHub Copilot, you already have the CLI:

```bash
copilot -p "What does this project do?"
```

For repos with custom agents (like Squad), use the `--agent` flag:

```bash
copilot --agent squad -p "Walk me through the architecture"
```

### Graphify

Graphify works as a skill inside Copilot CLI, Claude Code, Codex, Cursor, and others:

```bash
# Inside any supported AI coding tool
/graphify .

# For deeper extraction
/graphify . --mode deep

# Install standalone
pip install graphifyy
```

After running, you get three artifacts:
- **`graph.html`** — Interactive visual graph you can click, search, and filter
- **`GRAPH_REPORT.md`** — Human-readable summary of the architecture (god nodes, communities, surprising connections)
- **`graph.json`** — Machine-readable graph for session-to-session reuse

### Deep blame (Git configuration)

Standard `git blame` only shows the last person who touched a line. Deep blame traces code across renames, moves, and refactors:

```bash
# Deep blame — track lines across file moves and copies
git blame -C -C -C --follow -- src/core/engine.ts

# Breakdown:
#   -C          detect lines moved/copied within a file
#   -C -C       detect across files in the same commit
#   -C -C -C    detect across ALL commits (expensive but thorough)
#   --follow    continue history past renames
```

### GitDiagram and RepoMapr (zero-setup visual overview)

These browser-based tools generate architecture diagrams from any public GitHub repo — no cloning, no install:

- **[GitDiagram](https://gitdiagram.com)** — Paste a GitHub URL → instant interactive diagram in seconds
- **[RepoMapr](https://repomapr.com)** — Prefix any GitHub URL with `repomapr.com/` → clickable architecture map with AI chat

Both are ideal for the "should I even clone this?" decision. PMs and OSS adopters: start here.

### Sourcegraph Cody (cross-repo search)

[Cody](https://sourcegraph.com/cody) integrates with Sourcegraph's code intelligence to search across entire organizations — not just one repo. Install it in VS Code or JetBrains:

```
# In Cody chat (VS Code extension)
"How is user authentication handled across all our services?"
"Show me every place we call the payments API"
```

Where Copilot CLI understands the repo you're in, Cody understands *all* the repos in your organization. For teams with microservices or monorepo-plus-satellite architectures, this is the difference between seeing one tree and seeing the forest.

### dependency-cruiser (JS/TS dependency analysis)

For JavaScript and TypeScript projects, [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) catches circular dependencies, architectural violations, and unexpected coupling:

```bash
npm install -g dependency-cruiser

# Generate a visual dependency graph
depcruise src --include-only "^src" --output-type dot | dot -T svg > deps.svg

# Validate against architectural rules
depcruise --validate .dependency-cruiser.cjs src
```

This complements Graphify's language-agnostic approach with JS/TS-specific depth — it knows about `import`, `require`, dynamic imports, and TypeScript path aliases.

### GitHub MCP

If your Copilot CLI has the GitHub MCP server configured, you can query issues, PRs, and commits programmatically:

```bash
copilot -p "Search issues in this repo about authentication"
copilot -p "Show me the last 10 PRs merged to main"
```

---

<!-- Bellingham prompt (Level 0): A person standing on the Fairhaven dock, looking across Bellingham Bay through a pair of binoculars at Lummi Island — they haven't crossed yet, just scoping it out from the shore. A ferry schedule board beside them shows departure times. The island is rendered in soft detail, just enough to decide whether it's worth the trip. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

## Level 0: "Should I even look at this?" (Before you clone)

**Goal:** Evaluate a repository from your browser — no local setup, no cloning, no install.

Sometimes you just need a quick read on whether a repo is worth your time. Maybe you're a PM evaluating a vendor's SDK. Maybe you're an OSS adopter comparing three libraries. Maybe a teammate sent you a link and said "take a look."

### GitDiagram — instant architecture at a glance

Go to [gitdiagram.com](https://gitdiagram.com) and paste any public GitHub URL. In seconds you get an interactive diagram showing the repo's file structure, module relationships, and architectural layers.

No clone. No install. No account. Just paste and read.

### RepoMapr — architecture map with AI chat

Prefix any GitHub URL with `repomapr.com/`:

```
https://repomapr.com/github.com/bradygaster/squad
```

You get a clickable architecture map — and you can chat with an AI about any node. Click a module, ask "What does this do?", and get an answer grounded in the actual code.

### GitHub itself

Don't overlook what's already on the repo page:

```bash
# Quick health check via GitHub MCP or just browse the repo
copilot -p "How active is github.com/bradygaster/squad? Last commit, open issues, PR velocity?"
```

Or just scan manually:
- **Last commit date** — Is this maintained?
- **Open issues vs. closed** — Is the maintainer responsive?
- **Contributors tab** — Bus factor?
- **Dependency graph** (Insights → Dependency graph) — What does it pull in?

### Questions to ask at Level 0

| Question | Where to look |
|---|---|
| "Is this maintained?" | Last commit date, issue response time |
| "How complex is this?" | GitDiagram structure, file count |
| "What does it depend on?" | GitHub dependency graph, package manifest |
| "Is the community healthy?" | Stars trend, PR merge rate, contributor count |
| "Should I clone this?" | All of the above — if 3+ are green, clone it |

---

<!-- Bellingham prompt (Level 1): A kayaker paddling into Bellingham Bay for the first time, seen from above. The bay is calm and the shoreline is clearly visible — you can see the outline of the harbor, the Lummi Island ferry dock, the railroad tracks along the waterfront. It's the bird's-eye view before you dive in. A simple map floats beside the kayak showing "You are here." Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

## Level 1: "What does this repo do?" (First 5 minutes)

**Goal:** Get a mental model of what this project is, who it's for, and how big it is.

### With Copilot CLI

Start with the broadest possible questions:

```bash
copilot -p "What does this project do? Who is it for? What's the tech stack?"
copilot -p "What are the main entry points?"
copilot -p "How is this repo organized — what's in each top-level directory?"
```

Copilot reads the README, package manifests, and directory structure to give you a quick orientation.

### With Graphify

For a structural overview that goes beyond what a README tells you:

```bash
/graphify .
```

Then read `GRAPH_REPORT.md`. Look for:

- **God nodes** — The most connected files/modules. These are the architectural load-bearing walls. If you change them, everything feels it.
- **Communities** — Natural clusters of related code. These often map to features, layers, or bounded contexts.
- **Surprising connections** — Cross-community edges that reveal hidden coupling (a UI component that directly calls a database module, for instance).

### With Squad

If the repo has a Squad team (`.github/agents/squad.agent.md`), the coordinator already knows the architecture:

```bash
copilot --agent squad -p "Give me a 2-minute overview of this project"
```

Squad will delegate to the right specialist — a lead for architecture, a tester for quality assessment, a backend dev for API structure.

### Questions to ask at Level 1

These work with any of the tools above:

| Question | What you learn |
|---|---|
| "What does this project do in one paragraph?" | Purpose and scope |
| "What's the tech stack?" | Languages, frameworks, infrastructure |
| "What are the main entry points?" | Where execution starts |
| "How big is this codebase?" | Scale and complexity |
| "Is there a test suite? What's the coverage strategy?" | Quality signal |
| "What are the external dependencies?" | Supply chain and integration surface |

**For PMs:** Focus on "Who is this for?" and "What problem does it solve?" — the tools will extract this from README, docs, and code comments even when it isn't explicitly documented.

**For OSS adopters:** Ask "When was the last commit?" and "How many contributors are active?" — staleness is the number one risk signal.

---

<!-- Bellingham prompt (Level 2): A marine biologist in a small research boat on Bellingham Bay, leaning over the side with a waterproof camera on a pole, studying the kelp forest just below the surface. The kelp fronds form visible pathways and connections — some thick trunks (god nodes), some tangled clusters (communities), some surprising runners connecting separate patches. Fish follow the pathways. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

## Level 2: "How is it built?" (First hour)

**Goal:** Understand the architecture, patterns, and how pieces connect.

### Explore the graph interactively

Open `graph.html` from your Graphify run. This is where structure becomes visual:

- **Click a community** to isolate a feature area
- **Search for a module** to see everything it connects to
- **Look for bridges** — nodes that connect two otherwise separate communities. These are integration points and often the most complex code.

### Follow the data flow

Ask Copilot CLI to trace specific paths:

```bash
copilot -p "Trace the request flow from the API entry point to the database"
copilot -p "What happens when a user submits a form? Walk me through every file involved."
copilot -p "Where is authentication enforced? Show me the middleware chain."
```

### Understand the patterns

```bash
copilot -p "What architectural patterns does this project use? (MVC, event-driven, microservices, etc.)"
copilot -p "Is there dependency injection? How are services wired together?"
copilot -p "Where are the abstractions? What interfaces define the contracts?"
```

### Analyze multiple areas in parallel with `/fleet`

Copilot CLI's `/fleet` command spawns parallel sub-agents, each analyzing a different part of the codebase simultaneously:

```bash
copilot -p "/fleet Analyze these areas in parallel:
  Track 1: Summarize the authentication and authorization approach
  Track 2: Document the database schema and data access patterns
  Track 3: Map the API endpoints and their request/response contracts
  Track 4: Assess the test coverage strategy and gaps"
```

This is 3-4x faster than asking sequentially. Each track works independently and reports back.

> **Gotcha:** `/fleet` spawns generic explore agents — it does NOT use custom agents from `.github/agents/`. Good for read-only analysis, not for charter-driven work.

### Check dependency health (JS/TS projects)

For JavaScript and TypeScript repos, `dependency-cruiser` reveals what the code graph alone can't — circular imports, layering violations, and forbidden dependencies:

```bash
# Visual dependency graph
depcruise src --include-only "^src" --output-type dot | dot -T svg > deps.svg

# Check for violations against architectural rules
depcruise --validate .dependency-cruiser.cjs src
```

Look for:
- **Circular dependencies** — modules that import each other, creating fragile coupling
- **Layer violations** — UI code importing database modules directly
- **Orphan modules** — files that nothing imports (dead code candidates)

### Search across repos with Sourcegraph Cody

If you're in an organization with multiple repos, Cody answers questions that span repositories:

```
"How is rate limiting implemented across our services?"
"Show me every GraphQL resolver that touches the user table"
"What other repos depend on this package?"
```

This is the only tool in this guide that can search beyond the repo you're standing in.

### Check the build and test infrastructure

```bash
copilot -p "How do I build this project? What are the npm scripts / make targets?"
copilot -p "How is CI/CD configured? What checks run on PRs?"
copilot -p "What's the test strategy — unit, integration, e2e? Where do tests live?"
```

### Query what others have been working on

If you're using Copilot CLI's session store, you can query past sessions:

```sql
-- What files have been edited recently across all sessions?
SELECT file_path, COUNT(*) as edit_count
FROM session_files
WHERE tool_name = 'edit'
GROUP BY file_path
ORDER BY edit_count DESC
LIMIT 20;

-- What were recent sessions about?
SELECT summary, created_at
FROM sessions
WHERE repository LIKE '%my-repo%'
ORDER BY created_at DESC
LIMIT 10;
```

This tells you where the active development is — which is often where the complexity lives.

### Role-specific questions for Level 2

**Developer questions:**

| Question | Why it matters |
|---|---|
| "What's the error handling strategy?" | Tells you if failures are managed or ignored |
| "Where's the configuration loaded?" | First thing you'll need to change |
| "What's the logging approach?" | How you'll debug in production |
| "Are there feature flags?" | How changes are rolled out |
| "What are the hot paths — most-changed files in the last 3 months?" | Where you'll spend your time |

**PM questions:**

| Question | Why it matters |
|---|---|
| "What features were added in the last quarter?" | Velocity and direction |
| "Which areas have the most open issues?" | Pain points and tech debt |
| "What's the PR review cycle like?" | Team health signal |
| "Are there any areas with single-contributor ownership?" | Bus factor risk |

**OSS adopter questions:**

| Question | Why it matters |
|---|---|
| "How hard is it to contribute?" | Onboarding friction |
| "What's the breaking change history?" | Stability signal |
| "Are security advisories addressed promptly?" | Maintenance quality |
| "What's the license situation for all dependencies?" | Legal risk |

---

<!-- Bellingham prompt (Level 3 — Deep Blame): A geologist at the Chuckanut sandstone cliffs south of Bellingham, chipping away at exposed rock layers with a small hammer. Each stratum tells a different story — a fossil here, a color change there, a fault line where two eras collide. The geologist has a notebook open, sketching the timeline of how these layers were deposited. The cliff face is annotated with small date labels like a git blame output. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

## Level 3: "Why was it built this way?" (Deep blame)

**Goal:** Understand the *decisions* behind the code — not just what it does, but why.

This is where most tools stop. READMEs explain what. Architecture docs (when they exist) explain how. But *why* a particular approach was chosen over alternatives — that lives in git history, issues, and PR discussions.

### The deep blame workflow

When you find code that confuses you, here's the forensic process:

#### Step 1: Find who wrote it and when

```bash
# Deep blame — traces across renames and moves
git blame -C -C -C -- src/core/engine.ts
```

This gives you a commit SHA and author for every line. Look for lines where the commit message is interesting — merge commits, "fix:" prefixes, or references to issues.

#### Step 2: Read the commit in context

```bash
git show abc1234
```

Or ask Copilot to explain it:

```bash
copilot -p "Explain commit abc1234 — what problem was it solving and what approach did it take?"
```

#### Step 3: Find the issue or PR that drove the change

```bash
# Search for the commit SHA in PRs
copilot -p "Find the PR that contains commit abc1234"

# Search issues for keywords from the commit message
copilot -p "Search issues in this repo about 'MCP tool-loss' or 'dispatch'"
```

#### Step 4: Trace the full file history

```bash
# See every commit that touched this file, including renames
git log --follow --oneline -- src/core/engine.ts

# See the full diff history
git log --follow -p -- src/core/engine.ts
```

#### Step 5: Check for decision records

Many mature projects record architectural decisions:

```bash
# Architecture Decision Records
ls docs/adr/ docs/decisions/ .squad/decisions.md 2>/dev/null

# Ask Copilot to search for decision context
copilot -p "Are there any architecture decision records or design docs that explain why the dispatch system uses process-per-round instead of persistent sessions?"
```

### A real example: Why doesn't Squad use `--agent` in dispatch?

Here's deep blame in action. In the Squad repo, the dispatch system (`execute.ts`) spawns `copilot -p <prompt>` — a generic Copilot process with no `--agent squad` flag. That seems wrong. Let's investigate:

**Step 1 — Blame the dispatch command builder:**

```bash
git blame -C -C -C -- packages/squad-cli/src/cli/commands/watch/capabilities/execute.ts
```

Reveals the function was introduced in commit `ab1333e2` (Mar 31) — and from day one, it used generic Copilot.

**Step 2 — Check the commit:**

```bash
git show ab1333e2
```

It's the initial execute capability. No mention of `--agent` in the commit message.

**Step 3 — Search issues:**

Issue #928 (Apr 8) explains everything:

> "MCP tool-loss root cause: `execFileSync` per cycle kills MCP connections. Fix: use `CopilotClient` persistent sessions."

And issue #775 discovered:

> "Fleet ignores custom agents — spawns generic explore agents, NOT the custom agents from `.github/agents/`."

**Step 4 — The decision record:**

Commit `cb413bf1` (Apr 4) added `ralph-instructions.md` with an explicit note:

> "Intentionally minimal — the agent reads `.squad/ralph-instructions.md` for full instructions, matching the PS1 ralph-watch design."

**Verdict:** Not a bug — a deliberate architectural choice. `--agent squad` would still kill MCP connections per round, and fleet mode ignores custom agents entirely. The team chose file-based identity as a pragmatic workaround while building toward SDK persistent sessions.

Without deep blame, you'd assume it's a bug and file a PR. With deep blame, you understand the *why* and can make a better decision about what to fix.

### Deep blame questions

| Question | Command / Prompt |
|---|---|
| "Who originally wrote this function?" | `git blame -C -C -C -- <file>` |
| "Has this file been renamed or moved?" | `git log --follow --diff-filter=R -- <file>` |
| "What was this file called before?" | `git log --follow --name-status -- <file>` |
| "Why was this line changed?" | `git show <sha>` → read commit message and diff |
| "What issue drove this change?" | Search issues for commit SHA or keywords |
| "Was this approach debated?" | Find the PR → read review comments |
| "Was an alternative considered?" | Check for ADRs or decision records |
| "When did this pattern start?" | `git log --all --oneline -S "pattern" -- <file>` (pickaxe search) |

---

<!-- Bellingham prompt (Level 4): The Nooksack River seen from the Mosquito Lake Road bridge — the river is flowing, carrying sediment downstream, constantly reshaping its banks. Along the riverbanks, survey markers and small weather stations are planted at intervals, each with a blinking light (monitoring sensors). A naturalist sits in a camp chair with binoculars and a field journal, recording what changes day to day. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

## Level 4: "What's the living history?" (Ongoing understanding)

**Goal:** Stay current with a repo you're invested in — catch changes, understand trends, and maintain context over time.

### Continuous monitoring with Graphify

```bash
# Rebuild the graph incrementally as files change
/graphify . --watch

# Or update manually (SHA-based cache — only reprocesses changed files)
/graphify . --update
```

Compare `GRAPH_REPORT.md` across time to spot architectural drift — new communities forming, god nodes growing, unexpected coupling appearing.

### Automated structure diagrams with repo-visualizer

Add [`githubocto/repo-visualizer`](https://github.com/githubocto/repo-visualizer) as a GitHub Action to automatically generate and commit an SVG of your repo's file structure on every push:

```yaml
# .github/workflows/visualize.yml
name: Repo Visualizer
on: push
jobs:
  visualize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: githubocto/repo-visualizer@v1
        with:
          output_file: docs/repo-structure.svg
          excluded_paths: node_modules,dist,.git
```

This gives you a living architecture diagram that updates with your code — useful for onboarding docs and README badges.

### Session history as institutional memory

Copilot CLI's session store accumulates understanding across every interaction anyone has with the repo:

```sql
-- What areas got the most attention this week?
SELECT file_path, COUNT(*) as touches
FROM session_files
WHERE first_seen_at > now() - INTERVAL '7 days'
GROUP BY file_path
ORDER BY touches DESC
LIMIT 15;

-- What questions have people been asking?
SELECT substr(user_message, 1, 120) as question, timestamp
FROM turns
WHERE session_id IN (
  SELECT id FROM sessions
  WHERE repository LIKE '%my-repo%'
)
ORDER BY timestamp DESC
LIMIT 20;
```

### Squad orchestration logs

If the repo uses Squad, the orchestration log (`.squad/orchestration-log/`) records every agent interaction — who was asked what, what they decided, and what they produced. This is a rich source of "what happened while I was away?"

```bash
copilot --agent squad -p "What work was done in the last week? Summarize the orchestration log."
```

### GitHub MCP for trends

```bash
copilot -p "Show me PRs merged this week. Summarize the themes."
copilot -p "What issues were opened this month? Any patterns?"
copilot -p "Who are the most active contributors right now?"
```

---

<!-- Bellingham prompt (walkthrough): A panoramic view from the top of Mt. Baker's Artist Point — the entire landscape visible at once. In the foreground, a hiker has a topo map spread on a rock, cross-referencing it with what they can see: Bellingham Bay, the San Juan Islands, the Nooksack River valley, the Chuckanut cliffs. Each landmark is circled on the map with a note. The hiker has come full circle — they understand the whole region now. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

## Putting it all together: A real walkthrough

Let's understand the [Squad](https://github.com/bradygaster/squad) repository from scratch — a TypeScript monorepo that implements an AI team framework.

### Before cloning: Browser scan

Paste `https://github.com/bradygaster/squad` into [GitDiagram](https://gitdiagram.com). In seconds you see: two packages (`squad-cli`, `squad-sdk`), a `.github/agents/` directory, a `.squad/` directory, and a `templates/` system. That's enough to know this is a monorepo with an agent framework and some kind of team/template structure. Worth cloning.

### Minute 1: Quick scan

```bash
copilot -p "What is this project? Summarize in 3 sentences."
```

> Squad is a CLI framework that creates AI agent teams for software projects. It uses GitHub Copilot CLI under the hood, with multi-agent coordination, persistent memory (decisions.md, agent histories), and automated watch/dispatch loops. It's a TypeScript monorepo with two packages: squad-cli and squad-sdk.

### Minute 5: Structure map

```bash
/graphify . --mode deep
```

The `GRAPH_REPORT.md` reveals:
- **God nodes**: `cli-entry.ts` (CLI router), `execute.ts` (dispatch engine), `squad.agent.md` (coordinator prompt)
- **Communities**: CLI commands, SDK abstractions, watch capabilities, template system
- **Surprising connection**: Template files must be synchronized across 5 locations (`.squad-templates/`, `templates/`, both packages, `.github/agents/`)

### Minute 30: Architecture deep-dive

```bash
copilot -p "How does the watch/dispatch system work? Trace from 'squad watch' to the actual agent invocation."
copilot -p "What's the difference between squad-cli and squad-sdk?"
copilot -p "How does the team casting system work?"
```

### Hour 1: Decision archaeology

```bash
git blame -C -C -C -- packages/squad-cli/src/cli/commands/watch/capabilities/execute.ts
copilot -p "Search issues about dispatch, MCP tool-loss, or agent identity"
```

This reveals the dispatch amnesia problem (#928), the fleet agent identity gap (#775), and the deliberate `ralph-instructions.md` workaround — context that would take days to discover by reading code alone.

---

## Quick reference card

**"I want to know X → Use Y → Example"**

| I want to know... | Tool | Command or prompt |
|---|---|---|
| If this repo is worth cloning | GitDiagram | Paste GitHub URL at [gitdiagram.com](https://gitdiagram.com) |
| Quick architecture overview (no install) | RepoMapr | `repomapr.com/github.com/owner/repo` |
| What this project does | Copilot CLI | `copilot -p "What does this project do?"` |
| How the code is structured | Graphify | `/graphify .` → read `GRAPH_REPORT.md` |
| What the most important files are | Graphify | Look for god nodes in `graph.html` |
| How a specific feature works | Copilot CLI | `copilot -p "Trace the auth flow from login to token storage"` |
| Multiple areas at once | `/fleet` | `copilot -p "/fleet Track 1: auth Track 2: db Track 3: API"` |
| How X works across all our repos | Sourcegraph Cody | `"How is auth handled across our services?"` |
| Whether there are circular deps | dependency-cruiser | `depcruise src --output-type dot \| dot -T svg > deps.svg` |
| Who wrote this code and why | Deep blame | `git blame -C -C -C -- <file>` → `git show <sha>` |
| What decisions were made | GitHub MCP + blame | Search issues/PRs for keywords or commit SHAs |
| What was worked on recently | Session store | Query `session_files` and `sessions` tables |
| Whether this repo is maintained | GitHub MCP | Check recent PRs, issue response times, last commit |
| How complex the dependencies are | Graphify | `/graphify . --mode deep` → check cross-community edges |
| What the team is working on | Squad | `copilot --agent squad -p "What work happened this week?"` |
| If a pattern was intentional | Deep blame + issues | Blame → commit → PR → review comments → ADRs |
| How hard it is to contribute | Copilot CLI | `copilot -p "What's the contribution process? Any gotchas?"` |

---

> ### Beyond this guide
>
> This post focuses on the tools I've used hands-on. A few others worth knowing about:
>
> - **[Cursor](https://cursor.sh)** and **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — IDE-based AI assistants with strong multi-file understanding. If you're not using Copilot CLI, these cover similar ground for Levels 1-2.
> - **[Greptile](https://greptile.com)** — AI-powered codebase search that indexes massive repos. Enterprise-focused, excels at "find every place we do X" queries at scale.
> - **`git log --graph --oneline --all`** — The free, zero-install version of understanding branch history. Pair it with `git shortlog -sn` for contributor stats. Don't sleep on built-in Git.
> - **[githubocto/repo-visualizer](https://github.com/githubocto/repo-visualizer)** — GitHub Action that auto-generates SVG structure diagrams on every push (covered in Level 4 above).

---

<!-- Bellingham prompt (closing): Sunset at Boulevard Park — the person from the hero image is now sitting on the iconic over-water walkway, laptop closed beside them, looking out at the San Juan Islands. They're relaxed — they understand this place now. A few boats (the agents from earlier posts) are docked in the marina behind them, flags furled. The sky is gold fading to slate blue. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

## What's next

Understanding a repo is an ongoing process, not a one-time event. The tools keep getting better:

- **Copilot CLI session resume** means your understanding persists across sessions — you don't start from zero every time
- **Graphify's incremental mode** means the knowledge graph evolves with the codebase
- **Squad's persistent memory** (decisions.md, agent histories) means the AI team accumulates institutional knowledge
- **SDK persistent sessions** (coming) will solve dispatch amnesia — agents that remember across rounds without workarounds

The shift is from "read the code" to "interrogate the code." The codebase becomes a conversation partner, not a wall of text. The tools just determine how deep that conversation can go.

---

*This is part 6 of a series on building with AI agents. The series started with [Session Storage Decision Guide](/blog/2026-04-15-session-storage-decision-guide) and explored [session data integrity](/blog/2026-04-16-when-session-data-lies), [agent coordination](/blog/2026-04-17-agent-coordination-copilot-sdk), [multi-agent patterns](/blog/2026-04-17-choosing-multi-agent-patterns-copilot-sdk), and [remote-controlling agents from your phone](/blog/2026-04-17-remote-control-custom-agents-from-your-phone). Each post builds on discoveries made while working with Squad — an AI team framework that became both the subject and the tool.*
