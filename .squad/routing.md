# Work Routing

How to decide who handles what on dfberry.github.io.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|---------|
| Blog post drafting | Inara | Write a new post, draft from outline, rewrite a draft |
| Editing & polish | Book | Edit a draft, proofreading, consistency review |
| Site code & config | Kaylee | Docusaurus config, React components, TypeScript, build/deploy |
| SEO & metadata | Simon | Meta tags, keywords, structured data, sitemap |
| Social media copy | Wash | Twitter/X copy, LinkedIn post, distribution |
| Content roadmap | Zoe | What to write next, prioritization, content calendar |
| Technical decisions | Mal | Architecture, code review, cross-domain coordination |
| Code review | Mal | Review PRs, check quality |
| Session logging | Scribe | Automatic — never needs routing |

## Post Publication Pipeline

When a new post is requested, use this sequence (parallelize where inputs allow):

1. **Inara** — writes the draft
2. **Book** — edits the draft *(needs Inara's output)*
3. **Simon** — adds SEO metadata *(can start from outline; finalizes on edited draft)*
4. **Kaylee** — publishes to `website/blog/` *(needs edited + SEO'd draft)*
5. **Wash** — writes social copy *(can draft from outline; finalizes on published post)*

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | Mal |
| `squad:mal` | Lead/architecture work | Mal |
| `squad:inara` | Writing work | Inara |
| `squad:book` | Editing work | Book |
| `squad:kaylee` | Development work | Kaylee |
| `squad:wash` | Social media work | Wash |
| `squad:simon` | SEO work | Simon |
| `squad:zoe` | Product/roadmap work | Zoe |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, the **Lead** triages it — analyzing content, evaluating @copilot's capability profile, assigning the right `squad:{member}` label, and commenting with triage notes.
2. **@copilot evaluation:** The Lead checks if the issue matches @copilot's capability profile (🟢 good fit / 🟡 needs review / 🔴 not suitable). If it's a good fit, the Lead may route to `squad:copilot` instead of a squad member.
3. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
4. When `squad:copilot` is applied and auto-assign is enabled, `@copilot` is assigned on the issue and picks it up autonomously.
5. Members can reassign by removing their label and adding another member's label.
6. The `squad` label is the "inbox" — untriaged issues waiting for Lead review.

### Lead Triage Guidance for @copilot

When triaging, the Lead should ask:

1. **Is this well-defined?** Clear title, reproduction steps or acceptance criteria, bounded scope → likely 🟢
2. **Does it follow existing patterns?** Adding a test, fixing a known bug, updating a dependency → likely 🟢
3. **Does it need design judgment?** Architecture, API design, UX decisions → likely 🔴
4. **Is it security-sensitive?** Auth, encryption, access control → always 🔴
5. **Is it medium complexity with specs?** Feature with clear requirements, refactoring with tests → likely 🟡

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "what port does the server run on?"
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a feature is being built, spawn the tester to write test cases from requirements simultaneously.
7. **Issue-labeled work** — when a `squad:{member}` label is applied to an issue, route to that member. The Lead handles all `squad` (base label) triage.
8. **@copilot routing** — when evaluating issues, check @copilot's capability profile in `team.md`. Route 🟢 good-fit tasks to `squad:copilot`. Flag 🟡 needs-review tasks for PR review. Keep 🔴 not-suitable tasks with squad members.
