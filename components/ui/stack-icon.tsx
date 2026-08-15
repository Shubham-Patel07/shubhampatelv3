import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BellRing,
  Boxes,
  Database,
  FileCode2,
  Network,
  Table2,
  Target,
  Webhook,
  Workflow,
} from "lucide-react";
import { TechLogo } from "@/components/ui/tech-logo";
import { cn } from "@/lib/utils";

/**
 * Resolves a `lib/data/stack.ts` item to a glyph.
 *
 * Two kinds of entry live in that list and they can't be served the same way:
 *
 * - **Products** have a real brand mark, generated into `lib/data/tech-icons.ts`.
 * - **Concepts** don't. There is no logo for "Microservices" or "SLIs / SLOs",
 *   so they get a generic lucide glyph. Borrowing an unrelated vendor's mark to
 *   fill the gap was the one option ruled out — it would imply a tool that
 *   isn't being claimed.
 *
 * Keys are the exact display strings from `stackGroups`, so a renamed item
 * surfaces as a missing icon rather than silently mapping to the wrong one.
 */
const brandKey: Record<string, string> = {
  Java: "java",
  Python: "python",
  Go: "go",
  Bash: "bash",
  "Spring Boot": "springboot",
  AWS: "aws",
  Kubernetes: "kubernetes",
  Docker: "docker",
  OpenShift: "openshift",
  Terraform: "terraform",
  Linux: "linux",
  Jenkins: "jenkins",
  "GitLab CI": "gitlab",
  "GitHub Actions": "githubactions",
  Helm: "helm",
  Prometheus: "prometheus",
  Grafana: "grafana",
  "ELK / Kibana": "elasticstack",
};

const conceptIcon: Record<string, LucideIcon> = {
  SQL: Table2,
  "REST APIs": Webhook,
  Microservices: Boxes,
  "Distributed Systems": Network,
  "System Design": Workflow,
  Databases: Database,
  IaC: FileCode2,
  Alertmanager: BellRing,
  CloudWatch: Activity,
  "SLIs / SLOs": Target,
};

export function StackIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const brand = brandKey[name];
  if (brand) return <TechLogo name={brand} className={className} />;

  const Concept = conceptIcon[name];
  if (!Concept) return null;

  return (
    <Concept
      aria-hidden
      // Sized a hair above the 16px brand glyphs, and kept at full stroke
      // weight. A stroked outline carries less ink than a filled mark and reads
      // a size smaller at identical dimensions — the same mismatch that made
      // `components/icons.tsx` necessary instead of lucide's own brand icons.
      strokeWidth={2}
      className={cn("size-[1.0625rem] shrink-0", className)}
    />
  );
}
