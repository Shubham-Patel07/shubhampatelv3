import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "accent" | "outline";

const variants: Record<Variant, string> = {
  default: "border-border text-muted",
  accent: "border-accent/30 bg-accent/5 text-accent",
  outline: "border-border-strong text-foreground",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
