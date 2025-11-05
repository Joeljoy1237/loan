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
  const progress =
    loan.amount > 0 ? Math.min((loan.paid / loan.amount) * 100, 100) : 0;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        {/* ✅ Responsive top layout fix */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          {/* Left section */}
          <div className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight wrap-break-word">
              Loan ID: {loan.customId}
            </CardTitle>
            <h2 className="font-semibold">{loan.title}</h2>
            <CardDescription className="text-base">{loan.bank}</CardDescription>
          </div>

          {/* Right section (badge + progress) */}
          <div className="flex flex-col items-start sm:items-end gap-2 sm:min-w-[180px] w-full sm:w-auto">
            <Badge
              variant={isPaidOff ? "default" : "destructive"}
              className={`text-sm font-medium px-3 py-1 ${
                isPaidOff ? "bg-green-100 text-green-800" : ""
              }`}
            >
              {isPaidOff ? "Paid Off" : `₹${remaining.toLocaleString()} due`}
            </Badge>

            {/* Progress bar */}
            <div className="w-full sm:w-40 h-2 bg-muted rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-500 ${
                  isPaidOff ? "bg-green-600" : "bg-primary"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground sm:text-right w-full sm:w-auto">
              {progress.toFixed(1)}% repaid
            </p>
          </div>
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
