import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Summary = {
  totalLoan: number;
  totalPaid: number;
  totalRemaining: number;
  numberOfLoans: number;
};

export default function LoanSummaryCard({ summary }: { summary: Summary }) {
  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl sm:text-2xl font-semibold">
          Loan Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Total Loan */}
        <div className="flex flex-col items-start sm:items-center lg:items-start">
          <p className="text-sm text-muted-foreground">Total Loan</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-primary">
            ₹{summary.totalLoan.toLocaleString()}
          </p>
        </div>

        {/* Number of Loans */}
        <div className="flex flex-col items-start sm:items-center lg:items-start">
          <p className="text-sm text-muted-foreground">Number of Loans</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">
            {summary.numberOfLoans}
          </p>
        </div>

        {/* Total Paid */}
        <div className="flex flex-col items-start sm:items-center lg:items-start">
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-green-600">
            ₹{summary.totalPaid.toLocaleString()}
          </p>
        </div>

        {/* Remaining */}
        <div className="flex flex-col items-start sm:items-center lg:items-start">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-red-600">
            ₹{summary.totalRemaining.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
