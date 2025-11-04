// lib/firestoreAdmin.ts
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";
import type { Loan } from "../types/loan";
import type { DocumentData } from "firebase-admin/firestore";

export type TransactionInput = {
    isReverse?: boolean;
    amount: number | string;
    date: string;
    note?: string | null;
};

// Initialize Firebase Admin
if (!admin.apps.length) {
    const {
        FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY,
    } = process.env;

    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
        throw new Error("Missing Firebase Admin environment variables");
    }

    // let privateKey;
    // try {
    //     privateKey = JSON.parse(FIREBASE_PRIVATE_KEY);
    // } catch (error: unknown) {
    //     throw new Error(error instanceof Error ? error.message : "FIREBASE_PRIVATE_KEY must be a valid JSON string");
    // }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
    });
}

export const db = getFirestore();

// Helper: Convert unknown Firestore doc to typed Loan
function parseLoan(doc: FirebaseFirestore.QueryDocumentSnapshot<DocumentData>): Loan | null {
    const data = doc.data();

    // Validate required fields
    if (
        typeof data.userId !== "string" ||
        typeof data.title !== "string" ||
        typeof data.bank !== "string" ||
        typeof data.dueDate !== "string" ||
        data.amount == null ||
        data.paid == null
    ) {
        console.warn(`Invalid loan document: ${doc.id}`, data);
        return null;
    }

    const amount = Number(data.amount);
    const paid = Number(data.paid);

    if (isNaN(amount) || isNaN(paid)) {
        console.warn(`Invalid number in loan: ${doc.id}`, { amount: data.amount, paid: data.paid });
        return null;
    }

    return {
        id: doc.id,
        userId: data.userId,
        amount,
        paid,
        title: data.title,
        bank: data.bank,
        dueDate: data.dueDate,
    };
}

export async function getUserLoans(uid: string): Promise<Loan[]> {
    const snapshot = await db.collection("loans").where("userId", "==", uid).get();

    // Use .map + filter out nulls
    return snapshot.docs
        .map(parseLoan)
        .filter((loan): loan is Loan => loan !== null);
}

export async function getLoanSummary(uid: string) {
    const loans = await getUserLoans(uid);

    const totalLoan = loans.reduce((sum, l) => sum + l.amount, 0);
    const totalPaid = loans.reduce((sum, l) => sum + l.paid, 0);

    return {
        totalLoan,
        totalPaid,
        totalRemaining: totalLoan - totalPaid,
        numberOfLoans: loans.length,
    };
}


export async function getLoanById(id: string): Promise<Loan | null> {
  const doc = await db.collection("loans").doc(id).get();
  if (!doc.exists) return null;

  const data = doc.data();
  if (!data || !isValidLoanData(data)) return null;

  return {
    id: doc.id,
    userId: data.userId,
    customId: data.customId || "",
    amount: Number(data.amount),
    paid: Number(data.paid),
    title: data.title,
    bank: data.bank,
    dueDate: data.dueDate,
  };
}

// Reuse your validation logic
function isValidLoanData(data: DocumentData) {
  return (
    typeof data.userId === "string" &&
    typeof data.title === "string" &&
    typeof data.bank === "string" &&
    typeof data.dueDate === "string" &&
    !isNaN(Number(data.amount)) &&
    !isNaN(Number(data.paid))
  );
}

export async function getLoanTransactions(loanId: string) {
    const snapshot = await db
        .collection("loans")
        .doc(loanId)
        .collection("transactions")
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            amount: Number(data.amount) || 0,
            date: data.date as string,
            time: data.createdAt?.toDate() || new Date(),
            note: data.note as string | undefined,
        };
    })
};

export async function addTransaction(loanId: string, data: TransactionInput) {
    const txRef = db.collection("loans").doc(loanId).collection("transactions").doc();
    const isReverse = data.isReverse || false;
    await txRef.set({
        ...data,
        amount: Number(isReverse ? -data.amount : data.amount),
        date: data.date,
        note: data.note?.trim() || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });



  // Optional: Update loan.paid
    await db.collection("loans").doc(loanId).update({
        amount: admin.firestore.FieldValue.increment(isReverse ? Number(data.amount) : 0),
        paid: admin.firestore.FieldValue.increment(isReverse ? 0 : Number(data.amount)),
    });
}


export async function deleteOneTransaction(loanId: string, transactionId: string) {
    const loanRef = db.collection("loans").doc(loanId);
    const txRef = loanRef.collection("transactions").doc(transactionId);

    try {
        const txSnap = await txRef.get();

        if (!txSnap.exists) {
            throw new Error("Transaction not found");
        }

        const txData = txSnap.data();

        if (txData?.amount > 0) {
            // Update loan balance (assuming you have a `balance` field in loan doc)
            await loanRef.update({
                paid: admin.firestore.FieldValue.increment(-txData?.amount),
            });
        } else {
            await loanRef.update({
                amount: admin.firestore.FieldValue.increment(txData?.amount),
            });
        }
        // Delete the transaction document
        await txRef.delete();

        console.log(`Transaction ${transactionId} deleted and reversed successfully.`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return { success: false, error };
    }
}


export async function fetchAllLoans() {
    const snapshot = await db.collection('loans').get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            userEmail: data.userEmail || 'unknown@example.com',
            amount: data.amount,
            paid: data.paid || 0,
            remaining: data.amount - (data.paid || 0),
            dueDate: data.dueDate,
        };
    });
}

