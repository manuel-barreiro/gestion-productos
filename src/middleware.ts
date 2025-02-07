import { NextResponse } from "next/server"
import { auth } from "@/server/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAuthPage = nextUrl.pathname === "/sign-in"

  // Skip middleware for API routes
  if (nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // If logged in and trying to access /sign-in, redirect to home
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  // If not logged in and trying to access /, redirect to /sign-in
  if (!isLoggedIn && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/.*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/",
    "/sign-in",
  ],
}
