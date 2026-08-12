import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { PostCard, PlannedCard } from "@/components/writing/post-card";
import { getPosts } from "@/lib/writing";
import { plannedPosts } from "@/lib/data/writing-plan";

export function WritingTeaser() {
  // Real posts lead; planned titles fill the row only while there aren't three.
  const posts = getPosts().slice(0, 3);
  const planned = plannedPosts.slice(0, Math.max(0, 3 - posts.length));

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        index="03"
        title="Writing"
        action={
          <Link
            href="/writing"
            className="group inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-foreground"
          >
            all writing
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.08}>
            <PostCard post={post} />
          </Reveal>
        ))}
        {planned.map((post, i) => (
          <Reveal key={post.title} delay={(posts.length + i) * 0.08}>
            <PlannedCard title={post.title} tag={post.tag} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
