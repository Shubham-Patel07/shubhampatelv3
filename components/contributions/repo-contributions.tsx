import { ArrowUpRight, GitMerge, GitPullRequest, GitPullRequestClosed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import type { ContributedRepo } from "@/lib/github";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * One repository and every PR opened against it.
 *
 * State is icon + label, never colour alone — "merged" and "closed unmerged"
 * are the distinction that actually matters on this page and they must survive
 * a greyscale print or a colourblind reader.
 */
export function RepoContributions({ repo }: { repo: ContributedRepo }) {
  return (
    <Surface>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex max-w-full items-center gap-2"
          >
            <span className="truncate font-display text-lg font-semibold tracking-tight">
              <span className="text-muted">{repo.owner}/</span>
              {repo.name}
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          </a>
          <p className="mt-1 font-mono text-xs text-faint">
            {repo.total} pull request{repo.total === 1 ? "" : "s"}
            {repo.merged > 0 && ` · ${repo.merged} merged`}
          </p>
        </div>

        {repo.merged > 0 && (
          <Badge variant="accent">
            <GitMerge className="size-3" />
            {repo.merged} merged
          </Badge>
        )}
      </div>

      <ul className="mt-5 space-y-1">
        {repo.prs.map((pr) => (
          <li key={pr.url}>
            <a
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2"
            >
              {pr.merged ? (
                <GitMerge className="mt-0.5 size-4 shrink-0 text-accent" />
              ) : pr.state === "open" ? (
                <GitPullRequest className="mt-0.5 size-4 shrink-0 text-muted" />
              ) : (
                <GitPullRequestClosed className="mt-0.5 size-4 shrink-0 text-faint" />
              )}

              <span className="min-w-0 flex-1 text-sm leading-relaxed text-muted transition-colors group-hover:text-foreground">
                {pr.title}
              </span>

              <span className="shrink-0 font-mono text-xs text-faint">
                {formatDate(pr.createdAt)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Surface>
  );
}
