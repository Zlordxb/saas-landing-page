import { describe, expect, it } from "vitest";
import { bookingRules } from "../../config/clinic";
import { getAvailableSlots, isBookableDate, splitByPeriod } from "./slots";
import { addDays, dateInZone, formatTime, zonedTimeToUtc } from "./time";

const cairo = (date: string, time: string) => {
  const [h, m] = time.split(":").map(Number);
  return zonedTimeToUtc(date, h * 60 + m, "Africa/Cairo");
};
const labels = (slots: { start: string }[]) =>
  slots.map((slot) => formatTime(new Date(slot.start), "Africa/Cairo"));

// Tuesday 10 November 2026, 12:00 PM in Cairo (UTC+2 in winter)
const now = new Date("2026-11-10T10:00:00Z");

describe("time zones", () => {
  it("converts Cairo wall-clock time to UTC in winter and summer", () => {
    expect(cairo("2026-11-14", "16:30").toISOString()).toBe("2026-11-14T14:30:00.000Z");
    expect(cairo("2026-07-15", "16:30").toISOString()).toBe("2026-07-15T13:30:00.000Z");
  });

  it("finds the Cairo calendar day of a UTC instant", () => {
    expect(dateInZone(new Date("2026-11-09T23:30:00Z"), "Africa/Cairo")).toBe("2026-11-10");
  });
});

describe("bookable days", () => {
  it("closes on Fridays and outside the 30-day window", () => {
    expect(isBookableDate("2026-11-13", bookingRules, now)).toBe(false); // Friday
    expect(isBookableDate("2026-11-09", bookingRules, now)).toBe(false); // yesterday
    expect(isBookableDate("2026-11-14", bookingRules, now)).toBe(true); // Saturday
    expect(isBookableDate(addDays("2026-11-10", 31), bookingRules, now)).toBe(false);
    expect(isBookableDate("2026-02-30", bookingRules, now)).toBe(false); // not a real date
  });
});

describe("available slots", () => {
  it("respects the 2-hour minimum notice today", () => {
    const slots = getAvailableSlots({
      date: "2026-11-10",
      durationMinutes: 30,
      busy: [],
      rules: bookingRules,
      now,
    });
    expect(labels(slots)[0]).toBe("2:00 PM");
  });

  it("ends every appointment by closing time", () => {
    const short = getAvailableSlots({
      date: "2026-11-14",
      durationMinutes: 30,
      busy: [],
      rules: bookingRules,
      now,
    });
    const long = getAvailableSlots({
      date: "2026-11-14",
      durationMinutes: 60,
      busy: [],
      rules: bookingRules,
      now,
    });
    expect(labels(short).at(-1)).toBe("9:30 PM");
    expect(labels(long).at(-1)).toBe("9:00 PM");
    expect(labels(short)[0]).toBe("12:00 PM");
  });

  it("keeps the 15-minute sterilization buffer around existing bookings", () => {
    // A 45-minute cleaning at 2:00 PM blocks the chair until 3:00 PM.
    const busy = [{ start: cairo("2026-11-14", "14:00"), end: cairo("2026-11-14", "15:00") }];
    const slots = labels(
      getAvailableSlots({
        date: "2026-11-14",
        durationMinutes: 30,
        busy,
        rules: bookingRules,
        now,
      }),
    );
    expect(slots).toContain("1:15 PM"); // ends 1:45, buffer until 2:00
    expect(slots).not.toContain("1:30 PM"); // its buffer would run into 2:00
    expect(slots).not.toContain("2:00 PM");
    expect(slots).not.toContain("2:45 PM");
    expect(slots).toContain("3:00 PM");
  });

  it("splits slots into afternoon and evening", () => {
    const slots = getAvailableSlots({
      date: "2026-11-14",
      durationMinutes: 30,
      busy: [],
      rules: bookingRules,
      now,
    });
    const { afternoon, evening } = splitByPeriod(slots, bookingRules);
    expect(labels(afternoon).at(-1)).toBe("4:45 PM");
    expect(labels(evening)[0]).toBe("5:00 PM");
  });
});
