import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PagePlaceholder
      kicker="// about"
      title="A complete software engineer"
      description="From backend and distributed systems to the cloud infrastructure underneath — the story of how I build, ship, and operate software end to end."
    />
  );
}
