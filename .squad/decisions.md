# Squad Decisions

## Active Decisions

### Inner Source Collaboration: Blog Post Publication

**Date:** 2026-03-22  
**Agents:** Dolores (Editor), Luisa (Publisher), Julieta (SEO), Isabela (Writer)

#### Decision: Publish "Squad: Accelerating Inner Source with Agentic Teams"

**Status:** Ready for publication  
**Post:** `website/blog/2026-03-22-squad-inner-source.md`

**Workflow:**
1. Isabela drafted first-person post (~1,050 words) on Squad's `.squad/` as portable onboarding system
2. Dolores edited for voice, flow, accuracy; resolved TODOs on inner source model
3. Julieta provided SEO strategy and front matter (primary keyword: "AI-powered inner source collaboration")
4. Luisa opens PR when all sign-offs complete

**Front Matter:** Title (59 chars), description (152 chars), 7 tags covering GitHub Copilot/CLI, Inner Source, Agentic Workflows, Developer Experience

**Post Sections:**
- Hook — onboarding tax problem
- What Squad is (context)
- Contributor perspective — git clone + `.squad/` inheritance
- What you inherit (charters, routing, histories, decisions)
- Inner source connection
- Outer source (OSS maintainer) angle
- Interrupted contributor problem solved by `history.md`
- dfberry meta-experience
- CTA — reference Brady's repo, encourage OSS maintainers

**Target Audience:** Open source contributors, engineering leads, GitHub Copilot CLI power users, enterprise developers evaluating AI-assisted workflows

**SEO Strategy:** First-mover advantage in "inner source + AI + agentic workflows" search territory; aims for 3-6 month authority building

**Internal Linking:** Link from/to cloud-native, CLI, and monorepo posts for content web amplification

---

### Squad Terminology: Authoritative Reference

**Date:** 2026-03-22  
**Author:** Bruno (Squad Specialist)

**Key Distinctions Established:**
- **Skills ≠ Agent Memory** — Skills are reusable team learnings (`.squad/skills/`); agent memory is per-agent project knowledge (`.squad/agents/{name}/history.md`)
- **Routing ≠ Per-Agent** — Routing lives in shared `.squad/routing.md`; maps work types to agents
- **Ceremonies ≠ Workflow** — Ceremonies are team rituals (Design Review, Retrospective); routing handles work assignment
- **decisions.md ≠ decisions/inbox/** — Official structure uses single flat `decisions.md`; inbox is local extension for handoffs

**Verified Claims (safe for future content):**
- `.squad/` directory committed and travels with git clone
- Each agent has `charter.md` (identity) and `history.md` (accumulated knowledge)
- `squad` interactive shell, `squad init`, `squad upgrade` commands exist
- `history.md` accumulates knowledge across sessions
- `routing.md` defines who handles what
- `ceremonies.md` defines Design Reviews and Retrospectives
- "Not a chatbot wearing hats" — Brady's framing
- `squad upstream` command exists for managing upstream Squad sources

**Note for Public Content:** When mentioning Squad, distinguish between official schema (single `decisions.md`) and local pattern (inbox subdirectory with hedging language)

---

### Universe Recast: Firefly → Encanto

**Date:** 2026-03-22T21:30:25Z  
**By:** Squad (Coordinator)

**Decision:** Recast team from Firefly to Encanto universe

**Rationale:** User preference — family-friendly universe with female-first character focus

**Mapping:**
- Mal → Mirabel (dreamer, problem-solver)
- Inara → Isabela (structured, presentation-focused)
- Book → Dolores (keeper of knowledge)
- Kaylee → Luisa (gets things done)
- Wash → Camilo (adaptable, shapeshifter)
- Simon → Julieta (healer, fixes things)
- Zoe → Abuela (elder, leadership)
- River → Bruno (mysterious, visionary)

**Execution:** All 8 agent folders renamed, charters and histories updated, team.md and routing.md refreshed, casting registry marked Firefly retired and Encanto active, decision inbox entries updated, blog post references updated.

**Status:** Complete — ready for commit

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
