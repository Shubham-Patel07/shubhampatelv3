import type { ReactNode } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

/**
 * Standard header for interior pages — the non-placeholder counterpart to
 * `PagePlaceholder`, so every built page opens with the same rhythm.
 */
export function PageHeader({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden px-6 pb-10 pt-28">
      <AuroraBackground />
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-sm text-accent">{kicker}</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
