import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const mine = searchParams.get("mine");
        const client = await clientPromise;
        const db = client.db("shopify_builder");

        let query = {};

        if (mine === "true") {
            const session = await getServerSession(authOptions);
            if (!session) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            query = { userId: session.user.id };
        }

        const sections = await db.collection("custom_sections").find(query).sort({ createdAt: -1 }).toArray();

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
            userId: session.user.id,
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

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { slug, ...updates } = data;

        if (!slug) {
            return NextResponse.json({ error: "Missing slug" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("shopify_builder");

        // Verify ownership before updating
        const existingSection = await db.collection("custom_sections").findOne({ slug });

        if (!existingSection) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        if (existingSection.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized to edit this section" }, { status: 403 });
        }

        // Update fields
        // Ensure we don't accidentally update immutable fields like _id or userId (though userId check handles auth)
        const allowedUpdates = { ...updates };
        delete allowedUpdates._id;
        delete allowedUpdates.userId;
        delete allowedUpdates.slug; // Slug shouldn't change
        delete allowedUpdates.createdAt;

        const result = await db.collection("custom_sections").updateOne(
            { slug },
            { $set: { ...allowedUpdates, updatedAt: new Date() } }
        );

        if (result.modifiedCount === 0) {
            // It's possible nothing changed, but success is true
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update section:", error);
        return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
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
            userId: session.user.id
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
