// lib/auth.ts
import { cookies } from "next/headers";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { verifyIdToken as edgeVerifyIdToken } from "next-firebase-auth-edge";

const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
};

if (!getApps().length) {
    initializeApp({
        credential: cert(firebaseAdminConfig),
    });
}

const adminAuth = getAuth();

const firebaseClientConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

// ✅ Verify token (using next-firebase-auth-edge)
export async function verifyToken(token: string) {
    return edgeVerifyIdToken(token, firebaseClientConfig);
}

// ✅ Create and store a session cookie
export async function setAuthCookie(idToken: string) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in ms
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    cookies().set("auth-token", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: expiresIn / 1000,
        sameSite: "lax",
    });
}
