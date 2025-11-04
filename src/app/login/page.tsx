import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/cookies";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

async function LoginContent() {
  const session = await getSession();
  if (session) redirect("/");

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div>
      <Suspense fallback={<LoginSkeleton />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto p-6 border border-border/40 rounded-2xl shadow-md space-y-6 bg-card">
      <div className="space-y-2 text-center">
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
    </div>
  );
}
