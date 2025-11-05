import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Summary = {
  totalLoan: number;
  totalPaid: number;
  totalRemaining: number;
  numberOfLoans: number;
};

export default function LoanSummaryCard({ summary }: { summary: Summary }) {
  const paidPercent =
    summary.totalLoan > 0 ? (summary.totalPaid / summary.totalLoan) * 100 : 0;

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-xl sm:text-2xl font-semibold">
          Loan Overview
        </CardTitle>

        {/* ✅ Visual indicator on the right (only shows on medium+ screens) */}
        <div className="hidden sm:flex flex-col items-end text-sm text-muted-foreground">
          <span>Repayment Progress</span>
          <div className="w-40 h-2 bg-muted rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(paidPercent, 100)}%` }}
            />
          </div>
          <span className="text-xs mt-1">{paidPercent.toFixed(1)}% Paid</span>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {/* Total Loan */}
        <div className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">Total Loan</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-primary">
            ₹{summary.totalLoan.toLocaleString()}
          </p>
        </div>

        {/* Number of Loans */}
        <div className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">Number of Loans</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">
            {summary.numberOfLoans}
          </p>
        </div>

        {/* Total Paid */}
        <div className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-green-600">
            ₹{summary.totalPaid.toLocaleString()}
          </p>
        </div>

        {/* Remaining */}
        <div className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-red-600">
            ₹{summary.totalRemaining.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
  