import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data/site";
import { projects } from "@/lib/data/projects";
import { getPosts } from "@/lib/writing";

/**
 * Generated from the same data the pages render from, so a new case study or
 * post appears here automatically — a hand-maintained sitemap goes stale the
 * first time someone forgets.
 *
 * Drafts are excluded: `getPosts()` filters them by default, and they're marked
 * noindex on the page anyway.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  // Written out rather than mapped: spreading through `.map()` widens
  // `changeFrequency` from its literal union to `string` and fails the build.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/dashboard`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
    { url: `${base}/contributions`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const caseStudies: MetadataRoute.Sitemap = projects
    .filter((p) => p.caseStudy)
    .map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    }));

  const posts: MetadataRoute.Sitemap = getPosts().map((post) => ({
    url: `${base}/writing/${post.slug}`,
    lastModified: post.date ? new Date(`${post.date}T00:00:00Z`) : now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudies, ...posts];
}
