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
    period: "Aug 2026 – present",
    location: "Warangal, IN",
    summary: "Applying my skills, building new ones, and keeping the coffee-to-code ratio healthy.",
    current: true,
  },
  {
    kind: "work",
    org: "Nasdaq Inc",
    role: "Software Engineer",
    period: "Jan 2024 – Jul 2025",
    location: "Pune, IN",
    summary: "Worked on Regulatory Reporting Solutions, supporting the development and maintenance of automated regulatory reporting workflows.",
    highlights: [],
    tech: [],
  },
  {
    kind: "education",
    org: "Symbiosis Institute Of Technology",
    role: "B.Tech, Computer Science & Engineering",
    period: "Jun 2020 – Jan 2024",
    location: "Pune, IN",
    summary: "4 years of coding, coffee, and convincing myself that one more cup would fix the bug.",
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
