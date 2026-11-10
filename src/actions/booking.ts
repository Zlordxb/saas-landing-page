"use server";

import { z } from "zod";
import { bookingRules } from "@/config/clinic";
import { getBusyIntervals } from "@/lib/booking/availability";
import { generateReference } from "@/lib/booking/reference";
import { blockedUntil, getAvailableSlots } from "@/lib/booking/slots";
import { addDays, dateInZone, zonedTimeToUtc } from "@/lib/booking/time";
import { normalizePhone } from "@/lib/format";
import { visitorKey } from "@/lib/request-key";
import { createAdminClient, isBookingConfigured } from "@/lib/supabase/admin";
import { createBookingSchema, type CreateBookingInput } from "@/lib/validation/booking";

export type CreateBookingResult =
  | { ok: true; reference: string }
  | {
      ok: false;
      error: "invalid" | "slot_taken" | "unavailable" | "limited" | "not_connected" | "unknown";
      message: string;
      fieldErrors?: Partial<Record<string, string[]>>;
    };

const SLOT_TAKEN: CreateBookingResult = {
  ok: false,
  error: "slot_taken",
  message: "This time was just booked. Pick another time below.",
};

const UNKNOWN: CreateBookingResult = {
  ok: false,
  error: "unknown",
  message: "Your booking couldn’t be saved. Try again, or call the clinic.",
};

const LIMITS: Record<string, CreateBookingResult> = {
  too_many_attempts: {
    ok: false,
    error: "limited",
    message:
      "Too many booking attempts from this device. Try again in an hour, or call the clinic.",
  },
  too_many_pending: {
    ok: false,
    error: "limited",
    message:
      "This phone number already has 3 appointments waiting for confirmation. Call the clinic to book more.",
  },
};

/**
 * Server Action: runs on the server when the patient presses "Confirm booking".
 * Anyone can call it, so it defends itself:
 * 1. Validate the input again (never trust the browser), and drop bots caught by the honeypot.
 * 2. Spam limits in the database: 5 attempts an hour per visitor, 3 pending bookings per phone.
 * 3. Re-check that the time is still free, with the same rules the calendar used.
 * 4. Save it. If two people book the same time at once, the database's exclusion
 *    constraint lets only one through (error 23P01), and the other sees a clear message.
 */
export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "invalid",
      message: "Some details need fixing.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (!isBookingConfigured()) {
    return {
      ok: false,
      error: "not_connected",
      message:
        "Bookings aren’t connected to a database yet. Add your Supabase keys to .env.local (see the README).",
    };
  }

  const { serviceSlug, startsAt, name, phone, email, notes, website } = parsed.data;
  // Only a bot fills in the hidden field. Nothing is saved, and the message gives nothing away.
  if (website) return UNKNOWN;

  const supabase = createAdminClient();

  try {
    const { data: verdict, error: limitError } = await supabase.rpc("booking_allowed", {
      p_client_key: await visitorKey(),
      p_phone: normalizePhone(phone),
    });
    if (limitError) throw limitError;
    if (verdict !== "ok") return LIMITS[String(verdict)] ?? UNKNOWN;

    const { data: serviceRow, error: serviceError } = await supabase
      .from("services")
      .select("id, duration_minutes, price_egp")
      .eq("slug", serviceSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (serviceError) throw serviceError;
    if (!serviceRow) {
      return {
        ok: false,
        error: "unavailable",
        message: "This service isn’t available any more. Please choose another one.",
      };
    }

    const service = serviceRow as { id: string; duration_minutes: number; price_egp: number };
    const start = new Date(startsAt);
    const { timeZone } = bookingRules;
    const day = dateInZone(start, timeZone);
    const busy = await getBusyIntervals(
      zonedTimeToUtc(day, 0, timeZone),
      zonedTimeToUtc(addDays(day, 1), 0, timeZone),
    );
    const freeSlots = getAvailableSlots({
      date: day,
      durationMinutes: service.duration_minutes,
      busy,
      rules: bookingRules,
      now: new Date(),
    });
    if (!freeSlots.some((slot) => slot.start === start.toISOString())) return SLOT_TAKEN;

    const end = new Date(start.getTime() + service.duration_minutes * 60_000);
    const blocked = blockedUntil(start, service.duration_minutes, bookingRules);

    // A reference collision is very unlikely, but cheap to handle: just try another one.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const reference = generateReference();
      const { error } = await supabase.from("bookings").insert({
        reference,
        service_id: service.id,
        customer_name: name,
        customer_phone: normalizePhone(phone),
        customer_email: email || null,
        notes: notes || null,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        blocked_until: blocked.toISOString(),
        price_egp: service.price_egp,
        status: "pending",
      });

      if (!error) return { ok: true, reference };
      if (error.code === "23P01") return SLOT_TAKEN; // exclusion constraint: someone was faster
      if (error.code === "23505") continue; // duplicate reference: try again
      throw error;
    }
    return UNKNOWN;
  } catch (error) {
    console.error("createBooking failed:", error);
    return UNKNOWN;
  }
}
