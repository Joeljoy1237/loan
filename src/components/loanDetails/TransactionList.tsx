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
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/30">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            No payments yet
          </h3>
          <p className="text-xs text-muted-foreground">
            Add a payment to see history here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {transactions.map((tx) => {
          const isNegative = tx.amount < 0;
          const absAmount = Math.abs(tx.amount);

          return (
            <Card
              key={tx.id}
              className={`border bg-background/80 hover:bg-muted/30 transition-colors duration-150`}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  {/* Left: Amount & Note */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0
                        ${
                          isNegative
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                    >
                      {isNegative ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p
                        className={`text-base sm:text-lg font-semibold leading-tight ${
                          isNegative ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isNegative ? "-" : ""}₹
                        {absAmount.toLocaleString("en-IN")}
                      </p>
                      {tx.note && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                          “{tx.note}”
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Date/Time/Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="flex flex-col items-start sm:items-end text-[11px] sm:text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{format(new Date(tx.date), "d MMM yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(tx.time), "h:mm a")}</span>
                      </div>
                    </div>

                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => setDeleteId(tx.id)}
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
              Are you sure you want to delete this transaction? This can’t be
              undone.
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
