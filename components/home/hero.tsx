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
import { StatusDot } from "@/components/ui/status-dot";

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
            available for opportunities · {siteConfig.timezoneLabel}
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-[4.2rem]">
            {siteConfig.taglineLead}{" "}
            <ShimmerText>{siteConfig.taglineAccent}</ShimmerText>
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
            <span className="text-muted">Nasdaq, Silver Touch</span>
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
