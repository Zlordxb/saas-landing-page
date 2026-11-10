/** Public Supabase settings. Both values are safe in the browser (that's what NEXT_PUBLIC_ means). */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until you add your keys to .env.local. The site then runs on sample data. */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl.startsWith("http") && supabasePublishableKey.length > 0;
}
