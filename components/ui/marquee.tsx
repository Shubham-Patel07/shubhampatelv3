import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite horizontal ticker. Renders items twice for a seamless loop. */
export function Marquee({
  items,
  duration = 40,
  className,
}: {
  items: ReactNode[];
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("group flex overflow-hidden", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className="flex w-max shrink-0 animate-marquee items-center gap-10 pr-10 group-hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
