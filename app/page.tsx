import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ShimmerText } from "@/components/ui/shimmer-text";
import { Magnetic } from "@/components/ui/magnetic";
import { siteConfig } from "@/lib/data/site";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-widest text-faint">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

export default function Home() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 pb-16 pt-28">
      <AuroraBackground />

      <div className="mx-auto w-full max-w-6xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 font-mono text-xs text-muted backdrop-blur">
          <span className="size-1.5 animate-pulse-glow rounded-full bg-accent" />
          available for opportunities · {siteConfig.timezoneLabel}
        </div>

        <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Software engineer who
          <br className="hidden sm:block" /> builds it — and{" "}
          <ShimmerText>runs it in production.</ShimmerText>
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

        <dl className="mt-16 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-3">
          <Meta label="Role" value="Software Engineer" />
          <Meta label="Focus" value="Backend · Cloud · SRE" />
          <Meta label="Currently" value="M.Tech CSE · NIT Warangal" />
          <Meta label="Experience" value="2+ years" />
          <Meta label="Based in" value={siteConfig.location} />
          <Meta label="Previously" value="Nasdaq · Silver Touch" />
        </dl>
      </div>
    </section>
  );
}
