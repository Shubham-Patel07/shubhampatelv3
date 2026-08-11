import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

// Planned pieces — clearly labeled as upcoming until the MDX blog ships (Phase 6).
const upcoming = [
  { title: "Designing SLOs that actually page you", tag: "SRE" },
  { title: "Kubernetes observability from first principles", tag: "Observability" },
  { title: "Taming cloud infra with reusable Terraform modules", tag: "DevOps" },
];

export function WritingTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        index="03"
        title="Writing"
        action={
          <Link
            href="/writing"
            className="group inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-foreground"
          >
            all writing
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {upcoming.map((post, i) => (
          <Reveal key={post.title} delay={i * 0.08}>
            <div className="group flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-border-strong">
              <div className="flex items-center justify-between">
                <Badge>{post.tag}</Badge>
                <span className="font-mono text-xs text-faint">soon</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug">
                {post.title}
              </h3>
              <p className="mt-auto pt-6 font-mono text-xs text-faint">
                draft in progress
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
