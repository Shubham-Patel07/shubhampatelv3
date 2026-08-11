export type Project = {
  slug: string;
  title: string;
  summary: string;
  /** Domain tags used for filtering on the projects index. */
  domains: string[];
  stack: string[];
  year: string;
  /** Short status/category chip. */
  status: string;
  /** Headline outcome metric, shown on cards. */
  metric?: string;
  featured: boolean;
  links?: { repo?: string; demo?: string };
};

/**
 * Featured work. Themes confirmed by Shubham (infra automation, K8s
 * observability, backend systems). Specific repos/metrics are marked [verify]
 * and refined with real detail as case studies are authored in Phase 4.
 */
export const projects: Project[] = [
  {
    slug: "k8s-observability",
    title: "Kubernetes Observability Platform",
    summary:
      "End-to-end observability for a Kubernetes fleet — metrics, logs and alerting unified into SLO-driven dashboards so failures surface before users feel them.",
    domains: ["Observability", "Cloud", "SRE"],
    stack: ["Kubernetes", "Prometheus", "Grafana", "ELK", "Alertmanager", "Helm"],
    year: "2025",
    status: "Case study",
    metric: "MTTR ↓ significantly", // [verify] real number
    featured: true,
  },
  {
    slug: "infra-automation",
    title: "Infrastructure Automation Pipeline",
    summary:
      "Turned manual, error-prone provisioning into reproducible infrastructure-as-code with CI/CD — environments spun up in minutes, drift eliminated, toil cut.",
    domains: ["DevOps", "Cloud", "Automation"],
    stack: ["Terraform", "AWS", "GitHub Actions", "Docker", "Bash"],
    year: "2025",
    status: "Case study",
    metric: "Manual toil ↓ ~40%", // [verify]
    featured: true,
  },
  {
    slug: "distributed-backend",
    title: "Resilient Backend Service",
    summary:
      "A scalable backend service designed for production: clean APIs, resilient failure handling, and the operational tooling to run it reliably at scale.",
    domains: ["Backend", "Systems", "Distributed Systems"],
    stack: ["Java", "Spring Boot", "Docker", "Kubernetes", "PostgreSQL"],
    year: "2024",
    status: "Case study",
    metric: "Built to scale horizontally",
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
