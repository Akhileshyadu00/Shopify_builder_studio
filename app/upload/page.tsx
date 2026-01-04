"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSectionStore } from "@/lib/section-store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { SectionEditor } from "@/components/shared/SectionEditor";
import { Niche } from "@/data/sections";

export default function UploadPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { addSection } = useSectionStore();
    const [mounted, setMounted] = useState(false);

    // Initial mount check
    useEffect(() => {
        setMounted(true);
    }, []);

    // Auth check
    useEffect(() => {
        if (mounted && status === "unauthenticated") {
            toast.error("Please login to upload sections");
            router.push("/");
        }
    }, [status, router, mounted]);

    if (!mounted || status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleSave = async (data: any) => {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        await addSection({
            slug,
            name: data.name,
            description: data.description,
            category: data.category,
            niches: data.niches as Niche[],
            preview: data.preview,
            code: data.code,
        });

        router.push(`/sections/${slug}?custom=true`);
    };

    return (
        <SectionEditor
            mode="create"
            onSave={handleSave}
            onCancel={() => router.push("/sections")}
        />
    );
}
