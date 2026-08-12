import type { ElementType, ReactNode } from "react";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

/** Bento-grid surface: the shared card plus a hover sheen. */
export function BentoCard({
  children,
  className,
  as,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Surface
      as={as}
      className={cn(
        "group relative overflow-hidden backdrop-blur-sm transition-colors duration-300 hover:border-border-strong",
        className,
      )}
    >
      {/* top sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {children}
    </Surface>
  );
}
