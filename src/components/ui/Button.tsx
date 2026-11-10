import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "danger" | "inverse";
type Size = "sm" | "md" | "lg";

// Each variant sets its own border colour. Two classes that set the same property
// (say border-transparent and border-line-strong) would fight, and CSS order, not
// class order, would pick the winner.
const base =
  "inline-flex items-center justify-center gap-2 rounded-full border font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 ease-glaze active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  // The one main action of a view ("Book an appointment").
  primary: "border-transparent bg-primary text-on-primary hover:bg-primary-hover",
  // Every other action ("Book" on each service card).
  secondary: "border-line-strong bg-surface text-ink hover:border-primary hover:text-link",
  // Repeated row actions in the dashboard ("Confirm").
  soft: "border-transparent bg-primary-soft text-on-primary-soft hover:border-primary",
  ghost: "border-transparent bg-transparent text-ink hover:bg-surface-muted",
  danger: "border-transparent bg-danger-fill text-on-danger hover:bg-danger",
  // Only on the glazed hero card.
  inverse: "border-transparent bg-on-hero text-hero hover:bg-faience-50",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-label",
  md: "h-12 px-6 text-body",
  lg: "h-14 px-8 text-lead",
};

type StyleProps = { variant?: Variant; size?: Size; className?: string };

export function buttonStyles({ variant = "primary", size = "md", className }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

/** A link that looks like a button (for navigation, use a link, not a button). */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
