import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ShimmerText } from "@/components/ui/shimmer-text";
import { Magnetic } from "@/components/ui/magnetic";
import { Marquee } from "@/components/ui/marquee";
import { Terminal, type TerminalLine } from "@/components/ui/terminal";
import { TechLogo } from "@/components/ui/tech-logo";
import { siteConfig } from "@/lib/data/site";
import { marqueeStack } from "@/lib/data/stack";
import { timeline } from "@/lib/data/experience";
import { StatusDot } from "@/components/ui/status-dot";

/**
 * Derived, not hardcoded: this line previously read "Nasdaq, Silver Touch" and
 * went stale the moment the timeline changed, leaving the home page contradicting
 * /about. "Currently ..." below stays authored — the timeline's full `role`
 * string is far too long for that text-xs line.
 */
const pastEmployers = timeline
  .filter((entry) => entry.kind === "work")
  .map((entry) => entry.org)
  .join(", ");

const heroLines: TerminalLine[] = [
  { prompt: "$", text: "whoami" },
  { text: "Shubham Patel — Software Engineer", accent: true },
  { prompt: "$", text: "cat focus.txt" },
  { text: "backend · distributed systems · cloud · sre", accent: true },
  { prompt: "$", text: "uptime" },
  { text: "2+ yrs shipping resilient systems to production", muted: true },
  { prompt: "$", text: "location --now" },
  { text: "India · IST (UTC+5:30) · open to work", muted: true },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-14 pt-28">
      <AuroraBackground />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 font-mono text-xs text-muted backdrop-blur">
            <StatusDot />
            available for opportunities
            {/* At 390px the timezone pushes the pill onto a second line inside
                its own border. The terminal below already states it. */}
            <span className="hidden sm:inline">
              · {siteConfig.timezoneLabel}
            </span>
          </span>

          {/* Identity only — three deliberate lines. The promise moved to the
              subhead: a full sentence at this type size wrapped unpredictably in
              the narrow `lg` column. `block` on each span forces the breaks. */}
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-[4.2rem]">
            <span className="block">
              I&rsquo;m<span className="text-accent">,</span>
            </span>
            <span className="block">{siteConfig.name}</span>
            {/* The role is a label, not part of the name, so it takes the mono
                face the rest of the site uses for kickers and labels rather than
                the display face. Sized so 17 characters plus `tracking-widest`
                clear a 342px content box at 390 — it never splits. */}
            <ShimmerText className="mt-5 block font-mono text-2xl font-medium uppercase tracking-widest sm:text-3xl">
              {siteConfig.role}
            </ShimmerText>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {siteConfig.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform"
              >
                View selected work
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-border-strong"
              >
                Get in touch
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
          </div>

          <p className="mt-8 font-mono text-xs text-faint">
            Currently{" "}
            <span className="text-muted">M.Tech CSE @ NIT Warangal</span>
            {"  ·  "}previously{" "}
            <span className="text-muted">{pastEmployers}</span>
          </p>
        </div>

        <div className="w-full lg:justify-self-end">
          {/* The two-column split only kicks in at lg. Below that the terminal
              is alone on its row, so cap it only once it sits beside the copy —
              otherwise it strands half the row empty on a tablet. */}
          <Terminal
            lines={heroLines}
            className="w-full lg:ml-auto lg:max-w-md"
          />
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl">
        <div className="mask-x-faded">
          <Marquee
            duration={45}
            items={marqueeStack.map((tech) => (
              <span
                key={tech.name}
                className="flex items-center gap-10 font-mono text-sm text-faint transition-colors hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <TechLogo name={tech.icon} className="h-[1.15rem] w-auto" />
                  {tech.name}
                </span>
                <span className="text-accent/50">/</span>
              </span>
            ))}
          />
        </div>
      </div>
    </section>
  );
}
