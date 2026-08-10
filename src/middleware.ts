import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Auth.js v5 cookie names
  const token = request.cookies.get("authjs.session-token")?.value || 
                request.cookies.get("__Secure-authjs.session-token")?.value
  
  const isLoggedIn = !!token
  const pathname = request.nextUrl.pathname
  
  const isProtected = pathname.startsWith("/dashboard") || 
                      pathname.startsWith("/settings") || 
                      pathname.startsWith("/team") || 
                      pathname.startsWith("/analytics")
  const isAuthPage = pathname === "/login" || pathname === "/register"

  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|status).*)"],
}
