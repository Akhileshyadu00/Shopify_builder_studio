import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export async function PUT(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, role } = await req.json();

        if (!userId || !role) {
            return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("shopify_builder");
        const { ObjectId } = require("mongodb");

        let filter: any;
        try {
            filter = { _id: new ObjectId(userId) };
        } catch {
            filter = { _id: userId };
        }

        const result = await db.collection("users").updateOne(
            filter,
            { $set: { role } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
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
            const { ObjectId } = require("mongodb");
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
