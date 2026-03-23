---
name: "blog-image-generation"
description: "Full workflow for generating custom images for blog posts using Stable Diffusion XL, from prompt writing to placement in posts"
domain: "image-generation, blog"
confidence: "medium"
source: "manual"
tools:
  - name: "bash"
    description: "Run generation scripts and monitor output"
    when: "Executing generate_blog_images.sh and tailing logs"
  - name: "image-generation project"
    description: "Python 3.14 + HuggingFace diffusers SDXL pipeline"
    when: "Generating images via generate.py with custom prompts"
---

## Context

When a blog post needs custom, thematic imagery aligned to the site's tropical magical-realism aesthetic. Use this skill to generate images that match the visual palette and emotional tone of the content, then integrate them into the post with proper alt text.

**When to use:**
- Creating images for a new blog post
- Updating an existing post's images to match revised content
- Adding visual break points to long-form content

**When NOT to use:**
- Existing stock images are already well-suited
- Time constraints don't allow for 20-30 minutes of generation + placement work

## Patterns

### 0. Prerequisites

**Environment setup** (one-time):
```bash
cd /Users/geraldinefberry/repos/my_repos/image-generation
source venv/bin/activate
```

**Model weights location:**
- Cached at: `~/.cache/huggingface/hub/models--stabilityai--stable-diffusion-xl-base-1.0` (~13GB)
- Auto-downloads on first run if not present
- Device: Apple Silicon MPS (auto-detected by HuggingFace diffusers)

**Stack:**
- Python 3.14 + HuggingFace diffusers 0.37.0 + SDXL Base 1.0

### 1. Read the Blog Post and Map Images to Sections

Before writing any prompts, read the full post and identify key thematic moments:
- Identify 4-5 natural break points (after major sections)
- Note the emotional arc and visual themes each section introduces
- For medium posts (~15-20 sections): space images evenly after sections ~3, 7, 12, 16, 18
- Each image should reinforce its section's narrative without being literal

Example mapping for a post about community resilience:
- Image 1 (after intro): Hands joining together, warmth emerging
- Image 2 (after challenges section): Storm clouds parting, light breaking through
- Image 3 (after solutions): Gardens growing, abundance emerging
- Image 4 (after lessons): Path forward, luminous energy in landscape
- Image 5 (after conclusion): Celebration, community gathering in magical light

### 2. Write Prompts and Update Examples

**Style constraints (non-negotiable):**
- **Color palette:** Deep magenta, teal, emerald green, warm gold, coral, amber — woven throughout
- **Aesthetic:** Latin American folk art, magical realism illustration
- **Mood:** Warmth, community, luminous energy, wonder
- **Resolution:** 1024×1024 (SDXL native size)
- **Restrictions:** No text in images, no Disney/IP references, no photorealism

**Prompt structure:**
Each prompt should paint a specific visual scene:
```
{Latin American magical realism illustration style}, {subject/scene}, 
{specific colors and lighting}, {mood/emotion}, 
{folk art or cultural element}, warm and luminous atmosphere, 
illustrated in rich jewel tones of {palette colors}
```

**Example prompts:**
```
Latin American magical realism illustration of hands emerging from soil, 
reaching toward the sky, woven with golden threads and emerald vines, 
teal and magenta auras surrounding them, folk art textile patterns adorning their palms, 
warm and luminous atmosphere, illustrated in rich jewel tones
```

**Update tracking:**
After writing each prompt, add it to `prompts/examples.md` in the image-generation project:
```markdown
## Blog Post: [post-title]

### Image 1: [section theme]
[Your prompt here]
- Seed: 42 (or chosen seed)
- Used in: /website/blog/media/[post-slug]/image-01.png
```

### 3. Update the Generation Script

Edit `generate_blog_images.sh` in the image-generation project:

```bash
#!/bin/bash

# Blog Post Images: [post-title]
# Usage: bash generate_blog_images.sh &
# Monitor: tail -f generation.log

python -u generate.py \
  --prompt "Latin American magical realism illustration of..." \
  --output "outputs/01.png" \
  --seed 42

python -u generate.py \
  --prompt "Latin American magical realism illustration of..." \
  --output "outputs/02.png" \
  --seed 43

# ... (continue for each image)
```

**Key flag:** Use `python -u generate.py` (unbuffered output for live logging)

### 4. Run Generation and Monitor

```bash
cd /Users/geraldinefberry/repos/my_repos/image-generation
source venv/bin/activate

# Start in background
bash generate_blog_images.sh &

# Monitor in separate terminal
tail -f generation.log
```

**Timing:** ~4-5 minutes per image on Apple Silicon MPS (after weights cached)

**⚠️ Critical:** Use `bash script.sh &` NOT `nohup bash script.sh`
- Python 3.14 + nohup triggers: "Fatal Python error: init_sys_streams"
- Background bash handles I/O correctly

**Monitoring expectations:**
- First run takes longer (model weights load into VRAM)
- Subsequent runs in same session are faster
- Watch for GPU/MPS memory spikes in Activity Monitor
- Safe to close monitoring; script continues running

### 5. Copy Outputs to Blog Media Directory

Once generation completes:

```bash
# Create post media directory
mkdir -p /Users/geraldinefberry/repos/my_repos/dfberry.github.io/website/blog/media/{post-slug}/

# Copy and rename images
cp /Users/geraldinefberry/repos/my_repos/image-generation/outputs/0*.png \
   /Users/geraldinefberry/repos/my_repos/dfberry.github.io/website/blog/media/{post-slug}/
```

**Naming:** Keep outputs numbered sequentially: `01.png`, `02.png`, etc.

### 6. Update Alt Text in Blog Post

Each image in the Markdown/MDX should have descriptive alt text:

```markdown
![A scene of hands emerging from rich soil, reaching upward with golden light and emerald vines wrapping around them, representing how communities grow from collective action and shared roots](./media/{post-slug}/01.png)
```

**Alt text format:**
```
[What is shown in the image], representing [what it symbolizes for this post's theme]
```

**Guidelines:**
- Describe visual elements first (colors, composition, subjects)
- Second part connects it to the post's narrative
- 15-25 words typical
- Imagine reading it to someone who can't see the image

### 7. Commit Images and Updated Post

```bash
cd /Users/geraldinefberry/repos/my_repos/dfberry.github.io

git add website/blog/media/{post-slug}/ website/blog/{post-filename}.md
git commit -m "Add custom SDXL images for [post-title]

Generated 5 images using Stable Diffusion XL with tropical 
magical-realism aesthetic. Images placed in sections [list sections].

Co-authored-by: Pepa <pepa@encanto>"
```

## Examples

### Complete Workflow Example

**Blog post:** "Building Community Resilience" 

**Image 1 prompt:**
```
Latin American magical realism illustration of interlocking hands in a circle,
palms glowing with warm gold and coral light, intricate folk art patterns 
flowing across skin and into the ground as roots, teal and emerald energy
spiraling upward, surrounded by luminous seed pods and woven textile designs,
painted in rich jewel tones with deep magenta shadows and golden highlights
```

**Image 2 prompt:**
```
Illustration of a garden transforming from storm to light: dark clouds breaking
apart above, revealing teal and magenta auroras, below ground roots glow with
coral and gold energy, new shoots sprouting upward with emerald leaves,
folk art motifs of protection and growth woven into the landscape,
warm luminous atmosphere suggesting hope and renewal
```

**Alt texts:**
- Image 1: "Interlocking hands glowing with warm light and folk art patterns, representing the bonds and collective strength that build resilience"
- Image 2: "Storm clouds parting above a glowing garden, representing the transition from crisis to growth and hope"

## Anti-Patterns

**❌ Don't:**
- Use generic or stock-photo-like prompts ("realistic photograph of...")
- Include text, brand logos, or Disney characters
- Ignore the color palette in pursuit of photorealism
- Run `nohup bash script.sh` (causes Python 3.14 fatal errors)
- Place images randomly; map them to narrative moments first
- Write 50+ word prompts; SDXL performs better with 15-25 words of detail
- Skip alt text or use vague descriptions ("image", "picture", "graphic")
- Commit images without updating the tracking doc (examples.md)

**❌ Avoid these prompt mistakes:**
- "Create a beautiful sunset" (vague, no style context)
- "Stable Diffusion style..." (redundant; let the aesthetic speak)
- "4k ultra HD" (ignored by SDXL; wastes tokens)
- Mixing styles: "Latin American + anime + photorealism" (confuses the model)

**⚠️ Known issues:**
- SDXL may warn about "clip_text_model" — harmless, can ignore
- First image takes longest (weights loading); subsequent images faster
- MPS device memory can spike; monitor Activity Monitor's GPU pressure
- `--seed 42` guarantees reproducibility; change seed number for variation
- Very specific real-world locations in prompts don't work well; use conceptual descriptions instead
