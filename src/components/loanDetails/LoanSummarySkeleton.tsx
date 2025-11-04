import { Skeleton } from "@/components/ui/skeleton";

export function LoanSummarySkeleton() {
  return (
    <div className="shadow-sm border rounded-lg p-6 animate-pulse bg-card">
      {/* Header section */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-40 sm:w-60" /> {/* Loan ID */}
          <Skeleton className="h-5 w-32 sm:w-48" /> {/* Title */}
          <Skeleton className="h-4 w-28 sm:w-36" /> {/* Bank name */}
        </div>
        <Skeleton className="h-7 w-24 rounded-full" /> {/* Badge */}
      </div>

      {/* Content grid (3 columns on larger screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-muted/50 flex items-center gap-3"
          >
            <Skeleton className="h-6 w-6 rounded-full" />{" "}
            {/* Icon placeholder */}
            <div className="space-y-2 w-full">
              <Skeleton className="h-3 w-1/2" /> {/* Label */}
              <Skeleton className="h-5 w-3/4" /> {/* Value */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
