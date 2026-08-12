import { cn } from "@/lib/utils";

/**
 * The small pulsing accent dot that marks a live/available status.
 *
 * Repeated in the hero pill, the bento "currently" card, the contact panel, the
 * footer and the page placeholder. Pulsing is handled by `--animate-pulse-glow`,
 * which the reduced-motion block in `globals.css` already neutralises.
 *
 * The timeline's dot is deliberately not this: it swaps colour on a condition
 * and carries its own ring and absolute positioning.
 */
export function StatusDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-1.5 animate-pulse-glow rounded-full bg-accent",
        className,
      )}
    />
  );
}
