export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  details: string;
  location: string;
};

/** 2026-11-14T14:30:00.000Z → 20261114T143000Z (the format calendars expect). */
const stamp = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

/** A link that opens Google Calendar with the appointment filled in. */
export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${stamp(event.start)}/${stamp(event.end)}`,
    details: event.details,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Commas, semicolons, backslashes and line breaks must be escaped inside .ics text. */
const icsText = (text: string) =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/([,;])/g, "\\$1");

/**
 * An .ics file (iCalendar, RFC 5545) for Apple Calendar, Outlook and almost every other
 * calendar app, with a reminder two hours before the appointment.
 */
export function icsFile(event: CalendarEvent & { uid: string }, now: Date = new Date()): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BookFlow//Nefer Dental Studio//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(event.end)}`,
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(event.details)}`,
    `LOCATION:${icsText(event.location)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(event.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

/** The .ics file as a link the browser can download, no server route needed. */
export function icsDataUrl(ics: string): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
