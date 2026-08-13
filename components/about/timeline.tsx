import type { ComponentType } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/lib/data/experience";

type Kind = TimelineEntry["kind"];

/**
 * Keyed to the `kind` union so adding a third kind is a compile error here,
 * rather than an entry that silently renders with no glyph.
 */
const kindIcon: Record<Kind, ComponentType<{ className?: string }>> = {
  work: Briefcase,
  education: GraduationCap,
};

const kindLabel: Record<Kind, string> = {
  work: "Work experience",
  education: "Education",
};

/**
 * Vertical career timeline. `highlights` and `tech` are hidden when empty so
 * entries that haven't been written up yet render as a clean header rather than
 * an obviously unfinished block.
 *
 * The rail marker carries the entry's `kind` as a glyph. Entries are ordered
 * chronologically, so jobs and degrees interleave — with an undifferentiated dot
 * there was no way to tell them apart without reading every line.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative space-y-8 border-l border-border pl-10">
      {entries.map((entry, i) => {
        const Icon = kindIcon[entry.kind];

        return (
          <Reveal key={`${entry.org}-${entry.role}`} delay={i * 0.06}>
            <li className="relative">
              {/* Centred on the rail: the li starts `pl-10` (2.5rem) right of
                  the line, so a 1.75rem circle needs 2.5 + 0.875 = 3.375rem
                  back. `bg-background` is opaque — that's what masks the line
                  running behind it. */}
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[3.375rem] top-0 grid size-7 place-items-center rounded-full border bg-background",
                  entry.current
                    ? "border-accent/40 text-accent"
                    : "border-border text-faint",
                )}
              >
                {/* Pulse the glyph, not the circle: `pulse-glow` animates
                    opacity, and fading the whole marker would let the rail line
                    ghost through the fill. */}
                <Icon
                  className={cn(
                    "size-3.5",
                    entry.current && "animate-pulse-glow",
                  )}
                />
              </span>
              <span className="sr-only">{kindLabel[entry.kind]}</span>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {entry.org}
                </h3>
                {entry.current && <Badge variant="accent">current</Badge>}
              </div>

              <p className="mt-1 text-sm text-foreground">{entry.role}</p>
              <p className="mt-0.5 font-mono text-xs text-faint">
                {entry.period}
                {entry.location && ` · ${entry.location}`}
              </p>

              {entry.summary && (
                <p className="mt-3 leading-relaxed text-muted">
                  {entry.summary}
                </p>
              )}

              {entry.highlights && entry.highlights.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {entry.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 size-1 shrink-0 rounded-full bg-accent"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {entry.tech && entry.tech.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] text-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          </Reveal>
        );
      })}
    </ol>
  );
}
