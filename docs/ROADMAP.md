# Build roadmap

This site is built in phases. **Update the status table below whenever a phase
closes** — it is the hand-off record between sessions, and the only place the
phase numbering is written down.

> Keep this in `docs/` rather than `AGENTS.md`: `next dev` rewrites `AGENTS.md`
> on every run and would clobber anything added there.

## Status

| Phase | Scope | State |
| ----- | ----- | ----- |
| 1 | Scaffold — Next.js 16, Tailwind v4, core deps | done |
| 2 | Design system, app shell (nav/footer/theme/Lenis/spotlight), effects kit | done |
| 3 | Home page — hero, selected work, bento, writing teaser, CTA, globe | done |
| 4 | Projects index + case studies | done — metrics still `[verify]` |
| 5 | About & Contact | todo |
| 6 | Writing (MDX blog) | todo |
| 7 | Dashboard (live GitHub / WakaTime) + Contributions | todo |

Phases 5–7 are provisional — confirm scope before starting one.

## Conventions worth not rediscovering

- **Design tokens** live in `app/globals.css` as CSS variables, surfaced to
  Tailwind through `@theme inline`. Use `bg-surface`, `text-muted`, `text-faint`,
  `border-border`, `text-accent` — never raw hex. Changing `--accent` reskins the
  whole site.
- **Dark-first.** `next-themes` toggles a `.dark` class; the `dark:` variant is
  wired to it via `@custom-variant`. Default theme is dark, system disabled.
- **Three fonts**: `font-sans` (Geist), `font-mono` (Geist Mono), `font-display`
  (Space Grotesk). Kickers, labels, and metrics are mono; headings are display.
- **Motion** is Framer Motion and every animated primitive must no-op under
  `useReducedMotion()`. `globals.css` also kills animation globally under
  `prefers-reduced-motion`.
- **Content lives in `lib/data/`**, not in components. Pages read from it.
- **Routes wired into the nav must never 404.** `components/page-placeholder.tsx`
  is the on-brand stub used for routes whose phase hasn't landed yet.
- Facts that aren't verified yet are marked `[verify]` in a comment next to the
  value. Don't invent metrics — leave the marker.

## Phase 4 notes

Shipped: `/projects` (domain-filtered grid) and `/projects/[slug]` (case study,
prerendered via `generateStaticParams`, 404s on an unknown slug or a project
with no `caseStudy`).

**Outstanding:** every hard number in the `outcomes` of `lib/data/projects.ts`
renders literally as `[verify]`. Shubham needs to supply measured values — or
the outcome should be cut rather than guessed.

`lucide-react` v1 ships **no brand icons**. Import `GithubIcon` / `LinkedinIcon`
/ `XIcon` from `components/icons.tsx`; `import { Github } from "lucide-react"`
fails the build.
