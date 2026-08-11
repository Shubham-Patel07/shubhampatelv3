import type { ReactNode } from "react";

/** Numbered section header (onlyaeo-style 01 — Title) with an optional action. */
export function SectionHeading({
  index,
  title,
  action,
}: {
  index: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <span className="font-mono text-xs text-accent">{index}</span>
        <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
