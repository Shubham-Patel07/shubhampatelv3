"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TerminalLine = {
  /** Shell prompt shown before the text, e.g. "$" or "→". */
  prompt?: string;
  text: string;
  /** Render the text in the accent color (used for command output). */
  accent?: boolean;
  muted?: boolean;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Terminal({
  lines,
  title = "shubham@v3 ~/portfolio — zsh",
  className,
}: {
  lines: TerminalLine[];
  title?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState<string[]>(() => lines.map(() => ""));
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTyped(lines.map((l) => l.text));
      setDone(true);
      return;
    }
    let cancelled = false;
    const out = lines.map(() => "");
    (async () => {
      for (let i = 0; i < lines.length; i++) {
        const full = lines[i].text;
        for (let c = 0; c <= full.length; c++) {
          if (cancelled) return;
          out[i] = full.slice(0, c);
          setTyped([...out]);
          await sleep(lines[i].prompt ? 26 : 14);
        }
        if (cancelled) return;
        await sleep(280);
      }
      if (!cancelled) setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [inView, reduced, lines]);

  const activeLine = typed.findIndex((t, i) => t.length < lines[i].text.length);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface/80 font-mono text-sm shadow-2xl shadow-black/20 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-2/60 px-4 py-2.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate text-xs text-faint">{title}</span>
      </div>

      <div className="space-y-1.5 p-4 leading-relaxed">
        {lines.map((line, i) => {
          const isActive = i === activeLine || (activeLine === -1 && i === lines.length - 1);
          const visible = typed[i].length > 0 || i <= (activeLine === -1 ? lines.length : activeLine);
          return (
            <div key={i} className={cn("min-h-[1.4em]", !visible && "opacity-0")}>
              {line.prompt && (
                <span className="mr-2 select-none text-accent">{line.prompt}</span>
              )}
              <span
                className={cn(
                  line.accent && "text-accent",
                  line.muted && "text-faint",
                  !line.accent && !line.muted && "text-foreground/90",
                )}
              >
                {typed[i]}
              </span>
              {isActive && !done && (
                <span className="ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] animate-pulse bg-accent" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
