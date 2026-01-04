"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, Heart, Bookmark, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/data/sections";
import { useSectionStore, CustomSection } from "@/lib/section-store";

import { useSession } from "next-auth/react";

interface SectionCardProps {
    section: Section | CustomSection;
}

export const SectionCard = ({ section }: SectionCardProps) => {
    const { removeSection, toggleInteraction, likedSlugs, savedSlugs } = useSectionStore();
    const { status } = useSession();

    // We can't import useSession directly comfortably? 
    // Actually, let's use the one from next-auth/react
    // Need to make sure import is correct at top of file

    const isCustom = 'isCustom' in section && section.isCustom;
    const {
        slug = "fallback",
        name = "Untitled Section",
        preview = "/previews/placeholder.png",
        niches = [],
        code = "",
        likes = 0,
        saves = 0
    } = section;

    // Derived state from global store
    const isLiked = likedSlugs.includes(slug);
    const isSaved = savedSlugs.includes(slug);

    // Initial counts (static) + optimistic delta? 
    // For simplicity, we just use the static count + 1 if we toggled it ON and it wasn't before?
    // Actually simplicity is: just assume static count is source of truth for "others", 
    // but verifying "isLiked" adds 1 specifically for THIS user view if not already counted?
    // Let's just use local state for immediate feedback

    const [localLikes, setLocalLikes] = React.useState(likes);
    const [localSaves, setLocalSaves] = React.useState(saves);

    // Sync local counts when props change
    React.useEffect(() => {
        setLocalLikes(likes);
        setLocalSaves(saves);
    }, [likes, saves]);


    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!code) return;
        navigator.clipboard.writeText(code);
        toast.success("Code copied to clipboard!");
    };

    const handleInteraction = async (e: React.MouseEvent, action: "like" | "save") => {
        e.preventDefault();
        e.stopPropagation();

        if (status !== "authenticated") {
            toast.error(`Please login to ${action} sections`);
            return;
        }

        const isActive = action === "like" ? isLiked : isSaved;

        // Optimistic local update for count
        if (action === "like") {
            setLocalLikes(prev => isActive ? prev - 1 : prev + 1);
            toast.success(isActive ? "Removed from favorites" : "Added to favorites");
        } else {
            setLocalSaves(prev => isActive ? prev - 1 : prev + 1);
            toast.success(isActive ? "Removed from bookmarks" : "Saved to bookmarks");
        }

        toggleInteraction(slug, action);
    };

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-zinc-100 bg-white transition-all hover:border-black/5 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:glow-primary dark:border-zinc-900 dark:bg-zinc-950"
        >
            <Link href={`/sections/${slug}`} className="absolute inset-0 z-10" />

            <div className="relative aspect-[16/10] overflow-hidden m-2 rounded-[1.5rem]">
                <img
                    src={preview}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

                {/* Top Action Buttons (Glass) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transform translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <button
                        onClick={(e) => handleInteraction(e, "like")}
                        className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-95 ${isLiked ? "bg-red-500 border-red-400 text-white" : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                    >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                    <button
                        onClick={(e) => handleInteraction(e, "save")}
                        className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-95 ${isSaved ? "bg-black border-zinc-700 text-white" : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                    >
                        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                    {isCustom && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (confirm("Are you sure you want to delete this section?")) {
                                    removeSection(slug);
                                }
                            }}
                            className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-95 bg-red-500/80 text-white hover:bg-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Bottom Action Bar */}
                <div className="absolute bottom-5 left-5 right-5 flex translate-y-6 items-center justify-between gap-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 z-20">
                    <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2.5 text-center text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/20 transition-colors">
                        Inspect Section
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black transition-all hover:scale-105 active:scale-95 shadow-xl"
                    >
                        <Copy className="h-4.5 w-4.5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-6 pt-2">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {niches.slice(0, 2).map((niche) => (
                            <span
                                key={niche}
                                className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
                            >
                                {niche}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-zinc-400">
                        <div className="flex items-center gap-1.5 text-[10px] font-black">
                            <Heart className={`h-3.5 w-3.5 ${isLiked ? "text-red-500 fill-red-500" : ""}`} />
                            {localLikes}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black">
                            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "text-primary fill-primary" : ""}`} />
                            {localSaves}
                        </div>
                    </div>
                </div>
                <h3 className="line-clamp-2 text-lg font-black leading-[1.1] tracking-tight text-zinc-900 group-hover:text-primary transition-colors dark:text-white">
                    {name}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] dark:text-zinc-400">
                    <div className="w-4 h-px bg-zinc-200 dark:bg-zinc-800" />
                    Verified Liquid Source
                </div>
            </div>
        </motion.div>
    );
};

