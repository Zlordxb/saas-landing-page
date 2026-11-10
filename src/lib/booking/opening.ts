import type { BookingRules } from "../../config/clinic";
import { addDays, dateInZone, minutesInZone, parseTime, weekdayOf } from "./time";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "22:00" → "10 PM", "12:30" → "12:30 PM" */
export function hourLabel(time: string): string {
  const minutes = parseTime(time);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0
    ? `${hour12} ${suffix}`
    : `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export type OpeningStatus =
  { open: true; closesAt: string } | { open: false; opensAt: string; opensOn: string };

/**
 * Is the clinic open at this moment, and if not, when does it open next?
 * Worked out in the clinic's time zone, whatever the visitor's clock says.
 */
export function openingStatus(now: Date | number, rules: BookingRules): OpeningStatus {
  const instant = typeof now === "number" ? new Date(now) : now;
  const today = dateInZone(instant, rules.timeZone);
  const minutesNow = minutesInZone(instant, rules.timeZone);
  const hoursToday = rules.weeklyHours[weekdayOf(today)];

  if (hoursToday) {
    const opens = parseTime(hoursToday.open);
    const closes = parseTime(hoursToday.close);
    if (minutesNow >= opens && minutesNow < closes) {
      return { open: true, closesAt: hourLabel(hoursToday.close) };
    }
    if (minutesNow < opens) {
      return { open: false, opensAt: hourLabel(hoursToday.open), opensOn: "today" };
    }
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = addDays(today, offset);
    const hours = rules.weeklyHours[weekdayOf(day)];
    if (hours) {
      return {
        open: false,
        opensAt: hourLabel(hours.open),
        opensOn: offset === 1 ? "tomorrow" : WEEKDAYS[weekdayOf(day)],
      };
    }
  }
  return { open: false, opensAt: "", opensOn: "" };
}

/** Today's weekday (0 = Sunday) in the clinic's time zone. */
export function weekdayNow(now: Date | number, rules: BookingRules): number {
  const instant = typeof now === "number" ? new Date(now) : now;
  return weekdayOf(dateInZone(instant, rules.timeZone));
}

/** "Open now, closes at 10 PM" / "Closed now, opens Saturday at 12 PM" */
export function openingStatusText(status: OpeningStatus): string {
  if (status.open) return `Open now, closes at ${status.closesAt}`;
  if (!status.opensOn) return "Closed now";
  return `Closed now, opens ${status.opensOn} at ${status.opensAt}`;
}

/** The week as rows for an opening-hours table, starting on the clinic's first weekday. */
export function weeklySchedule(rules: BookingRules) {
  return Array.from({ length: 7 }, (_, index) => {
    const weekday = (rules.weekStartsOn + index) % 7;
    const hours = rules.weeklyHours[weekday];
    return {
      weekday,
      name: WEEKDAYS[weekday],
      hours: hours ? `${hourLabel(hours.open)} to ${hourLabel(hours.close)}` : "Closed",
    };
  });
}
