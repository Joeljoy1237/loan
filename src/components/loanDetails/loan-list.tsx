"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Search, ArrowRight, Calendar } from "lucide-react";
import { set } from "date-fns";

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

export function AdminLoanList({ isAdmin, loans }: { isAdmin: boolean; loans: LoanWithEmail[] }) {
  const [query, setQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  const filteredLoans = useMemo(() => {
    const q = query.toLowerCase();
    return loans.filter(
      (loan) =>
        loan.title.toLowerCase().includes(q) ||
        loan.userEmail.toLowerCase().includes(q)
    );
  }, [query, loans]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoans.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-12">
            No loans found
          </p>
        ) : (
          filteredLoans.map((loan) => (
            <Link key={loan.id} href={isAdmin ? `/admin/loan/${loan.id}` : `/loan/${loan.id}`}>
              <Card className="hover:shadow-xl transition-all hover:border-primary cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{loan.title}</CardTitle>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">ID: {loan.customId}</CardTitle>
                  <CardDescription>{loan.userEmail}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-semibold">
                      ₹{loan.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Paid</span>
                    <span className="font-medium text-green-600">
                      ₹{loan.paid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Due</span>
                    <Badge
                      variant={loan.remaining > 0 ? "destructive" : "default"}
                    >
                      ₹{loan.remaining.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Due: {isClient ? formatDate(loan.dueDate) : ""}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
