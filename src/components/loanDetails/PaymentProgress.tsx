// app/loan/[id]/components/PaymentProgress.tsx
interface PaymentProgressProps {
  paid: number;
  total: number;
}

export function PaymentProgress({ paid, total }: PaymentProgressProps) {
  const percentage = Math.min(Math.round((paid / total) * 100), 100);
  const isPaidOff = paid >= total;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Payment Progress</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isPaidOff ? "bg-green-500" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
