"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/utils";

const ALL = "All";

export function ProjectsGrid({
  projects,
  domains,
}: {
  projects: Project[];
  domains: string[];
}) {
  const [active, setActive] = useState(ALL);
  const reduced = useReducedMotion();

  const filtered = useMemo(
    () =>
      active === ALL
        ? projects
        : projects.filter((p) => p.domains.includes(active)),
    [projects, active],
  );

  const filters = [ALL, ...domains];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by domain"
        className="flex flex-wrap gap-2"
      >
        {filters.map((domain) => {
          const isActive = domain === active;
          const count =
            domain === ALL
              ? projects.length
              : projects.filter((p) => p.domains.includes(domain)).length;

          return (
            <button
              key={domain}
              type="button"
              onClick={() => setActive(domain)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                isActive
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border text-muted hover:border-border-strong hover:text-foreground",
              )}
            >
              {domain}
              <span className={isActive ? "text-accent/60" : "text-faint"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} project{filtered.length === 1 ? "" : "s"} shown
      </p>

      <motion.div layout={!reduced} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((project) => (
            <motion.div
              key={project.slug}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={project} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-10 font-mono text-sm text-faint">
          No projects tagged “{active}” yet.
        </p>
      )}
    </div>
  );
}
