// app/admin/loan/[id]/page.tsx
import { getLoanById, getLoanTransactions, addTransaction } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Plus } from 'lucide-react';
import { revalidatePath } from 'next/cache';

// Server Action: Add transaction
async function createTransaction(formData: FormData) {
  'use server';

  const loanId = formData.get('loanId') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const date = formData.get('date') as string;
  const note = formData.get('note') as string;

  if (!loanId || isNaN(amount) || amount <= 0 || !date) {
    throw new Error('Invalid input');
  }

  await addTransaction(loanId, { amount, date, note: note || undefined });
  revalidatePath(`/admin/loan/${loanId}`);
}

export default async function AdminLoanPage({ params }: { params: { id: string } }) {
  const [loan, transactions] = await Promise.all([
    getLoanById(params.id),
    getLoanTransactions(params.id),
  ]);

  if (!loan) notFound();

  // TODO: Add real admin auth check here
  // For now, we'll assume only admins can access /admin/*

  const remaining = loan.amount - loan.paid;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      {/* Loan Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{loan.title}</h1>
          <p className="text-muted-foreground">{loan.bank}</p>
        </div>
        <Badge variant={remaining > 0 ? 'destructive' : 'default'} className="text-lg px-3 py-1">
          {remaining > 0 ? `₹${remaining.toLocaleString()} due` : 'Paid Off'}
        </Badge>
      </div>

      <Separator />

      {/* Add Transaction Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Payment
          </CardTitle>
          <CardDescription>Record a new payment made toward this loan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTransaction} className="space-y-4">
            <input type="hidden" name="loanId" value={loan.id} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="5000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div>
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                name="note"
                placeholder="e.g., EMI for June"
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              <DollarSign className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>

        {transactions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No payments recorded yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">₹{tx.amount.toLocaleString()}</p>
                      {tx.note && <p className="text-sm text-muted-foreground">{tx.note}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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