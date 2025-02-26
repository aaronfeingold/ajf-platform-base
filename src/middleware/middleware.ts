import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard)
  const path = request.nextUrl.pathname;

  // Determine if the path is public
  const isPublicPath = path === "/login" || path === "/register";

  // Get the token from the cookies
  const token = request.cookies.get("userToken")?.value || "";

  // If the path is public and the user is already logged in, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
