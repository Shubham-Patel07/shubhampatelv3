import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <PagePlaceholder
      kicker="// projects"
      title="Selected work & case studies"
      description="Deep case studies — problem, architecture, decisions, and outcomes — across backend systems, infrastructure automation, and Kubernetes observability."
    />
  );
}
