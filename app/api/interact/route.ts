import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { slug, action } = await req.json();

        if (!slug || !["like", "save"].includes(action)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("shopify_builder");
        const collection = db.collection("interactions");

        // Find existing interaction for this slug
        const doc = await collection.findOne({ slug });

        // Initialize if not exists
        let likedBy = doc?.likedBy || [];
        let savedBy = doc?.savedBy || [];

        let isActive = false;

        if (action === "like") {
            if (likedBy.includes(userId)) {
                likedBy = likedBy.filter((id: string) => id !== userId);
                isActive = false;
            } else {
                likedBy.push(userId);
                isActive = true;
            }
        } else if (action === "save") {
            if (savedBy.includes(userId)) {
                savedBy = savedBy.filter((id: string) => id !== userId);
                isActive = false;
            } else {
                savedBy.push(userId);
                isActive = true;
            }
        }

        // Upsert the interaction document
        await collection.updateOne(
            { slug },
            {
                $set: {
                    slug,
                    likedBy,
                    savedBy,
                    likes: likedBy.length,
                    saves: savedBy.length,
                    lastUpdated: new Date()
                }
            },
            { upsert: true }
        );

        // Also update the main custom_sections collection if it exists there, 
        // to keep counts in sync for public display without joining
        // (This is a bit redundant but good for performance on listing pages if we display counts there)
        await db.collection("custom_sections").updateOne(
            { slug },
            {
                $set: {
                    [action === "like" ? "likes" : "saves"]: action === "like" ? likedBy.length : savedBy.length
                }
            }
        );

        return NextResponse.json({
            success: true,
            isActive,
            count: action === "like" ? likedBy.length : savedBy.length
        });

    } catch (error) {
        console.error("Interaction error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ likedSlugs: [], savedSlugs: [] });
        }

        const userId = session.user.id;
        const client = await clientPromise;
        const db = client.db("shopify_builder");

        // Fetch all interactions where this user is involved
        // This could be optimized, but fine for now
        const interactions = await db.collection("interactions").find({
            $or: [
                { likedBy: userId },
                { savedBy: userId }
            ]
        }).toArray();

        const likedSlugs = interactions
            .filter(doc => doc.likedBy?.includes(userId))
            .map(doc => doc.slug);

        const savedSlugs = interactions
            .filter(doc => doc.savedBy?.includes(userId))
            .map(doc => doc.slug);

        return NextResponse.json({ likedSlugs, savedSlugs });

    } catch (error) {
        console.error("Fetch interactions error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
