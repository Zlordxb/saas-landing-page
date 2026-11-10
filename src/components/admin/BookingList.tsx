import { StatusBadge } from "@/components/ui/StatusBadge";
import { bookingRules } from "@/config/clinic";
import { dateInZone, dayLabel, formatTime, todayInZone } from "@/lib/booking/time";
import type { AdminBooking } from "@/lib/data/admin";
import { formatPhone } from "@/lib/format";
import { BookingActions } from "./BookingActions";

const { timeZone } = bookingRules;

const minutesBetween = (start: string, end: string) =>
  Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60_000);

/** A table on wide screens, stacked cards on phones: the same data, in the same order. */
export function BookingList({
  bookings,
  emptyText,
}: {
  bookings: AdminBooking[];
  emptyText: string;
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line-strong bg-surface p-10 text-center">
        <p className="font-semibold">No bookings here</p>
        <p className="mt-1 text-small text-ink-muted">{emptyText}</p>
      </div>
    );
  }

  const today = todayInZone(timeZone);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div
        aria-hidden="true"
        className="hidden grid-cols-[8rem_minmax(0,1.2fr)_minmax(0,1.2fr)_9rem_14rem] gap-4 bg-surface-muted px-5 py-3 text-label font-medium text-ink-muted lg:grid"
      >
        <span>Time</span>
        <span>Patient</span>
        <span>Service</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>
      <ul>
        {bookings.map((booking) => {
          const start = new Date(booking.startsAt);
          return (
            <li
              key={booking.id}
              className="grid gap-3 border-t border-line px-5 py-4 first:border-t-0 lg:grid-cols-[8rem_minmax(0,1.2fr)_minmax(0,1.2fr)_9rem_14rem] lg:items-center lg:gap-4 lg:first:border-t lg:first:border-line"
            >
              <div>
                <p className="font-semibold tabular-nums">{formatTime(start, timeZone)}</p>
                <p className="text-small text-ink-muted tabular-nums">
                  {dayLabel(dateInZone(start, timeZone), today)},{" "}
                  {minutesBetween(booking.startsAt, booking.endsAt)} min
                </p>
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{booking.customerName}</p>
                <a
                  href={`tel:${booking.customerPhone}`}
                  className="text-small text-link tabular-nums hover:underline"
                >
                  {formatPhone(booking.customerPhone)}
                </a>
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{booking.serviceName}</p>
                <p className="text-small text-ink-muted tabular-nums">{booking.reference}</p>
                {booking.notes ? (
                  <p className="mt-1 line-clamp-2 text-small text-ink-muted">“{booking.notes}”</p>
                ) : null}
              </div>
              <div>
                <StatusBadge status={booking.status} />
              </div>
              <div className="lg:justify-self-end">
                <BookingActions id={booking.id} status={booking.status} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
