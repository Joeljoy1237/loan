// app/login/page.tsx
import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/cookies";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function LoginContent() {
  const session = await getSession();
  if (session) redirect("/");

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="flex justify-center p-8">Loading...</div>}
    >
      <LoginContent />
    </Suspense>
  );
}
