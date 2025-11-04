import { db } from "@/lib/firestore";
import { AdminLoanList } from "@/components/loanDetails/loan-list"; // 👈 new client component
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

function LoanListSkeleton() {
  return (
    <div className="space-y-4 mt-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 shadow-sm bg-card space-y-3"
        >
          <div className="flex justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-1/4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function page() {
  // Fetch once from Firestore
  const snapshot = await db.collection("loans").get();

  const allLoans: LoanWithEmail[] = snapshot.docs.map((doc) => {
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

      {/* 👇 Client-side loan list with search */}
      <Suspense fallback={<LoanListSkeleton />}>
        <AdminLoanList isAdmin={false} loans={allLoans} />
      </Suspense>
    </div>
  );
}
