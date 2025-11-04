import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function TransactionListSkeleton() {
  return (
    <div className="space-y-4">
      {/* We'll simulate 3 transaction rows */}
      {[...Array(3)].map((_, i) => (
        <Card
          key={i}
          className="overflow-hidden border bg-card shadow-sm animate-pulse"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              {/* Left section: icon + amount + note */}
              <div className="flex items-center gap-3 flex-1">
                {/* Icon bubble */}
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="space-y-2 flex-1">
                  {/* Amount */}
                  <Skeleton className="h-5 w-24 sm:w-32" />
                  {/* Note */}
                  <Skeleton className="h-3 w-40 sm:w-56" />
                </div>
              </div>

              {/* Right section: date + time + delete */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-2 text-right">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                {/* Delete button */}
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Optional "empty" placeholder skeleton */}
      <Card className="border-dashed bg-muted/10">
        <CardContent className="py-16 text-center space-y-3">
          <div className="flex justify-center">
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
          <Skeleton className="h-5 w-48 mx-auto" />
          <Skeleton className="h-3 w-60 mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
