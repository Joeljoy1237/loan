import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

import { getLoanById, getLoanTransactions } from "@/lib/firestore";

import { LoanHeader } from "@/components/loanDetails/LoanHeader";
import { LoanSummaryCard } from "@/components/loanDetails/LoanSummaryCard";
import { TransactionList } from "@/components/loanDetails/TransactionList";
import { LoanSummarySkeleton } from "@/components/loanDetails/LoanSummarySkeleton";
import { TransactionListSkeleton } from "@/components/loanDetails/TransactionListSkeleton";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic"; // Always render fresh data

export default async function LoanPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // ✅ Start both data fetches immediately (parallel fetching)
  const loanPromise = getLoanById(id);
  const transactionsPromise = getLoanTransactions(id);

  return (
    <div className="container mx-auto p-6 pb-12 max-w-5xl space-y-8">
      {/* 🟢 Header: always instant */}
      <LoanHeader />

      {/* 🟢 Loan Summary (Suspense for async data) */}
      <Suspense fallback={<LoanSummarySkeleton />}>
        <LoanSummarySection loanPromise={loanPromise} />
      </Suspense>

      <Separator className="my-8" />

      {/* 🟢 Transactions List */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Payment History
        </h2>

        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionSection
            transactionsPromise={transactionsPromise}
            loanId={id}
          />
        </Suspense>
      </section>
    </div>
  );
}

/* ----------------------------- SECTIONS ----------------------------- */

// 🔹 Loan Summary + Progress
async function LoanSummarySection({
  loanPromise,
}: {
  loanPromise: ReturnType<typeof getLoanById>;
}) {
  const loan = await loanPromise;
  if (!loan) notFound();

  return (
    <div>
      <LoanSummaryCard loan={loan} />
    </div>
  );
}

// 🔹 Transactions List
async function TransactionSection({
  transactionsPromise,
  loanId,
}: {
  transactionsPromise: ReturnType<typeof getLoanTransactions>;
  loanId: string;
}) {
  const transactions = await transactionsPromise;
  return <TransactionList loanId={loanId} transactions={transactions} />;
}
