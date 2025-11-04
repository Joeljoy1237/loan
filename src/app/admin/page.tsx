import { db } from "@/lib/firestore";
import { AdminLoanList } from "@/components/loanDetails/loan-list"; // 👈 new client component
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";

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

export default async function AdminHomePage() {
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
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage all loans and payments
          </p>
        </div>
        <div className="flex items-center space-x-4">
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
      </div>

      {/* 👇 Client-side loan list with search */}
      <AdminLoanList isAdmin={true} loans={allLoans} />
    </div>
  );
}
