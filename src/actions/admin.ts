"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type SignInState = { error: string | null };

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

/** Used with useActionState in the login form. Returns an error, or redirects on success. */
export async function signIn(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "That email and password don’t match. Try again." };

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export type UpdateStatusResult = { ok: true } | { ok: false; message: string };

const statusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["confirmed", "cancelled"]),
});

/**
 * Confirm or cancel a booking. Runs as the signed-in owner, so Row Level Security
 * decides what's allowed (only admins, and only the status column).
 * Allowed moves: pending → confirmed, pending or confirmed → cancelled.
 */
export async function updateBookingStatus(
  id: string,
  status: "confirmed" | "cancelled",
): Promise<UpdateStatusResult> {
  const parsed = statusSchema.safeParse({ id, status });
  if (!parsed.success) return { ok: false, message: "That booking couldn’t be updated." };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { ok: false, message: "Your session expired. Sign in again." };

  const allowedFrom = parsed.data.status === "confirmed" ? ["pending"] : ["pending", "confirmed"];
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .in("status", allowedFrom)
    .select("id");

  if (error) {
    console.error("updateBookingStatus failed:", error.message);
    return { ok: false, message: "That booking couldn’t be updated. Try again." };
  }
  if (!data || data.length === 0) {
    return { ok: false, message: "This booking changed in the meantime. Refresh the page." };
  }

  revalidatePath("/admin");
  return { ok: true };
}
