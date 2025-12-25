"use client";

import React, { useState, useMemo } from "react";
import { SectionCard } from "@/components/shared/SectionCard";
import { sections, Niche } from "@/data/sections";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSectionStore } from "@/lib/section-store";
import Link from "next/link";
import { cn } from "@/lib/utils";

const niches: Niche[] = [
    "Beauty", "Electronics", "Dropshipping", "Fashion", "Fitness",
    "Home Decor", "Jewelry", "Luxury", "Minimal", "Ready-To-Use Templates"
];

function SectionLibraryContent() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");

    const { customSections, mounted, isLoading } = useSectionStore();
    const [selectedNiches, setSelectedNiches] = useState<Niche[]>([]);
    const [searchQuery, setSearchQuery] = useState(q || "");

    React.useEffect(() => {
        if (q !== null) {
            setSearchQuery(q);
        }
    }, [q]);

    const allSections = useMemo(() => {
        return [...sections, ...customSections];
    }, [customSections]);


    const filteredSections = useMemo(() => {
        return allSections.filter((section) => {
            const matchesSearch = section.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesNiche = selectedNiches.length === 0 ||
                (section.niches || []).some((n) => selectedNiches.includes(n));
            return matchesSearch && matchesNiche;
        });
    }, [searchQuery, selectedNiches, allSections]);

    const toggleNiche = (niche: Niche) => {
        setSelectedNiches((prev) =>
            prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
        );
    };

    if (!mounted || isLoading) {

        return (
            <div className="flex min-h-screen flex-col bg-muted/20">
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-12">
                        <div className="animate-pulse space-y-8">
                            <div className="h-10 w-64 bg-muted rounded"></div>
                            <div className="h-12 w-full bg-muted rounded-xl"></div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-video bg-muted rounded-xl"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <main className="flex-1">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight">Browse Sections</h1>
                                <p className="mt-2 text-muted-foreground">Find the perfect block for your Shopify store.</p>
                            </div>
                            <Link
                                href="/upload"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:scale-105"
                            >
                                <Plus className="h-4 w-4" />
                                Create New
                            </Link>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Search Bar */}
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-12 w-full rounded-xl border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Niche Pills */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedNiches([])}
                                className={cn(
                                    "h-9 rounded-full px-4 text-xs font-semibold transition-all",
                                    selectedNiches.length === 0 ? "bg-primary text-primary-foreground" : "border bg-background hover:bg-muted"
                                )}
                            >
                                All Niches
                            </button>
                            {niches.map((niche) => (
                                <button
                                    key={niche}
                                    onClick={() => toggleNiche(niche)}
                                    className={cn(
                                        "h-9 rounded-full px-4 text-xs font-semibold transition-all",
                                        selectedNiches.includes(niche) ? "bg-primary text-primary-foreground" : "border bg-background hover:bg-muted"
                                    )}
                                >
                                    {niche}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
                        <p>Showing {filteredSections.length} sections</p>
                        {selectedNiches.length > 0 && (
                            <button
                                onClick={() => setSelectedNiches([])}
                                className="flex items-center gap-1 text-primary hover:underline"
                            >
                                Clear all <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>

                    {/* Grid */}
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            layout
                            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {filteredSections.map((section) => (
                                <motion.div
                                    key={section.slug}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <SectionCard section={section} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredSections.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="mb-4 rounded-full bg-muted p-6">
                                <Search className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">No sections found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function SectionsPage() {
    return (
        <React.Suspense fallback={
            <div className="flex min-h-screen flex-col bg-muted/20">
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-12">
                        <div className="animate-pulse space-y-8">
                            <div className="h-10 w-64 bg-muted rounded"></div>
                            <div className="h-12 w-full bg-muted rounded-xl"></div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-video bg-muted rounded-xl"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        }>
            <SectionLibraryContent />
        </React.Suspense>
    );
}

