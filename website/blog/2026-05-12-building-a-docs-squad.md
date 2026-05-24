---
slug: "/2026-05-12-building-a-docs-squad"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-building-a-docs-squad"
custom_edit_url: null
sidebar_label: "2026.05.12 Docs Squad"
title: "Building a Docs Squad — 8 AI Agents for Content Teams"
description: "How I organized eight specialized agents and supporting skills for repeatable documentation work."
draft: true
tags:
  - "AI Agents"
  - "Squad"
  - "Documentation"
  - "Developer Workflow"
  - "AI-assisted"
keywords:
  - "docs squad"
  - "documentation workflow"
  - "content operations"
  - "ai agents for docs"
  - "squad"
updated: "2026-05-12 00:00 PST"
---

I work on developer documentation. Reviews, freshness audits, SEO checks, feedback triage — the same patterns repeat across every content set. So I built a Squad for it.

[Squad](https://github.com/bradygaster/squad) is an open-source AI agent team framework. Most people use it for code projects. I used it for content — 8 specialist agents, 15 skills, and MCP integrations, all wired for documentation workflows.

Here's how it works and what I learned.

## The Team

| Agent | What it does | Example prompt |
|-------|-------------|---------------|
| **Writer** | Drafts articles from templates (quickstart, how-to, tutorial, concept) | "Scaffold a quickstart for our Python SDK" |
| **Reviewer** | Tech accuracy, style compliance, inclusive language, security review | "Review PR #42 for accuracy and style" |
| **SEO Analyst** | Metadata optimization, keyword analysis, title scoring | "Score the metadata on our quickstart" |
| **Freshness Tracker** | Staleness detection, API change mapping, update prioritization | "What articles are older than 6 months?" |
| **Loc Coordinator** | Localization readiness, cross-product dependencies | "Is this ready for loc?" |
| **Metrics Analyst** | Page views, engagement trends, content health | "Which articles need attention?" |
| **Feedback Triager** | GitHub issues, customer feedback, prioritization | "Triage the last 30 days of feedback" |
| **Scribe** | Decision logging, editorial standards, memory | "Log this editorial decision" |

Each agent has a charter at `.squad/agents/{name}/charter.md` — a 9-section document covering responsibilities, boundaries, MCP dependencies, routing rules, output format, quality standards, and anti-patterns.

## The Architecture

The template follows a **Content HQ model** — the squad repo is the headquarters, content repos are cloned into `./repos/`:

```
docs-squad/
├── .squad/agents/          # 8 agent charters
├── .squad/routing.md       # Agent-to-agent handoffs
├── .squad/decisions.md     # What's been decided
├── .copilot/skills/        # 15 portable skills
├── templates/content/      # Article templates (concept, how-to, quickstart, etc.)
├── docs/                   # Writing principles, quality framework, SEO guide
└── repos/                  # Content repos cloned here (gitignored)
```

When an agent works on content, it operates inside `./repos/{content-repo}/`, not in the squad repo itself. This separation matters — squad config and content live in different places with different git histories.

## MCP Integration

Squad agents connect to external services through MCPs (Model Context Protocol servers). You configure which MCPs are available in your Copilot MCP config — agents discover them at session start. 

Only GitHub is required. Everything else degrades gracefully:

| MCP | What it unlocks | Required? |
|-----|----------------|-----------|
| **GitHub** | Issues, PRs, code search | Yes |
| **Issue tracker** (Jira, Linear, etc.) | Work item management | No |
| **Analytics** (Amplitude, Mixpanel, etc.) | Content metrics | No |
| **Chat** (Slack, Discord, etc.) | Team notifications | No |

When an MCP isn't connected, agents say "I can't reach that service right now" instead of hallucinating data.

## Skills That Transfer

The 15 skills are the portable part. They work in any Squad project, not just this template:

| Skill | What it does |
|-------|-------------|
| `review-content` | Multi-pass review pipeline (tech accuracy → style → SEO → inclusive language) |
| `review-pr` | Structured PR feedback with severity labels |
| `resolve-pr-feedback` | Process and resolve review comments |
| `new-quickstart` | Scaffold from quickstart template |
| `new-how-to` | Scaffold from how-to guide template |
| `new-overview` | Scaffold concept/overview articles |
| `new-tutorial` | Scaffold multi-step tutorials |
| `audit-freshness` | Systematic staleness audit across a collection |
| `triage-feedback` | Categorize customer feedback by theme and impact |
| `optimize-seo` | Keyword analysis + metadata improvement |
| `validate-seo` | Validate metadata against standards |
| `validate-metadata` | Check YAML front matter against schema |
| `validate-ai-ready` | Check content for AI/copilot readiness |
| `check-inclusive-language` | Flag non-inclusive terms with approved replacements |
| `match-pattern` | Match content to the right article template |

Each skill has a `SKILL.md` following the Anthropic standard — trigger phrases, input requirements, steps, output format, error handling, and examples.

## The Review Pipeline

The default pipeline chains skills in sequence:

```
write-* → security-review → copy-edit → [clear context] → tech-accuracy
```

Writer creates with a `write-*` skill. Reviewer runs `security-review`, then `copy-edit` (style), then clears context and runs `tech-accuracy` (verification against source). The context clear between copy-edit and tech-accuracy prevents the reviewer from anchoring on the draft's claims.

## Decisions I Had to Make

After building the template, I realized there are decisions every adopter needs to make but nobody tells you about upfront. I documented them in `docs/adopter-decisions.md`:

1. **Where do squad files live?** Same repo? Different branch? Separate repo? Local only (gitignored)?
2. **Which content repos?** What do agents operate on?
3. **Which MCPs to enable?** Only GitHub is required — the rest degrade gracefully.
4. **Human vs agent boundary?** Agents draft, humans approve. But where exactly is the line?
5. **Which agents do you need?** 8 is the max. You might only need 3.
6. **Worktrees?** Parallel work on separate branches, or one branch at a time?
7. **Freshness thresholds?** 6 months? 12 months? Depends on your content.
8. **Required review passes?** Security review is non-negotiable. Style and accuracy depend.
9. **Vendor writers?** Different onboarding and quality expectations.
10. **Escalation path?** When agents can't resolve something.
11. **Decision logging?** Active, manual, or minimal?
12. **Auto-update PR branches?** Daily merge of target branch into open PRs?

These decisions should be recorded in `.squad/decisions.md` on day one so agents don't re-ask and new team members understand the choices.

## What Surprised Me

**Agents stay in their lane.** The routing rules in `.squad/routing.md` actually work — Reviewer doesn't try to write content, Writer doesn't try to do SEO analysis. The boundaries in charters matter more than I expected.

**MCPs degrade gracefully.** Most sessions, only 2-3 MCPs are connected. The agents adapt — they report what they can't reach instead of making things up.

**Squad config doesn't belong in the content repo.** This was the biggest architectural lesson. Your squad is a tool you use to work on content — it's not part of the content itself. Keep them separate.

## Getting Started

```bash
# Clone or fork the template
git clone https://github.com/your-org/docs-squad-template.git my-docs-squad
cd my-docs-squad

# Install dependencies
npm install

# Clone a content repo into repos/
cd repos
git clone https://github.com/your-org/your-docs-repo.git

# Launch Copilot CLI with your squad
cd ..
copilot -p "who's on the team?"
```

Then try: `"Review ./repos/your-docs-repo/articles/quickstart.md for technical accuracy and style compliance."`

The Reviewer agent runs the full pipeline. You get back a structured report with findings by severity.

---

Fork the template, run setup, and you have a working content team in under 5 minutes. The squad handles the repetitive parts — reviews, audits, scaffolding — so you can focus on clarity, accuracy, and the reader.
