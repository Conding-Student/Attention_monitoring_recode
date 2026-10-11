// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/signin", "/login", "/about", "/unauthorized"];
const API_PUBLIC_PATHS = ["/api/auth/login", "/api/auth/logout"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Capture the embedding website's token before rendering the monitor.
  if (pathname === "/attention-monitoring") {
    const response = NextResponse.next();
    const tokens = request.nextUrl.searchParams.getAll("token");
    const incomingToken = tokens.length === 1 ? tokens[0].trim() : "";

    if (incomingToken) {
      response.cookies.set("auth_token", incomingToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
    }

    return response;
  }

  // Allow public paths
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  if (isPublic) return NextResponse.next();

  // Allow public API endpoints
  const isPublicApi = API_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  if (isPublicApi) return NextResponse.next();

  // Check token cookie for protected routes
  const token = request.cookies.get("token")?.value;

// --- Uncomment this if you have a session timeout/auto logout feature/module ---
  // For API routes, return 401
  // if (pathname.startsWith("/api/")) {
  //   if (!token) {
  //     return NextResponse.json(
  //       { error: "Unauthorized", message: "Session Expired", retCode: "104" },
  //       { status: 401 },
  //     );
  //   }
  //   return NextResponse.next();
  // }

  // For pages, redirect to unauthorized
  // if (!token) {
  //   const unauthorizedUrl = new URL("/unauthorized", request.url);
  //   unauthorizedUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(unauthorizedUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf)).*)",
  ],
};
