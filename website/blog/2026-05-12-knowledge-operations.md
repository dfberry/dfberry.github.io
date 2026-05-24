---
slug: "/2026-05-12-knowledge-operations"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-knowledge-operations"
custom_edit_url: null
sidebar_label: "2026.05.12 Knowledge Operations"
title: "Your Squad Team Learns Every Session. Here's How to Capture and Reuse That Knowledge"
description: "A knowledge-operations workflow for turning repeated agent decisions into reusable team memory."
draft: true
tags:
  - "AI Agents"
  - "Knowledge Management"
  - "Squad"
  - "Developer Workflow"
  - "AI-assisted"
keywords:
  - "knowledge operations"
  - "agent memory"
  - "decision capture"
  - "team memory"
  - "squad"
updated: "2026-05-12 00:00 PST"
---

Every time your Squad agents work, they accumulate patterns. They learn what error handling looks like in your codebase, what your testing conventions are, how your team tackles null safety. After a few weeks, your agents have seen hundreds of examples. But that knowledge stays locked in history logs.

Most teams lose this knowledge entirely. New agents spawn without it. New humans join the team and waste weeks rediscovering patterns. You end up reinventing the same solutions repeatedly, each time less efficiently than the last.

I built a governance system to extract those patterns, turn them into reusable skills, and make them searchable. The result is [squad-knowledge](https://github.com/bradygaster/project-squad-sdk-example-knowledge)—a framework that transforms raw agent history into governed, discoverable team knowledge.

## The Problem: Knowledge Trapped in Logs

Teams run Squad agents for weeks or months. The agents make thousands of small decisions: how to structure error messages, when to use async/await, which null checks are actually necessary. These decisions are consistent—your team *has* standards—but nobody writes them down. They stay buried in agent history files.

When new agents spawn, they don't inherit this knowledge. They start from scratch, making the same decisions agents made three weeks ago. When new humans join the team, onboarding takes weeks because the patterns are invisible. When you create a skill, there's no governance to prevent duplicates or contradictions. You end up with conflicting guidance.

The deeper problem: you have the data (agents saw 500 error handling examples), but you're not using it. That's leaving performance on the table.

## The Solution: Automated Pattern Discovery + Human Approval

The knowledge operations framework has four phases:

**Phase 1: Discovery.** Scan agent histories and extract repeated phrases using n-gram analysis. "Check for null" appears 47 times across 6 agents? That's a pattern worth capturing. The system measures frequency, agent breadth, and confidence automatically.

**Phase 2: Generation.** Turn discovered patterns into skill candidates with automatic deduplication against existing skills. No duplicates. No conflicts. Just new patterns that don't already exist.

**Phase 3: Approval.** A human reviews each candidate and approves it as a formal skill. No automation spam. Humans stay in the loop for quality control.

**Phase 4: Search.** Index all team memory (history + decisions) and make it searchable with source attribution. "How do we handle errors?" returns examples from 3 agents with citations.

> 📊 **[DIAGRAM: Knowledge Lifecycle Pipeline]**
> *Prompt for image generation:* A vertical flow diagram showing 4 phases stacked: (1) Agent History (cloud icon with documents) → (2) "N-gram Discovery" (magnifying glass processing box in teal) → (3) "Candidates" (stack of cards, blue) → (4) "Human Approval" (person icon checkmark, teal border) → (5) "Approved Skill" (trophy/star icon, gold accent) with a feedback arrow from (5) back to (1) labeled "Reuse". Dark background, clear stage labels, blue/teal/gold color scheme, minimal line decoration.
> *Purpose:* Visualizes the full knowledge lifecycle from raw history through discovery, approval, to reusable skills—shows both the automation (n-gram discovery) and human judgment (approval) loop.

## Setup

```bash
# Clone the repository
git clone https://github.com/bradygaster/project-squad-sdk-example-knowledge.git
cd project-squad-sdk-example-knowledge

# Install and build
npm install && npm run build

# Make the CLI globally available
npm link
```

Verify setup:

```bash
squad-knowledge --help
```

## Sample Data Workflow

The repo ships with sample data in `examples/.squad/` so you can see it in action immediately without your own history files.

**Step 1: Discover patterns**

```bash
squad-knowledge discover examples/.squad
```

Output:

```
Scanning 20 history entries…

Found 12 patterns:
  • "check for null" (5 occurrences, 2 agents)
  • "async/await" (4 occurrences, 2 agents)
  • "error handling" (6 occurrences, 3 agents)
  • "try-catch wrapper" (3 occurrences, 1 agent)
  • "early return pattern" (4 occurrences, 2 agents)
  • "validation on input" (5 occurrences, 3 agents)

Generated 6 skill candidates → examples/.squad/candidates.json
Memory index built → examples/.squad/memory-index.json (22 documents)
```

The framework extracted n-grams from agent histories, ranked them by frequency, and identified high-confidence patterns (ones that appear across multiple agents).

**Step 2: Check status**

```bash
squad-knowledge status
```

Output:

```
Knowledge Status
────────────────────────────────────────
  Candidates:  6 total
    Pending:   6
    Approved:  0
    Rejected:  0

  Memory Index: 22 documents, updated 2024-01-15T10:30:00.000Z
  Stale patterns: 0
  Avg confidence: 0.72 (medium)
```

**Step 3: Approve a candidate**

Copy a candidate ID from the discover output and approve it:

```bash
squad-knowledge approve candidates/null-check-pattern
```

Output:

```
✅ Candidate approved: null-check-pattern
   Generated examples/.squad/skills/null-safety-checks.md
   Confidence: medium (will upgrade to high as pattern reuses)
```

This generates a full SKILL.md file with frontmatter, agent attribution, and usage examples:

```markdown
---
id: null-safety-checks
title: Null Safety Checks
confidence: medium
discovered_by:
  - alice
  - bob
first_session: 2024-01-10
occurrences: 5
---

# Null Safety Checks

Pattern detected in 5 agent sessions across 2 agents. Agents consistently validate inputs before property access.

## Usage

Always check for null before accessing object properties:

```typescript
if (user && user.profile && user.profile.name) {
  // Safe to use user.profile.name
}
```

## Why This Matters

Prevents null pointer exceptions. Critical in TypeScript projects with strict null checking enabled.

## Attribution

- Alice (Session 001, 002, 003)
- Bob (Session 005, 010)
```

**Step 4: Search team memory**

```bash
squad-knowledge search "null safety"
```

Output:

```
Found 5 results:

  1. [score 8.0] alice (agent_history)
     "Session 001: Discussed null pointer errors. Always validate before property…"
     Matched: null, safety
     Source: examples/.squad/agent-histories/alice.txt

  2. [score 6.0] bob (agent_history)
     "Session 005: Always check for null before property access. Critical lesson.…"
     Matched: null, check
     Source: examples/.squad/agent-histories/bob.txt

  3. [score 4.2] decisions (team_decision)
     "2024-01-error-strategy: Consensus on defensive programming practices"
     Matched: safety
     Source: examples/.squad/decisions/2024-01-error-strategy.md
```

Results show who did it first (alice), which sessions covered it, and full source attribution for traceability.

## Using Your Own Data

Replace `examples/.squad/` with your real `.squad/` directory. Required structure:

```
.squad/
├── agent-histories/
│   ├── alice.txt          # one session per line
│   └── bob.txt
└── decisions/
    └── 2024-01-strategy.md
```

Then run:

```bash
squad-knowledge discover .squad
squad-knowledge status
squad-knowledge approve <candidate-id>
squad-knowledge search "error handling"
```

The discovery phase scans all files, extracts n-grams with configurable frequency thresholds, deduplicates automatically, and ranks candidates by frequency and agent breadth.

Once approved, candidates become formal skills in `.squad/skills/` with full SKILL.md frontmatter and agent attribution. When you search, results show who first demonstrated the pattern, which sessions featured it, and relevance scores—full traceability.

## Real Walkthrough: Building a Living Skill Registry

Here's the full workflow for a real team over one month:

**Week 1:** Agents run on various tasks, accumulating history.

```bash
squad-knowledge discover .squad
# Found 8 patterns across agent histories
```

> 📊 **[DIAGRAM: Confidence Progression Over Time]**
> *Prompt for image generation:* A line chart showing confidence level (Y-axis: 0–1 scale from "low" to "high") over weeks (X-axis: Week 1–4). Draw 3 curved lines: "null-check-pattern" starting at 0.3 Week 1, rising to 0.7 by Week 4 (solid teal). "async-await" starting at 0.4, rising to 0.8 (solid blue). "error-handling" starting at 0.2, rising to 0.9 (solid cyan). Mark approval moments with checkmarks (✓). Dark background, labeled axes, legend identifying each pattern, grid lines.
> *Purpose:* Shows how confidence compounds as patterns reappear—reinforces the idea that patterns prove themselves over time, building institutional knowledge incrementally rather than via one-time decisions.

**Week 2:** Review and approve high-confidence patterns.

```bash
squad-knowledge approve error-handling-try-catch
squad-knowledge approve validation-input-schema
squad-knowledge approve async-await-usage
```

**Week 3:** New agents can now search the registry and inject patterns into their prompts.

```bash
squad-knowledge search "how do we handle async?"
# Returns 3 approved skills with examples and agent attribution
```

**Week 4:** Staleness detection flags outdated patterns.

```bash
squad-knowledge status
# Shows: "promise-callback pattern - stale (30+ days), recommend review"
```

## What Makes This Different

Most knowledge management tools are write-once, read-never. Someone documents something, and then nobody reads it. This framework is write-automatic: patterns are discovered from *actual* agent behavior, approved by humans, and immediately searchable. The knowledge exists because agents actually used it, not because someone wrote documentation.

The confidence tracking matters. New skills start at low confidence. As they appear in subsequent agent spawns, confidence upgrades to medium → high. This means new patterns need to prove themselves before the team relies on them.

Staleness detection flags outdated patterns not referenced in recent sessions. If a pattern hasn't shown up in 30 days, it gets flagged. Your team's best practices evolve; the system should reflect that.

## Honest Scoping

**What this does:**
- Extract patterns from agent histories using n-gram analysis
- Generate skill candidates with deduplication
- Provide human approval workflow
- Index and search team memory with relevance ranking
- Track confidence as patterns reuse

**What this doesn't do:**
- Automatically approve patterns (humans review everything)
- Prevent you from approving bad patterns (it's advisory, not enforcement)
- Teach agents to use skills (that's on you to inject into prompts)
- Handle proprietary/confidential patterns specially (you should review before discovering)

## Next Steps

1. **Set discovery thresholds.** Tune minFrequency and minPhraseLength to match your team's pattern density.
2. **Integrate with your squad.** Wire discovered skills into agent prompts at spawn time.
3. **Monitor staleness.** Set up alerts when patterns go unused for N days.
4. **Build organization-wide registries.** Export approved skills to a central location for all teams to use.

## Get Started

```bash
# Clone and setup (5 minutes)
git clone https://github.com/bradygaster/project-squad-sdk-example-knowledge.git
cd project-squad-sdk-example-knowledge
npm install && npm run build && npm link

# Try it with sample data (2 minutes)
squad-knowledge discover examples/.squad
squad-knowledge search "null safety"

# Then point it at your real data (1 minute)
squad-knowledge discover .squad
squad-knowledge approve <candidate-id>
```

Eight minutes later, you have a searchable skill registry discovered from your team's actual behavior. New agents can learn from it. New humans can onboard with it. Your best practices become explicit, governed, and reusable.
