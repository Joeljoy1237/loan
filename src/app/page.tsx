// app/my/page.tsx
import { adminAuth } from "@/lib/firebaseAdmin";
import { getLoanSummary, getUserLoans } from "@/lib/firestore";
import LoanSummaryCard from "@/components/LoanSummaryCard";
import LoanList from "@/components/LoanList";
import AuthGuard from "@/components/AuthGuard";
import { getSession } from "@/lib/cookies";
import type { Loan } from "@/types/loan";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getSession();

  // If no session, skip data fetching but don't redirect
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

  // Verify session cookie
  let uid: string | null = null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session);
    uid = decoded.uid;
  } catch (error) {
    console.error("Session verification failed:", error);
  }

  // If verification fails
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

  // Fetch user-specific loan data
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

      <LoanSummaryCard summary={summary} />
      <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
      <LoanList loans={loans} />
    </div>
  </AuthGuard>
);
}