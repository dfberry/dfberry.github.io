# Project Context

- **Owner:** dfberry
- **Project:** dfberry.github.io — personal tech blog
- **Stack:** Docusaurus v3, React, TypeScript, MDX, GitHub Pages, Google Analytics
- **Created:** 2026-03-22

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-22 — Squad inner source post (`2026-03-22-squad-inner-source.md`)

- **Topic:** How Squad's `.squad/` directory functions as a portable, git-versioned onboarding system for contributors — inner source and outer source framing.
- **Differentiation angle chosen:** Contributor's perspective (not creator's, not enterprise admin's). Every other Squad post is written by repo owners. This is the first from someone who *clones into* a repo that already has a squad.
- **Central insight landed:** Committing `.squad/` collapses the onboarding tax. Contributors inherit institutional knowledge (charters, histories, routing rules, decisions) the moment they `git clone`.
- **Structure:** Hook → What Squad is (brief) → Contributor workflow → Inner source connection → Outer source → Interrupted contributor → dfberry's own meta-experience → CTA.
- **Flags left for Book:**
  - `<!-- TODO: -->` near the inner source section: verify whether Squad has explicit upstream/inheritance config or if this is purely git inheritance. Brady's docs may clarify.
  - Confirm the GitHub repo URL for dfberry's blog is correct (`dfberry/dfberry.github.io`).
  - Check word count sits in 900–1400 range (draft is approximately 1,050 words body).
- **Voice:** First person, practical, no hype. Follows dfberry's established register well.

### 2026-03-22 — PAO skills added to Squad inner source post

- **Change:** Wove Brady Gaster's PR #427 (PAO's `humanizer` and `external-comms` skills) into three sections:
  1. "What you inherit when you clone" — added Skills as 4th item (after Ceremonies, Rules, Agent Memory), using PAO's humanizer + external-comms as concrete example.
  2. "Open source: friction at maintainer scale" — added concrete PAO example: new contributor files issue → external-comms drafts reply with confidence flags → maintainer reviews and types `pao approve` → voice is institutionalized.
  3. "I'm using Squad on this blog right now" — added note that guest authors inherit communication patterns, not just structure.
- **Why:** PAO skills are the clearest concrete proof that contributors inherit not just code/docs but team voice and engagement playbooks. Skills are the mechanism for "team comes along in git clone."
- **Specificity constraint:** Used actual skill names, command syntax (`pao approve`), confidence flags (🟢/🟡/🔴) to anchor the example. No abstract framing.
- **Thesis alignment:** Reinforces central claim: `.squad/` reduces collaboration friction by distributing institutional knowledge. Skills are that knowledge, operationalized.

### 2026-03-22 — Image prompts section appended to Squad inner source post

- **Approach:** Created 5 AI-generation prompts covering core concepts: team arrival, inherited collaboration structure, knowledge transfer, community gate with human review, and friction resolution.
- **Style established:** Warm, editorial, slightly abstract — "tech blog hero" aesthetic. Used isometric vectors, glowing elements, amber/blue color palettes, minimal text. No Disney/Encanto references, no real people or brand logos, no stock photo clichés.
- **Technique notes for future posts:** 
  - Lead with composition and mood before specific objects ("warm amber light" before "holographic teammates")
  - Use metaphor judiciously: "particles of dissolved friction" works; "dancing code" would be overblown
  - Specify style language explicitly (flat vector, isometric, watercolor digital) to avoid photorealism
  - Prompt length: 30–60 words with lighting, mood, and material hints for consistency
- **Themes mapped:** contributor arrival → inherited ceremonies/knowledge → portable skills → moderated community response → smooth collaboration. Each prompt grounds one conceptual pillar in visual language.

### 2026-03-22 — Antonio's narrative repairs applied

**Three targeted additions from Dolores (Storyteller review):**

1. **Repair 1 — "What Squad actually is" opener:** Added concrete scenario sentence before definitional text. New opening: "When you run `squad`, you might find Isabela drafting your pull request description, Julieta generating SEO metadata, and Dolores flagging a terminology inconsistency — all before you've written a single line. That's Squad in action..." This gives readers a visceral moment before the explanation.

2. **Repair 2 — Inner source mini-anecdote:** Inserted 2-sentence scenario after the dense explanatory paragraph about ceremonies, rules, and skills. Added: "Think of a mobile team cloning the identity platform's repo for the first time. Without Squad, they'd spend a sprint reading Confluence pages and pinging the platform team on Slack. With Squad, the agent memory already knows the auth flow, the edge cases, and the naming conventions. The first PR comes from someone who never met the platform team." Grounds the abstraction in a concrete platform team use case.

3. **Repair 3 — Image prompts framing:** Inserted single sentence between italicized intro and first prompt that ties visual aesthetic to emotional journey: "The palette below mirrors the post's emotional arc: warm tropical colors for belonging and momentum, luminous particles for knowledge in motion, and deep magentas for the friction that dissolves when the right team shows up." Connects visual strategy to post's narrative spine.

**Status:** All three repairs applied. Voice maintained (warm, technical, practical). No rewrites — pure targeted insertions.

### 2026-03-23 — User voice directive: always write in Geraldine's voice

Geraldine has explicitly requested that all future posts be written in her documented voice. This is a standing directive — applies to every post going forward.

**Geraldine's voice (extracted from published posts — use this as primary style guide):**

- **Direct and practical.** No narrative flourish, no literary ambition. Explains what she did, what she found, how to use it.
- **First-person grounded in action.** "I use...", "I built...", "I found...". Experience-first, not storytelling.
- **Short declarative sentences.** Informs, doesn't perform. Paragraphs: 2–4 sentences max.
- **Structured over lyrical.** Lists, bullet points, numbered steps. Information architecture beats narrative flow.
- **Personal but matter-of-fact.** Real personal context (actual tools, actual account names) stated plainly, without drama.
- **Humble and collegial.** "Let me know how you would have proceeded." Never self-aggrandizing.
- **No literary devices:** No em-dashes for dramatic effect. No poetic closes. No "Here's the one that doesn't get talked about enough." No cinematic transitions.
- **Functional transitions.** "Here's how it works." "This is what I found." Not: "The collaboration friction doesn't disappear. But it collapses."

**Voice anti-patterns to avoid:**
- Long narrative paragraphs building to a dramatic reveal
- Journalist-style lede paragraphs
- Em-dash-heavy rhythm prose
- Metaphors used for effect rather than clarity
- Closing lines that try to land emotionally

**Primary style references in repo:**
- `website/blog/2025-12-30-github-account-clean.md` — best single example of her voice
- `website/blog/2023-10-27-cloud-native-001.md` — first-person narrative, personal framing

### 2026-03-23 — Brady quote expanded in Squad inner source post

- **Change:** Replaced the terse "Each agent has a defined scope and accumulates context over time. They aren't stateless prompts." with a plain-language translation: "What that means in practice: each agent has a bounded scope and a memory that persists across sessions — not a single prompt with personas bolted on."
- **Rationale:** Geraldine chose option 4 — preserve Brady's voice ("Not a chatbot wearing hats") but add an accessible explanation for readers unfamiliar with the anti-pattern.
- **Lesson:** Brady's coined phrases are worth keeping verbatim; follow-on sentence doing the translation work is the pattern to use.

### 2026-03-24 — Expanded external-comms section with RFC #426 context

- **Requested by:** Geraldine (Build task: explain WHY `.squad/` committed to repo made external-comms skill possible)
- **Changes made:**
  1. Tightened opening paragraph: changed "onboarding overhead / same questions / missing conventions" to concrete pain: "slow first response / issues sit unanswered for days / team heads-down"
  2. Added 3 new paragraphs after the numbered list that explain the RFC #426 mechanism:
     - **Para 1:** Skill ships as `.squad/skills/external-comms/SKILL.md` — travels with repo. Clone gets agent, charter, templates, tone patterns, audit workflow. No setup.
     - **Para 2:** Full infrastructure in `.squad/comms/` — audit trail, review state, tone tests — all version-controlled. Ralph integration, routing rules in `.squad/routing.md`. Contributor gets workflow + templates + audit trail on git clone.
     - **Para 3:** Brady's constraint (human review gate) is baked into workflow, not just policy. `pao approve` is maintainer sign-off. Reusable: maintainer can fork skill and adapt templates to their project's voice.
- **Voice maintained:** Direct, practical, short sentences. First-person ("I built") grounded in action. No literary flourish.
- **Mechanics preserved:** Numbered list untouched. Image tag untouched. Section transitions functional ("Here's why...").
- **Why this matters:** Demonstrates that `.squad/` as a git-versioned system makes portable, inheritable collaboration infrastructure possible — the central thesis of the post.
