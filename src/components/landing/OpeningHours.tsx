"use client";

import { OpenStatus } from "@/components/site/OpenStatus";
import { bookingRules } from "@/config/clinic";
import { weekdayNow, weeklySchedule } from "@/lib/booking/opening";
import { cn } from "@/lib/format";
import { useNow } from "@/lib/use-now";

const week = weeklySchedule(bookingRules);

/** The week's hours, with today highlighted in the clinic's time zone. */
export function OpeningHours() {
  const now = useNow();
  const today = now === null ? null : weekdayNow(now, bookingRules);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-bg p-5 sm:p-6">
      <OpenStatus className="font-semibold" />
      <table className="w-full text-left">
        <caption className="sr-only">Opening hours</caption>
        <tbody>
          {week.map((day) => {
            const isToday = day.weekday === today;
            const closed = day.hours === "Closed";
            return (
              <tr
                key={day.weekday}
                aria-current={isToday ? "date" : undefined}
                className="border-t border-line first:border-t-0"
              >
                <th scope="row" className={cn("py-2", isToday ? "font-semibold" : "font-medium")}>
                  {day.name}
                  {isToday ? <span className="ml-2 text-small font-medium text-link">Today</span> : null}
                </th>
                <td
                  className={cn(
                    "py-2 text-right tabular-nums",
                    isToday ? "font-semibold text-ink" : closed ? "text-ink-subtle" : "text-ink-muted",
                  )}
                >
                  {day.hours}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
