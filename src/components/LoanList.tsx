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

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <Card
          key={loan.id}
          className="cursor-pointer transition-all hover:shadow-md hover:bg-accent/5"
          onClick={() => handleLoanClick(loan.id)}
        >
          <CardContent className="flex justify-between items-center py-4">
            <div>
              <h3 className="font-semibold">{loan.title}</h3>
              <p className="text-sm text-muted-foreground">{loan.bank}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{loan.amount.toLocaleString()}</p>
              <p className="text-sm">Paid: ₹{loan.paid.toLocaleString()}</p>
              <p className="text-sm text-red-600">
                Due: {new Date(loan.dueDate).toLocaleDateString()}
              </p>
            </div>
            <ArrowRight className="ml-4 h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
