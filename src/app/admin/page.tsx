import { db } from "@/lib/firestore";
import { AdminLoanList } from "@/components/loanDetails/loan-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { Suspense } from "react";
import { LoanListSkeleton } from "@/components/LoanListSkelton";

export const dynamic = "force-dynamic";

// 🔹 Type definition
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

// 🔹 Firestore fetch function
async function getLoans(): Promise<LoanWithEmail[]> {
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

// 🟢 Run once at module level (per request)
const loanPromise = getLoans();

// 🔹 Page Component
export default function AdminHomePage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage all loans and payments
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center lg:justify-end space-x-4 mb-8">
        <Link href="/admin/manage-users">
          <Button size="lg" className="shadow-lg">
            <User className="mr-2 h-5 w-5" />
            Manage User
          </Button>
        </Link>
        <Link href="/admin/new-loan">
          <Button size="lg" className="shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Add New Loan
          </Button>
        </Link>
      </div>

      {/* Suspense Boundary */}
      <Suspense fallback={<LoanListSkeleton />}>
        <LoanListAwait promise={loanPromise} />
      </Suspense>
    </div>
  );
}

// 🔹 Async section for Suspense
async function LoanListAwait({
  promise,
}: {
  promise: Promise<LoanWithEmail[]>;
}) {
  const loans = await promise;
  return <AdminLoanList isAdmin={true} loans={loans} />;
}
