import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, ArrowLeft, Plus, Hash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/firestore";
import { getAuth } from "firebase-admin/auth";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

// 🔹 Server Action: Create Loan
async function createLoan(formData: FormData): Promise<void> {
  "use server";

  const userEmail = formData.get("userEmail") as string;
  const title = formData.get("title") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const dueDate = formData.get("dueDate") as string;
  const bank = formData.get("bank") as string;
  const customId = (formData.get("customId") as string)?.trim() || undefined;

  if (
    !userEmail ||
    !title ||
    isNaN(amount) ||
    amount <= 0 ||
    !dueDate ||
    !bank
  ) {
    redirect(
      `/admin/new-loan?error=${encodeURIComponent(
        "All fields are required and amount must be positive."
      )}&email=${encodeURIComponent(userEmail || "")}`
    );
    return;
  }

  try {
    const user = await getAuth().getUserByEmail(userEmail);
    const userId = user.uid;

    await db.collection("loans").add({
      userId,
      userEmail,
      title,
      amount,
      paid: 0,
      bank,
      dueDate,
      customId,
      createdAt: new Date().toISOString(),
    });

    redirect("/admin");
  } catch (error: unknown) {
    redirect(
      `/admin/new-loan?error=${encodeURIComponent(
        (error as Error).message || "Failed to create loan. User may not exist."
      )}&email=${encodeURIComponent(userEmail || "")}`
    );
  }
}

// 🔹 Page Component
export default function NewLoanPage({
  searchParams,
}: {
  searchParams: { error?: string; email?: string };
}) {
  const paramsPromise = Promise.resolve(searchParams); // turn into promise

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Loan</h1>
      </div>

      {/* Suspense boundary */}
      <Suspense fallback={<NewLoanSkeleton />}>
        <NewLoanForm promise={paramsPromise} />
      </Suspense>
    </div>
  );
}

// 🔹 Async wrapper that reads the promise
async function NewLoanForm({
  promise,
}: {
  promise: Promise<{ error?: string; email?: string }>;
}) {
  const params = await promise;
  const error = params.error;
  const email = params.email;

  return (
    <>
      {error && (
        <Card className="mb-6 border-red-500">
          <CardContent className="pt-6 text-red-600">
            {decodeURIComponent(error)}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>
            Enter the borrower&apos;s email and loan information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createLoan} className="space-y-6">
            {/* User Email */}
            <div>
              <Label htmlFor="userEmail">User Email</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  required
                  defaultValue={email || ""}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Must be a registered user in Firebase Auth.
              </p>
            </div>

            {/* Custom ID */}
            <div>
              <Label htmlFor="customId" className="flex items-center gap-1">
                Custom ID{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <div className="relative mt-2">
                <Hash className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="customId"
                  name="customId"
                  type="text"
                  placeholder="LOAN-2025-001"
                  className="pl-10 font-mono text-sm"
                  maxLength={50}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Unique identifier for internal tracking (e.g., LOAN-2025-001)
              </p>
            </div>

            {/* Loan Title */}
            <div>
              <Label htmlFor="title">Loan Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Home Loan, Car Loan, etc."
                required
              />
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Loan Amount (₹)</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-3 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="500000"
                  required
                  className="pl-8"
                />
              </div>
            </div>

            {/* Bank */}
            <div>
              <Label htmlFor="bank">Bank / Lender</Label>
              <Input id="bank" name="bank" placeholder="HDFC Bank" required />
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" size="lg" className="flex-1">
                <Plus className="mr-2 h-5 w-5" />
                Create Loan
              </Button>
              <Link href="/admin">
                <Button type="button" variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

// 🔹 Simple skeleton loader
function NewLoanSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/3" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
