import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Badge } from "@/components/ui/badge";
import { getPost, getPosts, formatPostDate } from "@/lib/writing";
import { siteConfig } from "@/lib/data/site";

// Drafts are included: they're hidden from the index but must still resolve by
// direct URL, which is what makes a draft link shareable for review.
export function generateStaticParams() {
  return getPosts({ includeDrafts: true }).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/writing/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.summary,
    // Drafts shouldn't be indexed by search engines even though the URL works.
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date || undefined,
      url: `${siteConfig.url}/writing/${post.slug}`,
    },
  };
}

export default async function PostPage(props: PageProps<"/writing/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);

  if (!post) notFound();

  // Relative rather than aliased: the bundler builds a context module from the
  // static prefix of this path, which is what lets the slug be dynamic.
  let Content: React.ComponentType;
  try {
    const mod = await import(`../../../content/writing/${slug}.mdx`);
    Content = mod.default;
  } catch {
    notFound();
  }

  return (
    <article className="pb-24">
      <header className="relative overflow-hidden px-6 pb-10 pt-28">
        <AuroraBackground />
        <div className="mx-auto max-w-2xl">
          <Link
            href="/writing"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            all writing
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{post.tag}</Badge>
            {post.draft && <Badge>draft</Badge>}
          </div>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 font-mono text-xs text-faint">
            {formatPostDate(post.date)}
            {post.date && " · "}
            {post.readingTime}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6">
        <Content />

        <div className="mt-16 border-t border-border pt-8">
          <Link
            href="/writing"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            back to all writing
          </Link>
        </div>
      </div>
    </article>
  );
}
