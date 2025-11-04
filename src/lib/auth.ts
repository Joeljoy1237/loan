// lib/auth.ts
import { cookies } from "next/headers";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth, DecodedIdToken } from "firebase-admin/auth";

// ✅ Firebase Admin config
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
};

// ✅ Initialize Firebase Admin (only once)
let adminApp: App;
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(firebaseAdminConfig),
  });
} else {
  adminApp = getApps()[0]!;
}

const adminAuth: Auth = getAuth(adminApp);

// ✅ Verify ID token
export async function verifyToken(idToken: string): Promise<DecodedIdToken | null> {
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// ✅ Create and store a session cookie
export async function setAuthCookie(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in ms
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

  const cookieStore = await cookies(); // ✅ must await here

  cookieStore.set("auth-token", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresIn / 1000,
    sameSite: "lax",
  });
}

// ✅ Get current authenticated user from cookie
export async function getCurrentUser(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies(); // ✅ must await here
  const sessionCookie = cookieStore.get("auth-token")?.value;

  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function getAllUsers() {
  const users = [];
  let nextPageToken;

  do {
    const result = await adminAuth.listUsers(1000, nextPageToken);
    users.push(...result.users);
    nextPageToken = result.pageToken;
  } while (nextPageToken);

  return users.map((user) => ({
    uid: user.uid,
    email: user.email,
    isAdmin: user.customClaims?.admin || false,
  }));
}
