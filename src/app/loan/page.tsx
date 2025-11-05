import { Suspense } from "react";
import { db } from "@/lib/firestore";
import { AdminLoanList } from "@/components/loanDetails/loan-list";
import { LoanListSkeleton } from "@/components/LoanListSkelton";

export const dynamic = "force-dynamic";

type LoanWithEmail = {
  id: string;
  title: string;
  customId: string;
  userEmail: string;
  amount: number;
  paid: number;
  remaining: number;
  dueDate: string;
};

// 🔹 Async fetch function
async function fetchLoans(): Promise<LoanWithEmail[]> {
  const snapshot = await db.collection("loans").get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "Untitled",
      customId: data.customId || "",
      userEmail: data.userEmail || "unknown@example.com",
      amount: Number(data.amount) || 0,
      paid: Number(data.paid) || 0,
      remaining: (Number(data.amount) || 0) - (Number(data.paid) || 0),
      dueDate: data.dueDate || "1970-01-01",
    };
  });
}

// ✅ This async component runs *inside* Suspense
async function LoanListLoader() {
  const allLoans = await fetchLoans(); // Suspense handles the promise
  return <AdminLoanList isAdmin={false} loans={allLoans} />;
}

export default function Page() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Group Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            View all loans and payments
          </p>
        </div>
      </div>

      {/* 👇 Suspense now actually suspends */}
      <Suspense fallback={<LoanListSkeleton />}>
        <LoanListLoader />
      </Suspense>
    </div>
  );
}
