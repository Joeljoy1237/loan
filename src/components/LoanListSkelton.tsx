import { Skeleton } from "@/components/ui/skeleton";

export function LoanListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="cursor-default border rounded-lg bg-card shadow-sm p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left section (Title + Bank) */}
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-5 w-2/3 sm:w-1/3" />
              <Skeleton className="h-4 w-1/2 sm:w-1/4" />
            </div>

            {/* Right section (Amounts + Due) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 text-right sm:text-left w-full sm:w-auto">
              <div className="space-y-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-1 sm:mt-0 mt-2">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Arrow icon */}
            <div className="hidden sm:block">
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
