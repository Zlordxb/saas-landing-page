import { cn } from "@/lib/format";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

const styles: Record<BookingStatus, string> = {
  // Loudest: it waits for the owner.
  pending: "bg-pending text-on-pending",
  confirmed: "bg-confirmed text-on-confirmed",
  // Quiet on purpose: cancelled needs no attention.
  cancelled: "bg-cancelled text-on-cancelled",
};

const labels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

/** Word plus colour, never colour alone. */
export function StatusBadge({ status, label }: { status: BookingStatus; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-caption font-medium whitespace-nowrap",
        styles[status],
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label ?? labels[status]}
    </span>
  );
}
