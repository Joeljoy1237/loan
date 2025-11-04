// components/FirebaseAuthProvider.tsx
"use client";

import { useEffect } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Optional: auto-refresh token
      }
    });
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
