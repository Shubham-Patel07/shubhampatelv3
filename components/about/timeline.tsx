import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import type { TimelineEntry } from "@/lib/data/experience";

/**
 * Vertical career timeline. `highlights` and `tech` are hidden when empty so
 * entries that haven't been written up yet render as a clean header rather than
 * an obviously unfinished block.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative space-y-8 border-l border-border pl-8">
      {entries.map((entry, i) => (
        <Reveal key={`${entry.org}-${entry.role}`} delay={i * 0.06}>
          <li className="relative">
            <span
              aria-hidden
              className={
                "absolute -left-[2.3rem] top-1.5 size-2.5 rounded-full ring-4 ring-background " +
                (entry.current ? "bg-accent animate-pulse-glow" : "bg-border-strong")
              }
            />

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
              <p className="mt-3 leading-relaxed text-muted">{entry.summary}</p>
            )}

            {entry.highlights && entry.highlights.length > 0 && (
              <ul className="mt-3 space-y-2">
                {entry.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
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
      ))}
    </ol>
  );
}
