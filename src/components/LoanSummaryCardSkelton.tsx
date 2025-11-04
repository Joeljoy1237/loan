import { Skeleton } from "@/components/ui/skeleton";

export function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="p-4 border rounded-lg bg-card shadow-sm flex flex-col space-y-3"
        >
          {/* Label line */}
          <Skeleton className="h-4 w-1/2" />
          {/* Value line */}
          <Skeleton className="h-6 w-3/4" />
        </div>
      ))}
    </div>
  );
}
