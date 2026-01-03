"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, Heart, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/data/sections";

interface SectionCardProps {
    section: Section;
}

export const SectionCard = ({ section }: SectionCardProps) => {
    const {
        slug = "fallback",
        name = "Untitled Section",
        preview = "/previews/placeholder.png",
        niches = [],
        code = "",
        likes = 0,
        saves = 0
    } = section;

    const [isLiked, setIsLiked] = React.useState(false);
    const [isSaved, setIsSaved] = React.useState(false);
    const [likeCount, setLikeCount] = React.useState(likes);
    const [saveCount, setSaveCount] = React.useState(saves);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!code) return;
        navigator.clipboard.writeText(code);
        toast.success("Code copied to clipboard!");
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
    };

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSaved(!isSaved);
        setSaveCount(prev => isSaved ? prev - 1 : prev + 1);
        toast.success(isSaved ? "Removed from bookmarks" : "Saved to bookmarks");
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-2xl hover:shadow-primary/10"
        >
            <Link href={`/sections/${slug}`} className="absolute inset-0 z-10" />

            <div className="relative aspect-video overflow-hidden">
                <img
                    src={preview}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 md:opacity-0 md:group-hover:opacity-100 transition-all group-hover:opacity-100 z-20">
                    <button
                        onClick={handleLike}
                        className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${isLiked ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/40"
                            }`}
                    >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${isSaved ? "bg-primary text-white" : "bg-white/20 text-white hover:bg-white/40"
                            }`}
                    >
                        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex translate-y-4 items-center justify-between gap-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 z-20">
                    <Link
                        href={`/sections/${slug}`}
                        className="flex-1 rounded-lg bg-white/10 backdrop-blur-md px-3 py-2 text-center text-xs font-semibold text-white hover:bg-white/20"
                    >
                        Preview
                    </Link>
                    <button
                        onClick={handleCopy}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition-colors hover:bg-primary hover:text-white"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {niches.slice(0, 2).map((niche) => (
                            <span
                                key={niche}
                                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary"
                            >
                                {niche}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                            <Heart className={`h-3 w-3 ${likeCount > likes ? "text-red-500 fill-red-500" : ""}`} />
                            {likeCount}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                            <Bookmark className={`h-3 w-3 ${saveCount > saves ? "text-primary fill-primary" : ""}`} />
                            {saveCount}
                        </div>
                    </div>
                </div>
                <h3 className="line-clamp-2 text-sm sm:text-base font-bold leading-tight group-hover:text-primary transition-colors">
                    {name}
                </h3>
            </div>
        </motion.div>
    );
};
