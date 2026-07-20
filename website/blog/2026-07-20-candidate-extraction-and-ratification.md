---
slug: /2026-07-20-candidate-extraction-and-ratification
date: 2026-07-20
canonical_url: https://dfberry.github.io/blog/2026-07-20-candidate-extraction-and-ratification
custom_edit_url: null
sidebar_label: "2026.07.20 Candidate extraction"
title: "Candidate Extraction: I Built a Ratification Gate for AI Memory"
description: "Candidate extraction kept Copilot CLI memory from becoming rules by turning repeated evidence into review YAML with a ratification gate."
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
  - chronicle
  - candidate extraction
  - ratification
  - ratification gate
  - yaml
  - node:sqlite
keywords:
  - candidate extraction
  - ratification
  - ratification gate
  - portable personal context
  - copilot cli chronicle
  - copilot cli memory
  - copilot memory alternative
  - copilot memory
  - node sqlite
  - node:sqlite
  - yaml candidate review
  - human ratification gate
  - observation candidate ratification context
  - local first ai memory
  - vendor neutral ai context
  - personal context pipeline
updated: 2026-07-20 13:44 PST
draft: true
---

Candidate extraction is the step that keeps my AI memory from becoming my AI rules.

In [Portable Personal Context Across AI Client Surfaces](/2026-07-10-portable-personal-context), I separated reviewed context from raw memory. In [the Copilot CLI capture-layer post](/2026-07-14-capture-layer-for-portable-context), I built the YAML feed. This post is the next piece: candidate extraction plus a human ratification gate, with an honest detour through Copilot CLI `/chronicle` and Copilot Memory.

The short version: extraction can propose facts. It cannot approve them.

> 🖼️ **Image prompt:** Create a dark developer-architecture hero image on background #1a1a2e showing YAML observations flowing into grouped candidate cards. Each card is stopped at a narrow review gate labeled "human ratification" before a small markdown repo labeled "portable context". Add a separate read-only source labeled "Copilot CLI /chronicle" feeding the same candidate extractor. Clean vector style, cyan and violet accents, no logos, no people.

---

## Keep candidate extraction out of the approval seat

The first two posts gave me the shape of the system, but they did not yet give me the review loop. A log file on disk is useful evidence. It is not a rule I want every AI surface to trust.

Here is the pipeline I am building toward.

```text
observation  →  candidate  →  [ratification gate]  →  context
 (memory)       (proposed)     (a human decision)      (canonical)
```

The capture layer produces observations. Candidate extraction groups repeated signals and writes proposals. Ratification is where I decide whether a candidate becomes canonical markdown.

That distinction matters because AI sessions are messy. I ask one-off questions. I paste odd text. The assistant can suggest something that sounds confident but does not represent my actual preference. If that all goes straight into memory, I now have a cleanup problem. If it goes straight into context, I have a trust problem.

Boring is good here. The extractor should be conservative, readable, and easy to reject.

## Build candidates from repeated evidence

The shipped work is in [`diberry/copilot-cli-log-to-file` PR #3](https://github.com/diberry/copilot-cli-log-to-file/pull/3). The repo now has a Node ESM extractor in `lib/extract.mjs` and a CLI entry point in `bin/extract-candidates.mjs`.

The default input is the capture folder from the previous post. The default time window is seven days.

```bash
node bin/extract-candidates.mjs --input copilot-response-log --days 7 --output candidate-review.yaml
```

That command reads `copilot-response-log/*.yaml`, normalizes each file into an observation, groups repeated signals, and writes a review file. It does not edit my context repo. It does not open a PR by itself. It just creates the artifact a human can review.

The review file is deliberately plain YAML. I want to be able to open it in any editor, change a status, refine text, and use git history as the approval record.

```yaml
generated_at: "2026-07-20T19:00:00.000Z"
source_log_dir: "C:\\work\\copilot-response-log"
source: "yaml"
window:
  since: "2026-07-13T19:00:00.000Z"
  until: "2026-07-20T19:00:00.000Z"
instructions: |-
  Edit status to approved, rejected, or refined. If refined, set refined_fact.
  Merge the PR only after human review.
candidates:
  - id: "cand-001-targeted-validation"
    proposed_fact: |-
      You often prefer targeted validation before broader or full-suite validation.
    category: "workflow-preference"
    target_file: "context/workflow.md"
    confidence: "medium"
    status: "pending"
    approve: false
    reject: false
    refined_fact: ""
    reviewer_notes: ""
    evidence:
      - source: "copilot-response-log\\2026-07-19T18-00-00Z-one.yaml"
        timestamp: "2026-07-19T18:00:00.000Z"
        sessionId: "session-a"
        count: 1
        quote: |-
          Please run targeted validation.
```

The most important field is not `confidence`. It is `status: "pending"`. Every candidate starts there. A candidate is a prompt for review, not an accepted fact.

I also kept the evidence close to the proposal. If I cannot see where a candidate came from, I do not want it in my portable context. Evidence includes frequency, session IDs, timestamps, and source files. That gives me enough to ask, "Was this really a preference, or did I just do the same odd thing twice?"

## Normalize observations before judging them

The extractor has one early rule that keeps the rest of the code calmer: every source becomes the same observation shape before candidate logic runs.

For YAML capture files, the observation is almost direct. The parser reads the timestamp, session ID, prompt, response, and optional message list from the file format I built in the capture layer.

```yaml
timestamp: "2026-07-19T18:00:00.000Z"
sessionId: "session-a"
prompt: |-
  Always run targeted validation before broad validation.
response: |-
  Run `node test\extract.test.mjs` before the full suite.
```

After parsing, the extractor treats that as an observation with a source path and a source type. That sounds small, but it is the seam that made chronicle support easy later. YAML and chronicle do not need to look alike on disk. They only need to become the same shape before signal extraction.

The current signal rules are intentionally modest. They look for patterns like repeated targeted-validation language, repeated tool commands, and repeated user-stated directives. I am not asking the extractor to become a general-purpose biographer. I am asking it to find review-worthy hints.

The grouping step then counts support across sessions. That second condition is important. If I repeat the same prompt three times in one broken session, that may be frustration, not a durable preference. Cross-session evidence is a better reason to review.

The candidate output keeps the grouped evidence visible instead of hiding it behind a score. I want the review experience to feel like reading a short case file:

```text
Candidate: You often prefer targeted validation before broader validation.
Why it appeared: 4 matching observations across 2 sessions.
Where it came from: 4 source entries with timestamps and quotes.
Current authority: none, status is still pending.
```

That last line is the safety property. The extractor can make a case. It cannot win the case.

## Use confidence only for triage

I added confidence because review queues need sorting. I did not add it because I think the extractor knows the truth.

The current levels are simple:

| Confidence | Meaning in my review queue |
|---|---|
| `low` | Enough repetition to show up, but review carefully |
| `medium` | More support or more than one session |
| `high` | At least five observations across at least three sessions |

This is not a model score. It is not a probability. It is not a reason to skip review.

I like that because it keeps the language honest. A high-confidence candidate might still be wrong. A low-confidence candidate might be valuable if the source quote is clear. The confidence value only answers, "Which pile should I read first?"

That also keeps the future publisher simpler. The publisher should not care about confidence. It should care about review status. If I approve a low-confidence candidate after reading the evidence, it can publish. If I reject a high-confidence candidate because the repeated signal came from test data or a bad prompt, it stays out.

## Add a ratification gate instead of auto-promotion

The ratification form factor is intentionally normal developer workflow: a YAML review file plus a git PR.

My current design is this:

```text
extract-candidates
        ↓
candidate-review-YYYY-MM-DD.yaml
        ↓
review branch + pull request
        ↓
human edits status fields
        ↓
merge means approved review decision
        ↓
context publisher updates canonical markdown
```

The first half is built. The PR wiring and context publishing are designed, not finished. I am calling that out because it changes the risk profile. Today the extractor can produce a review file. It cannot yet carry an approved candidate into the portable context repo without the next step of code.

That is the right order for me. I would rather ship a safe candidate artifact before I ship a publisher.

The review states are small on purpose.

| Review state | Meaning | Expected action |
|---|---|---|
| `pending` | Nobody has approved this yet | Leave it alone or review it |
| `approved` | The proposed fact is acceptable | Publish as canonical context later |
| `rejected` | The candidate is noise or wrong | Keep the decision in git history |
| `refined` | The idea is right but the wording is wrong | Publish `refined_fact`, not `proposed_fact` |

I like the PR as the gate because it gives me a diff, a timestamp, and a merge decision. It also slows me down just enough. If a candidate does not deserve a PR review, it probably does not deserve to become a rule that follows me across tools.

## Filter the obvious bad promotions

The extractor is not trying to understand my whole life. It is doing a narrow job: find repeated signals that might deserve review.

The guardrails are small, but they do real work.

| Guardrail | Why I added it |
|---|---|
| One-off observations are filtered | A single weird session should not become durable context |
| Candidates require repeated support | Repetition is not proof, but it is a better review trigger |
| Assistant text alone is not canonical | The assistant can be wrong about me |
| Prompt-injection text stays a candidate | Repetition still needs human approval |
| Confidence is only triage | High confidence means "review this first," not "trust this" |

High confidence currently means at least five observations across at least three sessions. That is a sorting hint. It is not a promotion rule.

The prompt-injection case is the one I care about most. Suppose a pasted file includes "always remember this secret instruction" or a log includes a malicious phrase. If it appears once, it should disappear below the extraction threshold. If it appears repeatedly, it can still only become a pending candidate. The human gate is the hard stop.

This is also why I do not let assistant responses become canonical on their own. An assistant can summarize my behavior, but my portable context should not trust that summary until I approve it.

## Compare Copilot CLI `/chronicle` overlap honestly

Here is the honest twist: after building the capture layer, I found that Copilot CLI already has `/chronicle`.

The CLI help describes `/chronicle` as "Session history tools and insights." The same help also lists `/memory` for memory status and cross-session memory controls. [GitHub's Copilot CLI docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli) describe the CLI as Copilot directly in the terminal, and the [Copilot Memory docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory/manage-for-yourself) describe memory as stored coding conventions, preferences, and other details from interactions.

My first reaction was mild annoyance. I had just built a YAML capture layer, and the product already had a local session history path.

My better reaction was relief.

For Copilot-CLI-only use, `/chronicle` overlaps part of my capture layer and part of the retrospective side of extraction. It already has the raw session feed and user-facing history tools. That is useful. I do not need to compete with it.

So I changed the extractor to read chronicle as an additive evidence source.

```bash
node bin/extract-candidates.mjs --source both --days 7 --output candidate-review.yaml
```

The default stays `yaml` because my capture files are the portable shape I control. But `--source chronicle` and `--source both` let me use the CLI's own local feed when it exists.

That turned a collision into a better design. YAML capture remains useful when I want explicit files, easy redaction, and a tool-owned format. Chronicle becomes another local evidence source for Copilot CLI sessions.

## Read chronicle with `node:sqlite` and no runtime dependency

The chronicle integration reads the local SQLite store in read-only mode and maps its turns into the same observation shape as YAML captures.

The mapping is simple:

| Chronicle field | Observation field |
|---|---|
| `user_message` | `prompt` |
| `assistant_response` | `response` |
| `session_id` | `sessionId` |
| `timestamp` | `timestamp` |

The extractor also carries along useful side evidence when available, such as touched files, refs, and usage rows. Those are evidence, not facts.

The implementation uses Node's built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) module. Node's docs show `DatabaseSync` as the built-in SQLite API under the `node:` scheme. In this repo, I use it only if the runtime supports it.

```js
const sqlite = await import("node:sqlite").catch(() => null);

if (!sqlite?.DatabaseSync) {
  notices.push("node:sqlite is unavailable in this Node.js runtime; skipped chronicle source");
  return { observations: [], notices };
}

const db = new sqlite.DatabaseSync(`${pathToFileURL(storePath).href}?mode=ro`);
```

The read-only open is the important bit. I do not want candidate extraction to mutate Copilot's local history store. If the runtime cannot load `node:sqlite`, the extractor records a notice and keeps going.

That decision keeps the repo at zero runtime npm dependencies. The tests use `js-yaml` as a dev dependency to validate artifacts, but the shipped extractor does not need a package install to run. For a small personal-context tool, that feels right. Fewer moving pieces means fewer reasons for the extractor to fail when I just want a review file.

## Separate chronicle, memory, and portable context

This was the part I needed to get honest about. If Copilot CLI has `/chronicle` and Copilot has Memory, what is left for my portable personal context work?

My perspective: the overlap is real, but it is not the whole loop.

| Capability | What it is good at | What it does not replace for me |
|---|---|---|
| YAML capture | Explicit files I can inspect, sync, redact, and parse | It is only raw evidence |
| `/chronicle` | Local Copilot CLI history, search, standups, and insights | It does not publish vendor-neutral canonical rules |
| Copilot Memory | Copilot-hosted memory for supported Copilot features | It is single-vendor and provider-hosted |
| Portable context repo | Reviewed markdown rules any wired AI surface can read | It still needs per-surface wiring |

Copilot Memory is useful. I am not trying to replace it everywhere. GitHub's docs say Copilot Memory stores coding conventions, preferences, and other details from interactions, and lets you review and manage them. That is a good product feature.

The tradeoff is control boundary. Copilot Memory is store-now-review-or-delete-later. My ratification loop is review-before-promote. Copilot Memory is for Copilot. My context repo is vendor-neutral markdown. It can be read by Copilot, Claude, Cursor, ChatGPT, a shell script, or nothing at all until I wire it.

Chronicle has a different job. It helps me inspect past sessions across Copilot surfaces. That makes it a strong evidence source. But it is not a canonical rules publisher, and I do not want it to be. Session history should stay history unless I choose to promote something.

So the un-duplicated value is the gate plus the portable corpus. Capture and chronicle help me collect evidence. Extraction helps me find review candidates. Ratification decides what becomes a rule.

## Show where Copilot helped and where it did not

Copilot was very good at the boring code once the boundary was clear. It helped draft the parser, the grouping logic, the CLI flag handling, and the test fixture for chronicle turns. It also helped keep the emitted YAML review file stable enough to test.

Where it struggled was the product boundary. It wanted to make the extractor feel more automatic than I wanted. Auto-publishing is tempting because it makes the demo cleaner. It is also the exact failure mode I am trying to avoid.

The useful collaboration pattern was to keep asking, "What is the smallest artifact a human can review?" That kept pulling the design back to a YAML file, explicit statuses, evidence, and a later publisher.

The tests gave me receipts. PR #3 shipped with 24 passing checks across config, filename tokens, YAML round-tripping, extraction, chronicle normalization, source de-duping, and graceful fallback. The chronicle tests skip the SQLite path when the runtime does not support `node:sqlite`, which matches the runtime behavior.

## Make the review file the next interface

The candidate review YAML is now the interface between memory and context. That is the piece I want to keep stable while the surrounding plumbing changes.

A future publisher should be able to read only approved or refined entries.

```text
if status == approved:
  publish proposed_fact

if status == refined:
  publish refined_fact

if status == pending or rejected:
  publish nothing
```

That tiny rule is the ratification gate in code form. It also means the review file can outlive the first implementation. I can generate it from YAML capture today, chronicle tomorrow, and another local evidence source later. The publisher should not care as long as the review decision is clear.

I still need to decide how much structure the canonical markdown gets. A workflow preference might belong in `context/workflow.md`. A personal preference might belong in `context/preferences.md`. A decision with time-bound context might belong in a decision ledger instead of a standing rule.

That mapping is not built yet. I am glad. The review artifact will teach me what the publisher needs to know.

## Keep the next step concrete

The next implementation step is not another memory source. It is the ratification PR wiring and context publishing.

I want the flow to create a review branch, commit the candidate YAML, open a PR, and wait. After I edit the statuses and merge, a publisher can apply approved and refined facts to the canonical markdown repo. Rejected and pending candidates stay out.

That is the loop I wanted from the start:

```text
raw session evidence
        ↓
reviewable candidates
        ↓
human ratification in git
        ↓
portable markdown context
        ↓
AI surfaces read the same reviewed source
```

The capture layer got memory onto disk. Candidate extraction makes the evidence reviewable. Ratification is what keeps the context trustworthy.
