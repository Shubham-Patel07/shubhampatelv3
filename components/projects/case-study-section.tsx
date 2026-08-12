import type { ReactNode } from "react";

/**
 * A numbered case-study section. Narrower than `SectionHeading` on purpose —
 * long-form reading wants a quieter header than a landing-page band.
 */
export function CaseStudySection({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-3">
        <span className="font-mono text-xs text-accent">{index}</span>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
