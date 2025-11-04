import { adminAuth } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "No token" }, { status: 400 });
    }

    // Verify ID token
    await adminAuth.verifyIdToken(idToken);

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in ms
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // ✅ Await cookies() before calling set()
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expiresIn / 1000,
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Session creation failed:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
