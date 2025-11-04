// lib/firestoreAdmin.ts
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";
import type { Loan } from "../types/loan";
import type { DocumentData } from "firebase-admin/firestore";

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

    let privateKey;
    try {
        privateKey = JSON.parse(FIREBASE_PRIVATE_KEY);
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : "FIREBASE_PRIVATE_KEY must be a valid JSON string");
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
    });
}

const db = getFirestore();

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
        .orderBy("date", "desc")
        .get();

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            amount: Number(data.amount) || 0,
            date: data.date as string,
            note: data.note as string | undefined,
        };
    })
};

export async function addTransaction(loanId: string, data: TransactionInput) {
  const txRef = db.collection("loans").doc(loanId).collection("transactions").doc();

  await txRef.set({
    ...data,
    amount: Number(data.amount),
    date: data.date,
    note: data.note?.trim() || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Optional: Update loan.paid
  await db.collection("loans").doc(loanId).update({
    paid: admin.firestore.FieldValue.increment(data.amount),
  });
}