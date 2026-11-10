import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";

/**
 * An anonymous, stable key for the visitor making this request: an HMAC of their IP.
 * The same visitor gets the same key (so attempts can be counted), but the IP address
 * itself is never stored. On Vercel the platform sets x-forwarded-for itself;
 * behind another proxy, check how it sets that header before relying on it.
 */
export async function visitorKey(): Promise<string> {
  const list = await headers();
  const ip =
    list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
  const secret = process.env.SUPABASE_SECRET_KEY ?? "bookflow-local";
  return createHmac("sha256", secret).update(ip).digest("hex");
}
