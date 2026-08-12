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

export type MarqueeItem = {
  name: string;
  /** Key into `lib/data/tech-icons.ts`. Omitted where no mark is available. */
  icon?: string;
};

/**
 * Flat, curated list for the hero marquee ticker.
 *
 * `icon` stays optional on purpose — an entry without one renders as its name
 * alone rather than a broken or invented glyph. (AWS and Java are not in Simple
 * Icons at all; both come from Font Awesome instead — see the generator.)
 */
export const marqueeStack: MarqueeItem[] = [
  { name: "Java", icon: "java" },
  { name: "Go", icon: "go" },
  { name: "Python", icon: "python" },
  { name: "Spring Boot", icon: "springboot" },
  { name: "Kubernetes", icon: "kubernetes" },
  { name: "AWS", icon: "aws" },
  { name: "Terraform", icon: "terraform" },
  { name: "Docker", icon: "docker" },
  { name: "OpenShift", icon: "openshift" },
  { name: "Prometheus", icon: "prometheus" },
  { name: "Grafana", icon: "grafana" },
  { name: "Helm", icon: "helm" },
  { name: "Jenkins", icon: "jenkins" },
  { name: "GitHub Actions", icon: "githubactions" },
  { name: "Linux", icon: "linux" },
];
