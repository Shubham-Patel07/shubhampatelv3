import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Prose styles for MDX content. Required at the project root by the App Router.
 *
 * Written as explicit component overrides rather than a typography plugin, so
 * article text uses the same tokens as the rest of the site and can't drift
 * from it.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="mt-12 scroll-mt-24 font-display text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 scroll-mt-24 font-display text-xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mt-5 leading-relaxed text-muted">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mt-5 space-y-2 pl-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-5 text-muted">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed text-muted marker:text-accent">
        {children}
      </li>
    ),
    a: ({ href, children }) => {
      const external = href?.startsWith("http");
      const className =
        "text-foreground underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent";
      return external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      ) : (
        <Link href={href ?? "#"} className={className}>
          {children}
        </Link>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-accent/40 pl-5 italic text-muted">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      // `overflow-x-auto` on the block itself — a long line must scroll here,
      // never widen the page.
      <pre className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface-2 p-5 font-mono text-sm leading-relaxed [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0">
        {children}
      </pre>
    ),
    hr: () => <hr className="my-10 border-border" />,
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    ...components,
  };
}
