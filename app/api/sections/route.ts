import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("shopify_builder");
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
        const db = client.db("shopify_builder");


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
            userId: (session.user as any).id,
            likes: 0,
            saves: 0,
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

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("shopify_builder");

        // Only allow deleting sections created by the user
        const result = await db.collection("custom_sections").deleteOne({
            slug,
            userId: (session.user as any).id
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Section not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete section:", error);
        return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
    }
}
