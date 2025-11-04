// components/LoanSummaryCard.tsx
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
      <CardHeader>
        <CardTitle>Loan Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Total Loan</p>
          <p className="text-2xl font-bold">
            ₹{summary.totalLoan.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Number of Loans</p>
          <p className="text-2xl font-bold">{summary.numberOfLoans}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{summary.totalPaid.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="text-2xl font-bold text-red-600">
            ₹{summary.totalRemaining.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
