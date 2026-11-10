/**
 * Date and time helpers with no dependencies.
 *
 * A calendar day is a "YYYY-MM-DD" string in the clinic's time zone.
 * An exact moment is a JavaScript Date (stored in the database as timestamptz).
 * Keeping the two apart avoids the classic bug where a booking shifts by a few
 * hours because the server, the browser and the clinic are in different zones.
 */

const pad = (n: number) => String(n).padStart(2, "0");

/** Intl output can contain narrow no-break spaces ("4:30 PM"). Normalize them so
 * the server and the browser always render identical text. */
const clean = (text: string) => text.replace(/[  ]/g, " ");

export function toDateString(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function parseDate(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

export function isValidDateString(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const { year, month, day } = parseDate(date);
  const check = new Date(Date.UTC(year, month - 1, day));
  return (
    check.getUTCFullYear() === year &&
    check.getUTCMonth() === month - 1 &&
    check.getUTCDate() === day
  );
}

export function addDays(date: string, days: number): string {
  const { year, month, day } = parseDate(date);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return toDateString(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
}

/** 0 = Sunday … 6 = Saturday. */
export function weekdayOf(date: string): number {
  const { year, month, day } = parseDate(date);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** "14:30" → 870 (minutes after midnight). */
export function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** 870 → "14:30". */
export function minutesToTime(minutes: number): string {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

function zonedParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

/** The calendar day an instant falls on, in a time zone. */
export function dateInZone(instant: Date, timeZone: string): string {
  const p = zonedParts(instant, timeZone);
  return toDateString(p.year, p.month, p.day);
}

/**
 * Today's date in a time zone. Components call this instead of `new Date()`,
 * because React components should give the same output for the same input.
 */
export function todayInZone(timeZone: string, now: Date = new Date()): string {
  return dateInZone(now, timeZone);
}

/** Minutes after local midnight of an instant, in a time zone. */
export function minutesInZone(instant: Date, timeZone: string): number {
  const p = zonedParts(instant, timeZone);
  return p.hour * 60 + p.minute;
}

function offsetMinutes(instant: Date, timeZone: string): number {
  const p = zonedParts(instant, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - instant.getTime()) / 60_000);
}

/** The exact moment when the wall clock in `timeZone` shows `date` at `minutes` after midnight.
 * Works across daylight-saving changes (Egypt uses summer time). */
export function zonedTimeToUtc(date: string, minutes: number, timeZone: string): Date {
  const { year, month, day } = parseDate(date);
  const wallClock = Date.UTC(year, month - 1, day, 0, minutes);
  let utc = wallClock - offsetMinutes(new Date(wallClock), timeZone) * 60_000;
  const corrected = wallClock - offsetMinutes(new Date(utc), timeZone) * 60_000;
  if (corrected !== utc) utc = corrected;
  return new Date(utc);
}

/** 4:30 PM */
export function formatTime(instant: Date, timeZone: string): string {
  return clean(
    new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(
      instant,
    ),
  );
}

function utcNoon(date: string): Date {
  const { year, month, day } = parseDate(date);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

/** Sat 14 Nov */
export function formatDateShort(date: string): string {
  return clean(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "UTC",
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(utcNoon(date)),
  );
}

/** Saturday 14 November */
export function formatDateLong(date: string): string {
  return clean(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(utcNoon(date)),
  );
}

/** November 2026 */
export function formatMonthYear(year: number, month: number): string {
  return clean(
    new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", month: "long", year: "numeric" }).format(
      new Date(Date.UTC(year, month - 1, 1, 12)),
    ),
  );
}

/** "Today", "Tomorrow" or "Sat 14 Nov". */
export function dayLabel(date: string, today: string): string {
  if (date === today) return "Today";
  if (date === addDays(today, 1)) return "Tomorrow";
  return formatDateShort(date);
}
