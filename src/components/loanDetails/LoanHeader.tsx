// app/loan/[id]/components/LoanHeader.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function LoanHeader() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link href="/" passHref>
        <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back to Loans
        </Button>
      </Link>
    </div>
  );
}
