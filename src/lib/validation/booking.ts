/**
 * One set of rules for the booking form, used twice:
 * in the browser (React Hook Form) for instant feedback, and on the server
 * (the Server Action) because the server never trusts the browser.
 */
import { z } from "zod";

/** 11 digits starting with 010, 011, 012 or 015. Spaces or dashes between digits are fine. */
export const EGYPT_MOBILE = /^01[0125](?:[\s-]?\d){8}$/;

const isEmail = (value: string) => z.email().safeParse(value).success;

export const bookingDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Please enter your full name.")
    .max(60, "Names can be up to 60 characters."),
  phone: z
    .string()
    .trim()
    .regex(EGYPT_MOBILE, "Enter an 11-digit Egyptian mobile number, like 01012345678."),
  email: z
    .string()
    .trim()
    .max(254, "Enter a valid email address.")
    .refine((value) => value === "" || isEmail(value), "Enter a valid email address."),
  notes: z.string().trim().max(500, "Notes can be up to 500 characters."),
  // Honeypot: a field people never see. Spam bots fill in every field and give themselves away.
  // Accepted here so the form doesn't flag it; the Server Action rejects any value.
  website: z.string().max(200).optional(),
});

export type BookingDetails = z.infer<typeof bookingDetailsSchema>;

export const createBookingSchema = bookingDetailsSchema.extend({
  serviceSlug: z.string().min(1, "Please choose a service."),
  startsAt: z.iso.datetime({ error: "Please choose a time." }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
