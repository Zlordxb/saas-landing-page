import { describe, expect, it } from "vitest";
import { bookingRules } from "../../config/clinic";
import { hourLabel, openingStatus, openingStatusText, weeklySchedule } from "./opening";
import { zonedTimeToUtc } from "./time";

// 2026-11-10 is a Tuesday, 2026-11-13 a Friday (closed). Cairo is UTC+2 in November.
const at = (date: string, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return zonedTimeToUtc(date, hours * 60 + minutes, bookingRules.timeZone);
};

describe("opening hours", () => {
  it("formats hours the way people say them", () => {
    expect(hourLabel("22:00")).toBe("10 PM");
    expect(hourLabel("12:00")).toBe("12 PM");
    expect(hourLabel("09:30")).toBe("9:30 AM");
  });

  it("is open during the day and closes at 10 PM", () => {
    expect(openingStatus(at("2026-11-10", "16:00"), bookingRules)).toEqual({
      open: true,
      closesAt: "10 PM",
    });
  });

  it("opens later today when it is still morning", () => {
    expect(openingStatusText(openingStatus(at("2026-11-10", "09:00"), bookingRules))).toBe(
      "Closed now, opens today at 12 PM",
    );
  });

  it("skips Friday: Thursday night opens again on Saturday", () => {
    expect(openingStatusText(openingStatus(at("2026-11-12", "22:30"), bookingRules))).toBe(
      "Closed now, opens Saturday at 12 PM",
    );
  });

  it("starts the week on Saturday and marks Friday closed", () => {
    const week = weeklySchedule(bookingRules);
    expect(week[0].name).toBe("Saturday");
    expect(week[6]).toEqual({ weekday: 5, name: "Friday", hours: "Closed" });
  });
});
