import type { Metadata } from "next";
import { ArrowUpRight, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { GithubIcon } from "@/components/icons";
import { TechLogo } from "@/components/ui/tech-logo";
import { ContributionGraph } from "@/components/dashboard/contribution-graph";
import { Panel, PanelNotice, StatTile } from "@/components/dashboard/panel";
import { getGithubStats, getContributionCalendar } from "@/lib/github";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "A live look at GitHub activity, contribution graph, and the languages I actually write.",
};

/** Rebuild hourly — the underlying fetches carry the same revalidate. */
export const revalidate = 3600;

const languageIcons: Record<string, string> = {
  Java: "java",
  Python: "python",
  Go: "go",
  Shell: "linux",
  Dockerfile: "docker",
  HCL: "terraform",
};

export default async function DashboardPage() {
  // Independent sources: one failing must not blank the other.
  const [stats, calendar] = await Promise.all([
    getGithubStats(),
    getContributionCalendar(),
  ]);

  return (
    <>
      <PageHeader
        kicker="// dashboard"
        title="Live engineering metrics"
        description="Pulled from the GitHub API on a one-hour cache. Nothing here is hand-maintained — if it's wrong, the API says so too."
      />

      <section className="mx-auto max-w-6xl space-y-6 px-6 pb-24 pt-6">
        {stats ? (
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile value={stats.profile.publicRepos} label="Public repos" />
              <StatTile
                value={stats.totalStars}
                label="Stars earned"
                hint="across owned repos"
              />
              <StatTile value={stats.profile.followers} label="Followers" />
              <StatTile
                value={new Date(stats.profile.createdAt).getFullYear()}
                label="On GitHub since"
              />
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <Panel label="github">
              <PanelNotice title="GitHub stats unavailable">
                The public API didn&apos;t respond — usually the unauthenticated
                rate limit (60 requests/hour per IP). Adding{" "}
                <code className="font-mono text-muted">GITHUB_TOKEN</code> to{" "}
                <code className="font-mono text-muted">.env.local</code> raises
                it to 5,000.
              </PanelNotice>
            </Panel>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <Panel
            label="contributions"
            action={
              <a
                href={`https://github.com/${siteConfig.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
              >
                <GithubIcon className="size-3.5 shrink-0" />
                profile
                <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            }
          >
            {calendar.status === "ok" ? (
              <ContributionGraph calendar={calendar.calendar} />
            ) : calendar.status === "no-token" ? (
              <PanelNotice title="Contribution graph not configured">
                GitHub only exposes the contribution calendar through its
                GraphQL API, which requires authentication — there is no public
                REST equivalent. Add a read-only{" "}
                <code className="font-mono text-muted">GITHUB_TOKEN</code> to{" "}
                <code className="font-mono text-muted">.env.local</code> and this
                panel fills in.
              </PanelNotice>
            ) : (
              <PanelNotice title="Couldn't load the contribution graph">
                The GraphQL request failed. Check that{" "}
                <code className="font-mono text-muted">GITHUB_TOKEN</code> is
                valid and hasn&apos;t expired.
              </PanelNotice>
            )}
          </Panel>
        </Reveal>

        {stats && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal delay={0.1}>
              <Panel label="languages" className="h-full">
                {stats.topLanguages.length > 0 ? (
                  <ul className="space-y-3">
                    {stats.topLanguages.map((lang) => {
                      const share =
                        (lang.count /
                          stats.topLanguages.reduce((s, l) => s + l.count, 0)) *
                        100;
                      return (
                        <li key={lang.name}>
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="flex min-w-0 items-center gap-2">
                              <TechLogo
                                name={languageIcons[lang.name]}
                                className="size-3.5 text-faint"
                              />
                              <span className="truncate text-foreground">
                                {lang.name}
                              </span>
                            </span>
                            <span className="shrink-0 font-mono text-xs text-faint">
                              {lang.count} repo{lang.count === 1 ? "" : "s"}
                            </span>
                          </div>
                          {/* Single-series magnitude: one hue, no legend —
                              the row label names it. */}
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <PanelNotice title="No languages detected yet" />
                )}
              </Panel>
            </Reveal>

            <Reveal delay={0.15}>
              <Panel label="recent repos" className="h-full">
                <ul className="space-y-3">
                  {stats.topRepos.map((repo) => (
                    <li key={repo.name}>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-xl border border-border px-4 py-3 transition-colors hover:border-border-strong hover:bg-surface-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
                            {repo.name}
                          </span>
                          {repo.stars > 0 && (
                            <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-faint">
                              <Star className="size-3" />
                              {repo.stars}
                            </span>
                          )}
                          <ArrowUpRight className="size-3.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        {repo.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                            {repo.description}
                          </p>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
          </div>
        )}
      </section>
    </>
  );
}
