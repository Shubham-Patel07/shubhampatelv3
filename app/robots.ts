import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Drafts already send `noindex` from generateMetadata, but they're
      // reachable by URL by design — belt and braces so a shared draft link
      // never turns into a search result.
      disallow: ["/writing/sample-post"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
