import "server-only";
import { bookingRules } from "@/config/clinic";
import { createAdminClient, isBookingConfigured } from "@/lib/supabase/admin";
import {
  bookingWindow,
  getAvailableSlots,
  isBookableDate,
  type AvailableSlot,
  type BusyInterval,
} from "./slots";
import { addDays, dayLabel, formatTime, parseTime, zonedTimeToUtc } from "./time";
import type { Availability, SlotOption } from "./types";

export type { Availability, SlotOption };

const { timeZone } = bookingRules;

/** Pending and confirmed bookings that overlap [from, to). Only times leave the server, never names. */
export async function getBusyIntervals(from: Date, to: Date): Promise<BusyInterval[]> {
  if (!isBookingConfigured()) return [];

  const { data, error } = await createAdminClient()
    .from("bookings")
    .select("starts_at, blocked_until")
    .in("status", ["pending", "confirmed"])
    .lt("starts_at", to.toISOString())
    .gt("blocked_until", from.toISOString());

  if (error) throw new Error(`Could not load bookings: ${error.message}`);
  return (data as { starts_at: string; blocked_until: string }[]).map((row) => ({
    start: new Date(row.starts_at),
    end: new Date(row.blocked_until),
  }));
}

const eveningStartsAt = parseTime(bookingRules.eveningStartsAt);

const toOptions = (slots: AvailableSlot[]): SlotOption[] =>
  slots.map((slot) => ({
    start: slot.start,
    label: formatTime(new Date(slot.start), timeZone),
    period: slot.minutes < eveningStartsAt ? "afternoon" : "evening",
  }));

/**
 * Free start times for a service on a day.
 * Pass `date: "next"` to get the first day that has free times (used by the hero card).
 */
export async function getAvailability(params: {
  durationMinutes: number;
  date: string;
  now?: Date;
}): Promise<Availability> {
  const now = params.now ?? new Date();
  const { first, last } = bookingWindow(bookingRules, now);
  const connected = isBookingConfigured();

  // One query for the whole window, then the maths happens in memory.
  const busy = await getBusyIntervals(
    zonedTimeToUtc(first, 0, timeZone),
    zonedTimeToUtc(addDays(last, 1), 0, timeZone),
  );
  const slotsOn = (date: string) =>
    getAvailableSlots({
      date,
      durationMinutes: params.durationMinutes,
      busy,
      rules: bookingRules,
      now,
    });
  const firstFreeDayFrom = (from: string): string | null => {
    for (let day = from; day <= last; day = addDays(day, 1)) {
      if (slotsOn(day).length > 0) return day;
    }
    return null;
  };

  if (params.date === "next") {
    const day = firstFreeDayFrom(first);
    if (!day) return { date: null, dateLabel: null, slots: [], nextAvailableDate: null, connected };
    return {
      date: day,
      dateLabel: dayLabel(day, first),
      slots: toOptions(slotsOn(day)),
      nextAvailableDate: day,
      connected,
    };
  }

  const date = params.date;
  const slots = isBookableDate(date, bookingRules, now) ? slotsOn(date) : [];
  return {
    date,
    dateLabel: dayLabel(date, first),
    slots: toOptions(slots),
    nextAvailableDate: slots.length > 0 ? date : firstFreeDayFrom(addDays(date, 1)),
    connected,
  };
}
