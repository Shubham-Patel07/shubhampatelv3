import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Panel, PanelNotice, StatTile } from "@/components/dashboard/panel";
import { RepoContributions } from "@/components/contributions/repo-contributions";
import { getExternalContributions } from "@/lib/github";

export const metadata: Metadata = {
  title: "Contributions",
  description:
    "Pull requests opened on other people's open-source projects — what was merged, and where.",
};

/** Same hourly cache as the dashboard; this data moves slowly. */
export const revalidate = 3600;

export default async function ContributionsPage() {
  const data = await getExternalContributions();

  return (
    <>
      <PageHeader
        kicker="// contributions"
        title="Open source & community"
        description="Pull requests opened on other people's projects, pulled live from the GitHub API. Merged and unmerged both shown — the ones that didn't land are part of the record too."
      />

      <section className="mx-auto max-w-6xl space-y-6 px-6 pb-24 pt-6">
        {!data ? (
          <Reveal>
            <Panel label="github">
              <PanelNotice title="Couldn't load contributions">
                The GitHub search API didn&apos;t respond — usually its rate
                limit, which is tight for unauthenticated requests. Adding{" "}
                <code className="font-mono text-muted">GITHUB_TOKEN</code> to{" "}
                <code className="font-mono text-muted">.env</code> raises it.
              </PanelNotice>
            </Panel>
          </Reveal>
        ) : data.repoCount === 0 ? (
          <Reveal>
            <Panel label="github">
              <PanelNotice title="No external contributions yet">
                This page lists pull requests opened on repositories owned by
                other people. Your own repos live on the Dashboard instead.
              </PanelNotice>
            </Panel>
          </Reveal>
        ) : (
          <>
            <Reveal>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatTile
                  value={data.totalPRs}
                  label="Pull requests opened"
                  hint="on other people's repos"
                />
                <StatTile
                  value={data.mergedPRs}
                  label="Merged"
                  hint={`${Math.round((data.mergedPRs / data.totalPRs) * 100)}% of those opened`}
                />
                <StatTile value={data.repoCount} label="Projects contributed to" />
              </div>
            </Reveal>

            <div className="space-y-4">
              {data.repos.map((repo, i) => (
                <Reveal key={repo.full} delay={Math.min(i, 4) * 0.05}>
                  <RepoContributions repo={repo} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
