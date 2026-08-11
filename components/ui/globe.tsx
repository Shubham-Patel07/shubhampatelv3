"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Canvas-2D dotted globe showing real continents. Deliberately NOT WebGL —
 * cobe/three-style globes render only a grey sphere (no map) on some Mac/ANGLE
 * GPU backends. Instead we sample an equirectangular Earth map for land and plot
 * dots on the continents, projected orthographically. Renders everywhere.
 * Auto-rotates (pauses under reduced motion); drag to spin.
 */

type Vec3 = [number, number, number];

// land-mask.png: land is black, oceans are white → land = low luminance.
const LAND_THRESHOLD = 110;
const INDIA_LAT = 17.9689;
const INDIA_LNG = 79.5941;
const TILT = -0.42; // lean the north pole toward the viewer

function latLngToVec3(latDeg: number, lngDeg: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lng = (lngDeg * Math.PI) / 180;
  return [
    Math.cos(lat) * Math.cos(lng),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lng),
  ];
}

// Built once from the map, then reused across mounts / theme toggles.
let landPointsCache: Vec3[] | null = null;

function buildLandPoints(): Promise<Vec3[]> {
  if (landPointsCache) return Promise.resolve(landPointsCache);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = 1024;
      const h = 512;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      if (!octx) return resolve([]);
      octx.drawImage(img, 0, 0, w, h);
      const data = octx.getImageData(0, 0, w, h).data;

      const isLand = (lat: number, lng: number) => {
        const u = (lng + 180) / 360;
        const v = (90 - lat) / 180;
        const px = Math.min(w - 1, Math.max(0, Math.floor(u * w)));
        const py = Math.min(h - 1, Math.max(0, Math.floor(v * h)));
        const i = (py * w + px) * 4;
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        return lum < LAND_THRESHOLD;
      };

      const pts: Vec3[] = [];
      // Skip the poles: Antarctica's solid band + longitude convergence make an
      // ugly detached swirl. Real continents live comfortably within this range.
      for (let lat = -60; lat <= 78; lat += 1.7) {
        const latR = (lat * Math.PI) / 180;
        const step = 1.7 / Math.max(Math.cos(latR), 0.2);
        for (let lng = -180; lng < 180; lng += step) {
          if (isLand(lat, lng)) pts.push(latLngToVec3(lat, lng));
        }
      }
      landPointsCache = pts;
      resolve(pts);
    };
    img.onerror = () => resolve([]);
    img.src = "/land-mask.png";
  });
}

function readVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  return v.trim() || fallback;
}

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const angle = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dark = resolvedTheme !== "light";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dotColor = dark ? "231, 233, 238" : "11, 12, 14";
    const accent = readVar("--accent", dark ? "#34d399" : "#0c9d63");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = 0;
    const resize = () => {
      size = canvas.offsetWidth || 320;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);

    let points: Vec3[] = landPointsCache ?? [];
    let raf = 0;
    let cancelled = false;

    const render = () => {
      const cx = (size * dpr) / 2;
      const cy = (size * dpr) / 2;
      const R = (size * dpr) / 2 - 6 * dpr;
      ctx.clearRect(0, 0, size * dpr, size * dpr);

      const a = angle.current;
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);

      const project = ([x, y, z]: Vec3) => {
        const rx = x * cosA + z * sinA;
        const rz = -x * sinA + z * cosA;
        const ry = y * cosT - rz * sinT;
        const rz2 = y * sinT + rz * cosT;
        return { sx: cx + rx * R, sy: cy - ry * R, depth: rz2 };
      };

      for (const p of points) {
        const { sx, sy, depth } = project(p);
        if (depth < -0.05) continue;
        const t = (depth + 1) / 2;
        const alpha = (dark ? 0.25 : 0.3) + t * 0.55;
        const r = (0.5 + t * 1.0) * dpr;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${dotColor}, ${alpha.toFixed(3)})`;
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const m = project(latLngToVec3(INDIA_LAT, INDIA_LNG));
      if (m.depth > -0.02) {
        const pulse = reduce ? 0.6 : 0.5 + 0.5 * Math.sin(Date.now() / 500);
        ctx.beginPath();
        ctx.fillStyle = accent;
        ctx.arc(m.sx, m.sy, 3 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.25 + pulse * 0.4;
        ctx.lineWidth = 1.5 * dpr;
        ctx.arc(m.sx, m.sy, (5 + pulse * 5) * dpr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (!reduce && !dragging.current) angle.current += 0.0032;
      raf = requestAnimationFrame(render);
    };

    render();
    if (points.length === 0) {
      buildLandPoints().then((pts) => {
        if (!cancelled) points = pts;
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
        if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
      }}
      onPointerUp={() => {
        dragging.current = false;
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        angle.current += (e.clientX - lastX.current) * 0.01;
        lastX.current = e.clientX;
      }}
      className={cn("h-full w-full touch-none", className)}
      style={{ cursor: "grab", aspectRatio: "1 / 1" }}
    />
  );
}
