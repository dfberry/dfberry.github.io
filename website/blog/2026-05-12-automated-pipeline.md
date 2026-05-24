---
slug: "/2026-05-12-automated-pipeline"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-automated-pipeline"
custom_edit_url: null
sidebar_label: "2026.05.12 Automated Pipeline"
title: "Turn Your Squad Team's Charters into Automated Workflows"
description: "A way to promote agent charters from guidance documents into automated workflows that run on triggers."
draft: true
tags:
  - "AI Agents"
  - "Automation"
  - "Workflows"
  - "Squad"
  - "AI-assisted"
keywords:
  - "automated workflows"
  - "agent charters"
  - "pipeline automation"
  - "workflow triggers"
  - "squad"
updated: "2026-05-12 00:00 PST"
---

You've built a Squad team. You have a security expert, a tester, a documentarian. Each has a charter — a markdown file describing their role, expertise, model preference, and boundaries.

Then you want to run a pipeline: **analyze code → write tests → update docs.**

Here's what usually happens: you hardcode three prompts into your pipeline config, one per stage. Six months later, your security expert updates their approach, so you manually edit the prompts. Someone leaves, you update the charter but also have to find and update every pipeline that uses that agent. Prompts drift. Decisions scatter. You're maintaining two sources of truth.

What if charters were **configuration**, not just documentation? What if a pipeline read your team's charters at runtime and injected them into the agent prompts automatically? Then when a charter changes, every pipeline adapts without touching the pipeline config.

That's the core idea behind [Squad's Automated Pipeline](https://github.com/bradygaster/squad-sdk-example-pipeline) — turn your team charters into executable workflows. Charters drive behavior, not just intentions.

## How It Works

The pipeline reads each agent's charter file and extracts defaults: identity, role, expertise, model preference, behavioral boundaries. Skills (reusable capability definitions) are auto-matched by role and injected into the prompt. The result: pipeline configs stay focused on **what** to do (the stages and their inputs/outputs), while agent behavior lives in the charters and stays synchronized with reality.

> 📊 **[DIAGRAM: Charter-to-Pipeline Flow]**
> *Prompt for image generation:* Horizontal flow diagram showing: `.squad/agents/{name}/charter.md` files (3 cards labeled Sentinel, Guardian, Chronicler with identity/expertise/model info) → Central "Pipeline Runtime" processor (blue box) with filtering logic → 3 output stages in parallel showing agent identity, model choice, and injected skills highlighted. Dark background, teal/blue theme, charter cards on left in light boxes, runtime processor in center with gears/process arrows, output stages on right with checkmarks showing matched skills.
> *Purpose:* Illustrates how charters drive runtime behavior and how skills are auto-discovered and injected, emphasizing that pipeline configs remain static while agent behavior adapts.

You define three things:

1. **Charters** — `.squad/agents/{name}/charter.md` (who each agent is, their expertise, their boundaries)
2. **Skills** — `.squad/skills/{name}/SKILL.md` (what capabilities are available, defined once, used by any agent)
3. **Pipeline** — `pipeline.json` (what stages to run and in what order, referencing agents by name)

Update a charter, and every pipeline that uses that agent picks up the change automatically. No pipeline config edits needed.

## A Real Walkthrough

Here's what running the example pipeline looks like from start to finish, with actual CLI commands and expected output.

### Step 1: Explore the Example Team and Charters

First, let's look at the included example team. There are three agents, each with a charter:

```bash
ls -la examples/.squad/agents/
```

Output:
```
sentinel/      # Security specialist
guardian/      # Test quality specialist  
chronicler/    # Documentation specialist
```

Each charter defines the agent's identity, role, expertise, and boundaries. Let's read one:

```bash
cat examples/.squad/agents/sentinel/charter.md
```

Output:
```markdown
# Sentinel: Security Specialist

## Identity
- **Name:** Sentinel
- **Role:** Security Specialist
- **Expertise:** OWASP patterns, supply chain security, secret detection, vulnerability assessment

## Charter
You are a security expert focused on protecting our codebase and infrastructure. Your role is to:

1. **Identify Security Issues**
   - Scan for exposed secrets, hardcoded credentials, and vulnerable dependencies
   - Assess code changes for OWASP-Top-10 patterns
   - Review infrastructure-as-code for misconfigurations

2. **Assess Risk**
   - Categorize findings by severity (critical, high, medium, low)
   - Provide context and reproducibility steps
   - Suggest remediation approaches

3. **Boundaries**
   - MUST NOT modify code directly
   - MUST NOT delete any files
   - MUST provide structured findings (JSON when possible)
   - MUST follow principle of least privilege in recommendations

## Model Preference
- **Primary:** gpt-4 (security tasks require careful analysis)
- **Fallback:** gpt-4-turbo if token limits hit

## Skills
- `secret-scanning`: Detect exposed secrets and API keys
- `dependency-audit`: Check for known vulnerabilities in dependencies
```

This charter defines not just who Sentinel is, but also what model to use and which skills to inject when Sentinel runs. The pipeline will read this at runtime.

Guardian and Chronicler have similar charters defining their roles (testing and documentation):

```bash
cat examples/.squad/agents/guardian/charter.md
cat examples/.squad/agents/chronicler/charter.md
```

Guardian is focused on writing tests for risky surfaces, while Chronicler updates docs based on test findings.

### Step 2: Validate the Pipeline Configuration (Dry-Run)

Before running anything expensive, validate that the pipeline is wired correctly — all agents exist, all skills are available, all stages are connected:

```bash
npx squad-pipeline run examples/pipeline.json --dry-run
```

Output:
```
▶ Validating pipeline: Nightly Repo Health Check
  Stages: analyze → test → document

  Loading stage 1/3: analyze
    ✓ Agent 'sentinel' found
    ✓ Charter loaded (.squad/agents/sentinel/charter.md)
    ✓ Model: gpt-4
    ✓ Skills: secret-scanning, dependency-audit (2 matched)
    ✓ Task: Analyze code for security issues

  Loading stage 2/3: test
    ✓ Agent 'guardian' found
    ✓ Charter loaded (.squad/agents/guardian/charter.md)
    ✓ Model: gpt-4-turbo
    ✓ Skills: test-generation, edge-case-coverage (2 matched)
    ✓ Task: Write focused tests for risky surfaces
    ✓ Depends on: analyze (output mapping verified)

  Loading stage 3/3: document
    ✓ Agent 'chronicler' found
    ✓ Charter loaded (.squad/agents/chronicler/charter.md)
    ✓ Model: gpt-3.5-turbo
    ✓ Skills: doc-generation, changelog-update (2 matched)
    ✓ Task: Update documentation based on findings
    ✓ Depends on: test (output mapping verified)

✅ Validation passed: All stages valid, all agents found
   Stages: 3
   Agents: 3 (sentinel, guardian, chronicler)
   Charters: 3 loaded
   Skills matched: 6 total (2 + 2 + 2)
```

This tells you upfront: are all the agents referenced in the pipeline actually defined? Are the skills available? Before running anything expensive, you get confidence that the pipeline is wired correctly.

### Step 3: Run the Pipeline for Real

```bash
npx squad-pipeline run examples/pipeline.json
```

Output:
```
▶ Running pipeline: Nightly Repo Health Check
  Stages: analyze → test → document

  Stage 1/3: analyze (sentinel)
    📖 Charter: Security Specialist (model: gpt-4)
    🎯 Task: Analyze code for security issues
    ⏳ Running...
    ✅ Completed (1m 34s)
       Findings: 8 security issues discovered
         • 2 critical (exposed API keys, hardcoded secrets)
         • 3 high (dependency vulnerabilities)
         • 3 medium (weak cryptography patterns)

  Stage 2/3: test (guardian)
    📖 Charter: Test Quality Specialist (model: gpt-4-turbo)
    🎯 Task: Write tests for findings from analyze stage
    ⏳ Running...
    ✅ Completed (1m 28s)
       Results: 12 tests written, 3 edge cases
         • 3 tests for secret detection scenarios
         • 5 tests for dependency interaction
         • 4 tests for crypto patterns

  Stage 3/3: document (chronicler)
    📖 Charter: Documentation Specialist (model: gpt-3.5-turbo)
    🎯 Task: Update documentation based on security findings
    ⏳ Running...
    ✅ Completed (45s)
       Documentation updated:
         • README.md: security best practices section added
         • SECURITY.md: dependency audit checklist added
         • docs/architecture.md: threat model section revised

  ✅ Pipeline passed: 3/3 stages passed
    Run ID: eafd1dcc-bfe3-4a7b-abdc-532b96bcc4bb
    Duration: 3m 47s
    Artifacts location: examples/.squad/pipelines/eafd1dcc-bfe3-4a7b-abdc-532b96bcc4bb/
```

> 📊 **[DIAGRAM: Three-Stage Nightly Pipeline Execution]**
> *Prompt for image generation:* Vertical pipeline diagram showing 3 sequential stages stacked top-to-bottom: Stage 1 "Analyze" (inputs: codebase, runs 1m 34s, outputs: 8 issues JSON) → arrows flowing down → Stage 2 "Test" (inputs: security findings from Stage 1, runs 1m 28s, outputs: 12 tests) → arrows flowing down → Stage 3 "Document" (inputs: test results from Stage 2, runs 45s, outputs: updated docs). Each stage shows agent icon (Sentinel/Guardian/Chronicler), model used, and timing. Dark background, blue/teal stage boxes, green checkmarks, orange duration labels. Total runtime: 3m 47s shown at bottom.
> *Purpose:* Demonstrates the dependency chain and parallel-safe execution pattern—how stage outputs feed into the next stage's inputs, and why stages must run sequentially in this case.

Each stage reads its agent's charter at runtime. Sentinel uses gpt-4 because that's defined in the charter. Guardian uses gpt-4-turbo because Guardian's charter specifies that. The pipeline didn't hardcode these — it read them from the charters.

Each run creates an immutable directory with artifacts: `examples/.squad/pipelines/{runId}/`. Stage outputs are checksummed and versioned so you can audit what each agent produced, when, and in what order.

### Step 4: Check What the Pipeline Produced (Immutable Artifacts)

```bash
npx squad-pipeline status eafd1dcc-bfe3-4a7b-abdc-532b96bcc4bb --squad-dir examples/.squad
```

Output:
```
Pipeline Run: eafd1dcc-bfe3-4a7b-abdc-532b96bcc4bb
Status: passed

Stage 1: analyze
  Agent: sentinel (Security Specialist, gpt-4)
  Status: ✅ passed
  Output file: analyze/output.json
  Checksum: sha256:a3b4c5d6e7f8...
  Duration: 1m 34s
  Produced:
    {
      "issues": [
        { "type": "secret", "severity": "critical", "file": "src/config.ts", "line": 42 },
        { "type": "dependency", "severity": "high", "file": "package.json", "version": "vulnerable" }
      ]
    }

Stage 2: test
  Agent: guardian (Test Quality Specialist, gpt-4-turbo)
  Status: ✅ passed
  Output file: test/output.json
  Checksum: sha256:b4c5d6e7f8g9...
  Duration: 1m 28s
  Depends on: analyze
  Produced:
    {
      "tests_written": 12,
      "edge_cases": 3,
      "coverage_gain": "8%"
    }

Stage 3: document
  Agent: chronicler (Documentation Specialist, gpt-3.5-turbo)
  Status: ✅ passed
  Output file: document/output.json
  Checksum: sha256:c5d6e7f8g9h0...
  Duration: 45s
  Depends on: test
  Produced:
    {
      "files_updated": ["README.md", "SECURITY.md", "docs/architecture.md"],
      "sections_added": 3
    }
```

All artifacts are immutable and checksummed. You can compare runs to see what changed. This is your audit trail.

### Step 5: Update a Charter and Re-Run

Now comes the key moment: edit an agent's charter and re-run the same pipeline without touching the pipeline config.

```bash
# Edit the sentinel charter to change security expertise
vim examples/.squad/agents/sentinel/charter.md
# Change "OWASP patterns, supply chain security" to "OWASP patterns, supply chain security, API security, zero trust"

# Re-run the same pipeline — sentinel's new expertise is automatically picked up
npx squad-pipeline run examples/pipeline.json
```

Output:
```
▶ Running pipeline: Nightly Repo Health Check
  Stages: analyze → test → document

  Stage 1/3: analyze (sentinel)
    📖 Charter: Security Specialist (model: gpt-4, updated expertise)
    🎯 Task: Analyze code for security issues
    ⏳ Running with new expertise: API security, zero trust patterns now in scope...
    ✅ Completed (1m 42s)
       Findings: 10 security issues discovered (was 8)
         • New findings for API authentication patterns
         • New findings for IAM and authorization

  ...
  ✅ Pipeline passed: 3/3 stages passed
    Run ID: f9e8d7c6b5a4... (new run)
    Duration: 3m 55s
```

The pipeline didn't change. The charter did. And because the pipeline reads the charter at runtime, Sentinel's security analysis adapts without any pipeline config edits. This is the power of charters as configuration.

## Why This Matters

Most pipeline tools treat agents as interchangeable executors with inline prompts. This treats agents as **team members with persistent identities**. The charter is the single source of truth. The pipeline is the orchestration layer.

This solves real problems:
- **Prompt drift:** Charters evolve in one place, not scattered across pipeline configs and 10 different YAML files
- **Onboarding:** New team members read charters to understand capabilities and boundaries
- **Auditability:** Every run produces immutable artifacts with metadata and checksums
- **Reusability:** The same agent can participate in multiple pipelines with consistent behavior and expertise
- **Extensibility:** Add skills by writing a SKILL.md file; agents with matching roles auto-discover them

If you manage multiple pipelines or multiple agents, this pattern pays for itself immediately.

## Honest Scoping

This works great when your pipeline stages have clear dependencies and your agents have stable roles over time. It's less useful for highly experimental pipelines where you're trying different agent combinations every run.

The real value appears when you have 5+ pipelines using the same agents. At that scale, maintaining separate prompts for each agent in each pipeline becomes unmaintainable.

## What's Next

From here, you can:
- Add more agents by creating `.squad/agents/{name}/charter.md`
- Add skills in `.squad/skills/{name}/SKILL.md` — they're auto-matched by agent role
- Chain pipelines together for multi-stage orchestration
- Export pipeline runs to report generators or monitoring tools

The example also works as a foundation for other multi-stage workflows: incident response pipelines, content review pipelines, or code promotion workflows.

---

If you've built a Squad team and you're tired of hardcoding prompts into pipelines, charters-as-configuration is the pattern you need. Update your team's approach once in a charter file, and every workflow adapts automatically.

Get started: [github.com/bradygaster/squad-sdk-example-pipeline](https://github.com/bradygaster/squad-sdk-example-pipeline)
