import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vitest's HTML/lcov report. Gitignored, but flat config doesn't read
    // .gitignore, so without this `npm run lint` starts reporting on generated
    // files the moment anyone runs coverage locally.
    "coverage/**",
  ]),
]);

export default eslintConfig;
