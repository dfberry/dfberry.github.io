# Project Context

- **Owner:** dfberry
- **Project:** dfberry.github.io — personal tech blog
- **Stack:** Docusaurus v3, React, TypeScript, MDX, GitHub Pages, Google Analytics
- **Created:** 2026-03-22

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-22 — Squad inner source post editorial pass

**Editorial direction from dfberry:** Center the post on reducing collaboration friction by providing squads that already have ceremonies, rules, and skills — with explicit coverage of both inner source and open source.

**Reframe applied:** Replaced the "onboarding tax / context acquisition" frame with "collaboration friction" as the central thesis. The opening now leads with the problem of missing collaboration infrastructure, not just missing context.

**Key structural changes:**
1. **New opening** — Leads with friction as the core problem; establishes that Squad addresses it directly.
2. **Restructured "What you inherit" section** — Moved before "The contributor's perspective" so readers understand the mechanism before the scenario. Renamed to foreground the three inherited elements explicitly.
3. **Ceremonies / Rules / Skills made explicit** — These three terms now appear as named, bolded concepts with clear definitions. They recur in the inner source, open source, and closing sections for reinforcement.
4. **Inner source section retitled and sharpened** — "The inner source connection" → "Inner source: friction at org scale." Parallel structure with open source section.
5. **Open source section retitled and sharpened** — "The outer source angle" → "Open source: friction at maintainer scale." Now frames the stakes clearly (maintainer burnout vs. enterprise velocity) and explicitly states the friction mechanism is the same as inner source.
6. **Resolved TODO comment** — Confirmed Squad's upstream inheritance is purely git-native (`.squad/` files travel through normal `git clone`/fork). Removed `<!-- TODO: Dolores -->` comment and clarified the sentence in the inner source section.
7. **Closing paragraph updated** — "The onboarding tax doesn't disappear. But it collapses." → Rewritten to close with the friction frame and echo the ceremonies/rules/skills language from the body.

**Voice:** Preserved dfberry's direct, first-person, lightly sardonic register throughout. No homogenization.

### 2026-03-23 — Full blog content audit

**Scope:** Comprehensive review of all 14 blog posts in `website/blog/` covering publish status, frontmatter consistency, image usage, MDX syntax, content quality, tag consistency, and in-progress post status.

**Key Findings:**

1. **Publication Status:**
   - 2 posts published (14%)
   - 12 posts unpublished (86%) — all appear content-complete, not drafts/stubs
   - No skeleton content detected; all posts have substantial prose and structure

2. **Frontmatter Consistency — ISSUES FOUND:**
   - **Missing tags:** `2024-04-06-remote-code.md` has NO tags defined (empty tag block)
   - **Field presence:** All posts have title, description, slug, updated fields ✓
   - **Published field:** All posts have explicit `published: true/false` ✓

3. **Image Path Consistency — ISSUES FOUND:**
   - **Pattern:** Most posts correctly use `./media/{date-slug}/` relative paths
   - **Inconsistency:** `2023-12-10-cloud-native-005-deploy-from-github-to-azure.md` has 6 images missing the `./` prefix (lines 37, 41, 81, 99, 118, 122, 126)
   - Media directory exists at `website/blog/media/` with 6 post-specific subdirectories

4. **MDX Syntax — CLEAN:**
   - No unclosed HTML/JSX tags detected
   - All code blocks properly closed (backticks balanced)
   - No invalid MDX syntax

5. **Truncate Markers — CRITICAL ISSUE:**
   - Only 1 of 14 posts has `<!-- truncate -->` marker (7%)
   - `2026-03-22-squad-inner-source.md` is the ONLY post with truncate marker
   - 13 posts missing this marker (affects excerpt rendering on listing pages)

6. **Tag Consistency — ISSUES FOUND:**
   - **Capitalization variance:** "Cloud-native" vs "cloud-native", "AI assisted" vs "AI-Assisted Development"
   - **Spacing:** "AI assisted" (space) in older posts, "AI-Assisted Development" (hyphenated) in newer post
   - **Semantic overlap:** "Developer Experience" vs "devex" — same concept, different tags
   - **Status tags:** "todo" tag appears in 3 posts (likely legacy, should be removed or clarified)
   - **Leading/trailing spaces:** "Azure " in one post has trailing space

7. **2026-03-22-squad-inner-source.md Status:**
   - **State:** COMPLETE prose — fully developed 144-line blog post with 19 headings
   - **Images:** 8 images, all using correct `./media/2026-03-22-squad-inner-source/` paths
   - **Structure:** Complete with intro, body sections, conclusion, and CTA
   - **No TODOs:** No placeholder text or unfinished sections
   - **Ready for publication** pending frontmatter date correction (uses future date: 2026)

**Tag Normalization Needed:**
- "Cloud-native" → standardize capitalization
- "AI assisted" → "AI-Assisted Development" (or choose one)
- "devex" → "Developer Experience" (or vice versa)
- "todo" → remove or clarify intent
- "Azure " → fix trailing space

**Content Quality:**
- All posts range from 47 to 643 lines
- Clear heading structures in all posts
- No stub content or skeletons
- 12 complete unpublished posts suggest potential for publication pipeline
