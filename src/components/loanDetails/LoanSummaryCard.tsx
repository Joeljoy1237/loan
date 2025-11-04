// app/loan/[id]/components/LoanSummaryCard.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BiRupee, BiCalendar } from "react-icons/bi";
import { format } from "date-fns";
import { Loan } from "@/types/loan";

interface LoanSummaryCardProps {
  loan: Loan;
}

export function LoanSummaryCard({ loan }: LoanSummaryCardProps) {
  const remaining = loan.amount - loan.paid;
  const isPaidOff = remaining <= 0;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
              Loan ID: {loan.customId}
            </CardTitle>
            <h2 className="font-semibold">
              {loan.title}
            </h2>
            <CardDescription className="text-base">{loan.bank}</CardDescription>
          </div>
          <Badge
            variant={isPaidOff ? "default" : "destructive"}
            className={`text-sm font-medium px-3 py-1 ${
              isPaidOff ? "bg-green-100 text-green-800" : ""
            }`}
          >
            {isPaidOff ? "Paid Off" : `₹${remaining.toLocaleString()} due`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <BiRupee className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-lg font-bold">
                ₹{loan.amount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
            <BiRupee className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ₹{loan.paid.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <BiCalendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="text-lg font-semibold">
                {format(new Date(loan.dueDate), "d MMM yyyy")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
