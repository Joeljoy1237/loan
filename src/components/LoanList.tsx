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
    <div className="space-y-4">
      {loans.map((loan) => (
        <Card
          key={loan.id}
          onClick={() => handleLoanClick(loan.id)}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-px hover:border-primary/30"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Left section: Title + Bank */}
              <div className="flex-1 min-w-[150px]">
                <h3 className="font-semibold text-base sm:text-lg leading-snug">
                  {loan.title}
                </h3>
                <p className="text-sm text-muted-foreground">{loan.bank}</p>
              </div>

              {/* Right section: Amount + Paid + Due */}
              <div className="flex flex-col items-end text-right min-w-[140px]">
                <p className="font-semibold text-primary text-sm sm:text-base">
                  ₹{loan.amount.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Paid: ₹{loan.paid.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-destructive font-medium">
                  Due:{" "}
                  {new Date(loan.dueDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Arrow Icon */}
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
