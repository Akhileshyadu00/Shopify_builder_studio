import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user?.role === "admin";
}

export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("shopify_builder");

        const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();
        const sections = await db.collection("custom_sections").find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({ users, sections });
    } catch (error) {
        console.error("Admin API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("shopify_builder");

        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.collection("users").insertOne({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            userId: result.insertedId
        }, { status: 201 });
    } catch (error) {
        console.error("Admin Create User Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, role, newPassword } = await req.json();

        const adminStatus = session.user.role === "admin";
        const isSelfPromotion = session.user.id === userId && role === "admin";

        // Only admins can change roles or passwords for others.
        // Special case: self-promotion for onboarding.
        if (!adminStatus && !isSelfPromotion) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("shopify_builder");

        let filter: any;
        try {
            filter = { _id: new ObjectId(userId) };
        } catch {
            filter = { _id: userId };
        }

        const updateData: any = {};
        if (role) updateData.role = role;
        if (newPassword) {
            updateData.password = await bcrypt.hash(newPassword, 12);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No updates provided" }, { status: 400 });
        }

        const result = await db.collection("users").updateOne(
            filter,
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: newPassword ? "Password reset successfully" : "User updated successfully" });
    } catch (error) {
        console.error("Admin Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const id = searchParams.get("id");

        if (!type || !id) {
            return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("shopify_builder");

        if (type === "section") {
            await db.collection("custom_sections").deleteOne({ slug: id });
        } else if (type === "user") {
            let filter: any;
            try {
                filter = { _id: new ObjectId(id) };
            } catch {
                filter = { _id: id };
            }

            const result = await db.collection("users").deleteOne(filter);

            if (result.deletedCount === 0) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            // Clean up user's sections
            await db.collection("custom_sections").deleteMany({ userId: id });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin Delete Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
