import type { NextRequest } from "next/server";

function debugEnabled() {
  const v = String(process.env.DEBUG_MICROFRONTENDS || "").toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/**
 * Request-level traces for /blogs and /_astro when DEBUG_MICROFRONTENDS=1.
 * (Rewrite still happens in Next; this only logs that the request reached the edge.)
 */
export function middleware(request: NextRequest) {
  if (!debugEnabled()) return;

  const { pathname, search } = request.nextUrl;
  console.log("[microfrontends] request", {
    method: request.method,
    path: pathname + (search || ""),
    host: request.headers.get("host"),
  });
}

export const config = {
  matcher: ["/blogs", "/blogs/:path*", "/_astro/:path*"],
};
