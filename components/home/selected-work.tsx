import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/ui/reveal";
import { featuredProjects } from "@/lib/data/projects";

export function SelectedWork() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        index="01"
        title="Selected work"
        action={
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-foreground"
          >
            all projects
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.08}>
            <ProjectCard project={project} className="h-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
