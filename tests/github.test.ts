import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getContributionCalendar,
  getExternalContributions,
  getGithubStats,
} from "@/lib/github";

/**
 * The README claims two things about this module:
 *
 *   "Every call resolves to `null` or a status rather than throwing, so a rate
 *    limit degrades one panel, not the route"
 *
 * and that the UI can tell *"not configured"* apart from *"request failed"*.
 *
 * Both are contracts, not implementation details — `next build` prerenders
 * /dashboard and /contributions, so a throw here doesn't blank a panel, it
 * fails the build. These tests exist to keep that honest.
 */

const ok = (body: unknown) => ({ ok: true, json: async () => body });
const fail = (status = 403) => ({ ok: false, status, json: async () => ({}) });

/** Routes a stubbed fetch by URL. Both user URLs contain `/users/`. */
function stubFetch(handler: (url: string) => unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => handler(String(input))),
  );
}

beforeEach(() => {
  // A real token in the developer's shell would otherwise decide the outcome of
  // the no-token test. Every case sets what it needs explicitly.
  delete process.env.GITHUB_TOKEN;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("getGithubStats", () => {
  it("resolves null when GitHub refuses the request", async () => {
    stubFetch(() => fail(403));
    await expect(getGithubStats()).resolves.toBeNull();
  });

  it("resolves null when the network is gone, rather than rejecting", async () => {
    stubFetch(() => {
      throw new TypeError("fetch failed");
    });
    await expect(getGithubStats()).resolves.toBeNull();
  });

  it("resolves null when the repos payload isn't a list", async () => {
    // A rate-limited GitHub answers 200 with `{ message: "API rate limit ..." }`.
    // Mapping over that would throw, so the array check is load-bearing.
    stubFetch((url) =>
      url.includes("/repos?")
        ? ok({ message: "API rate limit exceeded" })
        : ok({ login: "x" }),
    );
    await expect(getGithubStats()).resolves.toBeNull();
  });

  it("excludes forks and ranks what's left", async () => {
    stubFetch((url) =>
      url.includes("/repos?")
        ? ok([
            {
              name: "forked",
              fork: true,
              stargazers_count: 900,
              language: "Ruby",
              pushed_at: "2026-01-01T00:00:00Z",
              html_url: "u",
            },
            {
              name: "small",
              fork: false,
              stargazers_count: 2,
              language: "Go",
              pushed_at: "2026-01-02T00:00:00Z",
              html_url: "u",
            },
            {
              name: "big",
              fork: false,
              stargazers_count: 40,
              language: "Go",
              pushed_at: "2026-01-03T00:00:00Z",
              html_url: "u",
            },
          ])
        : ok({
            login: "shubham",
            name: "Shubham",
            followers: 10,
            following: 3,
            public_repos: 12,
            created_at: "2020-01-01T00:00:00Z",
            html_url: "u",
          }),
    );

    const stats = await getGithubStats();

    // 900 stars on a fork are someone else's; counting them would be a lie.
    expect(stats?.totalStars).toBe(42);
    expect(stats?.topRepos.map((r) => r.name)).toEqual(["big", "small"]);
    expect(stats?.topLanguages).toEqual([{ name: "Go", count: 2 }]);
  });
});

describe("getExternalContributions", () => {
  const pr = (repo: string, merged: boolean, number: number) => ({
    title: `PR ${number}`,
    html_url: `https://github.com/${repo}/pull/${number}`,
    number,
    state: merged ? "closed" : "open",
    created_at: `2026-0${number}-01T00:00:00Z`,
    repository_url: `https://api.github.com/repos/${repo}`,
    pull_request: { merged_at: merged ? "2026-01-05T00:00:00Z" : null },
  });

  it("resolves null on a failed search", async () => {
    stubFetch(() => fail(422));
    await expect(getExternalContributions()).resolves.toBeNull();
  });

  it("drops PRs raised against the author's own repos", async () => {
    // The page is about contributions to *other people's* projects; his own
    // repos are already the Dashboard's subject.
    stubFetch(() =>
      ok({
        items: [
          pr("OWASP/wrongsecrets", true, 1),
          pr("Shubham-Patel07/shubhampatelv3", true, 2),
        ],
      }),
    );

    const result = await getExternalContributions();

    expect(result?.totalPRs).toBe(1);
    expect(result?.repos.map((r) => r.full)).toEqual(["OWASP/wrongsecrets"]);
  });

  it("counts merged separately from closed-unmerged", async () => {
    // Merged vs. closed-but-not-merged is the entire point of the page, so a
    // closed PR must never be counted as a landed contribution.
    stubFetch(() =>
      ok({
        items: [
          pr("OWASP/wrongsecrets", true, 1),
          pr("OWASP/wrongsecrets", false, 2),
          pr("kubernetes/kubernetes", true, 3),
        ],
      }),
    );

    const result = await getExternalContributions();

    expect(result?.totalPRs).toBe(3);
    expect(result?.mergedPRs).toBe(2);
    expect(result?.repoCount).toBe(2);
    // Most merged first.
    expect(result?.repos[0].full).toBe("OWASP/wrongsecrets");
    expect(result?.repos[0].merged).toBe(1);
  });
});

describe("getContributionCalendar", () => {
  it("reports no-token as its own status, not an error", async () => {
    // This is the distinction the dashboard UI renders differently: "add a
    // token" and "GitHub is down" need different reactions from the reader.
    stubFetch(() => {
      throw new Error("should never be called without a token");
    });

    await expect(getContributionCalendar()).resolves.toEqual({
      status: "no-token",
    });
  });

  it("reports error when the request fails", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    stubFetch(() => fail(401));
    await expect(getContributionCalendar()).resolves.toEqual({
      status: "error",
    });
  });

  it("reports error when GraphQL answers 200 with no calendar", async () => {
    // GraphQL returns 200 with an `errors` array for a bad token, so `res.ok`
    // alone doesn't mean there's data.
    vi.stubEnv("GITHUB_TOKEN", "t");
    stubFetch(() => ok({ errors: [{ message: "Bad credentials" }] }));
    await expect(getContributionCalendar()).resolves.toEqual({
      status: "error",
    });
  });

  it("reports error instead of throwing when the request blows up", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    stubFetch(() => {
      throw new TypeError("fetch failed");
    });
    await expect(getContributionCalendar()).resolves.toEqual({
      status: "error",
    });
  });

  it("flattens weeks and floors maxCount at 1", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    stubFetch(() =>
      ok({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 0,
                weeks: [
                  {
                    contributionDays: [
                      { date: "2026-01-01", contributionCount: 0 },
                    ],
                  },
                ],
              },
            },
          },
        },
      }),
    );

    const result = await getContributionCalendar();

    expect(result.status).toBe("ok");
    // A zero-contribution year must not divide by zero when the heatmap scales
    // each day against the busiest one.
    if (result.status === "ok") expect(result.calendar.maxCount).toBe(1);
  });
});
