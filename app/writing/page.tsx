import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { PostCard, PlannedCard } from "@/components/writing/post-card";
import { getPosts } from "@/lib/writing";
import { plannedPosts } from "@/lib/data/writing-plan";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays on distributed systems, backend design, reliability, and the infrastructure that keeps software running in production.",
};

export default function WritingPage() {
  const posts = getPosts();

  return (
    <>
      <PageHeader
        kicker="// writing"
        title="Notes on systems & software"
        description="Distributed systems, backend design, reliability, and the infrastructure that keeps software running in production."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-6">
        {posts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.06}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <p className="font-mono text-sm text-muted">
                Nothing published yet.
              </p>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-faint">
                Drop an <code className="font-mono">.mdx</code> file into{" "}
                <code className="font-mono">content/writing/</code> and it shows
                up here — no list to register it in.
              </p>
            </div>
          </Reveal>
        )}

        {plannedPosts.length > 0 && (
          <div className="mt-20">
            <SectionHeading index="01" title="On the way" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {plannedPosts.map((post, i) => (
                <Reveal key={post.title} delay={i * 0.06}>
                  <PlannedCard title={post.title} tag={post.tag} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
