"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import createGlobe, { type COBEOptions } from "cobe";
import { cn } from "@/lib/utils";

/**
 * Interactive cobe globe with a marker on India. Fills its parent (which owns
 * the size/clipping — e.g. a bottom-anchored half-globe). Drag to spin;
 * auto-rotates otherwise, pausing under reduced motion.
 *
 * Creation is deferred one frame so the canvas has a settled, non-zero size —
 * cobe bakes the buffer size at init and won't recover from a 0-width start.
 */
export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);
  const phi = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = () => {
      widthRef.current = canvas.offsetWidth || 400;
    };
    measure();
    window.addEventListener("resize", measure);

    const dark = resolvedTheme !== "light";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let globe: ReturnType<typeof createGlobe> | undefined;

    const raf = requestAnimationFrame(() => {
      measure();
      // cobe's shipped types omit `onRender`, though it's part of the runtime API.
      const options: COBEOptions & {
        onRender: (state: { phi: number; width: number; height: number }) => void;
      } = {
        devicePixelRatio: 2,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        phi: 0,
        theta: 0.22,
        dark: dark ? 1 : 0,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: dark ? 8 : 4,
        baseColor: dark ? [0.36, 0.4, 0.46] : [0.8, 0.81, 0.85],
        markerColor: [0.22, 0.9, 0.62],
        glowColor: dark ? [0.11, 0.14, 0.16] : [0.88, 0.9, 0.94],
        markers: [{ location: [17.9689, 79.5941], size: 0.1 }], // NIT Warangal, India
        onRender: (state) => {
          if (!reduce && pointerInteracting.current === null) phi.current += 0.004;
          state.phi = phi.current + pointerMovement.current;
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      };

      globe = createGlobe(canvas, options);
      canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(raf);
      globe?.destroy();
      window.removeEventListener("resize", measure);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={(e) => {
        pointerInteracting.current = e.clientX - pointerMovement.current * 100;
        if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
      }}
      onPointerUp={() => {
        pointerInteracting.current = null;
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
      }}
      onPointerOut={() => {
        pointerInteracting.current = null;
      }}
      onPointerMove={(e) => {
        if (pointerInteracting.current !== null) {
          const delta = e.clientX - pointerInteracting.current;
          pointerMovement.current = delta / 100;
        }
      }}
      className={cn(
        "h-full w-full opacity-0 transition-opacity duration-700",
        className,
      )}
      style={{ cursor: "grab", aspectRatio: "1 / 1" }}
    />
  );
}
