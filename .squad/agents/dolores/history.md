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
