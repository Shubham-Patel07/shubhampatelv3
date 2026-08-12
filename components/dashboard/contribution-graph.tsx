import type { ContributionCalendar } from "@/lib/github";

/**
 * Calendar heatmap of contributions.
 *
 * Sequential encoding: one hue, five steps, `heat-0` reserved for a genuinely
 * empty day so "no activity" never reads as a low count. Thresholds are
 * quartiles of the observed max rather than fixed numbers, so the ramp stays
 * informative whether the busiest day is 3 commits or 30.
 */

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

/** 0 = empty, 1..4 = quartiles of the period's busiest day. */
function level(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

const LEVEL_CLASS: Record<number, string> = {
  0: "bg-heat-0",
  1: "bg-heat-1",
  2: "bg-heat-2",
  3: "bg-heat-3",
  4: "bg-heat-4",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Month labels sit above the week column where that month first appears. */
function monthColumns(weeks: ContributionCalendar["weeks"]) {
  const out: { label: string; index: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const first = week[0];
    if (!first) return;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month !== lastMonth) {
      out.push({
        label: new Date(`${first.date}T00:00:00Z`).toLocaleDateString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
        index: i,
      });
      lastMonth = month;
    }
  });
  return out;
}

export function ContributionGraph({
  calendar,
}: {
  calendar: ContributionCalendar;
}) {
  const months = monthColumns(calendar.weeks);

  return (
    <figure className="m-0">
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {calendar.total.toLocaleString()} contributions
        </h3>
        <span className="font-mono text-xs text-faint">in the last year</span>
      </figcaption>

      {/* Horizontal scroll rather than squashing cells on narrow screens. */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex min-w-full flex-col gap-1">
          <div className="flex gap-1 pl-8">
            {calendar.weeks.map((_, i) => {
              const month = months.find((m) => m.index === i);
              return (
                <span
                  key={i}
                  className="w-2.5 shrink-0 font-mono text-[10px] text-faint"
                >
                  {month?.label ?? ""}
                </span>
              );
            })}
          </div>

          <div className="flex gap-1">
            <div className="flex w-7 shrink-0 flex-col gap-1">
              {DAY_LABELS.map((label, i) => (
                <span
                  key={i}
                  className="h-2.5 font-mono text-[10px] leading-[0.625rem] text-faint"
                >
                  {label}
                </span>
              ))}
            </div>

            {calendar.weeks.map((week, wi) => (
              <div key={wi} className="flex shrink-0 flex-col gap-1">
                {week.map((day) => {
                  const lvl = level(day.count, calendar.maxCount);
                  return (
                    <span
                      key={day.date}
                      // `title` gives the hover tooltip and doubles as the
                      // accessible name — the count is never colour-alone.
                      title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                      className={`size-2.5 rounded-[2px] ring-1 ring-inset ring-foreground/5 transition-transform hover:scale-125 ${LEVEL_CLASS[lvl]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5">
        <span className="font-mono text-[10px] text-faint">Less</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <span
            key={lvl}
            className={`size-2.5 rounded-[2px] ring-1 ring-inset ring-foreground/5 ${LEVEL_CLASS[lvl]}`}
          />
        ))}
        <span className="font-mono text-[10px] text-faint">More</span>
      </div>
    </figure>
  );
}
