---
slug: /2026-07-14-capture-layer-for-portable-context
date: 2026-07-14
canonical_url: https://dfberry.github.io/blog/2026-07-14-capture-layer-for-portable-context
custom_edit_url: null
sidebar_label: "2026.07.14 Capture layer"
title: "Capturing the Memory Feed: A Copilot CLI Plugin for Portable Personal Context"
description: "A Copilot CLI log-to-file extension turns sessions into structured YAML observations that can feed a human-reviewed portable personal context pipeline."
tags:
  - ai
  - copilot
  - personal context
  - github
  - markdown
  - productivity
  - architecture
  - memory
  - copilot cli
  - plugin
  - extension
  - observability
  - yaml
keywords:
  - copilot cli plugin
  - copilot cli extension
  - portable personal context
  - ai memory feed
  - ai observation log
  - copilot response logging
  - yaml ai logs
  - personal context pipeline
  - observation candidate ratification context
  - local first ai memory
  - developer productivity ai
  - ai context architecture
  - prompt injection retrieval boundary
  - second brain for developers
---

In [Portable Personal Context Across AI Client Surfaces](/2026-07-10-portable-personal-context), I separated **personal context** from **memory**.

Personal context is authored, curated, and authoritative. Memory is accumulated, observed, and evidentiary. The post proposed a promotion pipeline:

```text
observation  →  candidate  →  [ratification gate]  →  context
 (memory)       (proposed)     (a human decision)      (canonical)
```

That post focused on the right side of the pipeline: the curated context repo. It named the left side, but left it mostly unimplemented.

The `copilot-cli-log-to-file` extension fills that gap. It does not make memory authoritative. It gives memory a capture layer: timestamped, structured observations from Copilot CLI sessions, written as files you own.

> 🖼️ **Image prompt:** Create a dark developer-architecture hero image on background #1a1a2e showing a terminal window labeled "Copilot CLI" emitting small timestamped YAML documents into a folder labeled "memory feed". A separate curated markdown repo labeled "portable personal context" sits to the right, connected by a narrow gate labeled "human ratification". Style: clean vector, subtle cyan and violet accents, no people, no logos, high contrast, suitable for a technical blog header.

---

## Which Half Is This? The Memory Feed

The stronger angle is **memory feed**, not cross-computer sync.

Sync is real, but it is downstream. The plugin's core contribution is capture: it produces the raw, timestamped, machine-parseable feed that the first post identified as the missing memory half of the architecture. Once the feed is made of files, cross-computer second-brain behavior becomes a useful payoff, not the center of the design.

That distinction matters because capture is not context. A log file can prove what happened. It should not silently become an instruction.

---

## What the Plugin Actually Does

`copilot-cli-log-to-file` is a GitHub Copilot CLI extension. After each Copilot CLI turn finishes, it writes the prompt, final response, timestamp, session ID, and any opted-in capture data to a timestamped file.

By default, it writes complete YAML documents:

```text
copilot-response-log/
  2026-07-13T11-21-45Z-list-all-my-files.yaml
  2026-07-13T14-05-02Z-explain-this-function.yaml
```

The default output is intentionally conservative: no enriched capture is enabled unless you opt in. With default settings, the file contains the timestamp, session ID, prompt, and final response. Additional categories can be enabled individually, including attachments, reasoning, tool calls and results, token usage and cost, model info, skills, subagents, permissions, errors, lifecycle events, turn boundaries, schedules, and notifications.

The extension can also write plain text, but YAML is the more interesting default because each file is a complete valid YAML document, not markdown with frontmatter. It can be loaded directly by a parser.

A small realistic capture might look like this:

```yaml
timestamp: "2026-07-14T18:21:45.000Z"
sessionId: "9f4c2a7b12345678"
prompt: |-
  Summarize the current branch and suggest the next test to run.
tools:
  - toolCallId: "call_abc123"
    toolName: "git"
    arguments: '{"command":"status --short"}'
    success: true
    result: "M website/blog/2026-07-14-capture-layer-for-portable-context.md"
usage:
  - model: "gpt-5"
    inputTokens: 1840
    outputTokens: 420
    cacheReadTokens: 600
    cacheWriteTokens: 0
    duration: 1310
    finishReason: "stop"
response: |-
  The branch has one modified blog post. The next targeted validation is to re-read
  the file for frontmatter, link, and YAML-example accuracy before committing.
```

Two implementation details are worth noting. First, stdout is reserved for the CLI's JSON-RPC protocol, so extension output uses `session.log(...)`, not `console.log(...)`. Second, `@github/copilot-sdk` is provided by the Copilot CLI runtime; the extension does not ship it as an npm runtime dependency.

> 🎨 **Diagram prompt:** Create a dark-background technical diagram (#1a1a2e) titled "Copilot CLI capture layer". Left node: "User prompt". Middle node: "Copilot CLI turn" with two smaller internal labels: "assistant response" and "events". Right node: "timestamped YAML file". Under the YAML file, list optional sections: "attachments", "tools", "usage", "skills", "errors". Add a small note beside the optional sections: "all enriched captures default OFF". Use rounded boxes, cyan arrows, and compact developer-diagram styling.

---

## From Captured Turn to Curated Context

The first post's pipeline becomes more concrete with a log folder:

```text
copilot-response-log/*.yaml
        ↓
observation
        ↓
candidate
        ↓
[ratification gate]
        ↓
portable personal context repo
```

The capture file is the **observation**. It says: this prompt happened, this response was given, these tools ran, these costs or errors were observed, if those categories were enabled.

A **candidate** is a proposed durable fact extracted from one or more observations:

```markdown
### Candidate: Prefer targeted validation before full-suite validation
- **Evidence:** Multiple Copilot CLI sessions recommended a targeted file or unit test before full build validation.
- **Proposed context:** For documentation-only changes, re-read the edited file before running broader validation.
- **Confidence:** Medium
```

The **ratification gate** is still human. The user decides whether that candidate belongs in canonical context. If approved, it moves into a curated markdown file such as `process/quality-bar.md`, `decisions/_active.md`, or `core/communication.md`.

That human gate is not ceremony. It is the difference between evidence and authority.

| Pipeline stage | Source | Status | Example |
|---|---|---|---|
| Observation | YAML capture | Raw evidence | "This session used a targeted validation step." |
| Candidate | Extracted proposal | Not authoritative | "Maybe targeted validation is preferred." |
| Ratification | Human review | Decision point | "Yes, make this a workflow rule." |
| Context | Markdown repo | Canonical | "For docs-only changes, re-read the edited file first." |

> 🎨 **Diagram prompt:** Create a dark vector flow diagram on #1a1a2e showing four horizontal stages: "Observation (YAML log)", "Candidate (proposed fact)", "Ratification gate (human review)", and "Context (canonical markdown)". Make the ratification gate visually distinct as a narrow checkpoint with a lock icon. Add a red bypass arrow labeled "do not auto-promote" that is crossed out. Style should match a precise engineering architecture diagram.

---

## Why Files, Not a Hidden Store?

The first post argued that LLMs already speak markdown. The same local-first logic applies to the memory feed, with one adjustment: observations want structured data more than prose. YAML fits that middle ground.

| Choice | Why it helps |
|---|---|
| **YAML documents** | Machine-parseable, human-readable, easy to diff |
| **One file per turn** | Append-friendly, timestamped, easy to archive or delete |
| **Configurable folder** | Can stay local, live inside a project, or point to a private synced location |
| **Git-versionable** | Useful when logs are deliberately curated or scrubbed before commit |
| **Plain text option** | Helpful when the user wants readability over structured ingestion |

A hidden memory service can be convenient. A folder of YAML files is inspectable. You can open it, grep it, parse it, redact it, or delete it without asking a platform for an export.

This is the same architectural bet as portable personal context: files are a lowest-common-denominator interface that developer tools already understand.

---

## Threat Model: Logs Are Private-Tier Data

A capture layer increases visibility, but it also increases responsibility.

These logs can contain secrets, file paths, tool arguments, snippets of attached files, PII, internal project details, failed commands, and model outputs that were never meant to become public. Enriched capture defaults to off for a reason.

Treat the log folder like the **private tier** from the first post:

- Keep captures local unless you have a deliberate sync policy.
- Scrub before committing logs to any repository.
- Be careful with tool arguments and results; they can reveal more than the final response.
- Do not index the full log folder into every AI surface by default.
- Enforce trust tiers before retrieval, not after output.

Retrieval is still the boundary. If an untrusted surface can read private logs, output filtering is too late.

> 🎨 **Diagram prompt:** Create a dark security-boundary diagram (#1a1a2e) with a folder labeled "raw Copilot CLI logs" inside a red-outlined zone labeled "private tier". Outside the zone, show three consumers: "local parser", "curated context repo", and "untrusted AI surface". Draw an allowed arrow from logs to local parser, an allowed arrow through "scrub + ratify" to curated context, and a blocked arrow from logs directly to untrusted AI surface. Use red for blocked access, cyan for allowed access.

---

## The Payoff: A Central Second Brain Across Computers

Once the memory feed is files, syncing becomes straightforward. A developer can point the extension at a folder that is backed up or synced through git, OneDrive, or another private file-sync mechanism.

That does not make every surface smart automatically. It creates a common substrate:

```text
Computer A: Copilot CLI → copilot-response-log/*.yaml
Computer B: Copilot CLI → same synced folder
Review step: observations → candidates → approved context
Wired surfaces: read approved context, not raw logs by default
```

The central second brain is not the raw log folder by itself. It is the combination of:

1. captured observations,
2. human-reviewed promotion,
3. canonical portable context, and
4. per-surface wiring.

The raw feed helps you stop losing useful session evidence. The curated repo helps tools stop relearning approved facts.

---

## What Is Still Manual

This is still an early architecture, not a finished standard.

Several pieces remain manual:

- **Ratification.** A human still decides what becomes canonical context.
- **Extraction.** Candidate generation can be assisted, but the durable rule still needs review.
- **Per-surface wiring.** Each AI surface still needs its own way to read the promoted context.
- **Trust tiers.** A local folder does not enforce server-side redaction.
- **Shared standard.** There is still no common `$AI_CONTEXT_PATH` or equivalent that all tools honor.

That is the honest boundary. The plugin does one important thing well: it captures the missing memory feed as structured files. From there, the architecture in the first post has something concrete to promote.

The standard still does not exist. But the raw material for one is now easier to see.
