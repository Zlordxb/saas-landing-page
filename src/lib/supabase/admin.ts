import "server-only";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseUrl } from "./env";

/**
 * Supabase client with the SECRET key. It bypasses Row Level Security, so:
 * - it only ever runs on the server (`server-only` breaks the build if a client file imports it);
 * - it is used only after our own checks (validation and the booking rules).
 * Patients never get direct access to the bookings table.
 */
const secretKey = process.env.SUPABASE_SECRET_KEY ?? "";

export function isBookingConfigured(): boolean {
  return isSupabaseConfigured() && secretKey.length > 0;
}

export function createAdminClient() {
  return createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
