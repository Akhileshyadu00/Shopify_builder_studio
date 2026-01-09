import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: "Both current and new passwords are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { message: "New password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("shopify_builder");

        const user = await db.collection("users").findOne({
            _id: new ObjectId(session.user.id)
        });

        if (!user || !user.password) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: "Incorrect current password" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user
        await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
        );

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Change password error:", error);
        return NextResponse.json(
            { message: "An error occurred. Please try again later." },
            { status: 500 }
        );
    }
}
