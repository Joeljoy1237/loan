import { getLoanById, getLoanTransactions } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { FileText } from "lucide-react";

import { LoanHeader } from "@/components/loanDetails/LoanHeader";
import { LoanSummaryCard } from "@/components/loanDetails/LoanSummaryCard";
import { PaymentProgress } from "@/components/loanDetails/PaymentProgress";
import { TransactionList } from "@/components/loanDetails/TransactionList";
import { LoanSummarySkeleton } from "@/components/loanDetails/LoanSummarySkeleton";
import { TransactionListSkeleton } from "@/components/loanDetails/TransactionListSkeleton";

export default async function LoanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 🟢 Kick off both fetches immediately
  const loanPromise = getLoanById(id);
  const transactionsPromise = getLoanTransactions(id);

  return (
    <div className="container mx-auto p-6 pb-12 space-y-8 max-w-5xl">
      <LoanHeader />

      {/* Summary Section with Suspense */}
      <Suspense fallback={<LoanSummarySkeleton />}>
        <LoanSummarySection promise={loanPromise} />
      </Suspense>

      <Separator className="my-8" />

      {/* Transactions Section with Suspense */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Payment History
        </h2>

        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionSection promise={transactionsPromise} loanId={id} />
        </Suspense>
      </section>
    </div>
  );
}

// 🔹 Async section: Loan summary + progress
async function LoanSummarySection({
  promise,
}: {
  promise: ReturnType<typeof getLoanById>;
}) {
  const loan = await promise;
  if (!loan) notFound();

  return (
    <>
      <LoanSummaryCard loan={loan} />
      <div className="mt-6">
        <PaymentProgress paid={loan.paid} total={loan.amount} />
      </div>
    </>
  );
}

// 🔹 Async section: Transactions
async function TransactionSection({
  promise,
  loanId,
}: {
  promise: ReturnType<typeof getLoanTransactions>;
  loanId: string;
}) {
  const transactions = await promise;
  return <TransactionList loanId={loanId} transactions={transactions} />;
}
