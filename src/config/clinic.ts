/**
 * Everything specific to the business lives here, so BookFlow can be reused
 * for any service business by changing this file (and the services table).
 */

export const clinic = {
  name: "Nefer Dental Studio",
  shortName: "Nefer",
  tagline: "Calm, careful dentistry in Cairo, booked in under a minute.",
  area: "Zamalek, Cairo",
  phone: "010 0000 0000",
  email: "hello@nefer.example",
  doctor: "Dr. Salma Nabil",
  openDaysText: "Saturday to Thursday, 12 PM to 10 PM",
  closedDaysText: "Friday closed",
  isDemo: true,
} as const;

/** Opening hours for one weekday, as 24-hour "HH:MM" strings. */
export type OpeningHours = { open: string; close: string };

export type BookingRules = {
  /** IANA time zone of the clinic. All booking maths happens in this zone. */
  timeZone: string;
  /** 0 = Sunday … 6 = Saturday (the same numbers as Date.getUTCDay()). null = closed. */
  weeklyHours: Record<number, OpeningHours | null>;
  /** A new start time is offered every N minutes. */
  slotIntervalMinutes: number;
  /** Time kept free after each appointment to sterilize the instruments. */
  bufferMinutes: number;
  /** How many days ahead patients can book (today + N days). */
  bookingWindowDays: number;
  /** The earliest bookable time is now + N minutes. */
  minNoticeMinutes: number;
  /** First day of the week in the calendar: 6 = Saturday. */
  weekStartsOn: number;
  /** Slots from this time on are grouped as "Evening". */
  eveningStartsAt: string;
};

const DAY = { open: "12:00", close: "22:00" };

export const bookingRules: BookingRules = {
  timeZone: "Africa/Cairo",
  weeklyHours: {
    0: DAY, // Sunday
    1: DAY, // Monday
    2: DAY, // Tuesday
    3: DAY, // Wednesday
    4: DAY, // Thursday
    5: null, // Friday: closed
    6: DAY, // Saturday
  },
  slotIntervalMinutes: 15,
  bufferMinutes: 15,
  bookingWindowDays: 30,
  minNoticeMinutes: 120,
  weekStartsOn: 6,
  eveningStartsAt: "17:00",
};

/** Weekdays with no opening hours (used to grey out days in the calendar). */
export const closedWeekdays: number[] = Object.entries(bookingRules.weeklyHours)
  .filter(([, hours]) => hours === null)
  .map(([day]) => Number(day));
