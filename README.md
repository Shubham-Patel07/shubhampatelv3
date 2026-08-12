<div align="center">

# shubham.patel()

**Personal site of Shubham Patel — software engineer.**
Backend and distributed systems, and the cloud infrastructure that keeps them running.

<br />

![The site on desktop and mobile](docs/screenshots/hero.png)

</div>

<br />

## What this is

A portfolio built to be read the way an engineer would want to read one: case
studies that explain the tradeoffs rather than list technologies, and dashboards
that pull real numbers from an API rather than repeating whatever was true the
day they were written.

Dark-first, one accent colour, no component library — every element is built in
this repo.

<br />

![Live GitHub data on the dashboard and contributions pages](docs/screenshots/live-data.png)

<div align="center"><sub>Both pages are live — the numbers come from the GitHub API on a one-hour cache, not from a config file.</sub></div>

<br />

## Highlights

**Case studies, not screenshots.** Each project is written as problem →
constraints → architecture → decisions *with their costs* → outcomes → what I'd
do differently. The tradeoffs are the point.

**Live data, degraded honestly.** `/dashboard` and `/contributions` read from the
GitHub REST, GraphQL and search APIs. Every call resolves to `null` or a status
rather than throwing, so a rate limit or an outage degrades one panel instead of
breaking the route — and the UI distinguishes "not configured" from "request
failed", because those need different reactions.

**A design system, not a theme.** Every colour is a CSS variable surfaced to
Tailwind through `@theme inline`. Changing `--accent` in `app/globals.css`
reskins the entire site.

**Motion that yields.** Smooth scroll, scroll reveals, magnetic buttons, a
cursor spotlight, a canvas globe you can spin — and every one of them no-ops
under `prefers-reduced-motion`.

**Zero-registration writing.** Drop an `.mdx` file into `content/writing/` and
it publishes. Frontmatter drives the metadata; reading time is computed from the
body. Drafts stay out of the index but keep a shareable URL.

<br />

## Built with

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS-variable design tokens |
| Motion | Framer Motion, Lenis |
| Content | MDX, gray-matter, reading-time |
| Data | GitHub REST + GraphQL + search APIs, ISR |
| Hosting | Vercel |

<br />

## Running locally

```bash
npm install
cp .env.example .env      # then fill in the values below
npm run dev               # http://localhost:3000
```

`.env` keys:

| Key | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | for correct metadata | Canonical URL used by OpenGraph, sitemap and robots |
| `GITHUB_USERNAME` | yes | Whose data the dashboard reads |
| `GITHUB_TOKEN` | recommended | Raises the API rate limit and enables the contribution graph, which is GraphQL-only. **Public read-only scope is enough — do not use a token with `repo` write access** |
| `WAKATIME_API_KEY` | optional | Unused today; reserved for coding-hours metrics |

Without `GITHUB_TOKEN` the site still builds and runs: the dashboard falls back
to unauthenticated rate limits and the contribution graph reports that it isn't
configured.

<br />

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm start            # serve the production build
npm run lint         # eslint
npm run gen:icons    # regenerate lib/data/tech-icons.ts from the icon sets
```

`scripts/responsive-shots.sh <route> <out.png> 390 768 1024` screenshots a route
at several widths at once. It renders the site inside fixed-width iframes on
purpose — macOS clamps Chrome's minimum window to ~500px, so `--window-size=390`
silently lays out at 500 and merely crops, which imitates a horizontal-overflow
bug that isn't there.

<br />

## Repo map

```
app/                 routes, metadata, sitemap and robots
components/
  ui/                design-system primitives
  home/              homepage sections
  projects/          case-study rendering
  dashboard/         panels, stat tiles, contribution heatmap
content/writing/     blog posts (.mdx) — add a file, it publishes
lib/
  data/              all copy and content, kept out of components
  github.ts          GitHub API layer; never throws
  writing.ts         filesystem-backed post index
docs/                ROADMAP.md — build phases and house rules
```

`docs/ROADMAP.md` is the hand-off record: the phase history plus the conventions
worth not rediscovering.

<br />

---

<div align="center">
<sub>Built by <a href="https://github.com/Shubham-Patel07">Shubham Patel</a></sub>
</div>
