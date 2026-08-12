import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores stray lockfiles above the repo.
  turbopack: {
    root: import.meta.dirname,
  },
  // `.mdx` files live in `content/`, not `app/`, so they're imported as
  // components rather than becoming routes on their own.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // Without this, MDX has no concept of frontmatter: the `---` fences
      // compile to a horizontal rule and the YAML keys render as body text at
      // the top of every post. gray-matter reads that block for metadata; this
      // is what keeps it out of the rendered article.
      "remark-frontmatter",
      // GitHub-flavoured markdown — tables, strikethrough, task lists.
      "remark-gfm",
    ],
    // Plugin names are strings on purpose: Turbopack serializes this config to
    // Rust and can't accept imported functions.
  } as never,
});

export default withMDX(nextConfig);
