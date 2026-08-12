import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The bordered card surface every panel on the site is built from.
 *
 * This exact class string was repeated 16 times across 9 files, and four
 * components (`BentoCard`, `Panel`, `StatTile`, `ProjectCard`, `PostCard`) each
 * kept a private copy of it — so restyling a card meant editing nine places.
 *
 * There is no variant API on purpose. `cn()` runs tailwind-merge, so a caller
 * passing `p-5`, `h-full` or `bg-surface/30` simply overrides the default; a
 * prop matrix would be more to learn and no more capable.
 */
export function Surface({
  as,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-border bg-surface/60 p-6",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
