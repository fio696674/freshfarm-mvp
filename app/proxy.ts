import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js Proxy (replaces middleware in Next.js 16).
 *
 * Runs before every matched request to refresh the Supabase session
 * and enforce route-level authentication/authorization.
 */
export async function proxy(request: NextRequest) {
  // Create a mutable response that updateSession can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  response = await updateSession(request, response);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder assets
     * - images in public/
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
