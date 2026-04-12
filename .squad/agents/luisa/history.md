# Project Context

- **Owner:** dfberry
- **Project:** dfberry.github.io — personal tech blog
- **Stack:** Docusaurus v3, React, TypeScript, MDX, GitHub Pages, Google Analytics
- **Created:** 2026-03-22

## Work Log

### 2026-03-22: Blog Post PR Published

**Task:** Ship approved blog post: "Squad: Accelerating Inner Source with Agentic Teams"

**Actions:**
1. Created feature branch: `squad/blog-squad-inner-source`
2. Pushed branch to origin
3. Opened PR #24 to main

**PR Details:**
- Title: "feat(blog): Squad contributor enablement post"
- Status: ✅ Ready for review
- URL: https://github.com/dfberry/dfberry.github.io/pull/24
- Base: main
- All agent sign-offs complete (Dolores, Bruno, Julieta, Antonio)

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-03-22: Code Quality Review — Build Health Excellent, Minor Deprecation Warning

**Codebase Health:** Strong overall quality, production-ready.

**Key Findings:**
1. **Build succeeds cleanly** — `npm run build` completes without errors
2. **Dependency health good** — Only minor updates available (Prettier 3.7.4 → 3.8.1, search plugin 0.52.2 → 0.52.3)
3. **React 18.x stable** — React 19 available but no rush to upgrade (breaking changes)
4. **Deprecated config warning** — `siteConfig.onBrokenMarkdownLinks` deprecated in favor of `siteConfig.markdown.hooks.onBrokenMarkdownLinks` (Docusaurus v4 breaking change)
5. **Blog truncation warnings** — 13 posts missing `<!-- truncate -->` markers (non-blocking, UX improvement)

**TypeScript Status:** Not currently used — codebase is JavaScript/JSX only. No tsconfig.json, no .ts/.tsx files.

**Linting:** No ESLint config present. Code quality relies on Prettier for formatting only.

**GitHub Actions:**
- Build and deploy workflows use current actions versions (v6 for checkout/setup-node, v4/v7 for scripts)
- All Squad workflows properly configured
- No deprecated action versions

**Static Assets:** Well-organized, minimal files (3 images + favicon), no bloat

**Site Config:** Externalized to `site.config.js` (good separation), clean structure

**Component Quality:**
- `HomepageFeatures.js` uses default Docusaurus boilerplate (could be customized but functional)
- Proper React patterns (no `key={idx}` issues exist — only one use, acceptable for static list)
- CSS modules properly scoped

**No Critical Issues Found** — Site is deployment-ready. Only recommendation is addressing the deprecation warning before Docusaurus v4.
