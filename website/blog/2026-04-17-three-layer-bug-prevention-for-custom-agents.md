---
slug: /2026-04-17-three-layer-bug-prevention-for-custom-agents
canonical_url: https://dfberry.github.io/blog/2026-04-17-three-layer-bug-prevention-for-custom-agents
custom_edit_url: null
sidebar_label: "2026-04-17 Three-layer bug prevention for custom agents"
title: "Three-Layer Bug Prevention for Custom Agents Built on Copilot SDK"
description: "A real bug in Squad — an invalid CLI flag copy-pasted across 8 files — reveals a pattern any custom agent can use to prevent bugs from spreading through AI-generated code."
published: false
tags:
  - GitHub Copilot
  - AI agents
  - Copilot SDK
  - testing
  - developer workflow
keywords:
  - copilot sdk bug prevention
  - ai agent code quality
  - tdd agents
  - custom agent testing
  - multi-agent bug patterns
updated: 2026-04-17 00:00 PST
---

# Three-Layer Bug Prevention for Custom Agents Built on Copilot SDK

<!-- Bellingham prompt: A cross-section of a Bellingham fishing net with three layers of mesh, each catching different sizes of debris before it reaches the catch. Same 3-color palette (slate blue #4A6FA5, warm sage #7A9A7B, charcoal #3C3C3C), pen-and-ink with watercolor wash, 1200×630px. -->

> Part of a series on building custom agents with Copilot SDK. See also: [Agent Coordination in Copilot CLI](/blog/2026-04-17-agent-coordination-copilot-sdk).

## A Real Bug, Eight Files Deep

I was reviewing a PR on [Squad](https://github.com/bradygaster/squad), an AI team framework built on Copilot CLI, when I found a bug that tells a broader story about agent-built code.

The bug: Squad's watch and loop commands shell out to the Copilot CLI to dispatch work to agents. Every one of those commands used `--message` to pass the prompt — a flag that **doesn't exist**. The correct flag is `-p`. The result: every automated dispatch silently failed with `error: unknown option '--message'`.

How did it happen? One developer wrote a `buildAgentCommand()` function in the first watch capability with `--message`. Then that function was copy-pasted — sometimes by humans, sometimes by AI agents — into seven more files. A second developer built the `loop` command months later, saw the existing pattern, and followed it. The bug spread because the pattern *looked* established.

The fix PR changed `--message` to `-p` in all eight files. Correct, but not structural. The same class of bug can happen again next time someone adds a watch capability.

This got me thinking: **if you're building a custom agent on the Copilot SDK, what would prevent this class of bug?** Not just this specific flag, but the pattern — incorrect code that looks correct because it matches existing code, and spreads because agents copy what they see.

## Why AI Agents Make This Worse

Human developers copy-paste too, but they're more likely to:
- Google the flag before using it
- Notice when a command fails in their terminal
- Ask "wait, is this right?" when something looks unfamiliar

AI agents are excellent pattern matchers. When an agent sees `--message` used consistently across 7 files, it treats that as a strong signal: *this is the correct pattern*. The agent doesn't verify against external documentation. It doesn't run the command to check. It copies what exists with high confidence.

This is the **inherited bug problem**: agents amplify existing bugs by treating frequency as correctness. The more files contain the bug, the more confident the agent becomes that it's right.

## The Three-Layer Approach

Good engineering prevents most of this. TDD combined with extracted shared functions would have caught this specific bug on day one. But agents move fast, skip steps, and generate code across many files in parallel. You need defense in depth — layers that catch what the previous layer missed.

Here's the pattern I'd recommend for any custom agent built on the Copilot SDK:

### Layer 1: Code Structure — Extract and Centralize

**The principle:** Any function that gets used in more than one place should exist in exactly one place.

In Squad's case, `buildAgentCommand()` should live in a single shared module:

```typescript
// cli/core/agent-command.ts — single source of truth
export function buildAgentCommand(
  prompt: string,
  options: { agentCmd?: string; copilotFlags?: string }
): { cmd: string; args: string[] } {
  if (options.agentCmd) {
    const parts = options.agentCmd.trim().split(/\s+/);
    return { cmd: parts[0]!, args: [...parts.slice(1), '-p', prompt] };
  }
  const args = ['-p', prompt];
  if (options.copilotFlags) {
    args.push(...options.copilotFlags.trim().split(/\s+/));
  }
  return { cmd: 'copilot', args };
}
```

Every watch capability and the loop command imports from this one file. Now:
- A bug fix is one line, not eight
- An agent writing a new capability imports the function instead of reinventing it
- The function becomes the canonical pattern that agents copy — and it's correct

**How the Copilot SDK helps:** When creating a session, you can scope which tools and files an agent has access to. If your agent's charter says "use `buildAgentCommand()` from `cli/core/agent-command.ts` for all CLI invocations," the agent follows that instruction. The SDK's `SystemMessageConfig` lets you embed this guidance directly in the agent's system prompt:

```typescript
const session = await client.createSession({
  systemMessage: {
    mode: 'append',
    content: 'When shelling out to Copilot CLI, always use buildAgentCommand() from cli/core/agent-command.ts. Never construct CLI arguments manually.'
  },
  onPermissionRequest: approveAll,
});
```

**What this catches:** Duplication. One correct implementation, everywhere.

### Layer 2: Knowledge — Encode Conventions as Agent Memory

**The principle:** If a convention isn't written down where agents can read it, it doesn't exist for agents.

Code extraction prevents duplication, but it doesn't prevent someone from bypassing the shared function and writing their own. You need the *reason* documented, not just the code.

For a Squad-style team, this means writing it into `decisions.md`:

```markdown
## 2026-04-17 — Copilot CLI invocation convention

**Decision:** All commands that shell out to Copilot CLI must use the shared
`buildAgentCommand()` from `cli/core/agent-command.ts`. The non-interactive
prompt flag is `-p` (not `--message`, which doesn't exist). Direct CLI
invocation uses `copilot` (not `gh copilot`, which causes Windows console
window issues).

**Rationale:** `--message` was used in 8 files for months before anyone caught
it. Copy-paste propagation made the bug look intentional. Centralizing
prevents drift.
```

Every agent reads this at spawn time. When an agent is tempted to write `['copilot', '--message', prompt]` inline, it sees the decision and uses the shared function instead.

**For non-Squad custom agents:** The same principle applies through the SDK. You can use `SessionHooks` to inject conventions into every session:

```typescript
const session = await client.createSession({
  hooks: {
    onUserPromptSubmitted: async (input) => {
      // Inject project conventions into every prompt
      if (input.prompt.includes('shell') || input.prompt.includes('execFile')) {
        return {
          additionalContext: `CONVENTION: Use buildAgentCommand() for CLI invocations. The prompt flag is -p. Never use --message.`
        };
      }
    }
  },
  onPermissionRequest: approveAll,
});
```

The `onUserPromptSubmitted` hook fires before the model processes the prompt, letting you append convention reminders contextually. The agent sees the convention at exactly the moment it needs it.

**What this catches:** Agents bypassing the shared code. Even if someone writes a new function, the convention tells them which flag to use.

### Layer 3: Verification — Tests That Validate Reality

**The principle:** If your tests mock the thing that's broken, they can't catch the breakage.

The existing tests for `buildAgentCommand()` mocked `execFile` and checked that `--message` appeared in the arguments. The tests passed perfectly — they validated that the code produced the *expected wrong output*. The mock replaced reality with an assumption, and the assumption was wrong.

**TDD prevents this from the start.** Write the test before the implementation:

```typescript
import { buildAgentCommand } from '../cli/core/agent-command.js';

describe('buildAgentCommand', () => {
  test('uses -p flag for non-interactive prompt', () => {
    const { cmd, args } = buildAgentCommand('test prompt', {});
    expect(cmd).toBe('copilot');
    expect(args).toContain('-p');
    expect(args).not.toContain('--message');
    expect(args).toContain('test prompt');
  });

  test('respects custom agent command', () => {
    const { cmd, args } = buildAgentCommand('test', { agentCmd: 'my-agent --flag' });
    expect(cmd).toBe('my-agent');
    expect(args).toContain('--flag');
    expect(args).toContain('-p');
  });

  test('passes copilot flags through', () => {
    const { args } = buildAgentCommand('test', { copilotFlags: '--model gpt-4' });
    expect(args).toContain('--model');
    expect(args).toContain('gpt-4');
  });
});
```

These tests validate the function's contract directly — no mocks, no assumptions about the external CLI. The `-p` flag is specified in the test before the implementation exists.

**For deeper validation,** add an integration smoke test:

```typescript
import { execFileSync } from 'node:child_process';

test('copilot CLI accepts -p flag', () => {
  // Verify the flag is valid by checking help output
  const help = execFileSync('copilot', ['--help'], { encoding: 'utf8' });
  expect(help).toContain('-p');
});
```

This test fails if the CLI ever changes its flags — catching the problem at the source, not downstream.

**How the SDK enables this:** The `SessionHooks.onPostToolUse` hook lets you validate tool results after execution:

```typescript
hooks: {
  onPostToolUse: async (input) => {
    if (input.toolName === 'powershell' && input.toolResult.resultType === 'failure') {
      const output = input.toolResult.textResultForLlm;
      if (output.includes('unknown option')) {
        return {
          additionalContext: `A CLI flag was rejected. Check the flag against the CLI's --help output before retrying. Known valid flags: -p (prompt), --model, --agent.`
        };
      }
    }
  }
}
```

This hooks into the agent's tool pipeline in real time. When a command fails with "unknown option," the hook injects a correction before the agent retries — turning a runtime failure into a learning moment within the session.

**What this catches:** The actual bug. If `-p` is wrong tomorrow, the test fails. No amount of convention documentation saves you if the external tool changes.

## How the Three Layers Work Together

Each layer catches what the previous one misses:

| Layer | What it prevents | What it misses |
|-------|-----------------|----------------|
| **1. Code structure** | Duplication drift — bug appears once, not eight times | Someone bypassing the shared function |
| **2. Knowledge** | Agents ignoring conventions — the *why* is documented | The convention itself being wrong |
| **3. Verification** | Wrong conventions — tests validate against reality | Nothing, if the tests are comprehensive |

The layers compound. With all three:
- The function exists in one place (structure)
- Agents know to use it (knowledge)
- Tests prove it works (verification)

Without any one layer, bugs find a way in:
- Without structure: correct knowledge, duplicated in eight places, gradually drifting
- Without knowledge: correct function exists, but agents write their own version
- Without verification: correct function, well-documented, but the flag is wrong and nobody knows

## Applying This to Your Custom Agent

If you're building a custom agent with the Copilot SDK, here's the practical checklist:

### Structure
- [ ] Extract shared utilities — anything used in 2+ places gets its own module
- [ ] Scope agent system prompts to reference shared modules: "use X from Y"
- [ ] Use `SessionConfig.availableTools` to limit which tools agents can use, reducing surface area for mistakes

### Knowledge
- [ ] Document conventions where agents read them — system prompts, decisions files, or `onUserPromptSubmitted` hooks
- [ ] Include the *rationale*, not just the rule — agents follow "use `-p` because `--message` doesn't exist" better than "use `-p`"
- [ ] Use `SessionHooks` to inject conventions contextually (when the agent is about to do the relevant thing)

### Verification
- [ ] Write tests for shared utilities before implementing them (TDD)
- [ ] Don't mock the thing you're testing — mock the boundaries, test the logic directly
- [ ] Add integration smoke tests for external tool invocations
- [ ] Use `onPostToolUse` hooks to detect and correct tool failures in real time

## The Bottom Line

<!-- Bellingham prompt: Three layers of fishing net pulled taut across Bellingham Bay, sun shining through, each layer finer than the last. Same palette, same style. -->

AI agents are powerful pattern matchers, and that's exactly the problem. They copy what they see with high confidence, and they see bugs as often as they see correct code. The more an incorrect pattern appears in a codebase, the more an agent trusts it.

The fix isn't to make agents smarter — it's to make the codebase harder to get wrong. Extract shared code so bugs can only live in one place. Document conventions so agents know the right pattern. Write tests that validate reality so wrong patterns get caught.

Three layers. Each one simple. Together, they catch the class of bug that spreads through codebases like `--message` spread through eight files — silently, confidently, and wrong.
