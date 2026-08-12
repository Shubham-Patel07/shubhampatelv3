"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lenis smooth scroll. Disabled entirely when the user prefers reduced motion,
 * so we never fight native scrolling for those users.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return <LenisScroll>{children}</LenisScroll>;
}

function LenisScroll({ children }: { children: ReactNode }) {
  const ref = useRef<LenisRef>(null);

  /**
   * Re-measure whenever the page gets taller.
   *
   * Lenis caches the scrollable limit. Anything that changes height after that
   * measurement — web fonts swapping in, the globe canvas sizing itself,
   * scroll-reveals expanding, an image landing — leaves the limit short, and
   * the page then refuses to scroll the last stretch. The footer is last, so
   * it's what you can't reach.
   *
   * A ResizeObserver on <body> covers all of those causes at once rather than
   * guessing at each. `resize()` is cheap and idempotent.
   */
  useEffect(() => {
    let ro: ResizeObserver | undefined;

    // The ref is populated on mount, but guard in case it isn't ready yet.
    const start = () => {
      const lenis = ref.current?.lenis;
      if (!lenis) return false;
      ro = new ResizeObserver(() => lenis.resize());
      ro.observe(document.body);
      ro.observe(document.documentElement);
      return true;
    };

    let raf = 0;
    if (!start()) raf = requestAnimationFrame(() => void start());

    // Fonts settle after first paint and shift every subsequent offset.
    document.fonts?.ready.then(() => ref.current?.lenis?.resize()).catch(() => {});
    const onLoad = () => ref.current?.lenis?.resize();
    window.addEventListener("load", onLoad);

    return () => {
      ro?.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <ReactLenis
      ref={ref}
      root
      options={{ lerp: 0.1, duration: 1.1, smoothWheel: true, wheelMultiplier: 1 }}
    >
      {children}
    </ReactLenis>
  );
}
