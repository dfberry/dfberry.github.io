# Bruno — History

## Project Context

- **Project:** dfberry.github.io — personal tech blog
- **Owner:** dfberry
- **Stack:** Docusaurus v3, React, TypeScript, MDX, GitHub Pages
- **Team:** Firefly universe — Mal (Lead), Inara (Writer), Book (Editor), Kaylee (Dev), Wash (Social), Simon (SEO), Zoe (PM)
- **Joined:** 2026-03-22

## Learnings

### Squad Official Terminology (verified against https://github.com/bradygaster/squad)

**Correct file structure (from official README):**
- `.squad/team.md` — Roster; who's on the team
- `.squad/routing.md` — Routing; who handles what (SHARED file, not per-agent)
- `.squad/decisions.md` — Shared brain; team decisions (FLAT FILE, not a directory)
- `.squad/ceremonies.md` — Sprint ceremonies config (Design Reviews, Retrospectives)
- `.squad/agents/{name}/charter.md` — Agent identity, expertise, voice
- `.squad/agents/{name}/history.md` — What that agent knows about YOUR project
- `.squad/skills/` — Compressed learnings from work (distinct from history.md!)
- `.squad/casting/` — policy.json, registry.json, history.json

**Key terminology distinctions:**
- **Routing rules** → live in the SHARED `routing.md`, NOT per-agent. Each agent has routing rules *about* them, but there is no per-agent routing file.
- **Skills** → `.squad/skills/` directory with SKILL.md files. Compressed, reusable learnings. NOT the same as `history.md`.
- **Agent Memory / history.md** → per-agent accumulated knowledge about the specific project. Different from Skills.
- **Ceremonies** → pre/post-work team rituals (Design Review before multi-agent tasks, Retrospective after failures). NOT about issue-to-PR handoffs — that's routing.
- **decisions.md** → The official primary coordination file is `.squad/decisions.md` (a flat markdown file). The `decisions/inbox/` subdirectory is a local extension, not official Squad structure.
- `squad` (no args) → launches the interactive shell with `squad >` prompt. Correct.
- `copilot --agent squad --yolo` → the Copilot CLI invocation. Official.
- Upstream inheritance → `squad upstream add|remove|list|sync` command exists. Calling it "git-native" in the sense of traveling with git clone is conceptually accurate.

**Blog post errors corrected (2026-03-22):**
1. "each agent gets a charter, a routing rule" → routing is a shared `routing.md`, not per-agent
2. "`decisions/` inbox" → primary coordination is `decisions.md` (flat file)
3. "Skills — specialized knowledge accumulated in `history.md`" → Skills are `.squad/skills/`; `history.md` is Agent Memory. These are distinct Squad concepts.
4. "Ceremonies — What triggers which agent, how an issue becomes a PR" → Ceremonies are Design Reviews and Retrospectives. Issue/PR handoff logic lives in `routing.md`.

