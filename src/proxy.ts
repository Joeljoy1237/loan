import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function proxy(request: NextRequest) {
    const session = request.cookies.get("session")?.value;

    // Public paths (accessible without login)
    const publicPaths = ["/login", "/api/auth"];
    const isPublicPath = publicPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isPublicPath) return NextResponse.next();

    // No session → redirect to login
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
  }

    try {
      // ✅ Verify session cookie
      const decodedClaims = await adminAuth.verifySessionCookie(session, true);

      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      // ✅ If accessing an admin route but user isn’t admin
      if (isAdminRoute && !decodedClaims.admin) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      // Allow request
      return NextResponse.next();
  } catch (error) {
      console.error("Invalid session cookie:", error);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
  }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public|login|api/auth).*)",
    ],
};
