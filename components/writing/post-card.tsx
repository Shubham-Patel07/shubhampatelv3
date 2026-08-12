import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPostDate, type PostMeta } from "@/lib/writing";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface/60 p-6 transition-colors hover:border-border-strong hover:bg-surface"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge variant="accent">{post.tag}</Badge>
        {post.draft && <Badge>draft</Badge>}
        <span className="ml-auto shrink-0 font-mono text-xs text-faint">
          {post.readingTime}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight">
        {post.title}
      </h3>
      {post.summary && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {post.summary}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-faint">
          {formatPostDate(post.date)}
        </span>
        <ArrowUpRight className="size-3.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}

/** A piece that isn't written yet — visually quieter, and never a link. */
export function PlannedCard({ title, tag }: { title: string; tag: string }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-dashed border-border bg-surface/30 p-6">
      <div className="flex items-center justify-between">
        <Badge>{tag}</Badge>
        <span className="font-mono text-xs text-faint">soon</span>
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-muted">
        {title}
      </h3>
      <p className="mt-auto pt-6 font-mono text-xs text-faint">
        draft in progress
      </p>
    </div>
  );
}
