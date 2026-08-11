import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Headline text with an animated accent shimmer sweeping across it. */
export function ShimmerText({
  as,
  children,
  className,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  const Tag = as ?? "span";
  return <Tag className={cn("text-shimmer", className)}>{children}</Tag>;
}
