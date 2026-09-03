---
slug: /2026-09-03-create-a-skill
date: 2026-09-03
canonical_url: https://dfberry.github.io/blog/2026-09-03-create-a-skill
custom_edit_url: null
sidebar_label: "2026.09.03 Create an agent skill"
title: "How to Create Agent Plugin Skills That Work"
description: "Learn how plugins organize agent skills, then compare six public skill creators for routing, structure, testing, and reliable execution."
tags:
  - ai
  - agent plugins
  - agent skills
  - GitHub Copilot
  - Claude
  - Codex
keywords:
  - create an agent plugin
  - agent plugin skills
  - create an agent skill
  - SKILL.md
  - agent skill creator
  - skill routing metadata
  - test agent skills
---

# How to create agent plugin skills that work

I wanted a better way to create skills for an agent plugin, so I read six public skill creators to see what they agreed on. A plugin is the top-level package. It can contain several skills, with each skill providing one reusable capability. A portable skill can also stand alone.

## My quick recommendation

- For one portable skill, start with [.NET create-skill](https://github.com/dotnet/skills/blob/main/.agents/skills/create-skill/SKILL.md), then use the [Anthropic skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) evaluation loop.
- For a Codex skill, use the [OpenAI skill-creator](https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md) as the design guide.
- For deep operational knowledge, borrow the vocabulary and anti-pattern techniques from the [Forge skill-creator](https://github.com/jdforsythe/forge/blob/master/skills/skill-creator/SKILL.md).
- For a plugin containing a family of skills or a publication pipeline, look at [Skill Forge by AgriciDaniel](https://github.com/AgriciDaniel/skill-forge/blob/main/skill-forge/SKILL.md) or [SkillForge by tripleyak](https://github.com/tripleyak/SkillForge/blob/main/SKILL.md).

## What makes a useful SKILL.md

### The description does the routing

The agent often sees the skill name and description before it loads the full file. Write the description in the words a person would use when asking for help. Include the artifacts, symptoms, or tasks that should trigger the skill.

Also say when the skill should not run. If two skills both claim "GitHub help," the router has little reason to choose the right one. "Review a pull request" and "repair a failing GitHub Actions workflow" are easier to route.

A narrow description can carry both the positive and negative routing signals:

```markdown
---
name: workflow-repair
description: Diagnoses and repairs failing CI workflows. Use for failed jobs, logs, or workflow YAML. Do not use for pull request reviews or feature development.
---
```

### The main file stays lean

Put the instructions needed for most runs in `SKILL.md`. Move long examples, schemas, and domain references into files the agent can open when needed. Put repeatable or fragile operations in scripts.

A lean main file protects the shared context. Every line of background material competes with the task, conversation, and source files the agent also needs.

The main file can name the common path and disclose details only when needed:

```markdown
---
name: release-notes
description: Drafts release notes from completed changes.
---

## Workflow

1. Identify user-visible changes.
2. Draft the summary.
3. Check [the style guide](references/style.md) when wording is unclear.
4. Run `scripts/check-notes.py` before returning the result.
```

### The instructions match the risk

Some work needs judgment. Give the agent principles and room to choose. Other work must happen the same way every time. Give that work a script or a strict sequence.

The OpenAI creator frames this as choosing the right degree of freedom. I find that more useful than treating every skill as a prose prompt. If a missed step can damage data or publish the wrong thing, do not rely on the agent remembering a suggestion buried in a paragraph.

### The skill defines a finish line

Say what the output should contain, how to represent partial success, and when to stop. Include the smallest question the agent should ask when it cannot continue safely.

Without a finish line, a skill can produce a plausible answer while skipping the check that mattered. "Update the file" is weaker than "update the file, run the existing validator, and report any failed checks without hiding them."

The finish line should make output, validation, and stopping conditions explicit:

```markdown
## Finish

- Return the updated file and a short change summary.
- Run `scripts/validate.py`.
- Report every failed check; do not claim completion if validation fails.
- If the target file is unknown, ask for its path and stop.
```

### Activation and execution get separate tests

A skill can work perfectly when you force the agent to use it and still fail in normal conversation because the description never attracts the right prompts.

Test both:

1. Does the skill activate for several realistic requests?
2. Does it stay out of nearby requests owned by another skill?
3. Once selected, does it complete the task and produce the expected result?

Anthropic's creator is especially useful here because it treats skill authoring as a loop: draft, test, review the results, revise, and add the failures to the test set.

## Microsoft and Azure skill examples

These Microsoft-owned repositories provide strong Agent Skill examples for Azure and developer workflows. They are not ranked by usage. Each one demonstrates a pattern worth borrowing:

- The [Azure AI skill](https://github.com/microsoft/azure-skills/blob/main/skills/azure-ai/SKILL.md) routes requests across several AI services while keeping service-specific details in supporting references.
- The [Azure Cost Management skill](https://github.com/microsoft/azure-skills/blob/main/skills/azure-cost/SKILL.md) defines positive and negative routing, required roles, separate workflows, and safety guidance.
- The [Azure SDK pipeline troubleshooting skill](https://github.com/Azure/azure-sdk-tools/blob/main/plugins/azure-sdk-tools/skills/pipeline-troubleshooting/SKILL.md) follows a focused identify, analyze, reproduce, fix, and verify sequence with fallback behavior.
- The [Azure Policy external evaluation authoring skill](https://github.com/Azure/azure-policy/blob/master/ExternalEvaluationPolicies/agent-skills/azure-arg-external-evaluation-policy-author/SKILL.md) shows how permissions, rejection criteria, validation, and stop conditions belong in safety-sensitive work.
- The [ASP.NET Core Web API skill](https://github.com/dotnet/skills/blob/main/plugins/dotnet-aspnetcore/skills/dotnet-webapi/SKILL.md) combines precise exclusions and deep domain guidance with security checks, examples, and a verification checklist.

## A simple way to start

I would create the next skill in this order:

1. Write three prompts that should activate it and three that should not.
2. Draft the description from the words used in those prompts.
3. Write only the instructions needed to complete the common path.
4. Move reusable facts into references and deterministic work into scripts.
5. Test routing and results separately, then revise from the failures.

The [Agent Skills specification](https://agentskills.io/specification) provides the portable base. Platform guidance, such as the [GitHub Copilot agent skills overview](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills), adds its own locations and runtime behavior. When skills are packaged in a plugin, keep plugin discovery and runtime rules separate from the portable skill instructions.

I came away with a practical test: can the agent find this skill from a normal request, and can it finish the work without guessing? If both answers are yes, `SKILL.md` is doing its job.
