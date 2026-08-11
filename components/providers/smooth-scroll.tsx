"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Lenis smooth scroll. Disabled entirely when the user prefers reduced motion,
 * so we never fight native scrolling for those users.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.1, smoothWheel: true, wheelMultiplier: 1 }}
    >
      {children}
    </ReactLenis>
  );
}
