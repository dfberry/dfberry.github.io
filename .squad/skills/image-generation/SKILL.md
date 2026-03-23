---
name: "image-generation"
description: "Generate SDXL-based blog post images using the tropical magical-realism palette workflow"
domain: "image generation, blog media, visual content"
confidence: "high"
source: "earned"
tools:
  - name: "bash"
    description: "Execute image generation scripts and monitor progress"
    when: "Running generation jobs, checking logs, copying outputs"
---

## Context

This skill covers the complete workflow for generating blog post images using a local SDXL Base 1.0 setup. It's used when a blog post needs accompanying visual media that align with a tropical magical-realism aesthetic. The project lives at `/Users/geraldinefberry/repos/my_repos/image-generation` and generates ~4–5 minutes per image on Apple Silicon MPS.

## Patterns

### Setup & Environment

**Project location:** `/Users/geraldinefberry/repos/my_repos/image-generation/`

**Python venv:**
- Location: `venv/` inside the project
- Use: `venv/bin/python` — NOT system python
- Why: System Python 3.14 encounters `Fatal Python error: init_sys_streams` with nohup

**Model weights:**
- Cached at: `~/.cache/huggingface/hub/models--stabilityai--stable-diffusion-xl-base-1.0`
- Size: ~13GB (already downloaded)
- Device: Apple Silicon MPS (auto-detected)

### Running Image Generation

**Primary script:** `generate_blog_images.sh`
- Contains all 5 prompts and output paths
- CRITICAL: Always use `python -u` (unbuffered) to avoid Python 3.14 stderr/stdout init errors
- Run as background job: `cd /path/to/image-generation && bash generate_blog_images.sh &`
- Do NOT use `nohup` — causes the fatal init_sys_streams error on Python 3.14

**Logging:**
- Logs: `generation.log` (script redirects via `exec 1>> generation.log; exec 2>&1`)
- Monitor: `tail -20 /Users/geraldinefberry/repos/my_repos/image-generation/generation.log`

**Output:**
- Directory: `outputs/` (created by script)
- Filenames: `01.png` through `05.png` (stable naming)
- Time: ~4–5 minutes per image (30 steps on MPS); ~20–25 minutes for 5 images total

**Process monitoring:**
```bash
ps aux | grep generate_blog | grep -v grep
```

### Prompt Writing Guide

**Tropical Magical-Realism Palette:**
- Colors: deep magenta, teal, emerald green, warm gold, coral, amber
- Aesthetic: Latin American folk art, magical realism illustration
- Always end prompts with: `no text`

**Prompt principles:**
- Be specific and visual — paint a concrete scene, not abstract concepts
- No Disney or intellectual property references
- Map each section cluster to one image (5 images max per blog post)
- Each prompt should align with its section's thematic intent

**Storage:** Prompts are documented in `prompts/examples.md` in the image-generation project for reference and iteration.

### Updating Prompts for a New Blog Post

1. **Read the blog post sections** — understand the emotional arc and key themes
2. **Map sections to images** — typically 5 images: intro, workflow overview, technical details, applied example, long-term value
3. **Write prompts** — store in `prompts/examples.md` (image-generation project) with comments linking to blog post sections
4. **Update the script** — edit `generate_blog_images.sh` with new prompts; preserve the `python -u` flag
5. **Keep filenames stable** — use `01` through `05` unless post structure changes significantly

### Copying Outputs to Blog

After generation completes:

```bash
cp /Users/geraldinefberry/repos/my_repos/image-generation/outputs/*.png \
   /Users/geraldinefberry/repos/my_repos/dfberry.github.io/website/blog/media/{post-slug}/
```

Then commit the images to the blog branch.

### Image Placement in Blog Posts

- **Position:** After section clusters, not after individual sections
- **Quantity:** 5 images for a typical post (intro, contributor workflow, committed assets, context-specific, long-term value)
- **Alt text:** Describe the actual image content/theme — not the filename
- **Sync:** If prompts change image themes, update alt text in the post to match

## Examples

**Example: Running generation for a 5-image batch**

```bash
cd /Users/geraldinefberry/repos/my_repos/image-generation
bash generate_blog_images.sh &
sleep 2
tail -20 generation.log
```

**Example: Script structure with python -u**

```bash
#!/bin/bash
cd "$(dirname "$0")" || exit 1
exec 1>> generation.log
exec 2>&1

venv/bin/python -u - <<'EOF'
# Python code here
EOF
```

**Example: Prompt structure (from examples.md)**

```markdown
### Post: "API Design Best Practices"

**Image 1 — Intro: Abstract Data Flow**
A swirling vortex of teal and magenta data streams forming geometric patterns, 
with gold accents highlighting connection nodes. Magical realism illustration style, 
no text.

**Image 2 — Workflow: Collaborative Design**
Three figures in emerald and coral tones around a glowing blueprint, 
surrounded by floating design tokens and Latin American folk art motifs, 
magical realism, no text.
```

## Anti-Patterns

- ❌ Using `nohup bash generate_blog_images.sh` — causes Python 3.14 init error; use `&` instead
- ❌ Using system python (`python` or `python3`) — must use `venv/bin/python`
- ❌ Removing `python -u` from the script — unbuffered output is required to avoid stderr/stdout init issues
- ❌ Placing images after individual sections — group by section cluster (5 max per post)
- ❌ Writing abstract prompts without specific visual elements — be concrete and painterly
- ❌ Forgetting to update alt text when prompt themes change — keep text-image alignment
- ❌ Running the script without checking the generation.log tail first — verify no prior job still running
- ❌ Hardcoding absolute paths in prompts — keep them relative; the script sets working directory
