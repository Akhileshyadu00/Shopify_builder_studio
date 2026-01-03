"use client";

import React, { useState, useMemo } from "react";
import { SectionCard } from "@/components/shared/SectionCard";
import { sections, Niche } from "@/data/sections";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus, Sparkles } from "lucide-react";
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
        <div className="relative flex min-h-screen flex-col bg-white dark:bg-black overflow-hidden">
            {/* Global Noise Overlay */}
            <div className="bg-noise fixed inset-0 z-[100] pointer-events-none" />

            <main className="flex-1 relative z-10">
                <div className="container mx-auto px-4 py-20">
                    {/* Header */}
                    <div className="mb-20">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                            <div className="max-w-xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/5 bg-zinc-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-400"
                                >
                                    <Sparkles className="h-3 w-3" />
                                    <span>Verified Library</span>
                                </motion.div>
                                <h1 className="text-5xl font-black tracking-tighter sm:text-7xl uppercase leading-none">
                                    The <span className="text-primary italic">Drops</span>
                                </h1>
                                <p className="mt-6 text-lg text-zinc-500 font-medium max-w-sm">
                                    A curated collection of industry-leading liquid components.
                                </p>
                            </div>
                            <Link
                                href="/upload"
                                className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-black px-10 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-xl dark:bg-white dark:text-black"
                            >
                                <Plus className="h-4 w-4" />
                                Create Drop
                            </Link>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mb-12 space-y-8">
                        {/* Search Bar Refined */}
                        <div className="relative group max-w-2xl">
                            <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, tag, or niche..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-16 w-full rounded-[1.5rem] border border-zinc-100 bg-zinc-50/50 pl-14 pr-12 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5 transition-all hover:border-zinc-200"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 opacity-30">
                                <kbd className="flex h-6 w-6 items-center justify-center rounded-lg border border-black font-black text-[10px]">⌘</kbd>
                                <kbd className="flex h-6 w-6 items-center justify-center rounded-lg border border-black font-black text-[10px]">K</kbd>
                            </div>
                        </div>

                        {/* Niche Pills Refined */}
                        <div className="flex flex-wrap gap-2.5">
                            <button
                                onClick={() => setSelectedNiches([])}
                                className={cn(
                                    "h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                                    selectedNiches.length === 0
                                        ? "bg-black text-white shadow-lg"
                                        : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100"
                                )}
                            >
                                All
                            </button>
                            {niches.map((niche) => (
                                <button
                                    key={niche}
                                    onClick={() => toggleNiche(niche)}
                                    className={cn(
                                        "h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                                        selectedNiches.includes(niche)
                                            ? "bg-black text-white shadow-lg"
                                            : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100"
                                    )}
                                >
                                    {niche}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="mb-10 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                            Authenticated Result Set: {filteredSections.length}
                        </p>
                        {selectedNiches.length > 0 && (
                            <button
                                onClick={() => setSelectedNiches([])}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70"
                            >
                                Reset Filters <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>

                    {/* Grid */}
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            layout
                            className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {filteredSections.map((section, idx) => (
                                <motion.div
                                    key={section.slug}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                >
                                    <SectionCard section={section} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredSections.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-40 text-center">
                            <div className="mb-8 rounded-full bg-zinc-50 p-10 ring-1 ring-zinc-100">
                                <Search className="h-12 w-12 text-zinc-200" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic">No Matches In Matrix</h3>
                            <p className="mt-2 text-sm text-zinc-500 font-medium">Try broadening your search parameters.</p>
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

