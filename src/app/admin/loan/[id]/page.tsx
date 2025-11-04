import { Suspense } from "react";
import {
  getLoanById,
  getLoanTransactions,
  addTransaction,
} from "@/lib/firestore";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

import { AdminLoanHeader } from "@/components/admin/AdminLoanHeader";
import { AddPaymentForm } from "@/components/admin/AddPaymentForm";
import { LoanSummaryCard } from "@/components/loanDetails/LoanSummaryCard";
import { PaymentProgress } from "@/components/loanDetails/PaymentProgress";
import { TransactionList } from "@/components/loanDetails/TransactionList";
import { LoanSummarySkeleton } from "@/components/loanDetails/LoanSummarySkeleton";
import { TransactionListSkeleton } from "@/components/loanDetails/TransactionListSkeleton";
interface FormState {
  isError?: boolean;
  error?: string;
  isSuccess?: boolean;
  message?: string;
}

// 🔹 Server action for adding a transaction
async function createTransaction(
  prevState: FormState,
  formData: FormData,
  isReverse: boolean
): Promise<FormState> {
  "use server";

  try {
    const loanId = formData.get("loanId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const date = formData.get("date") as string;
    const note = (formData.get("note") as string) || undefined;

    if (!loanId || isNaN(amount) || amount <= 0 || !date) {
      return {
        isError: true,
        error: "Please fill all required fields correctly.",
      };
    }

    await addTransaction(loanId, { isReverse, amount, date, note });
    revalidatePath(`/admin/loan/${loanId}`);

    return { isSuccess: true, message: "Payment recorded!" };
  } catch (error) {
    return { isError: true, error: "Failed to record payment. Try again." };
  }
}

const revalidate = async (path: string) => {
  "use server";
  revalidatePath(path);
};

// 🔹 Page
export default async function AdminLoanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Instead of awaiting immediately, build promises
  const loanPromise = getLoanById(id);
  const transactionsPromise = getLoanTransactions(id);

  return (
    <div className="container mx-auto p-6 pb-12 space-y-8 max-w-5xl">
      <AdminLoanHeader />

      {/* 🔸 Loan Summary Section */}
      <Suspense fallback={<LoanSummarySkeleton />}>
        <LoanSummarySection promise={loanPromise} />
      </Suspense>

      <Separator className="my-8" />

      {/* 🔸 Add Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Payment
          </CardTitle>
          <CardDescription>
            Record a new payment made toward this loan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddPaymentForm loanId={id} action={createTransaction} />
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* 🔸 Transaction History Section */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Payment History
        </h2>

        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionSection
            promise={transactionsPromise}
            loanId={id}
            revalidate={revalidate}
          />
        </Suspense>
      </section>
    </div>
  );
}

// 🔹 Async section for loan summary
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

// 🔹 Async section for transaction list
async function TransactionSection({
  promise,
  loanId,
  revalidate,
}: {
  promise: ReturnType<typeof getLoanTransactions>;
  loanId: string;
  revalidate: (path: string) => Promise<void>;
}) {
  const transactions = await promise;
  return (
    <TransactionList
      revalidate={revalidate}
      loanId={loanId}
      transactions={transactions}
      isAdmin={true}
    />
  );
}
