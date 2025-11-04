import { adminAuth } from "@/lib/firebaseAdmin";
import { getLoanSummary, getUserLoans } from "@/lib/firestore";
import LoanSummaryCard from "@/components/LoanSummaryCard";
import LoanList from "@/components/LoanList";
import AuthGuard from "@/components/AuthGuard";
import { getSession } from "@/lib/cookies";
import type { Loan } from "@/types/loan";
import LogoutButton from "@/components/LogoutButton";
import { Suspense } from "react";
import { LoanListSkeleton } from "@/components/LoanListSkelton";
import { SummarySkeleton } from "@/components/LoanSummaryCardSkelton";

export const dynamic = "force-dynamic";


type Summary = {
  totalLoan: number;
  totalPaid: number;
  totalRemaining: number;
  numberOfLoans: number;
};


// Component that resolves the summary promise
async function LoanSummaryWrapper({
  summaryPromise,
}: {
  summaryPromise: Promise<Summary>;
}) {
  const summary = await summaryPromise;
  return <LoanSummaryCard summary={summary} />;
}

// Component that resolves the loans promise
async function LoanListWrapper({
  loansPromise,
}: {
  loansPromise: Promise<Loan[]>;
}) {
  const rawLoans = await loansPromise;

  const loans: Loan[] = rawLoans.map((loan) => ({
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
          <p>Couldn&apos;t verify your session. Please log in again.</p>
        </div>
      </AuthGuard>
    );
  }

  // Create promises for the data
  const summaryPromise = getLoanSummary(uid);
  const loansPromise = getUserLoans(uid);

  return (
    <AuthGuard>
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Loans</h1>
          <LogoutButton />
        </div>

        <Suspense fallback={<SummarySkeleton />}>
          <LoanSummaryWrapper summaryPromise={summaryPromise} />
        </Suspense>

        <h2 className="text-xl font-semibold mb-4">Loan Details</h2>

        <Suspense fallback={<LoanListSkeleton />}>
          <LoanListWrapper loansPromise={loansPromise} />
        </Suspense>
      </div>
    </AuthGuard>
  );
}