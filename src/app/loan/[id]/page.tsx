// app/loan/[id]/page.tsx
import { getLoanById, getLoanTransactions } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { FileText } from "lucide-react";

import { LoanHeader } from "@/components/loanDetails/LoanHeader";
import { LoanSummaryCard } from "@/components/loanDetails/LoanSummaryCard";
import { PaymentProgress } from "@/components/loanDetails/PaymentProgress";
import { TransactionList } from "@/components/loanDetails/TransactionList";
import {
  LoanSummarySkeleton,
  TransactionListSkeleton,
} from "@/components/loanDetails/LoadingSkeleton";

export default async function LoanPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Fetch both in parallel
  const [loan, transactions] = await Promise.all([
    getLoanById(id),
    getLoanTransactions(id),
  ]);

  if (!loan) notFound();

  return (
    <div className="container mx-auto p-6 pb-12 space-y-8 max-w-5xl">
      <LoanHeader />

      {/* Summary Card with Progress */}
      <Suspense fallback={<LoanSummarySkeleton />}>
        <LoanSummaryCard loan={loan} />
        <div className="mt-6">
          <PaymentProgress paid={loan.paid} total={loan.amount} />
        </div>
      </Suspense>

      <Separator className="my-8" />

      {/* Transactions Section */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Payment History
        </h2>

        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionList loanId={id} transactions={transactions} />
        </Suspense>
      </section>
    </div>
  );
}
