export type StackGroup = { label: string; items: string[] };

/**
 * Software-first ordering: languages and backend/systems lead; cloud, DevOps and
 * observability follow as range — not the headline identity.
 */
export const stackGroups: StackGroup[] = [
  { label: "Languages", items: ["Java", "Python", "Go", "Bash", "SQL"] },
  {
    label: "Backend & Systems",
    items: [
      "Spring Boot",
      "REST APIs",
      "Microservices",
      "Distributed Systems",
      "System Design",
      "Databases",
    ],
  },
  {
    label: "Cloud & Infra",
    items: ["AWS", "Kubernetes", "Docker", "OpenShift", "Terraform", "Linux"],
  },
  {
    label: "DevOps & CI/CD",
    items: ["Jenkins", "GitLab CI", "GitHub Actions", "Helm", "IaC"],
  },
  {
    label: "Observability & SRE",
    items: [
      "Prometheus",
      "Grafana",
      "ELK / Kibana",
      "Alertmanager",
      "CloudWatch",
      "SLIs / SLOs",
    ],
  },
];

/** Flat, curated list for the hero marquee ticker. */
export const marqueeStack: string[] = [
  "Java",
  "Go",
  "Python",
  "Spring Boot",
  "Kubernetes",
  "AWS",
  "Terraform",
  "Docker",
  "OpenShift",
  "Prometheus",
  "Grafana",
  "Helm",
  "Jenkins",
  "GitHub Actions",
  "Linux",
];
