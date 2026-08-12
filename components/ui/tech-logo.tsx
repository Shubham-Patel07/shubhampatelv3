import { techIcons } from "@/lib/data/tech-icons";
import { cn } from "@/lib/utils";

/**
 * Monochrome brand glyph driven by `currentColor`.
 *
 * Deliberately not brand-coloured: fifteen vendor palettes at once would fight
 * the single-accent design system. Returns null for an unknown key so callers
 * can fall back to the plain name.
 */
export function TechLogo({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const icon = name ? techIcons[name] : undefined;
  if (!icon) return null;

  return (
    <svg
      // Per-icon viewBox: Simple Icons are 24×24 but Font Awesome marks aren't
      // (AWS is 640×512). Hardcoding 24 would crop them.
      viewBox={icon.viewBox}
      fill="currentColor"
      aria-hidden
      // Height-driven with auto width, so a wide logotype (AWS) gets the full
      // line height instead of being letterboxed inside a square and rendering
      // a quarter smaller than the square glyphs beside it.
      className={cn("h-4 w-auto shrink-0", className)}
    >
      <path d={icon.path} />
    </svg>
  );
}
