// types/loan.ts
export type Loan = {
    id: string;
    customId?: string;
    userId: string;
    amount: number;
    paid: number;
    title: string;
    bank: string;
    dueDate: string; // ISO date string: "2025-12-31"
};