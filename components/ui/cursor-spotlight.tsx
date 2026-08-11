"use client";

import { useEffect, useRef } from "react";

/**
 * A soft radial glow that follows the cursor. Desktop (fine pointer) only,
 * and disabled under reduced motion. rAF-throttled to stay cheap.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduce.matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--x", `${e.clientX}px`);
        el.style.setProperty("--y", `${e.clientY}px`);
        el.style.opacity = "1";
      });
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)",
      }}
    />
  );
}
