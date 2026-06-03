---
title: "Image Generation CLI Reference"
---

# Image Generation Commands Reference

This document contains all CLI commands for regenerating the blog post's visual assets. Use this when modifying prompts, regenerating specific images, or troubleshooting output.

## Quick Start

```bash
# Regenerate all images
bash generate-images.sh all

# Regenerate only watercolors
bash generate-images.sh watercolor

# Regenerate only PNG infographics
bash generate-images.sh png

# Regenerate only SVG diagrams
bash generate-images.sh svg
```

---

## Image Specifications

### Design System (All Images)
- **Background:** Light (#ffffff or #f5f7fa)
- **Text:** Black (#000000)
- **Lines/Connectors:** Light gray (#cccccc)
- **Size:** 1536×1024 pixels (blog-hero standard)
- **Text Constraint:** No overlapping text; minimum 8-24px clearance from shapes
- **Style:** Monochrome, no gradients, no accent colors

### Color Schema (Watercolors Only)
- **Technique:** Soft wet-on-wet washes
- **Texture:** Visible paper texture
- **Tones:** Warm, muted palette
- **Brushwork:** Loose, painterly
- **Text:** None

---

## SVG Diagrams

### 1. Mental Model (Three Rings + Cards)
```
diagram-1-mental-model-v3.svg
```
- **Content:** Three nested rings (Instructions → Agents → Skills cascade)
- **Cards:** INSTRUCTIONS (top), AGENTS (right), SKILLS (left) with light backgrounds (#f5f7fa)
- **Layout:** Symmetric, centered
- **Clearance:** 24px minimum from text to shapes

**Manual regeneration:**
1. Export from Mermaid diagram editor
2. Post-process: ensure card fills are #f5f7fa, no pill labels
3. Verify clearance zones: top card INSTRUCTIONS | right card AGENTS | left card SKILLS | center copy

### 2. File Families Decision Tree
```
diagram-2-file-families-v3.svg
```
- **Root Node:** "Config Files"
- **Branches:** Instructions | Agents | Skills | Prompts | Workflows
- **Edge Labels:** Routing decisions (2-3 words max)
- **Layout:** Hierarchical tree

### 3. Skills vs. Prompts Decision Tree
```
diagram-3-top-level-routing-v3.svg
```
- **Decision Point:** "Does it reuse across many prompts?"
- **Left path:** "Yes" → Skills
- **Right path:** "No" → Prompts
- **Layout:** Binary decision flow

### 4. Agent Routing
```
diagram-4-agent-routing-v3.svg
```
- **Flow:** Agents (by role + task type) → Handlers → Execution Channels
- **Elements:** Agent boxes, handler boxes, channel endpoints
- **Connectors:** Labeled edges showing routing logic

### 5. File Placement Decision Tree
```
diagram-5-input-parsing-v3.svg
```
- **Question:** "Where do these files live?"
- **Decisions:** Scope (repo-wide vs. per-branch) → Location (.github vs. root vs. dotenv)
- **Leaf nodes:** Final placement recommendations

---

## PNG Infographics

### Image 1: Quick Reference Table
```bash
python3 simple_config.py \
  --prompt "A clean reference table layout showing file families, descriptions, and locations in a organized grid format, light background, black text, minimal design, professional appearance, no decorative elements, clear typography" \
  --preset production \
  --style infographic \
  --size blog-hero \
  --seed 53 \
  --output outputs/image-1-quick-reference-table.png \
  --cpu \
  --modifier clarity \
  --modifier organized
```

**What it shows:**
- Structured table of file families (Instructions, Agents, Skills, Prompts, Workflows)
- Columns: Family Name | Purpose | File Name(s) | Location
- Professional grid layout, no decorative elements

### Image 2: Where They Live (File System Structure)
```bash
python3 simple_config.py \
  --prompt "Folder and file structure diagram showing .github directory, root config files, environment variables, visual hierarchy with clear separation between file types, light background, monochrome, professional infographic style, no text labels inside boxes" \
  --preset production \
  --style infographic \
  --size blog-hero \
  --seed 54 \
  --output outputs/image-2-where-they-live.png \
  --cpu \
  --modifier structure \
  --modifier clarity
```

**What it shows:**
- Visual tree of `.github/` directory structure
- Root-level config files (copilot.json, etc.)
- Environment variable locations
- Clear visual separation of file types

---

## Watercolor Illustrations

Each watercolor uses **tight, focused prompts** (~20 words) to avoid competing visual details. See `watercolor-prompts.md` for narrative context.

### Watercolor 1: Mapping the Five File Families
```bash
python3 simple_config.py \
  --prompt "Normal woman at desk sorting five distinct stacks of repository files into order, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text" \
  --preset production \
  --style watercolor \
  --size blog-hero \
  --seed 55 \
  --output outputs/watercolor-1-mapping-file-families.png \
  --cpu \
  --modifier painterly \
  --modifier loose
```

**Narrative:** Opening section — woman physically organizing the five file families into one usable mental model.

**Key elements:**
- Normal woman (average features, practical clothes)
- Desk with papers/folders
- Five distinct stacks being sorted
- Warm, loose watercolor technique

### Watercolor 2: Understanding the Layers
```bash
python3 simple_config.py \
  --prompt "Normal woman examining nested transparent layers of governance documents, comparing one layer to another, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text" \
  --preset production \
  --style watercolor \
  --size blog-hero \
  --seed 56 \
  --output outputs/watercolor-2-understanding-layers.png \
  --cpu \
  --modifier painterly \
  --modifier loose
```

**Narrative:** Instructions, Agents, Skills section — woman examining nested layers to understand how they sit together.

**Key elements:**
- Woman at desk
- Transparent/translucent layers (trays or sheets)
- One layer lifted/compared to another
- Focused, curious expression
- Watercolor technique

### Watercolor 3: Tracing a Real Workflow
```bash
python3 simple_config.py \
  --prompt "Normal woman in home office tracing a path between pinned repository notes and workflow folders, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text" \
  --preset production \
  --style watercolor \
  --size blog-hero \
  --seed 57 \
  --output outputs/watercolor-3-tracing-workflow.png \
  --cpu \
  --modifier painterly \
  --modifier loose
```

**Narrative:** Azure workflow section and decision table — woman tracing a concrete path from abstract categories to real implementation.

**Key elements:**
- Woman at home office
- Pinned notes on wall or board
- Workflow folders/documents
- Following a line/path between elements
- Hands-on, investigative posture
- Watercolor technique

---

## Prompt Engineering Rules

### Watercolor Prompts (Critical)
- **Length:** Keep to ~20 words (PRDs blog style)
- **Structure:** `[Subject] [one clear focal action] [technique keywords] [result constraint]`
- **Avoid:** Multiple competing actions, vague subjects, text overlays
- **Character:** Always "normal woman" (not beautified, not styled)
- **Setting:** Grounded work environment (desk, home office, etc.)
- **Technique keywords:** "watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text"

### PNG Infographic Prompts
- **Length:** 15–25 words
- **Style:** "light background, black text, minimal design, professional"
- **Avoid:** Decorative elements, gradients, accent colors
- **Modifiers:** `--modifier clarity`, `--modifier organized`, `--modifier structure`

### Common Modifiers
| Modifier | Effect |
|----------|--------|
| `painterly` | Loose, artistic technique |
| `loose` | Relaxed brushwork (watercolor) |
| `clarity` | Sharp focus, clear text |
| `organized` | Clean layout, grid structure |
| `structure` | Visual hierarchy, spatial relationships |
| `crisper` | Defined edges, precision |
| `more-detailed` | Additional visual information |

---

## Seed Values

**Base seed:** 52 (assigned at start of image generation batch)

**Increment:** +1 for each subsequent image in order:
- PNG Image 1: seed 53
- PNG Image 2: seed 54
- Watercolor 1: seed 55
- Watercolor 2: seed 56
- Watercolor 3: seed 57

**Why:** Consistent but varied results. Change the base seed (e.g., 100, 200) to explore different style directions while keeping relative relationships.

---

## Troubleshooting

### Images Look Poor Quality or Confusing
**Likely cause:** Prompt is too verbose or has competing visual elements.

**Fix:** Tighten the prompt. Remove secondary actions. Focus on ONE clear subject + ONE action. Example:
- ❌ "Woman at desk working on files, thinking deeply, with visible code snippets and diagrams around her"
- ✅ "Woman at desk sorting five distinct stacks of repository files, watercolor illustration"

### Text Overlaps Other Elements
**Likely cause:** Mermaid diagram text clearance zones not respected.

**Fix:** Review `image-specs-and-prompts.md` clearance constraints. Ensure 8–24px minimum space around all text.

### Watercolor Colors Don't Match PRDs Blog Style
**Likely cause:** Seed or modifier settings differ.

**Fix:** Check exact seed value and modifiers (`--modifier painterly --modifier loose`). Compare against reference images from PRDs blog. If still incorrect, adjust prompt to be more specific about tone (e.g., "ochre and soft blue undertones").

### SVG Diagrams Not Rendering in Docusaurus
**Likely cause:** SVG file size, missing xmlns, or embedded elements.

**Fix:** Verify SVG has `xmlns="http://www.w3.org/2000/svg"`. Check file size (should be <50KB). Test rendering locally: `npm start` in website directory.

---

## File Organization

All images live in:
```
website/blog/media/2026-05-31-copilot-config-files-guide/
```

**Naming convention:**
- SVGs: `diagram-{N}-{kebab-case-name}-v3.svg`
- PNG infographics: `image-{N}-{kebab-case-name}.png`
- Watercolors: `watercolor-{N}-{kebab-case-name}.png`

**Referenced in blog post:**
```markdown
![Alt text](./media/2026-05-31-copilot-config-files-guide/diagram-1-mental-model-v3.svg)
![Alt text](./media/2026-05-31-copilot-config-files-guide/watercolor-1-mapping-file-families.png)
```

---

## Next Steps

1. **Review regenerated images** against `image-specs-and-prompts.md`
2. **Integrate into blog post** (markdown image references)
3. **Test Docusaurus build:** `npm run build` in website directory
4. **Commit all media:** `git add media/2026-05-31-copilot-config-files-guide/`
5. **Publish blog post** when ready

---

## Reference Files

- **`watercolor-prompts.md`** — Narrative context and exact prompts for all 3 watercolor illustrations
- **`image-specs-and-prompts.md`** — Master reference with production specs, layout rationale, and modification guides for all 7 visual assets
- **`watercolor-manifest.md`** — Tracking file for watercolor generation status
- **`generate-images.sh`** — Bash script to regenerate all images with one command
