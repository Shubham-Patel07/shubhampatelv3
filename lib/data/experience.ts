export type TimelineEntry = {
  kind: "work" | "education";
  org: string;
  /** Job title or degree. */
  role: string;
  period: string;
  location?: string;
  /** One or two sentences of context. */
  summary?: string;
  /** What you actually did. Empty until Shubham fills it in — see note below. */
  highlights?: string[];
  tech?: string[];
  current?: boolean;
};

/**
 * Career timeline.
 *
 * Only the organisations and the current degree are known facts (they appear in
 * the hero copy). Roles, dates and highlights are Shubham's to supply — this
 * file deliberately ships `[verify]` placeholders rather than plausible-sounding
 * invented achievements, because these are real employers and an invented bullet
 * here is a fabricated employment claim, not a rough draft.
 *
 * The About page hides `highlights` when the array is empty, so filling these in
 * is purely additive.
 */
export const timeline: TimelineEntry[] = [
  {
    kind: "education",
    org: "NIT Warangal",
    role: "M.Tech, Computer Science & Engineering",
    period: "[verify] – present",
    location: "Warangal, India",
    summary:
      "Deepening the systems foundation — distributed systems, operating systems, and computer networks.",
    current: true,
  },
  {
    kind: "work",
    org: "Nasdaq",
    role: "[verify] — job title",
    period: "[verify] — start – end",
    location: "[verify]",
    summary: "[verify] — one or two sentences on scope and ownership.",
    highlights: [],
    tech: [],
  },
  {
    kind: "work",
    org: "Silver Touch Technologies",
    role: "[verify] — job title",
    period: "[verify] — start – end",
    location: "[verify]",
    summary: "[verify] — one or two sentences on scope and ownership.",
    highlights: [],
    tech: [],
  },
];

/** How I work — voice and philosophy, safe to edit freely. */
export const principles: { title: string; body: string }[] = [
  {
    title: "Build it, then run it",
    body: "Writing the service is half the job. The half that teaches you something is carrying the pager for it — operability, failure modes and observability are design inputs, not a follow-up ticket.",
  },
  {
    title: "Boring where it counts",
    body: "Novelty is a cost paid at 3am by whoever is on call. I spend the complexity budget on the part of the system that's genuinely hard, and pick the dull, well-understood option everywhere else.",
  },
  {
    title: "Make the tradeoff explicit",
    body: "Every decision costs something. Writing down what it cost — and what would make me revisit it — is what separates a design from a preference.",
  },
  {
    title: "Automate the thing you did twice",
    body: "Manual steps rot silently: the runbook is correct the day it's written and quietly wrong a month later. Encoding it in CI makes drift visible instead of surprising.",
  },
];
