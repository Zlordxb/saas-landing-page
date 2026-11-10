/**
 * The "smart" part of BookFlow: which start times are free.
 * Pure functions (no database, no React), so they are easy to unit test.
 *
 * A time is offered only when ALL of these are true:
 * 1. The day is open and inside the booking window (today … today + N days).
 * 2. The appointment ends by closing time.
 * 3. It starts at least `minNoticeMinutes` from now.
 * 4. The appointment plus its sterilization buffer doesn't overlap a pending or
 *    confirmed booking (whose own buffer is included in its `end`).
 */
import type { BookingRules, OpeningHours } from "../../config/clinic";
import {
  addDays,
  dateInZone,
  isValidDateString,
  parseTime,
  weekdayOf,
  zonedTimeToUtc,
} from "./time";

/** A blocked period: an existing booking from its start until its buffer ends. */
export type BusyInterval = { start: Date; end: Date };

export type AvailableSlot = {
  /** ISO timestamp of the start (UTC). */
  start: string;
  /** Minutes after local midnight, e.g. 990 = 4:30 PM. */
  minutes: number;
};

export function openingHoursFor(date: string, rules: BookingRules): OpeningHours | null {
  return rules.weeklyHours[weekdayOf(date)] ?? null;
}

/** The first and last bookable calendar days, in the clinic's time zone. */
export function bookingWindow(
  rules: BookingRules,
  now: Date = new Date(),
): { first: string; last: string } {
  const first = dateInZone(now, rules.timeZone);
  return { first, last: addDays(first, rules.bookingWindowDays) };
}

export function isBookableDate(date: string, rules: BookingRules, now: Date): boolean {
  if (!isValidDateString(date)) return false;
  const { first, last } = bookingWindow(rules, now);
  if (date < first || date > last) return false;
  return openingHoursFor(date, rules) !== null;
}

export function getAvailableSlots(params: {
  date: string;
  durationMinutes: number;
  busy: BusyInterval[];
  rules: BookingRules;
  now: Date;
}): AvailableSlot[] {
  const { date, durationMinutes, busy, rules, now } = params;
  if (!isBookableDate(date, rules, now)) return [];

  const hours = openingHoursFor(date, rules);
  if (!hours) return [];

  const open = parseTime(hours.open);
  const close = parseTime(hours.close);
  const earliest = now.getTime() + rules.minNoticeMinutes * 60_000;
  const slots: AvailableSlot[] = [];

  for (
    let minutes = open;
    minutes + durationMinutes <= close;
    minutes += rules.slotIntervalMinutes
  ) {
    const start = zonedTimeToUtc(date, minutes, rules.timeZone).getTime();
    if (start < earliest) continue;

    const blockedUntil = start + (durationMinutes + rules.bufferMinutes) * 60_000;
    const clashes = busy.some(
      (interval) => start < interval.end.getTime() && interval.start.getTime() < blockedUntil,
    );
    if (!clashes) slots.push({ start: new Date(start).toISOString(), minutes });
  }

  return slots;
}

/** Splits slots into Afternoon and Evening for display. */
export function splitByPeriod<T extends { minutes: number }>(
  slots: T[],
  rules: BookingRules,
): { afternoon: T[]; evening: T[] } {
  const evening = parseTime(rules.eveningStartsAt);
  return {
    afternoon: slots.filter((slot) => slot.minutes < evening),
    evening: slots.filter((slot) => slot.minutes >= evening),
  };
}

/** When a booking starting at `start` stops blocking the chair (end + buffer). */
export function blockedUntil(start: Date, durationMinutes: number, rules: BookingRules): Date {
  return new Date(start.getTime() + (durationMinutes + rules.bufferMinutes) * 60_000);
}
