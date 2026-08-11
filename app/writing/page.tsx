import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Writing" };

export default function WritingPage() {
  return (
    <PagePlaceholder
      kicker="// writing"
      title="Notes on systems & software"
      description="Essays on distributed systems, backend design, reliability, and the infrastructure that keeps software running in production."
    />
  );
}
