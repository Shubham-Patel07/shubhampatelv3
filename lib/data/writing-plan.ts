export type PlannedPost = { title: string; tag: string };

/**
 * Pieces Shubham intends to write, shown as clearly-labelled "soon" cards.
 *
 * Shared by the home teaser and the writing index so the two can't drift.
 * Delete an entry once the real post lands in `content/writing/` — nothing
 * cross-references them, they're just intent.
 */
export const plannedPosts: PlannedPost[] = [
  { title: "Designing SLOs that actually page you", tag: "SRE" },
  { title: "Kubernetes observability from first principles", tag: "Observability" },
  { title: "Taming cloud infra with reusable Terraform modules", tag: "DevOps" },
];
