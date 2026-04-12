# Project Context

- **Owner:** dfberry
- **Project:** dfberry.github.io — personal tech blog
- **Stack:** Docusaurus v3, React, TypeScript, MDX, GitHub Pages, Google Analytics
- **Created:** 2026-03-22

## Learnings

- Antonio added as Storyteller (Encanto universe, 2026-03-22)
- Added Félix (Python/ML Engineer) and Pepa (Image Specialist) to Encanto team (2026-03-22)
- Created /Users/geraldinefberry/repos/my_repos/image-generation — SDXL Python project
- Stack: Python 3.10+, diffusers>=0.19.0, torch>=2.0.0, supports CUDA/MPS/CPU
- Key files: generate.py (CLI), requirements.txt, prompts/examples.md
- Prompts in prompts/examples.md mirror the 5 blog post image prompts

### Architecture Review (2026-03-23)

**Repo Structure:** Clean separation — `.squad/` for team, `website/` for Docusaurus. Missing root README (intentional single-purpose repo).

**Docusaurus Config Issues:**
- `site.config.js` has typo: `descripton` (line 40) should be `description`
- Deprecated `onBrokenMarkdownLinks` at root level — migrate to `markdown.hooks.onBrokenMarkdownLinks` for Docusaurus v4
- 13 blog posts missing `<!-- truncate -->` markers — causes full content in list views

**Component Quality:** `HomepageFeatures.js` contains default Docusaurus boilerplate — never customized for dfberry brand. Static placeholders not replaced.

**Workflows:** Build/deploy healthy (Node 22, Prettier). Four Squad workflows present but heartbeat disabled (migration prep). All Squad workflows reference old Firefly names in labels/comments despite team recast to Encanto.

**Blog Organization:** 14 posts, structured dates, media in subfolders. Latest post (2026-03-22-squad-inner-source.md) marked `published: false` — won't appear in production.

**`.squad/` Team:** Well-configured — 11 agents (Encanto cast), routing.md comprehensive, ceremonies.md defined, skills directory present (blog-image-generation, project-conventions). No structural issues.

**Action Items:**
1. Fix typo in site.config.js line 40
2. Add truncate markers to 13 blog posts
3. Customize or remove HomepageFeatures boilerplate
4. Migrate onBrokenMarkdownLinks config for v4 compatibility
5. Update Squad workflow labels/comments from Firefly to Encanto names
6. Change squad-inner-source.md `published: false` → `true` when ready to ship
