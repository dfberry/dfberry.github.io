# Félix — History

## Core Context
- **Project:** dfberry.github.io — Geraldine's personal Docusaurus v3 blog
- **Team universe:** Encanto
- **New project:** image-generation at /Users/geraldinefberry/repos/my_repos/image-generation
  - Stack: Python, HuggingFace diffusers, Stable Diffusion XL Base 1.0
  - Purpose: Generate images using the tropical magical-realism palette prompts from the blog

## Progress

**2026-03-22:** image-generation project scaffolded ✅
- Repository initialized at `/Users/geraldinefberry/repos/my_repos/image-generation`
- `generate.py` CLI implemented with HuggingFace diffusers integration
- `requirements.txt` created with pinned dependencies (diffusers>=0.19.0, torch>=2.0.0)
- CUDA/MPS/CPU support configured for flexible hardware compatibility
- Project ready for prompt refinement and image generation iterations

## Learnings

### 2026-03-22: Image Generation Pipeline Setup
- Set up image-generation venv on Apple Silicon (MPS)
- pip install requires: diffusers, transformers, accelerate, safetensors, invisible-watermark, Pillow (torch already present)
- Torch 2.10.0 with MPS support confirmed on Apple Silicon
- Created generate_blog_images.sh for batch generation of all 5 blog post images
- Launched as detached background process via bash with stdin redirection
- First run downloads SDXL base model (~7GB) to ~/.cache/huggingface/hub/
- MPS inference: ~30 steps at 1024x1024 takes approx 5-10 min per image (post-download)
- generation.log tracks progress with timestamps for each of 5 images
- generation.pid has the process ID for monitoring
- All 5 outputs go to outputs/ folder: 01-friction-wall.png through 05-ceremonies-circle.png
- nohup causes file descriptor issues with Python - use bash detached with stdin redirect instead
- Batch script runs all 5 prompts sequentially with seed 42 for reproducibility
- Tropical magical-realism color palette: magenta, teal, emerald, gold particles, warm lighting
