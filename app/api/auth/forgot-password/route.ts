import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("shopify_builder");

        const user = await db.collection("users").findOne({ email });

        // We return success even if user not found for security (prevent email enumeration)
        if (!user) {
            return NextResponse.json(
                { message: "If an account exists with this email, a reset link has been sent." },
                { status: 200 }
            );
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        await db.collection("users").updateOne(
            { _id: user._id },
            {
                $set: {
                    resetToken: token,
                    resetTokenExpiry: expiry,
                },
            }
        );

        const emailResult = await sendPasswordResetEmail(email, token);

        if (!emailResult.success) {
            return NextResponse.json(
                { message: "Failed to send reset email. Please try again later." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "If an account exists with this email, a reset link has been sent." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { message: "An error occurred. Please try again later." },
            { status: 500 }
        );
    }
}
