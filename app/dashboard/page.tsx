import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <PagePlaceholder
      kicker="// dashboard"
      title="Live engineering metrics"
      description="A live look at GitHub activity, contribution graphs, and coding hours — a real-time pulse of what I'm building."
    />
  );
}
