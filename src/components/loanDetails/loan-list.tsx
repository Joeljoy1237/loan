"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Calendar, IndianRupee } from "lucide-react";

type LoanWithEmail = {
  id: string;
  title: string;
  customId: string;
  userEmail: string;
  amount: number;
  paid: number;
  remaining: number;
  dueDate: string;
};

export function AdminLoanList({
  isAdmin,
  loans,
}: {
  isAdmin: boolean;
  loans: LoanWithEmail[];
}) {
  const [query, setQuery] = useState("");

  const filteredLoans = useMemo(() => {
    const q = query.toLowerCase();
    return loans.filter(
      (loan) =>
        loan.title.toLowerCase().includes(q) ||
        loan.userEmail.toLowerCase().includes(q)
    );
  }, [query, loans]);

  function formatDate(dateString: string) {
    const formattedDueDate = new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formattedDueDate;
  }

  return (
    <>
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by user email or loan title..."
          className="pl-10 pr-4 py-6 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Loan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLoans.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-12">
            No loans found
          </p>
        ) : (
          filteredLoans.map((loan) => {
            const isPaidOff = loan.remaining <= 0;

            return (
              <Link
                key={loan.id}
                href={isAdmin ? `/admin/loan/${loan.id}` : `/loan/${loan.id}`}
              >
                <Card className="group hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {loan.title}
                        </CardTitle>
                        <CardDescription className="text-sm truncate">
                          {loan.userEmail}
                        </CardDescription>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {loan.customId || "N/A"}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {/* Row 1: Amounts */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <IndianRupee className="h-4 w-4" />
                        <span>Total</span>
                      </div>
                      <span className="font-semibold text-base">
                        ₹{loan.amount.toLocaleString()}
                      </span>
                    </div>

                    {/* Row 2: Paid and Remaining */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                          Paid
                        </span>
                        <span className="text-green-600 font-medium">
                          ₹{loan.paid.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground block">
                          Remaining
                        </span>
                        <Badge
                          variant={isPaidOff ? "default" : "destructive"}
                          className="text-sm px-3 py-1 mt-1"
                        >
                          ₹{loan.remaining.toLocaleString()}
                        </Badge>
                      </div>
                    </div>

                    {/* Row 3: Due Date */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-3 border-t">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Due: {formatDate(loan.dueDate)}</span>
                      </div>

                      {/* Status badge (right side) */}
                      <Badge
                        variant={isPaidOff ? "default" : "outline"}
                        className={`text-[10px] px-2 py-0.5 ${
                          isPaidOff
                            ? "bg-green-100 text-green-700"
                            : "border-yellow-400 text-yellow-600"
                        }`}
                      >
                        {isPaidOff ? "Paid Off" : "Active"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
