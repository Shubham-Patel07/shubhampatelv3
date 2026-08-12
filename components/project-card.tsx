import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <Surface
      as={Link}
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden transition-colors duration-300 hover:border-border-strong hover:bg-surface",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-center justify-between">
        <Badge variant="accent">{project.status}</Badge>
        <span className="font-mono text-xs text-faint">{project.year}</span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
        {project.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {project.summary}
      </p>

      {project.metric && (
        <p className="mt-4 font-mono text-xs text-accent">{project.metric}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] text-faint"
          >
            {tech}
          </span>
        ))}
        {project.stack.length > 4 && (
          <span className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] text-faint">
            +{project.stack.length - 4}
          </span>
        )}
      </div>

      <div className="mt-5 inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors group-hover:text-foreground">
        read case study
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Surface>
  );
}
