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
| 5 | About & Contact | done — timeline content still `[verify]` |
| 6 | Writing (MDX blog) | todo |
| 7a | Dashboard — live GitHub stats + contribution graph | done |
| 7b | Contributions page | todo |

## Lenis / scrolling

Three things must stay true together or scrolling breaks intermittently — the
symptom is a page that won't scroll on roughly 1 load in 10 and recovers on
refresh, because Lenis measured a scroll limit of zero:

1. `app/globals.css` imports `lenis/dist/lenis.css`. **Not optional** — its
   `html.lenis, html.lenis body { height: auto }` is what stops a
   height-constrained root from collapsing the scrollable area.
2. The root `<html>` carries **no** `h-full`. The sticky footer comes from
   body's `min-h-dvh flex flex-col`, not from a 100%-height root.
3. **No `scroll-behavior: smooth`** on `html`. Lenis sets scroll position every
   frame and native smooth scrolling fights it; Next.js warns about the
   combination too. The reduced-motion block keeps `auto` explicit for users who
   get native scrolling instead.

## Phase 7 notes

`lib/github.ts` never throws — every fetch resolves to `null`/a status so one
dead source degrades a single panel instead of the route.

Profile and repo stats use the **public REST API** and work with no credentials
(60 req/hr/IP). The contribution calendar is **GraphQL-only and needs a token** —
there is no public REST equivalent — so it reports `no-token` separately from
`error`, because "add a token" and "GitHub is down" need different reactions.

`.env` (gitignored) holds `GITHUB_TOKEN`. `WAKATIME_API_KEY` is present but
empty, so no coding-hours panel is wired up; add one only once the key is set —
an empty panel is worse than no panel.

Heatmap colors are the `--heat-0..4` tokens in `globals.css`: one hue, five
steps, `heat-0` neutral so an empty day never reads as a low count. The dark
steps are chosen against the dark surface, not an inversion of the light ones.

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
- `AuroraBackground` carries `mask-b-faded` for a reason: its parent clips with
  `overflow-hidden`, and in a short container the blob is still bright when it
  gets cut, leaving a hard horizontal line under the heading. Don't remove it,
  and keep the fade if you add another backdrop.

## Phase 5 notes

`lib/data/experience.ts` ships `[verify]` placeholders for the Nasdaq and Silver
Touch entries. **Do not write these for him.** Company names and the current
degree are known; roles, dates and highlights are real employment claims and
must come from Shubham. `Timeline` hides `highlights`/`tech` when empty, so
filling them in is purely additive.

The contact page has no backend — `ContactForm` composes a `mailto:` and says so
on the page. If a real form is ever wanted it needs a mail provider; a form that
silently drops messages is worse than none.

## Phase 4 notes

Shipped: `/projects` (domain-filtered grid) and `/projects/[slug]` (case study,
prerendered via `generateStaticParams`, 404s on an unknown slug or a project
with no `caseStudy`).

**Outstanding:** every hard number in the `outcomes` of `lib/data/projects.ts`
renders literally as `[verify]`. Shubham needs to supply measured values — or
the outcome should be cut rather than guessed.

`lucide-react` v1 ships **no brand icons**. Import `GithubIcon` / `LinkedinIcon`
/ `MailIcon` / `XIcon` from `components/icons.tsx`; `import { Github } from
"lucide-react"` fails the build.

Don't mix lucide's stroked icons with the filled brand glyphs in the same row —
at equal dimensions the stroked ones read a size smaller. That's why `MailIcon`
exists instead of lucide's `Mail`.

Tech logos in `lib/data/tech-icons.ts` are **generated** — edit the list in
`scripts/gen-tech-icons.mjs` and run `npm run gen:icons`. `simple-icons` is a
devDependency only; the paths are baked in so nothing ships at runtime. It has
no AWS or Java mark (trademark removals), so `MarqueeItem.icon` is optional and
falls back to the name alone; `java` maps to the OpenJDK glyph.
