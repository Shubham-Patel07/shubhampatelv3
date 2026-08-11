"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import createGlobe, { type COBEOptions } from "cobe";
import { cn } from "@/lib/utils";

/**
 * Interactive cobe globe with a marker on India. Drag to spin; auto-rotates
 * otherwise. Recolors with the theme; auto-rotation pauses under reduced motion.
 */
export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);
  const phi = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.offsetWidth;
    const onResize = () => {
      width = canvas.offsetWidth;
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    const dark = resolvedTheme !== "light";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // cobe's shipped types omit `onRender`, though it's part of the runtime API.
    const options: COBEOptions & {
      onRender: (state: { phi: number; width: number; height: number }) => void;
    } = {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.28,
      dark: dark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: dark ? 6 : 3,
      baseColor: dark ? [0.26, 0.29, 0.34] : [0.82, 0.83, 0.86],
      markerColor: [0.2, 0.83, 0.6],
      glowColor: dark ? [0.06, 0.09, 0.1] : [0.9, 0.92, 0.95],
      markers: [{ location: [17.9689, 79.5941], size: 0.09 }], // NIT Warangal, India
      onRender: (state) => {
        if (!reduce && pointerInteracting.current === null) phi.current += 0.004;
        state.phi = phi.current + pointerMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    };

    const globe = createGlobe(canvas, options);

    requestAnimationFrame(() => {
      if (canvas) canvas.style.opacity = "1";
    });

    return () => {
      globe.destroy();
      ro.disconnect();
    };
  }, [resolvedTheme]);

  return (
    <div className={cn("relative mx-auto aspect-square w-full max-w-[22rem]", className)}>
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
        className="h-full w-full opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]"
        style={{ cursor: "grab" }}
      />
    </div>
  );
}
