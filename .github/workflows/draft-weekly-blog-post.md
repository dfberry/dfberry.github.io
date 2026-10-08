---
emoji: ✍️
name: Draft weekly blog post
description: Turn the oldest open blog issue and the repo’s recent activity into a narrative, reader-friendly blog draft for review.
on:
  schedule:
    - cron: "0 9 * * 3" #wed 9am
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
strict: true
network:
  allowed: [defaults, github]
tools:
  github:
    mode: gh-proxy
    toolsets: [default]
safe-outputs:
  create-pull-request:
    max: 1
  add-comment:
    max: 5
---

# Draft weekly blog post

Draft a personal, engaging blog post from the oldest open `blog` issue in this repository.

## Objective

Use the repo’s actual activity as grounding, but write as a thoughtful editor and storyteller rather than as a changelog or issue list. The result should read like a real blog post that helps readers understand what changed, why it matters, and what the broader pattern suggests.

## Workflow

1. Inspect all issues labeled with `blog`. 
2. Read the issue title, body, and any related repo context that helps explain the theme or story behind it.
3. Identify the core narrative arc of each `blog` issue:
   - what problem or opportunity is being explored
   - why it matters in practical terms
   - what changed or what the reader should pay attention to
   - what a thoughtful close looks like
4. Draft a markdown blog body in first person with a warm, practical, editorial voice.
5. Make sure the post is grounded in the issue and repo facts only. Do not invent specific details or fabricate events.
6. Save the draft as a new markdown file in `website/blog/` using a date-based slug and a clear title.
7. Create a pull request for review when the draft is ready.

## Writing standards

- Write in first person and sound like a real human writer, not a task list.
- Start with a strong hook and a clear reason the topic matters.
- Organize the draft with a few short sections that develop the story.
- Explain tradeoffs, practical lessons, and implications for the reader.
- Do not simply repeat the issue body or enumerate tasks.
- Do not degrade into a flat "what happened this week" summary.
- Keep the tone reflective, useful, and specific to this project and audience.
- End with a reflective close, a takeaway, or a natural next step.

## Output requirements

- Create a markdown file under `website/blog/`.
- Use a filename like `YYYY-MM-DD-[slugified-title].md`.
- Include the blog body only in markdown; do not add YAML front matter unless the repo’s blog conventions require it.
- If no `blog` issue exists, exit with a clear `noop` result and no draft.
- Keep the tone polished enough for review before publishing.

## Review gate

Before finalizing, quickly check whether the draft:
- reads like a narrative, not a checklist
- explains why the topic matters
- stays factual and repo-grounded
- has a coherent close

When the draft meets those standards, create the review PR.
