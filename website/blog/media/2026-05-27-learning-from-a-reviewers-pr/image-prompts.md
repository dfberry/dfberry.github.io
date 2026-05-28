---
title: "Image prompts for Learning from a Reviewer's PR"
draft: true
description: "Support file for blog illustration and diagram generation prompts."
---

<!-- truncate -->

# 2026-05-27 Learning from a Reviewer's PR — Image Prompts

## Batch JSON

```json
{
  "post": "2026-05-27-learning-from-a-reviewers-pr",
  "style": "Watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork",
  "character": "White female with pink hair",
  "images": [
    {
      "filename": "hero-correction-moment.png",
      "alt": "A pink-haired woman holds a documentation screenshot beside a skill file on a corkboard, where correction marks appear",
      "prompt": "White female with pink hair holding a phone showing an official documentation page up beside a printed skill document page pinned to a corkboard, correction marks appearing on the corkboard document, warm morning light, fir trees outside a wide window, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text"
    },
    {
      "filename": "pr-review-table.png",
      "alt": "A pink-haired woman reviews before-and-after document pages spread across a wide table in two columns",
      "prompt": "White female with pink hair leaning over a wide table covered in before-and-after document printouts in two columns, warm afternoon light through tall windows, Pacific Northwest rain streaking the glass, watercolor illustration, soft wet-on-wet washes, visible paper texture, loose brushwork, no text"
    },
    {
      "filename": "skills-network.png",
      "alt": "A pink-haired woman connects pattern cards between six floating skill panels arranged on a wall",
      "prompt": "White female with pink hair connecting glowing rectangular pattern cards between six floating panels on a wall, each panel representing a different skill type, warm study light, misty Puget Sound visible through tall windows, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text"
    },
    {
      "filename": "evidence-check.png",
      "alt": "A pink-haired woman compares an official product page on her phone with a printed skill document, the two product names visibly different",
      "prompt": "White female with pink hair at a standing desk, phone in left hand showing an official product documentation page, printed skill document in right hand, the two names visibly different, soft overcast Pacific Northwest daylight, cedar trees outside the window, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text"
    },
    {
      "filename": "learning-loop.png",
      "alt": "A pink-haired woman walks a circular stone path on a misty beach, each stone showing one step of the learning loop",
      "prompt": "White female with pink hair walking a circular stone path on a misty Puget Sound beach, each large flat stone engraved with one step of the loop — PR, extract, update, check, correct, persist — watercolor illustration, soft wet-on-wet washes, visible paper texture, cool muted blues and greens, loose brushwork, no text"
    },
    {
      "filename": "pr-extraction-habit.png",
      "alt": "A pink-haired woman reviews a PR on a laptop while skill update cards float into an open binder beside her",
      "prompt": "White female with pink hair reviewing a pull request on a laptop at an outdoor table near a rain-streaked Pacific Northwest cafe window, small glowing file cards floating from the screen into an open binder beside her, overcast sky and Douglas firs outside, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text"
    }
  ],
  "mermaidDiagrams": [
    {
      "filename": "learning-loop.mmd",
      "prompt": "Create a left-to-right Mermaid flowchart showing the learning loop: Reviewer PR -> Extract patterns -> Update skills -> Contradiction check -> Human corrects AI -> Future work improved. Keep node labels short (3 words max). 6 nodes total. No edge labels."
    }
  ]
}
```

## Individual Watercolor Prompts

### 1. Hero — The Correction Moment

- **Filename:** `hero-correction-moment.png`
- **Prompt:** White female with pink hair holding a phone showing an official documentation page up beside a printed skill document page pinned to a corkboard, correction marks appearing on the corkboard document, warm morning light, fir trees outside a wide window, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text
- **Purpose:** Opening image. The physical act of holding the screenshot up next to the wrong skill guidance — the human correction moment made visual.

### 2. PR Review Table

- **Filename:** `pr-review-table.png`
- **Prompt:** White female with pink hair leaning over a wide table covered in before-and-after document printouts in two columns, warm afternoon light through tall windows, Pacific Northwest rain streaking the glass, watercolor illustration, soft wet-on-wet washes, visible paper texture, loose brushwork, no text
- **Purpose:** Pattern extraction section. Visualizes reading the full diff — the density of 200 edits across 8 files laid out in before/after columns.

### 3. Skills Network

- **Filename:** `skills-network.png`
- **Prompt:** White female with pink hair connecting glowing rectangular pattern cards between six floating panels on a wall, each panel representing a different skill type, warm study light, misty Puget Sound visible through tall windows, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text
- **Purpose:** Expand-beyond-the-original-skill section. Shows that 9 edits spread across 6 skill files is a connected system, not 6 independent updates.

### 4. Evidence Check

- **Filename:** `evidence-check.png`
- **Prompt:** White female with pink hair at a standing desk, phone in left hand showing an official product documentation page, printed skill document in right hand, the two names visibly different, soft overcast Pacific Northwest daylight, cedar trees outside the window, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text
- **Purpose:** The product name section. The screenshot is the receipt — two versions of a name, one of which had to go.

### 5. Learning Loop

- **Filename:** `learning-loop.png`
- **Prompt:** White female with pink hair walking a circular stone path on a misty Puget Sound beach, each large flat stone engraved with one step of the loop — PR, extract, update, check, correct, persist — watercolor illustration, soft wet-on-wet washes, visible paper texture, cool muted blues and greens, loose brushwork, no text
- **Purpose:** Learning loop section. The circular path on the beach — each step leaves the ground changed, each pass makes the route more reliable.

### 6. PR Extraction Habit

- **Filename:** `pr-extraction-habit.png`
- **Prompt:** White female with pink hair reviewing a pull request on a laptop at an outdoor table near a rain-streaked Pacific Northwest cafe window, small glowing file cards floating from the screen into an open binder beside her, overcast sky and Douglas firs outside, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text
- **Purpose:** "Run this on the next PR" section. The habit: PR review and skill update as a single motion, skills close enough to the work to reach.

## Mermaid Diagram

### Learning Loop Flow

- **Filename:** `learning-loop.mmd`
- **Prompt:** Left-to-right flowchart, 6 nodes, no edge labels, short node labels.
- **Source:**

```mermaid
flowchart LR
    A[Reviewer PR] --> B[Extract patterns]
    B --> C[Update skills]
    C --> D[Contradiction check]
    D --> E[Human corrects AI]
    E --> F[Future work improved]
```
