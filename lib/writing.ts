import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

/**
 * Filesystem-backed writing index.
 *
 * Frontmatter is read with gray-matter rather than an MDX plugin, so listing
 * posts never has to compile them — the index page reads a dozen small files
 * instead of building a dozen React trees. The MDX body is imported separately
 * by the post route.
 */

const CONTENT_DIR = join(process.cwd(), "content", "writing");

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tag: string;
  /** Hidden from the index; still reachable by direct URL. */
  draft: boolean;
  readingTime: string;
};

function readPostFile(slug: string) {
  return readFileSync(join(CONTENT_DIR, `${slug}.mdx`), "utf8");
}

function toMeta(slug: string, raw: string): PostMeta {
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    date: data.date ? String(data.date).slice(0, 10) : "",
    tag: data.tag ?? "Notes",
    draft: data.draft === true,
    readingTime: readingTime(content).text,
  };
}

/** Newest first. Drafts excluded unless asked for. */
export function getPosts({ includeDrafts = false } = {}): PostMeta[] {
  let files: string[];
  try {
    files = readdirSync(CONTENT_DIR);
  } catch {
    return []; // no content dir yet — an empty index, not a crash
  }

  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      return toMeta(slug, readPostFile(slug));
    })
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): PostMeta | null {
  try {
    return toMeta(slug, readPostFile(slug));
  } catch {
    return null;
  }
}

/** Every tag in use, for the writing index filter. */
export function getTags(posts: PostMeta[]): string[] {
  return [...new Set(posts.map((p) => p.tag))].sort();
}

export function formatPostDate(date: string) {
  if (!date) return "";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
