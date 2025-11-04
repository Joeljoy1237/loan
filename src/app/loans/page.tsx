// app/loans/page.tsx
import { getUserLoans } from "@/lib/firestore";
import LoanList from "@/components/LoanList";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function LoansPage() {
  const token = (await headers()).get("Authorization")?.split("Bearer ")[1];
  if (!token) redirect("/login");

  let user;
  try {
    user = await getAdminAuth().verifyIdToken(token);
  } catch {
    redirect("/login");
  }

  const loans = await getUserLoans(user.uid);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Loans (ISR)</h1>
      <LoanList loans={loans} />
    </div>
  );
}
