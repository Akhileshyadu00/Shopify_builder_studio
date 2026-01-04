"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { sections } from "@/data/sections";
import { Loader2 } from "lucide-react";
import { useSectionStore } from "@/lib/section-store";
import { SectionDetailClient } from "@/components/sections/SectionDetailClient";

export default function SectionDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { customSections, mounted } = useSectionStore();

    const section = useMemo(() => {
        const staticSection = sections.find((s) => s.slug === slug);
        if (staticSection) return staticSection;
        if (!mounted) return undefined; // Don't look in customSections until mounted
        return customSections.find((s) => s.slug === slug);
    }, [slug, customSections, mounted]);

    if (!section) {
        if (!mounted) {
            return (
                <div className="flex min-h-screen items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Section not found</h1>
                <button onClick={() => router.push("/sections")} className="mt-4 text-primary hover:underline">
                    Back to all sections
                </button>
            </div>
        );
    }

    return <SectionDetailClient section={section} />;
}
