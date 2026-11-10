"use client";

import { bookingRules, clinic } from "@/config/clinic";
import { openingStatus, openingStatusText } from "@/lib/booking/opening";
import { cn } from "@/lib/format";
import { useNow } from "@/lib/use-now";

/**
 * "Open now, closes at 10 PM", live, in the clinic's time zone.
 * The server doesn't know the visitor's "now", so it renders the opening days instead,
 * and the browser fills in the live status right after.
 */
export function OpenStatus({
  tone = "default",
  className,
}: {
  tone?: "default" | "night";
  className?: string;
}) {
  const now = useNow();
  const status = now === null ? null : openingStatus(now, bookingRules);
  const isOpen = status?.open ?? false;

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rounded-full",
          tone === "night"
            ? isOpen
              ? "animate-live bg-gold-on-night text-gold-on-night"
              : "bg-on-night-muted"
            : isOpen
              ? "animate-live bg-primary text-primary"
              : "bg-line-strong",
        )}
      />
      <span className="truncate">{status ? openingStatusText(status) : clinic.openDaysText}</span>
    </span>
  );
}
