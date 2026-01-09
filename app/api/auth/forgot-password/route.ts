import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { crypto } from "next/dist/compiled/@edge-runtime/primitives";
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

        if (!user) {
            // For security reasons, don't reveal that the user doesn't exist
            // but log it internally for debugging
            console.log(`Forgot password request for non-existent email: ${email}`);
            return NextResponse.json(
                { message: "If an account exists with this email, a reset link has been sent." },
                { status: 200 }
            );
        }

        // Generate token (32 chars)
        const token = Array.from(crypto.getRandomValues(new Uint8Array(20)))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

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

        // Send Email
        const emailResult = await sendPasswordResetEmail(email, token);

        if (!emailResult.success) {
            console.error("Failed to send email but token was saved:", emailResult.error);
        }

        return NextResponse.json(
            {
                message: "If an account exists with this email, a reset link has been sent.",
                mock: emailResult.mock // Inform frontend if in dev mode
            },
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
