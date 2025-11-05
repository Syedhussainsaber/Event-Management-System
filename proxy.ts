import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth"; // ✅ Import from your NextAuth config

export async function proxy(req: NextRequest) {
  const session = await getServerSession(); // ✅ Automatically checks session from cookies

  const publicRoutes = ["/login", "/register"];



  // If no session, redirect to login page
  if (!session && !publicRoutes.includes(req.nextUrl.pathname)) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If session, redirect to home page
  if (session && publicRoutes.includes(req.nextUrl.pathname)) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  // ✅ Continue to requested route
  return NextResponse.next();
}

// ✅ Match only specific routes
export const config = {
  matcher: ["/create", "/my-events", "/profile", "/events/:path*/edit", "/login", "/register"],
};
