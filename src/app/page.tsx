import { Suspense } from "react";
import { adminAuth } from "@/lib/firebaseAdmin";
import { getLoanSummary, getUserLoans } from "@/lib/firestore";
import { getSession } from "@/lib/cookies";

import AuthGuard from "@/components/AuthGuard";
import LoanSummaryCard from "@/components/LoanSummaryCard";
import LoanList from "@/components/LoanList";
import LogoutButton from "@/components/LogoutButton";
import { SummarySkeleton } from "@/components/LoanSummaryCardSkelton";
import { LoanListSkeleton } from "@/components/LoanListSkelton";

import type { Loan } from "@/types/loan";

export const dynamic = "force-dynamic";
export const revalidate = 60;

/* ----------------------------- Types ----------------------------- */
type Summary = {
  totalLoan: number;
  totalPaid: number;
  totalRemaining: number;
  numberOfLoans: number;
};

/* ------------------------- Data Functions ------------------------ */
/** Wraps data fetching in cache() for reuse during the render cycle */
import { cache } from "react";

const getUserSummary = cache(async (uid: string) => getLoanSummary(uid));
const getUserLoanList = cache(async (uid: string) => getUserLoans(uid));

/* --------------------- Async Suspense Wrappers -------------------- */
async function LoanSummarySection({
  summaryPromise,
}: {
  summaryPromise: Promise<Summary>;
}) {
  const summary = await summaryPromise;
  return <LoanSummaryCard summary={summary} />;
}

async function LoanListSection({
  loansPromise,
}: {
  loansPromise: Promise<Loan[]>;
}) {
  const rawLoans = await loansPromise;

  const loans = rawLoans.map((loan) => ({
    id: loan.id,
    userId: loan.userId ?? "",
    amount: Number(loan.amount) || 0,
    paid: Number(loan.paid) || 0,
    title: loan.title ?? "Untitled Loan",
    bank: loan.bank ?? "Unknown Bank",
    dueDate: loan.dueDate ?? new Date().toISOString().split("T")[0],
  }));

  return <LoanList loans={loans} />;
}

/* --------------------------- Page Logic --------------------------- */
export default async function Dashboard() {
  const session = await getSession();

  // Handle no session early for fast rejection
  if (!session) {
    return (
      <AuthGuard>
        <EmptyState
          title="My Loans"
          message="Please log in to view your loans."
        />
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
        <EmptyState
          title="My Loans"
          message="Couldn’t verify your session. Please log in again."
        />
      </AuthGuard>
    );
  }

  /* --------------------- Prefetch Data in Parallel -------------------- */
  // Start both fetches as soon as possible
  const summaryPromise = getUserSummary(uid);
  const loansPromise = getUserLoanList(uid);

  /* ----------------------------- Render ------------------------------ */
  return (
    <AuthGuard>
      <div className="container mx-auto p-6 max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">My Loans</h1>
          <LogoutButton />
        </div>

        {/* Loan Summary (suspense boundary 1) */}
        <Suspense fallback={<SummarySkeleton />}>
          <LoanSummarySection summaryPromise={summaryPromise} />
        </Suspense>

        {/* Loan List (suspense boundary 2) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
          <Suspense fallback={<LoanListSkeleton />}>
            <LoanListSection loansPromise={loansPromise} />
          </Suspense>
        </div>
      </div>
    </AuthGuard>
  );
}

/* ------------------------- Helper Component ------------------------- */
function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="container mx-auto p-6 max-w-5xl text-center text-muted-foreground">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      <p>{message}</p>
    </div>
  );
}
