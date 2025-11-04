// components/LoanList.tsx
"use client";

import { useRouter } from "next/navigation";
import { Loan } from "@/types/loan";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function LoanList({ loans }: { loans: Loan[] }) {
  const router = useRouter();

  const handleLoanClick = (id: string) => {
    router.push(`/loan/${id}`);
  };

  if (!loans?.length) {
    return (
      <p className="text-center text-muted-foreground py-8">No loans found.</p>
    );
  }

  return (
    <div className="space-y-3">
      {loans.map((loan) => (
        <Card
          key={loan.id}
          onClick={() => handleLoanClick(loan.id)}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-px hover:border-primary/30"
        >
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-lg">
                {loan.title}
              </h3>
              <p className="text-sm text-muted-foreground">{loan.bank}</p>
            </div>

            <div className="flex flex-col text-right">
              <p className="font-semibold text-primary">
                ₹{loan.amount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Paid: ₹{loan.paid.toLocaleString()}
              </p>
              <p className="text-sm text-destructive font-medium">
                Due: {new Date(loan.dueDate).toLocaleDateString("en-GB")}
              </p>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 sm:ml-3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
