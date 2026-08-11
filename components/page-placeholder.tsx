import { AuroraBackground } from "@/components/ui/aurora-background";

/**
 * Temporary on-brand stub for routes that are wired into the nav but built in a
 * later phase, so navigation never 404s during the gradual build.
 */
export function PagePlaceholder({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative mx-auto flex min-h-[72svh] max-w-5xl flex-col justify-center px-6 py-24">
      <AuroraBackground />
      <p className="font-mono text-sm text-accent">{kicker}</p>
      <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted">{description}</p>
      <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
        <span className="size-1.5 animate-pulse-glow rounded-full bg-accent" />
        building · shipping soon
      </span>
    </section>
  );
}
