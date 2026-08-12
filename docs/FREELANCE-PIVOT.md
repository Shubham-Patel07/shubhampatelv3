# Freelance repositioning — ON HOLD

> **This is not approved work. Nothing here is being implemented.**
> It is reconnaissance, parked deliberately on 2026-08-12 so it doesn't have to
> be re-derived. Do not start on it without Shubham reopening the decision — the
> four questions at the bottom have to be answered first, and the wrong answer
> makes the work useless.

## Context

The site reads as a student job-seeking portfolio: it proves employability to a
recruiter. Shubham wants it to work as a freelance brand instead — a site whose
job is to generate client leads. Those are different products, so the change is
a repositioning, not a redesign.

## The headline finding

**This is mostly copy, not a rebuild.** Roughly 85% of what exists is
identity-neutral and reusable. Three files carry the bulk of the positioning:

- **`lib/data/site.ts`** — `role`, `tagline` and `description` fan out to every
  page's metadata, the hero subhead and the footer. Note the M.Tech line is
  embedded in the global `description`, so it currently appears in every page's
  `<meta>`, OpenGraph and Twitter card.
- **`components/home/hero.tsx`** — the "available for opportunities" status
  pill, the H1, the résumé line ("Currently M.Tech… previously Nasdaq, Silver
  Touch"), and the terminal's "open to work" line.
- **`components/home/cta.tsx`** — the closing band, "Open to roles and
  interesting problems…".

Secondary: `lib/data/stats.ts` (CV metrics rather than business metrics),
`lib/data/experience.ts` (the education entry sits top of the timeline and holds
the glowing `current` badge), the Facts array in `app/about/page.tsx`, and
`app/contact/page.tsx` ("Best for … roles", "Open to opportunities").

## What already fits a service business

- **`CaseStudy`** (`lib/data/projects.ts`) is *already* a client-results schema:
  problem → constraints → architecture → decisions with tradeoffs → outcomes →
  learnings. No structural change needed.
- **`Outcome.value` is a `string`**, so `"3 weeks"` or `"−40% cost"` work as-is.
- **`ProjectsGrid`** filtering works unchanged if `domains` became service
  categories.
- **`Panel` / `StatTile` / `PanelNotice`** are generic and already reused by
  `/contributions`.
- **`TiltCard`** is built and used nowhere — free for a service or pricing card.
- **`Marquee`** currently carries tech logos — the natural home for client logos.
- **`Counter`** supports `prefix`, so it is price-ready.
- **`PageHeader`** takes a `children` slot, so a `/services` route needs no new
  header component.
- **The MDX pipeline** (`lib/writing.ts`) is content-type agnostic — reusable
  for services or FAQ content.
- **`PagePlaceholder`** is a ready on-brand stub for a route that isn't written.

## What is missing (verified by grep, not assumed)

| Gap | Note |
| --- | --- |
| Services / offerings | No route, no data file, no slot in `app/page.tsx` |
| Pricing / engagement models | Nothing anywhere |
| Testimonials / client proof | `Project` has no `client` field; `links.repo`/`links.demo` are declared but never populated on any project |
| **Real lead capture** | The contact form only composes a `mailto:` — no API route, no email provider. **The biggest functional gap**: it silently drops enquiries from anyone without a configured mail client, which is most people on phones. There is no email field at all, no budget/timeline/scope fields, no spam protection and no thank-you state |
| Client-facing CTAs | Every CTA is "Get in touch" / "Contact". Nothing like "Start a project" or "Book a call", and no scheduling link |
| Process / how-we-work | `principles` is engineering philosophy, not client-facing steps or deliverables |
| Availability | Expressed only in employment terms. Nothing about capacity, slots or lead time |
| FAQ | Absent; no accordion component exists |
| SEO / business basics | No `sitemap.ts`, no `robots.ts`, no OG image (despite `summary_large_image` being declared), no JSON-LD, no analytics. README is still create-next-app boilerplate |

## Decisions needed before any work starts

1. **Audience** — clients only, or clients-first with the credentials kept on
   About? A split message converts worse for both audiences.
2. **Services** — what is actually being sold? Backend/API, Cloud & DevOps, and
   K8s & observability are the candidates the existing case studies support.
3. **Lead capture** — keep `mailto`, or add a real form (needs an email provider
   account and an API key), optionally plus a booking link.
4. **Proof** — are testimonials available, and should rates be public?

## Blocker worth knowing

The case-study outcome numbers are still `[verify]` placeholders (issue #10) and
the employment history is still blank (issue #11). A freelance site leans harder
on proof than a portfolio does, so those get **more** urgent under this
positioning, not less.

The strongest proof already in hand is the open-source record — 37 PRs, 25
merged, including into OWASP projects. That is real, third-party-verifiable
credibility that needs no permission to use.
