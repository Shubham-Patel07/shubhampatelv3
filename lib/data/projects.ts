/** One step of the architecture walkthrough on a case study. */
export type ArchitectureStep = { title: string; body: string };

/** An engineering decision, why it was made, and what it cost. */
export type Decision = { decision: string; rationale: string; tradeoff: string };

/** A measured result. `value` is the headline, `detail` the honest context. */
export type Outcome = { value: string; label: string; detail: string };

export type CaseStudy = {
  /** One-paragraph framing of the problem, written for a reader who wasn't there. */
  problem: string;
  /** The constraints that actually shaped the design. */
  constraints: string[];
  architecture: ArchitectureStep[];
  decisions: Decision[];
  outcomes: Outcome[];
  /** What I'd do differently — the section that separates a case study from a brag. */
  learnings: string[];
};

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
  /** Scope of ownership — shown in the case-study header. */
  role?: string;
  timeline?: string;
  links?: { repo?: string; demo?: string };
  caseStudy?: CaseStudy;
};

/**
 * Featured work. Themes confirmed by Shubham (infra automation, K8s
 * observability, backend systems).
 *
 * The case-study *narratives* below describe the real shape of each system, but
 * every hard number is still marked [verify] — replace them with measured values
 * before this site goes in front of a recruiter. Placeholders read as "[verify]"
 * on the page rather than silently rendering an invented figure.
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
    role: "Design, build & operations",
    timeline: "2025",
    caseStudy: {
      problem:
        "Services ran across a multi-tenant Kubernetes fleet with no shared view of health. Each team kept its own dashboards and its own idea of \"broken\", so incidents were usually reported by users rather than detected by monitoring. Debugging meant SSH-ing toward whichever node looked suspicious and reading container logs by hand — and because pods are ephemeral, the evidence was often already gone by the time anyone looked.",
      constraints: [
        "Multi-tenant cluster — one team's noisy metrics must not degrade another's.",
        "Pods are ephemeral; logs and metrics have to outlive the workload that produced them.",
        "Alerting had to be adoptable by teams who did not write it, so conventions mattered more than cleverness.",
        "Retention and cardinality had to fit a fixed storage budget.",
      ],
      architecture: [
        {
          title: "Collection",
          body: "Prometheus scrapes application and infrastructure targets through ServiceMonitor definitions, so onboarding a service is a manifest change rather than a config edit. Node and cluster-level metrics come from node-exporter and kube-state-metrics.",
        },
        {
          title: "Log pipeline",
          body: "A node-level agent ships container logs into Elasticsearch with Kubernetes metadata (namespace, pod, labels) attached at ingest, so a log line can be traced back to the workload and deploy that produced it after the pod is gone.",
        },
        {
          title: "SLO & alert layer",
          body: "Recording rules turn raw counters into per-service availability and latency indicators, and alert rules fire against error-budget burn rather than instantaneous spikes. Alertmanager handles routing, grouping and inhibition so one failing dependency produces one page, not fifty.",
        },
        {
          title: "Presentation",
          body: "Grafana dashboards are templated by service and environment — one dashboard definition serves every team instead of a hand-built copy per service. The whole stack ships as versioned Helm releases, so the platform is reproducible and reviewable like any other code.",
        },
      ],
      decisions: [
        {
          decision: "Alert on error-budget burn rate, not raw thresholds.",
          rationale:
            "Static thresholds either page constantly on healthy noise or stay silent through a slow degradation. Burn rate ties every page to user-visible impact, which is also what makes an alert arguable in a review.",
          tradeoff:
            "Requires defining an SLO per service up front — real work, and a conversation with each team before their alerts mean anything.",
        },
        {
          decision: "Templated dashboards over per-service dashboards.",
          rationale:
            "A single parameterised dashboard means a fix or improvement lands everywhere at once, and every service is read the same way during an incident.",
          tradeoff:
            "Less room for service-specific panels; teams with genuinely unusual workloads needed an escape hatch.",
        },
        {
          decision: "Metadata enrichment at ingest rather than query time.",
          rationale:
            "Attaching pod and namespace labels while the context still exists makes logs searchable after the pod is deleted — the exact moment you need them.",
          tradeoff:
            "Larger documents and a heavier ingest path, paid for with tighter retention on low-value log streams.",
        },
      ],
      outcomes: [
        {
          value: "[verify]",
          label: "MTTR reduction",
          detail:
            "Measure median time-to-resolution across incidents before and after the platform landed.",
        },
        {
          value: "[verify]",
          label: "Services onboarded",
          detail: "Count of workloads reporting metrics and logs through the platform.",
        },
        {
          value: "[verify]",
          label: "Detection coverage",
          detail:
            "Share of incidents caught by alerting rather than reported by a user — the metric that best justifies the work.",
        },
      ],
      learnings: [
        "Dashboards are not observability. The step that changed on-call was defining what \"healthy\" meant per service; the graphs were the easy part.",
        "Alert fatigue is a design failure, not a people problem — grouping and inhibition mattered more than adding rules.",
        "Cardinality is a budget. A single unbounded label on a busy metric can cost more than an entire service's monitoring.",
      ],
    },
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
    role: "Design & implementation",
    timeline: "2025",
    caseStudy: {
      problem:
        "Environments were provisioned by hand from a runbook. The steps were correct on the day they were written and quietly wrong thereafter — staging and production drifted apart, a new environment took days of careful clicking, and nobody could say with confidence what was actually deployed. The failure mode wasn't dramatic; it was that \"works in staging\" had stopped being evidence of anything.",
      constraints: [
        "Existing infrastructure was already running and could not be torn down to be rebuilt cleanly.",
        "Credentials could never touch a developer machine or a repository.",
        "Changes had to be reviewable by people who don't write Terraform daily.",
        "A wrong apply against production had to be difficult, not merely discouraged.",
      ],
      architecture: [
        {
          title: "Modules",
          body: "Infrastructure is expressed as composable Terraform modules — networking, compute, data, IAM — with environments as thin configuration on top. Staging and production differ in sizing and counts, not in structure, which is what keeps them honest.",
        },
        {
          title: "State & isolation",
          body: "Remote state with locking, split per environment so a staging apply can never touch production state. Adopting the running infrastructure meant importing it into state rather than recreating it.",
        },
        {
          title: "Pipeline",
          body: "GitHub Actions runs fmt, validate and a security scan on every pull request, then posts the plan as a comment so a reviewer reads the actual diff instead of trusting the description. Apply runs only on merge, against a protected environment with required approval.",
        },
        {
          title: "Drift detection",
          body: "A scheduled plan runs against every environment and reports non-empty diffs, so out-of-band console changes surface as a notification rather than as a surprise during the next deploy.",
        },
      ],
      decisions: [
        {
          decision: "Plan-on-PR with the output posted to the review.",
          rationale:
            "The plan is the change. Putting it in the review turns infrastructure into something a teammate can actually approve, and catches destructive diffs before they reach an apply.",
          tradeoff:
            "The pipeline needs read access to real cloud state on pull requests, which has to be scoped carefully and kept read-only.",
        },
        {
          decision: "Import existing resources instead of rebuilding.",
          rationale:
            "The systems were live. Importing let the codebase become authoritative incrementally, without a migration event.",
          tradeoff:
            "A slow, unglamorous import phase, and a period where code and reality had to be reconciled by hand.",
        },
        {
          decision: "OIDC federation for CI credentials, no long-lived keys.",
          rationale:
            "Short-lived, workflow-scoped credentials remove the standing secret that is the usual root cause of a cloud breach.",
          tradeoff:
            "More setup complexity up front and a harder path for anyone wanting to run the pipeline locally.",
        },
      ],
      outcomes: [
        {
          value: "[verify]",
          label: "Provisioning time",
          detail: "Time to stand up a full environment, before versus after.",
        },
        {
          value: "~40% [verify]",
          label: "Manual toil reduced",
          detail:
            "Estimate on the card today — replace with hours-per-week recovered, or drop the number.",
        },
        {
          value: "[verify]",
          label: "Drift incidents",
          detail:
            "Out-of-band changes caught by scheduled plans since detection was added.",
        },
      ],
      learnings: [
        "The pipeline mattered more than the Terraform. Code alone doesn't stop drift — enforcing that the only path to production is a reviewed apply does.",
        "Importing running infrastructure is the whole job on a brownfield project; greenfield tutorials skip the part that takes the time.",
        "Making the plan visible in review changed team behaviour faster than any policy did.",
      ],
    },
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
    role: "Backend engineering",
    timeline: "2024",
    caseStudy: {
      problem:
        "The service sat in the middle of a call graph it did not control: upstream clients expected it to stay responsive, downstream dependencies were free to be slow or unavailable. Early versions treated every downstream call as if it would succeed, so a single slow dependency consumed the request threads and turned one degraded system into a full outage. The goal was a service that fails narrowly and predictably instead of all at once.",
      constraints: [
        "Downstream services had no availability guarantee and could not be changed.",
        "Horizontal scaling meant no instance could hold state that mattered.",
        "Clients retry, so every mutating endpoint had to tolerate duplicate delivery.",
        "Operability was a requirement, not a follow-up — a service you can't diagnose isn't finished.",
      ],
      architecture: [
        {
          title: "API layer",
          body: "Versioned REST endpoints with validation at the boundary and a single consistent error contract, so clients can distinguish \"your request was wrong\" from \"try again shortly\" without parsing prose.",
        },
        {
          title: "Resilience",
          body: "Every outbound dependency sits behind a timeout, a bounded retry with backoff and jitter, and a circuit breaker with a defined fallback. Bulkheads keep one saturated dependency from exhausting the pool the whole service shares.",
        },
        {
          title: "Data & idempotency",
          body: "PostgreSQL with schema migrations kept in version control. Mutating endpoints accept an idempotency key so a client retry after a timeout resolves to the original result instead of duplicating work.",
        },
        {
          title: "Runtime",
          body: "Containerised and deployed to Kubernetes with liveness and readiness probes that mean different things — readiness drops the instance out of rotation while it recovers, liveness restarts it only when it's genuinely stuck. Structured logs carry a correlation ID end to end.",
        },
      ],
      decisions: [
        {
          decision: "Circuit breakers with explicit fallbacks on every dependency.",
          rationale:
            "Failing fast with a defined degraded response keeps the service answering while a dependency recovers. Without it, latency propagates upward and the whole call graph goes down together.",
          tradeoff:
            "Every dependency needs a considered answer to \"what do we return when this is down?\" — and some fallbacks are genuinely worse than an error.",
        },
        {
          decision: "Idempotency keys on mutating endpoints.",
          rationale:
            "In a distributed system a timeout tells you nothing about whether the work happened. Making retries safe is the only way clients can retry correctly.",
          tradeoff:
            "Key storage, an expiry policy, and more complexity in the write path — paid on every request to protect against the uncommon one.",
        },
        {
          decision: "Stateless instances, state pushed to the database.",
          rationale:
            "Any instance can serve any request, so scaling is a replica count and losing a pod is uneventful.",
          tradeoff:
            "More load on the datastore, and caching has to be handled deliberately rather than accidentally in process memory.",
        },
      ],
      outcomes: [
        {
          value: "[verify]",
          label: "p99 latency",
          detail: "Steady-state p99, and the same figure with a dependency degraded.",
        },
        {
          value: "[verify]",
          label: "Throughput",
          detail: "Sustained requests per second per instance under load test.",
        },
        {
          value: "[verify]",
          label: "Degraded-mode behaviour",
          detail:
            "What the service does when a downstream is fully unavailable — the number worth quoting in an interview.",
        },
      ],
      learnings: [
        "Timeouts are the foundation. A retry or circuit breaker on top of an unbounded call is decoration — the default \"wait forever\" is what actually causes the outage.",
        "Retries without jitter turn a blip into a thundering herd and make recovery slower than the original fault.",
        "Readiness and liveness probes are not interchangeable; conflating them turns a recoverable slowdown into a restart loop.",
      ],
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Every domain tag in use, for the projects-index filter. */
export const projectDomains = [
  ...new Set(projects.flatMap((p) => p.domains)),
].sort();
