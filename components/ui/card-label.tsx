import { cn } from "@/lib/utils";

/**
 * The mono `// label` kicker above a card's contents.
 *
 * Was defined twice, byte-identical: locally (and unexported) in
 * `components/home/bento.tsx` and inline inside `components/dashboard/panel.tsx`.
 *
 * Note the footer's uppercase headings look like this but are semantic `<h2>`s
 * without the `//` prefix — they are deliberately not built on this.
 */
export function CardLabel({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  // Block-level, not a bare inline span: five of the six original sites were
  // `<p>`, and an inline element changes the line box enough to shift the
  // following `mt-5` block by several pixels.
  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-faint",
        className,
      )}
    >
      {"//"} {children}
    </p>
  );
}
