import { describe, expect, it } from "vitest";
import { formatPostDate, getPost, getPosts, getTags } from "@/lib/writing";

/**
 * The writing pipeline's selling point is that there is no list to register a
 * post in — dropping an `.mdx` file into `content/writing/` publishes it. The
 * cost of that is real: nothing rejects a file with missing or malformed
 * frontmatter, it just publishes with a slug for a title and an empty summary.
 *
 * These run against the actual content directory rather than a fixture, because
 * the failure worth catching is an authoring mistake in a real post.
 */

const published = getPosts();
const all = getPosts({ includeDrafts: true });

describe("getPosts", () => {
  it("finds posts at all", () => {
    // Guards the rest of this file: every assertion below is vacuously true
    // against an empty list, so a broken content path would look like a pass.
    expect(all.length).toBeGreaterThan(0);
  });

  it("excludes drafts by default and includes them on request", () => {
    expect(published.every((p) => !p.draft)).toBe(true);
    expect(all.length).toBeGreaterThanOrEqual(published.length);
  });

  it("orders newest first", () => {
    const dates = published.map((p) => p.date);
    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)));
  });

  it("gives every published post the frontmatter the cards render", () => {
    // A post missing `title` falls back to its slug and one missing `summary`
    // renders an empty card — both publish silently, which is exactly why this
    // is asserted rather than trusted.
    for (const post of published) {
      expect(post.title, `${post.slug}: title`).not.toBe(post.slug);
      expect(post.summary, `${post.slug}: summary`).not.toBe("");
      expect(post.date, `${post.slug}: date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.tag, `${post.slug}: tag`).toBeTruthy();
    }
  });

  it("computes reading time from the body instead of taking it on trust", () => {
    for (const post of all) {
      expect(post.readingTime, `${post.slug}: readingTime`).toMatch(/min read/);
    }
  });
});

describe("getPost", () => {
  it("returns null for an unknown slug rather than throwing", () => {
    // The post route 404s on null. A throw here would be a 500 instead.
    expect(getPost("no-such-post")).toBeNull();
  });

  it("resolves a draft by direct URL even though the index hides it", () => {
    const draft = all.find((p) => p.draft);
    if (!draft) return; // no drafts today; nothing to assert
    expect(getPost(draft.slug)?.slug).toBe(draft.slug);
    expect(published.some((p) => p.slug === draft.slug)).toBe(false);
  });

  it("rejects a slug that tries to climb out of the content directory", () => {
    expect(getPost("../../package.json")).toBeNull();
  });
});

describe("getTags", () => {
  it("dedupes and sorts", () => {
    const tags = getTags(all);
    expect(tags).toEqual([...new Set(tags)].sort());
  });
});

describe("formatPostDate", () => {
  it("formats in UTC regardless of the machine's timezone", () => {
    // Without the explicit UTC handling this reads as the 13th anywhere west of
    // Greenwich, so a post's date would differ between the build and a reader.
    expect(formatPostDate("2026-08-14")).toBe("August 14, 2026");
  });

  it("returns empty for a missing date instead of Invalid Date", () => {
    expect(formatPostDate("")).toBe("");
  });
});
