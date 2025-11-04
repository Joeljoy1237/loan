// components/admin/AddPaymentForm.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BiRupee } from "react-icons/bi";

function SubmitButton({ pending, isReverse }: { pending: boolean; isReverse: boolean }) {
  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full md:w-auto transition-all",
        pending && "opacity-80"
      )}
    >
      {pending ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {isReverse ? "Reversing..." : "Recording..."}
        </>
      ) : (
        <>
          {isReverse ? (
            <ArrowDown className="mr-2 h-4 w-4" />
          ) : (
            <BiRupee className="mr-2 h-4 w-4" />
          )}
          {isReverse ? "Reverse Payment" : "Record Payment"}
        </>
      )}
    </Button>
  );
}

interface FormState {
  isError?: boolean;
  error?: string;
  isSuccess?: boolean;
  message?: string;
}

/** Server action must accept `isReverse` (true = deduct) */
interface AddPaymentFormProps {
  loanId: string;
  /** `isReverse` tells the server to subtract the amount from `paid` */
  action: (
    prevState: FormState,
    formData: FormData,
    isReverse: boolean
  ) => Promise<FormState>;
}

export function AddPaymentForm({ loanId, action }: AddPaymentFormProps) {
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  // Auto-focus amount on mount
  useEffect(() => {
    amountRef.current?.focus();
  }, []);

  // Auto-clear success after 3 s
  useEffect(() => {
    if (state.isSuccess) {
      const timer = setTimeout(() => setState({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.isSuccess]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setState({});

    const form = e.currentTarget;
    const formData = new FormData(form);
    const amountStr = formData.get("amount") as string;
    const date = formData.get("date") as string;

    // ---- client validation ----
    const amount = parseFloat(amountStr);
    if (!amountStr || isNaN(amount) || amount <= 0) {
      setState({ isError: true, error: "Please enter a valid amount" });
      setPending(false);
      return;
    }
    if (!date) {
      setState({ isError: true, error: "Please select a date" });
      setPending(false);
      return;
    }

    try {
      const result = await action(state, formData, isReverse);
      setState(result);

      if (!result.isError) {
        form.reset();
        const dateInput = form.querySelector('input[name="date"]') as HTMLInputElement;
        if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
        amountRef.current?.focus();
      }
    } catch (err: unknown) {
      setState({
        isError: true,
        error: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="loanId" value={loanId} />

      {/* ---- Toggle ---- */}
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm text-muted-foreground">Record</span>
        <button
          type="button"
          onClick={() => setIsReverse((v) => !v)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            isReverse ? "bg-destructive" : "bg-primary"
          )}
          aria-label={isReverse ? "Reverse mode" : "Record mode"}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
              isReverse ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
        <span className="text-sm text-muted-foreground">Reverse</span>
      </div>

      {/* ---- Grid ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="flex items-center gap-1">
            Amount <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {isReverse ? <ArrowDown className="h-4 w-4" /> : "₹"}
            </span>
            <Input
              ref={amountRef}
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="5000"
              required
              disabled={pending}
              className={cn("pl-8", isReverse && "pr-10")}
              aria-label="Payment amount in rupees"
            />
            {isReverse && (
              <ArrowUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-1">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            disabled={pending}
            defaultValue={new Date().toISOString().split("T")[0]}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {/* ---- Note ---- */}
      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          name="note"
          placeholder={isReverse ? "e.g., Refund for over-payment" : "e.g., EMI for June"}
          rows={2}
          disabled={pending}
          className="resize-none"
        />
      </div>

      {/* ---- Submit ---- */}
      <div className="flex justify-end">
        <SubmitButton pending={pending} isReverse={isReverse} />
      </div>

      {/* ---- Feedback ---- */}
      <div className="min-h-6 space-y-2">
        {state.isSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-600 animate-in slide-in-from-bottom-2">
            <CheckCircle className="h-4 w-4" />
            <span>{state.message || (isReverse ? "Payment reversed!" : "Payment recorded!")}</span>
          </div>
        )}
        {state.isError && (
          <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-bottom-2">
            <AlertCircle className="h-4 w-4" />
            <span>{state.error}</span>
          </div>
        )}
      </div>
    </form>
  );
}