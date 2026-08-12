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
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={cn("size-4 shrink-0", className)}
    >
      <path d={icon.path} />
    </svg>
  );
}
