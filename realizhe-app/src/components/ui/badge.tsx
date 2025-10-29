"use client";

import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "primary" | "accent" | "muted";
};

export function Badge({ className, variant = "accent", ...props }: BadgeProps) {
  const variantClass =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : variant === "muted"
        ? "bg-muted text-muted-foreground"
        : "bg-accent text-accent-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm",
        variantClass,
        className,
      )}
      {...props}
    />
  );
}
