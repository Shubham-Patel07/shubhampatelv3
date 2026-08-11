import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Contributions" };

export default function ContributionsPage() {
  return (
    <PagePlaceholder
      kicker="// contributions"
      title="Open source & community"
      description="Contributions to open-source projects and the tools I rely on — giving back to the ecosystem I build on."
    />
  );
}
