import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const sections = await db.collection("custom_sections").find({}).toArray();
        return NextResponse.json(sections);
    } catch (error) {
        console.error("Failed to fetch sections:", error);
        return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { name, slug, preview, niches, code, liquid, css, javascript, schema } = data;

        if (!name || !slug || !code) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const section = {
            name,
            slug,
            preview,
            niches,
            code,
            liquid,
            css,
            javascript,
            schema,
            isCustom: true,
            userId: session.user.id,
            createdAt: new Date(),
        };

        // Upsert by slug
        await db.collection("custom_sections").updateOne(
            { slug },
            { $set: section },
            { upsert: true }
        );

        return NextResponse.json({ success: true, section });
    } catch (error) {
        console.error("Failed to save section:", error);
        return NextResponse.json({ error: "Failed to save section" }, { status: 500 });
    }
}
