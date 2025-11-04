// app/api/admin/toggle-admin/route.ts
import { adminAuth } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const uid = formData.get("uid") as string;
        const makeAdmin = formData.get("makeAdmin") === "true";

        if (!uid) {
            return NextResponse.json({ error: "Missing UID" }, { status: 400 });
        }

        await adminAuth.setCustomUserClaims(uid, { admin: makeAdmin });
        return NextResponse.redirect("/admin/users");
    } catch (error) {
        console.error("Admin update failed:", error);
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }
}
