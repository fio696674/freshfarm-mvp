import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Creates a Supabase client for use in the Next.js proxy (middleware).
 *
 * Uses request cookies for reading and response cookies for writing,
 * enabling session refresh during proxy execution.
 */
export function createClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          // Forward no-cache headers to prevent CDN from caching auth responses
          if (headers) {
            Object.entries(headers).forEach(([key, value]) =>
              response.headers.set(key, value)
            );
          }
        },
      },
    }
  );
}

/**
 * Session refresh and route protection.
 *
 * - Refreshes the Supabase session by calling getClaims() which validates
 *   the JWT signature (unlike getSession() which trusts the cookie blindly).
 * - /dashboard and /admin require authentication.
 * - /admin additionally requires the "admin" role in the profiles table.
 * - /login and /register redirect to /dashboard if already authenticated.
 *
 * @returns The (potentially modified) response.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createClient(request, response);

  // Refresh session — getClaims() validates the JWT signature against
  // the JWKS endpoint, unlike getSession() which just decodes the cookie.
  const { data, error } = await supabase.auth.getClaims();

  const isAuthenticated = !error && data?.claims;
  const pathname = request.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect /dashboard and /admin — require authentication
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }

    // /admin requires admin role — fetch from profiles table
    if (pathname.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data!.claims.sub)
        .single();

      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return response;
}
