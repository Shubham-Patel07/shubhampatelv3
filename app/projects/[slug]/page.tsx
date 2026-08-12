import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { CaseStudySection } from "@/components/projects/case-study-section";
import { projects, getProject } from "@/lib/data/projects";
import { siteConfig } from "@/lib/data/site";
import { Surface } from "@/components/ui/surface";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `${siteConfig.url}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);

  // Covers both an unknown slug and a project whose case study isn't written
  // yet — a page with a header and nothing under it is worse than a 404.
  if (!project?.caseStudy) notFound();

  const { caseStudy } = project;

  return (
    <article className="pb-24">
      <header className="relative overflow-hidden px-6 pb-12 pt-28">
        <AuroraBackground />
        <div className="mx-auto max-w-3xl">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            all projects
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {project.domains.map((domain) => (
              <Badge key={domain} variant="accent">
                {domain}
              </Badge>
            ))}
            <span className="font-mono text-xs text-faint">{project.year}</span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {project.summary}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
            {project.role && <Meta label="Role" value={project.role} />}
            {project.timeline && (
              <Meta label="Timeline" value={project.timeline} />
            )}
            <Meta label="Stack" value={project.stack.join(" · ")} />
          </dl>

          {(project.links?.repo || project.links?.demo) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.links.repo && (
                <ExternalLink
                  href={project.links.repo}
                  icon={<GithubIcon className="size-4" />}
                >
                  Source
                </ExternalLink>
              )}
              {project.links.demo && (
                <ExternalLink href={project.links.demo}>Live demo</ExternalLink>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-14 px-6">
        <CaseStudySection index="01" title="The problem">
          <p className="leading-relaxed text-muted">{caseStudy.problem}</p>
        </CaseStudySection>

        <CaseStudySection index="02" title="Constraints">
          <ul className="space-y-3">
            {caseStudy.constraints.map((constraint) => (
              <li key={constraint} className="flex gap-3 leading-relaxed text-muted">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {constraint}
              </li>
            ))}
          </ul>
        </CaseStudySection>

        <CaseStudySection index="03" title="Architecture">
          <ol className="space-y-4">
            {caseStudy.architecture.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05}>
                <Surface as="li" className="p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
                </Surface>
              </Reveal>
            ))}
          </ol>
        </CaseStudySection>

        <CaseStudySection index="04" title="Decisions & tradeoffs">
          <div className="space-y-4">
            {caseStudy.decisions.map((d, i) => (
              <Reveal key={d.decision} delay={i * 0.05}>
                <Surface className="p-5">
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {d.decision}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent">
                      why{" "}
                    </span>
                    {d.rationale}
                  </p>
                  <p className="mt-2 leading-relaxed text-muted">
                    <span className="font-mono text-xs uppercase tracking-wider text-faint">
                      cost{" "}
                    </span>
                    {d.tradeoff}
                  </p>
                </Surface>
              </Reveal>
            ))}
          </div>
        </CaseStudySection>

        <CaseStudySection index="05" title="Outcomes">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudy.outcomes.map((outcome, i) => (
              <Reveal key={outcome.label} delay={i * 0.05}>
                <Surface className="h-full p-5">
                  <p className="font-display text-2xl font-semibold text-accent">
                    {outcome.value}
                  </p>
                  <p className="mt-1 font-mono text-xs text-foreground">
                    {outcome.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-faint">
                    {outcome.detail}
                  </p>
                </Surface>
              </Reveal>
            ))}
          </div>
        </CaseStudySection>

        <CaseStudySection index="06" title="What I'd do differently">
          <ul className="space-y-3">
            {caseStudy.learnings.map((learning) => (
              <li key={learning} className="flex gap-3 leading-relaxed text-muted">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-border-strong" />
                {learning}
              </li>
            ))}
          </ul>
        </CaseStudySection>

        <NextProject slug={project.slug} />
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs text-faint">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function ExternalLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong"
    >
      {icon}
      {children}
      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

/** Keeps the reader moving instead of dead-ending at the bottom of a case study. */
function NextProject({ slug }: { slug: string }) {
  const pool = projects.filter((p) => p.caseStudy);
  const next = pool[(pool.findIndex((p) => p.slug === slug) + 1) % pool.length];

  if (!next || next.slug === slug) return null;

  return (
    <Link
      href={`/projects/${next.slug}`}
      className="group flex items-center justify-between gap-4 transition-colors hover:border-border-strong hover:bg-surface"
    >
      <div>
        <p className="font-mono text-xs text-faint">next case study</p>
        <p className="mt-1 font-display text-xl font-semibold tracking-tight">
          {next.title}
        </p>
      </div>
      <ArrowUpRight className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </Link>
  );
}
