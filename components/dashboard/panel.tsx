import type { ReactNode } from "react";
import { Surface } from "@/components/ui/surface";
import { CardLabel } from "@/components/ui/card-label";
import { cn } from "@/lib/utils";

export function Panel({
  label,
  action,
  className,
  children,
}: {
  label: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Surface className={className}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <CardLabel>{label}</CardLabel>
        {action}
      </div>
      {children}
    </Surface>
  );
}

/**
 * Shown when a panel's data source isn't configured or is unreachable.
 * Says which of the two it is — "add a token" and "GitHub is down" need
 * different reactions from the reader.
 */
export function PanelNotice({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border px-5 py-8 text-center">
      <p className="font-mono text-sm text-muted">{title}</p>
      {children && (
        <div className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-faint">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * A single headline number. Per the form heuristic this is deliberately not a
 * chart — one value's job is to be read, not compared.
 */
export function StatTile({
  value,
  label,
  hint,
  className,
}: {
  value: string | number;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <Surface className={cn("p-5", className)}>
      <p className="font-display text-3xl font-semibold tracking-tight text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-1 font-mono text-xs text-muted">{label}</p>
      {hint && <p className="mt-1 font-mono text-[11px] text-faint">{hint}</p>}
    </Surface>
  );
}
