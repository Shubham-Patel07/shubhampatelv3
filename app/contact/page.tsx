import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PagePlaceholder
      kicker="// contact"
      title="Let's build something"
      description="Open to opportunities and interesting problems in backend, systems, and cloud engineering. Reach out — I read everything."
    />
  );
}
