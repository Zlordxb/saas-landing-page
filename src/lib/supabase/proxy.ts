import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "./env";

const LOGIN_PATH = "/admin/login";

/**
 * Runs before every /admin request (see src/proxy.ts):
 * 1. refreshes the owner's session cookie, and
 * 2. sends visitors who aren't signed in to the login page.
 * Based on Supabase's official Next.js example.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Without keys there is nothing to protect yet: the login page explains the setup.
  if (!isSupabaseConfigured()) return supabaseResponse;

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers ?? {}).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  // Don't run code between createServerClient and getClaims(): it can log users out at random.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);
  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH;

  if (!isSignedIn && !isLoginPage) return redirectTo(request, LOGIN_PATH, supabaseResponse);
  if (isSignedIn && isLoginPage) return redirectTo(request, "/admin", supabaseResponse);

  return supabaseResponse;
}

/** Redirects while keeping any refreshed session cookies. */
function redirectTo(request: NextRequest, pathname: string, from: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const response = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}
