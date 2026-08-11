import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores stray lockfiles above the repo.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
