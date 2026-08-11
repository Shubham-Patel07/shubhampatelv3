import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Base surface panel for the bento grid. */
export function BentoCard({
  children,
  className,
  as,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-border-strong",
        className,
      )}
    >
      {/* top sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {children}
    </Tag>
  );
}
