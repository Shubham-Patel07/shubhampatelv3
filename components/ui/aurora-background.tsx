import { cn } from "@/lib/utils";

/**
 * Decorative, non-interactive backdrop: an engineering grid + slow-drifting
 * accent "aurora" blobs. Server component — safe to drop into any section.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="bg-grid mask-radial-faded absolute inset-0 opacity-40" />
      <div
        className="animate-aurora absolute -top-40 left-1/2 h-[38rem] w-[58rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 22%, transparent), transparent)",
        }}
      />
      <div
        className="animate-aurora absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          animationDelay: "-7s",
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--accent-soft) 16%, transparent), transparent)",
        }}
      />
    </div>
  );
}
