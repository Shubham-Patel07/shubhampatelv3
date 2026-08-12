import { siteConfig } from "@/lib/data/site";

/**
 * GitHub data for the Dashboard.
 *
 * Two access levels, deliberately:
 * - Profile and repo stats come from the **public REST API** and work with no
 *   credentials at all (60 requests/hour/IP, which ISR keeps us far under).
 * - The contribution calendar is **GraphQL-only and requires a token**. There is
 *   no public REST equivalent — so without `GITHUB_TOKEN` that one panel reports
 *   that it's unconfigured instead of the whole page failing.
 *
 * Every function resolves to `null` on any failure. A rate-limited or offline
 * GitHub should degrade one panel, never break the build or the route.
 */

const API = "https://api.github.com";
const REVALIDATE = 60 * 60; // an hour — this data does not move fast

const username = process.env.GITHUB_USERNAME || siteConfig.githubUsername;

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type GithubProfile = {
  login: string;
  name: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  htmlUrl: string;
};

export type GithubRepo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
};

export type GithubStats = {
  profile: GithubProfile;
  totalStars: number;
  topLanguages: { name: string; count: number }[];
  topRepos: GithubRepo[];
};

export async function getGithubStats(): Promise<GithubStats | null> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${API}/users/${username}`, {
        headers: headers(),
        next: { revalidate: REVALIDATE },
      }),
      fetch(`${API}/users/${username}/repos?per_page=100&sort=pushed`, {
        headers: headers(),
        next: { revalidate: REVALIDATE },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const repos: unknown = await reposRes.json();
    if (!Array.isArray(repos)) return null;

    // Forks inflate every count here and none of them are his work.
    const owned = repos.filter((r) => !r.fork);

    const mapped: GithubRepo[] = owned.map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      language: r.language,
      pushedAt: r.pushed_at,
    }));

    const languageCounts = new Map<string, number>();
    for (const repo of mapped) {
      if (!repo.language) continue;
      languageCounts.set(
        repo.language,
        (languageCounts.get(repo.language) ?? 0) + 1,
      );
    }

    return {
      profile: {
        login: user.login,
        name: user.name,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        publicRepos: user.public_repos ?? 0,
        createdAt: user.created_at,
        htmlUrl: user.html_url,
      },
      totalStars: mapped.reduce((sum, r) => sum + r.stars, 0),
      topLanguages: [...languageCounts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
      topRepos: [...mapped]
        .sort((a, b) => b.stars - a.stars || b.pushedAt.localeCompare(a.pushedAt))
        .slice(0, 4),
    };
  } catch {
    return null;
  }
}

export type ExternalPR = {
  title: string;
  url: string;
  number: number;
  state: "open" | "closed";
  merged: boolean;
  createdAt: string;
};

export type ContributedRepo = {
  /** "owner/name" */
  full: string;
  owner: string;
  name: string;
  url: string;
  total: number;
  merged: number;
  prs: ExternalPR[];
};

export type ExternalContributions = {
  totalPRs: number;
  mergedPRs: number;
  repoCount: number;
  repos: ContributedRepo[];
};

/**
 * Pull requests opened on **other people's** repositories.
 *
 * Uses the search API, which is the only endpoint that answers "everything this
 * person authored, anywhere". PRs against Shubham's own repos are filtered out —
 * they're already represented by the Dashboard, and they aren't contributions to
 * anyone else's project.
 *
 * Search is capped at 100 results per page; if the total ever exceeds that,
 * paginate here rather than silently truncating.
 */
export async function getExternalContributions(): Promise<ExternalContributions | null> {
  try {
    const q = encodeURIComponent(`author:${username} type:pr`);
    const res = await fetch(
      `${API}/search/issues?q=${q}&per_page=100&sort=created&order=desc`,
      { headers: headers(), next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) return null;

    const json = await res.json();
    const items: unknown[] = json?.items ?? [];
    const mine = username.toLowerCase();

    const byRepo = new Map<string, ContributedRepo>();
    let totalPRs = 0;
    let mergedPRs = 0;

    for (const raw of items) {
      const item = raw as {
        title: string;
        html_url: string;
        number: number;
        state: "open" | "closed";
        created_at: string;
        repository_url: string;
        pull_request?: { merged_at: string | null };
      };

      const full = item.repository_url.split("/repos/")[1];
      if (!full) continue;
      const [owner, name] = full.split("/");
      if (!owner || !name || owner.toLowerCase() === mine) continue;

      const merged = Boolean(item.pull_request?.merged_at);
      totalPRs += 1;
      if (merged) mergedPRs += 1;

      const entry = byRepo.get(full) ?? {
        full,
        owner,
        name,
        url: `https://github.com/${full}`,
        total: 0,
        merged: 0,
        prs: [],
      };
      entry.total += 1;
      if (merged) entry.merged += 1;
      entry.prs.push({
        title: item.title,
        url: item.html_url,
        number: item.number,
        state: item.state,
        merged,
        createdAt: item.created_at,
      });
      byRepo.set(full, entry);
    }

    const repos = [...byRepo.values()].sort(
      (a, b) => b.merged - a.merged || b.total - a.total,
    );
    for (const r of repos) {
      r.prs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return { totalPRs, mergedPRs, repoCount: repos.length, repos };
  } catch {
    return null;
  }
}

export type ContributionDay = { date: string; count: number };
export type ContributionCalendar = {
  total: number;
  /** Columns of the heatmap; each week runs Sunday → Saturday. */
  weeks: ContributionDay[][];
  maxCount: number;
};

/** Distinguishes "not set up" from "tried and failed" so the UI can say which. */
export type CalendarResult =
  | { status: "ok"; calendar: ContributionCalendar }
  | { status: "no-token" }
  | { status: "error" };

export async function getContributionCalendar(): Promise<CalendarResult> {
  if (!process.env.GITHUB_TOKEN) return { status: "no-token" };

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays { date contributionCount }
            }
          }
        }
      }
    }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: REVALIDATE },
    });

    if (!res.ok) return { status: "error" };

    const json = await res.json();
    const cal =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return { status: "error" };

    const weeks: ContributionDay[][] = cal.weeks.map(
      (w: { contributionDays: { date: string; contributionCount: number }[] }) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
        })),
    );

    return {
      status: "ok",
      calendar: {
        total: cal.totalContributions ?? 0,
        weeks,
        maxCount: Math.max(1, ...weeks.flat().map((d) => d.count)),
      },
    };
  } catch {
    return { status: "error" };
  }
}
