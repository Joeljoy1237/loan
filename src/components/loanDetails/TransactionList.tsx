// app/loan/[id]/components/TransactionList.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteTransactionAction } from "@/lib/deleteTransaction";

interface Transaction {
  id: string;
  amount: number;
  note?: string;
  time: string | number | Date;
  date: string | number | Date;
}

interface TransactionListProps {
  transactions: Transaction[];
  isAdmin?: boolean;
  loanId: string;
  revalidate?: (path: string) => Promise<void>;
}

export function TransactionList({
  transactions,
  loanId,
  isAdmin = false,
  revalidate,
}: TransactionListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteTransactionAction(loanId, deleteId);
      revalidate?.(`/admin/loan/${loanId}`);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="border-dashed bg-muted/10">
        <CardContent className="py-16 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No payments recorded yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Start tracking payments to see history here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {transactions.map((tx, index) => {
          const isNegative = tx.amount < 0;
          const absAmount = Math.abs(tx.amount);

          return (
            <Card
              key={tx.id}
              className={`
                overflow-hidden border
                transition-all duration-200
                hover:shadow-md hover:-translate-y-0.5
                ${index === 0 ? "ring-2 ring-primary/20" : ""}
              `}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Amount + Icon */}
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`
                        flex h-11 w-11 items-center justify-center rounded-full
                        ${
                          isNegative
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }
                      `}
                    >
                      {isNegative ? (
                        <ArrowDown className="h-5 w-5" />
                      ) : (
                        <ArrowUp className="h-5 w-5" />
                      )}
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <p
                        className={`
                          text-xl font-bold
                          ${isNegative ? "text-red-600" : "text-green-600"}
                        `}
                      >
                        {isNegative ? "-" : ""}₹
                        {absAmount.toLocaleString("en-IN")}
                      </p>
                      {tx.note && (
                        <p className="text-sm text-muted-foreground italic max-w-md truncate">
                          “{tx.note}”
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Date, Time, Delete */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1 text-right">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{format(new Date(tx.date), "d MMM yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(tx.time), "h:mm a")}</span>
                      </div>
                    </div>

                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setDeleteId(tx.id);
                        }}
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
