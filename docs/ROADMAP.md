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
| 6 | Writing (MDX blog) | done — first real post live |
| 7a | Dashboard — live GitHub stats + contribution graph | done |
| 7b | Contributions page | done |

All phases are complete. Remaining work is content, tracked as GitHub issues
#10–#13 (case-study metrics, employment history, real blog posts, device QA).

Since then, outside the phase numbering: a Vitest suite, CodeQL and Dependabot —
see **Testing** and **Security scanning** below.

> **Parked:** [FREELANCE-PIVOT.md](FREELANCE-PIVOT.md) — analysis for
> repositioning the site from a job-seeking portfolio to a freelance brand.
> **On hold, not approved work.** Don't start on it without reopening the four
> decisions listed there.

## Phase 6 notes — writing / MDX

Posts are `.mdx` files in `content/writing/`. Adding a file publishes it; there
is no list to register it in. Frontmatter: `title`, `summary`, `date`, `tag`,
`draft`. Reading time is computed from the body, never authored.

`draft: true` hides a post from the index and from the home teaser, but the URL
still resolves (so a draft link is shareable) and `generateMetadata` marks it
`noindex`.

**`remark-frontmatter` is required, not cosmetic.** MDX has no concept of
frontmatter on its own: the `---` fences compile to a horizontal rule and the
YAML keys render as body text at the top of every post. `gray-matter` reads the
block for metadata; the remark plugin is what removes it from the article.

Turbopack serializes the MDX config to Rust, so remark/rehype plugins must be
named as **strings** in `next.config.ts` — an imported function will not work.

`content/writing/sample-post.mdx` is a scaffold documenting the format, kept as
a draft so it never appears publicly. Delete it once real posts exist.

**Published so far:** `secrets-that-survive-the-build.mdx` (Security, 2026-08-14)
— three ways a secret ends up in an image or a repo despite the right tool being
used, built on the WrongSecrets challenges Shubham actually authored (OWASP PRs
#1790, #1668, #1452). Every claim in it is traceable to those PRs or to public
Docker/Sealed Secrets behaviour; nothing about his own work is asserted beyond
what the merged PRs show.

## Responsive

**Breakpoint ladder — never jump straight to three columns.** Card grids go
`base (1) → sm:2 → lg:3`. `md:grid-cols-3` puts ~215px cards on an iPad and
wraps every title onto three lines.

**The nav switches to desktop at `lg`, not `md`.** Logo + 6 links + theme toggle
+ Contact needs ~900px; at `md` (768px) the Contact button was clipped off the
right edge. Tablets keep the hamburger.

The hero splits into two columns only at `lg`, so the terminal is capped with
`lg:max-w-md` — capping it earlier strands half the row empty on a tablet.

**Testing gotcha, worth knowing before you debug a phantom:** macOS clamps
Chrome's minimum window width to ~500px, so `--window-size=390` lays out at 500
and merely *crops* to 390 — which looks exactly like a horizontal-overflow bug.
Use `scripts/responsive-shots.sh <route> <out.png> 390 768 1024`, which renders
the site in fixed-width iframes to get a real narrow viewport.

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

**Contributions (7b)** uses the GitHub **search** API — the only endpoint that
answers "everything this person authored, anywhere". PRs against Shubham's own
repos are filtered out; those belong to the Dashboard. Search returns max 100
per page: paginate if the total ever exceeds it rather than silently truncating.
PR state is shown as icon + label, never colour alone, since merged vs.
closed-unmerged is the whole point of the page.

Heatmap colors are the `--heat-0..4` tokens in `globals.css`: one hue, five
steps, `heat-0` neutral so an empty day never reads as a low count. The dark
steps are chosen against the dark surface, not an inversion of the light ones.

## Testing (Vitest)

`npm test` runs Vitest once; `test:watch` and `test:coverage` are the other two.
CI runs `test:coverage` between the typecheck and the build, **with no
credentials** — same reason the build step has none.

**What's worth testing here is the claims, not the framework.** The suite pins
the four things the README asserts and nothing else was enforcing: `lib/github.ts`
resolving to `null`/a status on every failure path rather than throwing (a throw
doesn't blank a panel — `/dashboard` is prerendered, so it fails the *build*),
`no-token` staying distinct from `error`, drafts staying out of the index while
still resolving by URL, and every `stackGroups` entry resolving to a glyph.

Three things that cost time to discover:

1. **The config must be `vitest.config.mts`, not `.ts`.** `package.json` has no
   `"type": "module"`, so Node loads a `.ts` config through the CJS path and
   Vitest 4 dies with `ERR_REQUIRE_ESM` on `std-env`. The `.mts` extension is
   already in the tsconfig `include` list.
2. **Coverage `include` takes globs, not paths.** An exact filename with no
   wildcard matches nothing and the file silently vanishes from the report
   rather than erroring.
3. **`components/ui/stack-icon.tsx` never appears in coverage** under any glob,
   though every other file in `components/ui/` does. It's the only one a test
   file imports directly. It *is* exercised — 28 render assertions — and you can
   see it indirectly, because `tech-logo.tsx` only reaches 75% by way of
   `StackIcon` rendering it. Don't re-litigate this; it's a v8 reporting
   artifact, not a hole in the suite.

Tests delete `GITHUB_TOKEN` in a `beforeEach`. Without that, a developer with a
real token in their shell tests the *opposite* branch of the no-token path and
the case passes for the wrong reason.

## Security scanning

`.github/workflows/codeql.yml` runs CodeQL (`security-and-quality`) on push, PR
and weekly. The schedule isn't padding: the rules change even when the code
doesn't, so without it the repo is only ever scanned by whatever ruleset existed
on merge day.

`.github/dependabot.yml` covers npm and github-actions, **grouped**. Ungrouped it
opens roughly a dozen PRs a week and a permanently full PR tab on a solo repo
reads as abandoned, not maintained. Next/React are their own group because a
framework major deserves its own review.

Badges must stay backed by something that actually runs. Do not add a
self-asserted quality badge: OpenSSF Scorecard reports `invalid repo path` until
the workflow exists, and Snyk renders a green `monitored` for this repo with
nothing imported and no scan ever run — that's the failure mode to avoid, not a
template.

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
`scripts/gen-tech-icons.mjs` and run `npm run gen:icons`. The icon packages are
devDependencies only; paths are baked in so nothing ships at runtime.

**Two sources, deliberately — neither covers the stack alone:**

- `simple-icons` (CC0) is the default and covers 16 of 18.
- `@iconify-json/fa6-brands` (Font Awesome Free, **CC BY 4.0** — attribution is
  in the generated file's header) supplies `aws` and `java`, which Simple Icons
  dropped over trademark policy.

Font Awesome alone is *not* a substitute: it lacks Spring Boot, Kubernetes,
Terraform, OpenShift, Prometheus, Grafana and Helm. (Devicon covers 14/15 —
everything but OpenShift — if a single source is ever wanted.)

`MarqueeItem.icon` stays optional so a missing mark degrades to the name alone.

**The Toolkit on `/about` mixes two icon systems on purpose, and it can't not.**
`stackGroups` holds 28 items, but only 18 of them are *products* with a brand
mark. The other 10 are *concepts* — "Microservices", "System Design",
"SLIs / SLOs" — and no logo for those exists or ever will. Before hunting for
one: `amazoncloudwatch` is not in either package (Simple Icons dropped the
Amazon marks), so CloudWatch is a concept entry too.

`components/ui/stack-icon.tsx` resolves the split: `brandKey` → `TechLogo`,
`conceptIcon` → a generic lucide glyph. Both maps are keyed on the **exact**
display string from `stackGroups`, so renaming an item there surfaces as a
missing icon instead of silently mapping to the wrong one. Never fill a concept
gap by borrowing an unrelated vendor's mark — it claims a tool he doesn't use.

This is the one place the "don't mix stroked lucide with filled brand glyphs"
rule is deliberately broken, so it pays the compensation the rule exists for:
concept icons render at `size-[1.0625rem]` (17px) against `TechLogo`'s 16px, at
full `strokeWidth`, because an outline carries less ink and reads a size smaller
at identical dimensions. Verified at 390 and 1024 — drop the compensation and
the stroked rows visibly shrink next to Spring Boot and Prometheus.
Render logos with `h-* w-auto`, never `size-*`: AWS is a 640×512 logotype and a
square box letterboxes it a quarter smaller than the glyphs beside it.
