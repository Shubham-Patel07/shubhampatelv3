import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ShimmerText } from "@/components/ui/shimmer-text";
import { Magnetic } from "@/components/ui/magnetic";
import { siteConfig } from "@/lib/data/site";

export function CTA() {
  return (
    <section className="px-6 pb-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border px-6 py-20 text-center">
        <AuroraBackground />
        <p className="font-mono text-sm text-accent">{"//"} let&apos;s talk</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Let&apos;s build something <ShimmerText>reliable.</ShimmerText>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted">
          Open to roles and interesting problems across backend, systems and
          cloud engineering. I read every message.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform"
            >
              Get in touch
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
          <a
            href={`mailto:${siteConfig.email}`}
            className="rounded-full border border-border px-5 py-2.5 font-mono text-sm text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>
    </section>
  );
}
