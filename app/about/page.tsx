import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { TechLogo } from "@/components/ui/tech-logo";
import { Timeline } from "@/components/about/timeline";
import { timeline, principles } from "@/lib/data/experience";
import { stackGroups } from "@/lib/data/stack";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "From backend and distributed systems to the cloud infrastructure underneath — how I build, ship, and operate software end to end.",
};

/** Maps a stack item to a generated glyph key where one exists. */
const iconKey: Record<string, string> = {
  Java: "java",
  Python: "python",
  Go: "go",
  "Spring Boot": "springboot",
  Kubernetes: "kubernetes",
  Docker: "docker",
  Terraform: "terraform",
  OpenShift: "openshift",
  Linux: "linux",
  Prometheus: "prometheus",
  Grafana: "grafana",
  Helm: "helm",
  Jenkins: "jenkins",
  "GitHub Actions": "githubactions",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="// about"
        title="A complete software engineer"
        description={siteConfig.tagline}
      />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              I build backend systems and the infrastructure they run on. Most of
              what I know came from the gap between those two things — a service
              that looks correct in review behaves differently at 3am with a
              dependency degraded and a queue backing up.
            </p>
            <p>
              That&apos;s the thread through my work: designing systems that fail
              narrowly instead of all at once, and building the observability to
              see it happening. Timeouts, circuit breakers, error budgets and
              reproducible infrastructure aren&apos;t separate specialities to me
              — they&apos;re the difference between software that works and
              software that keeps working.
            </p>
            <p>
              I&apos;m currently doing an M.Tech in CSE at NIT Warangal,
              deepening the systems foundations underneath all of it.
            </p>
          </div>

          <aside className="space-y-4">
            <Facts />
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <SectionHeading index="01" title="How I work" />
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-surface/60 p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <SectionHeading index="02" title="Where I've been" />
        <div className="max-w-3xl">
          <Timeline entries={timeline} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 pb-24">
        <SectionHeading index="03" title="Toolkit" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stackGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-border bg-surface/60 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-faint">
                  {group.label}
                </p>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-muted"
                    >
                      <TechLogo
                        name={iconKey[item]}
                        className="size-4 text-faint"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              Get in touch
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-border-strong"
          >
            Read the case studies
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Facts() {
  const facts = [
    { label: "Based in", value: `${siteConfig.location} · ${siteConfig.timezoneLabel}` },
    { label: "Focus", value: siteConfig.disciplines.join(" · ") },
    { label: "Currently", value: "M.Tech CSE @ NIT Warangal" },
    { label: "Status", value: "Open to opportunities" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-faint">
        {"//"} at a glance
      </p>
      <dl className="mt-5 space-y-4">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="font-mono text-xs text-faint">{f.label}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-foreground">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
