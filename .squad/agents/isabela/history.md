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

### 2026-03-24 — Restructured OSS section: contributor angle first, workflow detail to bottom

- **Requested by:** Geraldine (Restructure task)
- **Changes made:**
  1. **Rewrote "For open source maintainers" section** — shifted from "maintainer burnout/workflow" opening to "I cloned bradygaster/squad and found external-comms already there" angle. Focus: contributor experience of inheriting a skill, not building one. 4 paragraphs, direct first-person ("I cloned", "I found", "I could use"). No numbered list in this section.
  2. **Added new section at bottom: "How the external-comms skill works"** — placed after "When you come back" section, before "I'm using Squad on this blog". Contains the 6-step numbered workflow, infrastructure paragraph (`.squad/comms/`, Ralph, routing), Brady's constraint (`pao approve`, human review gate), both skill file links preserved.
- **Rationale:** The original structure opened with maintainer pain and jumped into workflow mechanics. New structure leads with the insight that a contributor can improve a repo they don't own by using the squad infrastructure already committed. The "how it works" detail is still in the post, just moved to the bottom where readers who want the mechanics can find it.
- **Voice:** Maintained Geraldine's direct style — short declarative sentences, first-person action, no em-dashes, functional transitions. Lists over prose where appropriate.
- **Key lesson:** Post structure should match the differentiation angle. This post is written from a contributor's seat, not a maintainer's or creator's seat. Leading with "I found this already there and could use it immediately" is truer to that perspective than leading with "here's how to build this workflow."

### 2026-03-24 — Reframed personal examples as supporting context (de721c5)

- **Requested by:** Geraldine (framing decision)
- **Changes made:**
  1. **Fix 1 — "What Squad is" section:** Removed personal contribution mention and external-comms bullet. Changed from "I've contributed one back to Squad... [bullet point link]... When you commit" to direct statement: "Skills are community-contributed. When you commit `.squad/` to your repo, you're sharing not just your team setup but any skills your team has built. Contributors who clone inherit those too." External-comms link already appears in the "How the external-comms skill works" section lower in the post.
  2. **Fix 2 — Blog squad section:** Retitled from "I'm using Squad on this blog" to "A concrete example: committed `.squad/` in practice". Reframed opening to lead with the general principle (team context lives in repo, anyone who clones gets it), then use blog as first-person supporting example. Paragraph structure: general point → blog as concrete case → universal payoff (guest author scenario).
- **Core framing principle learned:** Geraldine's personal examples (blog squad, external-comms contribution) are evidence for the broader narrative, not the headline. The post is ABOUT what Squad enables for repos and contributors — her experiences support that thesis but don't lead it.
- **Voice maintained:** Short declarative sentences, direct first-person action ("My blog repo has a Squad team"), functional transitions ("The value of Squad is..."). No literary flourish.

### 2026-03-24 — Seven new sections drafted + full section reorder proposed

- **Task:** Write 7 new sections in Geraldine's voice; propose full post order; map 5 images to reordered post.
- **Sections written:** Wikis go stale/decisions.md, Onboarding as conversation, First PR conforms, Playbooks committed, InnerSource re-learning cost, Process committed not negotiated, Guardrails in repo.
- **Voice patterns that held up:**
  - "Lead with a concrete failure, then state what Squad does about it" — worked for every section. The pain sentence comes first, always.
  - Short declarative sentences (3–8 words) at the start of paragraphs signal Geraldine's register. Never open with a subordinate clause.
  - Second-person throughout ("you clone", "you find out"). Do not slip into third-person case examples.
  - Functional closing sentences, not emotional ones. "Once it's committed, every contributor inherits it." Not "That's the power of committed skills."
  - No em-dashes. When tempted, use a period. Three-word fragment sentences work better anyway.
- **Structural pattern that worked for these sections:** 4-paragraph arc — (1) concrete failure, (2) why it happens / root cause, (3) what .squad/ does, (4) outcome stated plainly. Keeps sections tight and parallel.
- **Section ordering principle used:** Four clusters — contributor workflow (onboarding → first PR → validation → experimentation), committed assets (decisions.md, skills, ceremonies, governance), context-specific (OSS, InnerSource overview, InnerSource re-learning), long-term value (persistence, durability, contributing back). Concrete example and CTA always close.
- **Image placement lesson:** Image theme and filename can diverge after regeneration. Alt text should describe actual image content/theme, not the filename. Flagged mismatch for images 04 and 05 — current filenames are legacy, themes were updated by Pepa.

### 2026-03-24 — OSS maintainer section reframed: contributor conformance value

- **Requested by:** Geraldine (rewrite task)
- **Core insight corrected:** The value to an OSS maintainer like Brady isn't the external-comms workflow specifically. It's that contributors work within standards Brady already set. Brady defines conventions, routing, ceremonies, decisions — commits them to `.squad/`. Contributor clones, runs squad, works with Brady's team and standards. Their PR naturally conforms because the squad they used knows Brady's patterns.
- **Section rewritten:** Replaced "For open source maintainers" section (previously focused on external-comms skill inheritance) with 3 tight paragraphs:
  1. Brady sets standards once (decisions, conventions, review patterns) — lives in `.squad/`
  2. I cloned, ran squad, inherited Brady's team and conventions — changes aligned automatically
  3. My PR looked like I already knew the project — Brady reviews conforming work instead of repeating standards
- **What moved:** External-comms detail still exists lower in post ("How the external-comms skill works" section). OSS maintainer section now focuses on conformance/alignment value, not comms workflow.
- **Voice:** Direct declarative sentences. First-person ("I cloned", "I was working"). 3 paragraphs, no numbered list. No em-dashes.
- **Key lesson:** OSS maintainer value = contributors conform to standards already set, not that they inherit a particular skill. Standards travel with code via committed `.squad/`.

### 2026-03-24 — Full post rewrite: 7 new sections + section reorder + image remapping

- **Task:** Write 7 new sections in Geraldine's voice, apply exact section order across 6 clusters, and remap images 02–05 to new positions with updated alt texts.
- **Approach:** Replaced entire file in one pass using bash heredoc to avoid incremental edit collisions on a heavily restructured document. Complete overwrite is cleaner than 20+ individual edits when reordering is involved.
- **Sections added:** "You don't have to read the docs to get started", "Your first PR fits the project by default", "The documentation that doesn't go stale", "The playbooks are already there", "The process is committed, not negotiated", "The guardrails are in the repo", "Every InnerSource contribution costs less than the last".
- **Voice patterns that held in all 7 sections:**
  - Open every section with a concrete failure scenario (the pain). Never open with a benefit claim.
  - Second-person throughout ("you clone", "you find out"). No slippage to third-person case studies.
  - Short declarative sentences, 3–8 words, to open paragraphs. Subordinate clauses come second.
  - Functional closing sentences: "Once a skill is committed, every contributor inherits it." Not "That's the power of versioned playbooks."
  - No em-dashes. Where tempted, use a period or fragment instead.
- **Image remapping applied:**
  - IMAGE 01 unchanged (already correctly placed after intro).
  - IMAGE 04 moved from after "For open source maintainers" to after "Experimenting with a squad already in place". Alt text updated to match luminous tropical workspace theme.
  - IMAGE 03 moved from after "For teams sharing codebases" to after "For open source maintainers". Alt text updated to reflect bridge/conformance theme.
  - IMAGE 05 moved from after "A concrete example" to after "What stays when contributors leave". Alt text updated to reflect preserved knowledge/memory theme.
  - IMAGE 02 moved from after "What you get when you clone" to after "A concrete example" (before CTA). Alt text updated to reflect gift box/committed squad directory theme.
- **Structural lesson:** When a post requires section reordering AND image remapping AND new content, a full file rewrite is safer than sequential edits. Edit tool is better for surgical changes; bash heredoc is better for whole-file restructuring.

### 2026-03-24 — Vacation/travel metaphor woven into Squad inner source post

- **Task:** Apply a vacation/travel-to-a-foreign-destination aesthetic throughout `2026-03-22-squad-inner-source.md` without heavy-handed gimmick — one or two travel-flavored phrases per relevant section.
- **Metaphor mapping applied:**
  - Cloning a repo → arriving at a new destination
  - README/CONTRIBUTING.md → tourist brochure, written for strangers
  - Squad agents → concierge and hotel staff who know the city
  - decisions.md / agent history → local knowledge, insider tips
  - InnerSource re-learning cost → business traveler who re-learns the hotel layout every visit
  - First PR "good work, wrong direction" → walking confidently in the wrong district
  - Validating approach before building → asking the concierge before booking the day trip
  - Cloning with `.squad/` → checking in with a welcome kit that already has your preferences loaded
  - Repo owner standards → house rules in the welcome booklet
- **Sections touched:** H1 + intro (added foreign-city arrival setup), "You don't have to read the docs" (tourist brochure vs. concierge contrast), "Validate your approach" (concierge/day-trip framing), "Your first PR fits" (wrong-district problem), "For open source maintainers" (house-rules-in-welcome-booklet), "Knowledge compounds over time" (business-traveler re-learning), "A concrete example" (welcome-kit check-in analogy).
- **Sections left untouched:** All image markdown, all links, front matter, charter bullet list, "What to do next" bullets, closing line, sections where metaphor would muddy technical clarity.
- **Voice discipline:** Metaphor flavors; it doesn't dominate. Technical terms (.squad/, decisions.md, routing.md, ceremonies.md, skills/, etc.) kept exact throughout. Geraldine's short-sentence, first-person, active-verb register maintained.

