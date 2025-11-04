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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left Section */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg truncate">
                  {loan.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {loan.bank}
                </p>
              </div>

              {/* Middle Section (Amounts) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 text-right sm:text-left">
                <div>
                  <p className="font-semibold text-primary text-sm sm:text-base">
                    ₹{loan.amount.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Paid: ₹{loan.paid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-destructive font-medium mt-1 sm:mt-0">
                    Due:{" "}
                    {new Date(loan.dueDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Arrow Icon */}
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 self-end sm:self-center" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
