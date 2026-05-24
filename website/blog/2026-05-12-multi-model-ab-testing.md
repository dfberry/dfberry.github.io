---
slug: "/2026-05-12-multi-model-ab-testing"
canonical_url: "https://dfberry.github.io/blog/2026-05-12-multi-model-ab-testing"
custom_edit_url: null
sidebar_label: "2026.05.12 Model A/B Testing"
title: "Which AI Model Is Best for YOUR Codebase? Stop Guessing, Start Testing"
description: "A framework for comparing models against your own workloads instead of relying on vibes or vendor marketing."
draft: true
tags:
  - "AI Agents"
  - "Model Evaluation"
  - "Developer Workflow"
  - "Squad"
  - "AI-assisted"
keywords:
  - "model ab testing"
  - "llm evaluation"
  - "codebase benchmarking"
  - "ai model selection"
  - "squad"
updated: "2026-05-12 00:00 PST"
---

Every week, someone on a team asks: "Should we use Claude or GPT for this?" The answer used to be tribal knowledge—whatever we used last time, or what the vendor was pushing that month. Nobody had real data. Today, with 16 models in the [Squad SDK](https://github.com/bradygaster/squad) catalog and three new models landing monthly, guessing is expensive.

Generic benchmarks (LMSYS leaderboards, provider scorecards) test models on synthetic problems—math puzzles, roleplay, general trivia. They don't tell you which model generates the best tests for *your* test patterns, or which can refactor *your* codebase idioms fastest. A model that excels at generic code generation might struggle with your domain-specific architecture. And the cost column? Usually missing.

I built a framework to stop guessing. It runs identical tasks across models, collects cost/quality/speed metrics, and shows you which model wins for *your* specific codebase. No benchmark leaderboards. Just your code, your patterns, and hard numbers.

## The Problem: Tribal Model Selection

When you don't know which model to use, you either overspend on premium models when cheaper alternatives work just as well, or undershoot on quality because you don't know which model performs best for your specific tasks. Your team makes assumptions that don't hold.

Meanwhile, every month a new model ships. Do you switch? Run parallel experiments? Most teams just stick with what they know, leaving money on the table and performance on the bench.

The real cost isn't the few dollars per test—it's the opportunity cost of not knowing which model is right for your workflow. A model that excels at code generation might be terrible at refactoring. A cheap model might hit rate limits because it requires more retries. You need data, not intuition.

## The Solution: Local A/B Testing Framework

The [squad-ab-testing](https://github.com/bradygaster/squad-ab-testing) framework lets you run your real tasks against multiple models in parallel, measure output quality, collect token costs, and get a ranked comparison table.

Think of it as running controlled experiments on your own code. No code writing required—configure experiments as JSON, run CLI commands, read results. The framework handles parallel orchestration, metrics collection, statistical analysis, and reporting.

> 📊 **[DIAGRAM: Experiment Flow Pipeline]**
> *Prompt for image generation:* A horizontal flow diagram showing: (1) Configuration JSON icon → (2) Config Loader box → (3) Task Dispatcher splitting into parallel paths for GPT-4, Claude, GPT-3.5 (show 3 boxes side-by-side) → (4) Metrics Collector merging the paths → (5) Comparison Table output. Use dark background, teal/blue accent colors for boxes, white arrows showing flow direction. Add labels: "config", "load", "parallel runs", "metrics", "results". Style: clean lines, minimal decoration.
> *Purpose:* Helps readers visualize how experiments move from configuration through parallel model execution to aggregated results—demystifies the orchestration process.

## Setup

```bash
# Clone the repository
git clone https://github.com/bradygaster/squad-ab-testing.git
cd squad-ab-testing

# Install and build
npm install && npm run build

# Make the CLI globally available
npm link
```

Verify the setup works:

```bash
npm run test
```

Expected output: All tests pass (✓).

## Create Your First Experiment Config

```bash
squad-ab-test init
```

This generates `experiment.json`. Open it and customize:

```json
{
  "name": "code-generation-comparison",
  "task": {
    "prompt": "Write a TypeScript function that validates email addresses using regex. Include tests.",
    "inputFiles": [],
    "evaluator": "test-pass-rate"
  },
  "models": ["gpt-4o", "claude-sonnet-4-20250514", "gpt-3.5-turbo"],
  "repetitions": 3,
  "budget": {
    "maxPerRun": 5000,
    "maxTotal": 50000
  }
}
```

**Config breakdown:**
- **name**: Unique identifier for this experiment
- **task.prompt**: Instruction sent to each model
- **task.inputFiles**: Optional context files (relative paths)
- **task.evaluator**: Quality metric (`test-pass-rate`, `lint-score`, or custom)
- **models**: List of models to compare
- **repetitions**: How many times to run each model for statistical confidence
- **budget**: Optional token/cost limits to prevent runaway expenses

## Running Your First Experiment

```bash
squad-ab-test run experiment.json
```

The framework spawns agents for each model in parallel, runs your task against each one, collects metrics, aggregates results, and ranks them:

```
Experiment: code-generation-comparison
Date: 2025-01-15T10:30:00.000Z
N=3 repetitions

Model               | Avg Cost    | Avg Latency   | Quality   | Stddev
────────────────────────────────────────────────────────────────────────
gpt-4o              | 0.0045      | 1250ms        | 0.950     | 0.030
claude-sonnet-4     | 0.0038      | 980ms         | 0.920     | 0.050
gpt-3.5-turbo       | 0.0012      | 450ms         | 0.870     | 0.080
```

## Interpreting the Results Table

Each column answers a specific question:

- **Avg Cost**: Average token cost per run (lower = cheaper). Use this to calculate monthly/yearly spend for production tasks.
- **Avg Latency**: Average response time in milliseconds. Matters more for interactive workflows, less for batch jobs.
- **Quality**: Evaluator result on 0–1 scale (higher = better output). This is the business metric that matters most.
- **Stddev**: Standard deviation across repetitions. Models with low Stddev are more predictable and consistent.

> 📊 **[DIAGRAM: Cost vs. Quality Tradeoff Scatterplot]**
> *Prompt for image generation:* A scatter plot with Cost (dollars) on X-axis (0.001 to 0.010) and Quality (0–1) on Y-axis. Plot 3 data points: (0.0045, 0.950) labeled "gpt-4o" in teal, (0.0038, 0.920) labeled "claude-sonnet" in blue, (0.0012, 0.870) labeled "gpt-3.5-turbo" in cyan. Add a dotted diagonal line showing the tradeoff curve. Include grid lines (subtle), axis labels, and a legend. Dark background, accent colors for labels and dots.
> *Purpose:* Visually communicates the cost/quality spectrum—readers instantly see which models are "cheap but rough" vs. "expensive but best," making tradeoff decisions intuitive.

**Now you can answer hard questions with actual data:**

1. **Best overall?** Look at the Quality column. gpt-4o wins at 0.950.
2. **Cost vs. quality?** Compare Cost against Quality. claude-sonnet-4 is 16% cheaper (0.0038 vs 0.0045) with only 3% lower quality (0.920 vs 0.950). Is that tradeoff worth it? That's your call.
3. **Speed matters?** gpt-3.5-turbo is fastest (450ms). If you're generating docs in a batch job that runs once a day, speed doesn't matter. If you're in a tight loop, it does.
4. **Consistency?** Models with low Stddev are safer bets. gpt-4o is most consistent (0.030); gpt-3.5-turbo is least (0.080).

## Real Walkthrough: Testing Code Review Quality

Here's a concrete example: testing which model generates the best code review comments.

**Step 1: Create experiment.json**

```json
{
  "name": "code-review-quality",
  "task": {
    "prompt": "Review this function and identify bugs, performance issues, and style violations. Be specific.",
    "inputFiles": ["src/utils.ts"],
    "evaluator": "lint-score"
  },
  "models": ["gpt-4o", "claude-opus-4.6", "gpt-4-turbo"],
  "repetitions": 3
}
```

**Step 2: Run the experiment**

```bash
squad-ab-test run experiment.json --output results/
```

**Step 3: Analyze results**

```
Model               | Avg Cost    | Avg Latency   | Quality   | Stddev
────────────────────────────────────────────────────────────────────────
claude-opus-4.6     | 0.0062      | 1850ms        | 0.980     | 0.020
gpt-4o              | 0.0045      | 1250ms        | 0.950     | 0.030
gpt-4-turbo         | 0.0035      | 920ms         | 0.920     | 0.040
```

**Verdict:** claude-opus-4.6 generates the best reviews (0.980 quality). It costs 37% more (0.0062 vs 0.0045) but your code reviews are measurably better. For a team that reviews code daily, that difference compounds.

**Step 4: Decision**

- Use claude-opus-4.6 for review-quality tasks (high accuracy needed)
- Use gpt-4o for general code generation (best balance)
- Use gpt-4-turbo for batch analysis (speed + lower cost)

## What Makes This Framework Different

Most benchmarks test generic tasks. This tests *your* specific workflow. A model ranked #3 on LMSYS might be #1 for your codebase. The data comes from your code, your patterns, your evaluators.

The first time I ran this on my codebase, results surprised me:
- GPT-3.5-turbo outperformed Claude Opus on test generation—despite Opus being more expensive and marketed as the "quality" choice
- But on documentation tasks, Opus crushed GPT-4o
- The expensive model was wrong for two out of three tasks

Tribal knowledge would have locked me into the expensive choice. Data let me optimize.

## Extending It: Custom Evaluators

The framework ships with `test-pass-rate` and `lint-score`, but you can register custom evaluators:

```typescript
import { EvaluatorRegistry } from './src/evaluators/EvaluatorRegistry.js';

const registry = new EvaluatorRegistry();

registry.register('readability-score', async (output: string) => {
  // Your logic — return 0–1 score
  const complexity = analyzeComplexity(output);
  const clarity = analyzeClarity(output);
  return (complexity + clarity) / 2;
});
```

Then reference it in your config:

```json
{
  "evaluator": "readability-score"
}
```

Now you can measure whatever you care about: adherence to team style guides, performance benchmarks, accessibility compliance, or domain-specific quality metrics.

## Honest Scoping

**What this does:**
- Compare models on identical tasks with statistical confidence
- Measure cost, speed, and quality simultaneously
- Provide data-driven model selection

**What this doesn't do:**
- Integrate with production model APIs automatically (you need to wire that yourself)
- Handle long-running tasks (it's for discrete, bounded tasks like "generate a test" or "review code")
- Make the decision for you (you still decide what matters more: cost, speed, or quality)

## What's Next

Once you have data:

1. **Schedule regular experiments.** When a new model ships, test it. When your codebase evolves, rerun old experiments to see if your model choice still holds.
2. **Build decision trees.** Different models for different tasks. gpt-3.5-turbo for simple generation, Opus for complex reasoning, gpt-4o for the middle ground.
3. **Monitor in production.** Log which model you used and track actual metrics (customer satisfaction, bug escape rates). Adjust your experiments to match real outcomes.
4. **Share results across teams.** Your results are probably useful to sibling teams. Document your experiment methodology so others can reproduce it.

## Get Started

```bash
# Clone and setup (5 minutes)
git clone https://github.com/bradygaster/squad-ab-testing.git
cd squad-ab-testing
npm install && npm run build && npm link

# Create and run an experiment (2 minutes)
squad-ab-test init
squad-ab-test run experiment.json

# Analyze results (1 minute)
# Read the table, make a decision
```

Eight minutes later, you have data instead of guesses. That's the difference between tribal model selection and evidence-driven optimization. No more "we've always used Claude." Just: "The data says Claude is 8% better for this specific task, and it costs 12% more. Is that worth it?"
