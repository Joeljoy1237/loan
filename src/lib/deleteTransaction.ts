"use server";

import { deleteOneTransaction } from "@/lib/firestore";
import { revalidatePath } from "next/cache";

export async function deleteTransactionAction(loanId: string, transactionId: string) {
    try {
        await deleteOneTransaction(loanId, transactionId);
        revalidatePath(`/admin/loan/${loanId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return { success: false, error: "Failed to delete transaction" };
    }
}
