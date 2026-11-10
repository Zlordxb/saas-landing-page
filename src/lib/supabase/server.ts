import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublishableKey, supabaseUrl } from "./env";

export type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * It reads the signed-in user's session from cookies, so Row Level Security
 * applies as that user (the clinic owner in the dashboard).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore: src/proxy.ts refreshes the session on every /admin request.
        }
      },
    },
  });
}
