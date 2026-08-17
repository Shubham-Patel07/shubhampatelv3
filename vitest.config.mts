import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    // Mirrors the `@/*` path in tsconfig.json. Declared by hand rather than via
    // vite-tsconfig-paths — one alias isn't worth another dependency.
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    // `node`, not `jsdom`. Nothing under test touches the DOM: components are
    // asserted through `renderToStaticMarkup`, which is what the server does
    // for these anyway, and a DOM environment would only add a dependency and
    // start-up cost for output we never query.
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      // Only the modules with real logic. Route files, layouts and the design
      // primitives are covered by `next build`, and counting them would inflate
      // the denominator with files no unit test should be asserting on.
      //
      // `components/ui/stack-icon.tsx` is deliberately *not* listed even though
      // tests/stack-icon.test.tsx exercises it 28 times. v8 coverage doesn't
      // report it under any glob — every other file in components/ui/ shows up,
      // it alone doesn't, and it's the only one a test file imports directly.
      // Listing it would print a pattern that matches nothing. The coverage it
      // does produce is visible indirectly: tech-logo.tsx only reaches 75%
      // because StackIcon renders it.
      include: ["lib/**/*.ts"],
      exclude: ["lib/data/**"],
    },
  },
});
