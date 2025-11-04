// app/loan/[id]/page.tsx
import { getLoanById, getLoanTransactions } from "@/lib/firestore";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, FileText } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  note?: string;
  date: string | number | Date;
}

export default async function LoanPage({ params }: { params: { id: string } }) {
  const [loan, transactions] = await Promise.all([
    getLoanById(params.id),
    getLoanTransactions(params.id),
  ]);

  if (!loan) notFound();

  const remaining = loan.amount - loan.paid;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      {/* Loan Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{loan.title}</CardTitle>
              <CardDescription>{loan.bank}</CardDescription>
            </div>
            <Badge variant={remaining > 0 ? "destructive" : "default"}>
              {remaining > 0
                ? `₹${remaining.toLocaleString()} due`
                : "Paid Off"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold">₹{loan.amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="font-semibold text-green-600">
                  ₹{loan.paid.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-semibold">
                  {new Date(loan.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Transactions List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Transactions
        </h2>

        {transactions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No transactions recorded yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx: Transaction) => (
              <Card key={tx.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">
                        ₹{tx.amount.toLocaleString()}
                      </p>
                      {tx.note && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {tx.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
