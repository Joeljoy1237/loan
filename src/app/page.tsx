import { adminAuth } from "@/lib/firebaseAdmin";
import { getLoanSummary, getUserLoans } from "@/lib/firestore";
import LoanSummaryCard from "@/components/LoanSummaryCard";
import LoanList from "@/components/LoanList";
import AuthGuard from "@/components/AuthGuard";
import { getSession } from "@/lib/cookies";
import type { Loan } from "@/types/loan";
import LogoutButton from "@/components/LogoutButton";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}

function LoanListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="p-4 border rounded-lg shadow-sm bg-card space-y-2"
        >
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    return (
      <AuthGuard>
        <div className="container mx-auto p-6 max-w-5xl text-center text-muted-foreground">
          <h1 className="text-2xl font-semibold mb-4">My Loans</h1>
          <p>Please log in to view your loans.</p>
        </div>
      </AuthGuard>
    );
  }

  let uid: string | null = null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session);
    uid = decoded.uid;
  } catch (error) {
    console.error("Session verification failed:", error);
  }

  if (!uid) {
    return (
      <AuthGuard>
        <div className="container mx-auto p-6 max-w-5xl text-center text-muted-foreground">
          <h1 className="text-2xl font-semibold mb-4">My Loans</h1>
          <p>Couldn’t verify your session. Please log in again.</p>
        </div>
      </AuthGuard>
    );
  }

  const [summary, rawLoans] = await Promise.all([
    getLoanSummary(uid),
    getUserLoans(uid),
  ]);

  const loans: Loan[] = rawLoans.map((loan) => ({
    id: loan.id,
    userId: loan.userId ?? uid,
    amount: Number(loan.amount) || 0,
    paid: Number(loan.paid) || 0,
    title: loan.title ?? "Untitled Loan",
    bank: loan.bank ?? "Unknown Bank",
    dueDate: loan.dueDate ?? new Date().toISOString().split("T")[0],
  }));

  return (
    <AuthGuard>
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Loans</h1>
          <LogoutButton />
        </div>

        <Suspense fallback={<SummarySkeleton />}>
          <LoanSummaryCard summary={summary} />
        </Suspense>

        <h2 className="text-xl font-semibold mb-4">Loan Details</h2>

        <Suspense fallback={<LoanListSkeleton />}>
          <LoanList loans={loans} />
        </Suspense>
      </div>
    </AuthGuard>
  );
}
