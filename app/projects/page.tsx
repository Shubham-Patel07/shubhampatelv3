import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { projects, projectDomains } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Deep case studies — problem, architecture, decisions, and outcomes — across backend systems, infrastructure automation, and Kubernetes observability.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        kicker="// projects"
        title="Selected work & case studies"
        description="Each one is written the way I'd talk through it in a review: the problem, the constraints, what I chose, and what it cost."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <ProjectsGrid projects={projects} domains={projectDomains} />
      </section>
    </>
  );
}
