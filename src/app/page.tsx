// app/my/page.tsx
import { adminAuth } from "@/lib/firebaseAdmin";
import { getLoanSummary, getUserLoans } from "@/lib/firestore"; // ← ADMIN SDK
import LoanSummaryCard from "@/components/LoanSummaryCard";
import LoanList from "@/components/LoanList";
import AuthGuard from "@/components/AuthGuard";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/cookies";
import type { Loan } from "@/types/loan";

export const dynamic = "force-dynamic"; // SSR

export default async function Dashboard() {
  const session = await getSession();

  // No session → redirect to login
  if (!session) {
    redirect("/login");
  }

  // Verify session cookie
  let uid: string;
  try {
    const decoded = await adminAuth.verifySessionCookie(session);
    uid = decoded.uid;
  } catch (error) {
    console.error("Session verification failed:", error);
    redirect("/login");
  }

  // Fetch user-specific loan data using Admin SDK
  const [summary, rawLoans] = await Promise.all([
    getLoanSummary(uid),
    getUserLoans(uid),
  ]);

  // Type-safe mapping with defaults
  const loans: Loan[] = rawLoans.map((loan) => ({
    id: loan.id,
    userId: loan.userId ?? uid, // fallback to current user
    amount: Number(loan.amount) || 0,
    paid: Number(loan.paid) || 0,
    title: loan.title ?? "Untitled Loan",
    bank: loan.bank ?? "Unknown Bank",
    dueDate: loan.dueDate ?? new Date().toISOString().split("T")[0],
  }));

  return (
    <AuthGuard>
      <div className="container mx-auto p-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">My Loans</h1>
        <LoanSummaryCard summary={summary} />
        <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
        <LoanList loans={loans} />
      </div>
    </AuthGuard>
  );
}
