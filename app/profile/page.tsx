"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SectionCard } from "@/components/shared/SectionCard";
import { useSectionStore } from "@/lib/section-store";
import { Loader2, Plus, Layout, User, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { mySections, fetchMySections, isLoading, mounted } = useSectionStore();

    useEffect(() => {
        if (status === "authenticated") {
            fetchMySections();
        }
    }, [status, fetchMySections]);

    if (!mounted || status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-black selection:bg-primary/30">
            {/* Dynamic Background Element */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full"></div>
            </div>

            {/* Header section with glassmorphism */}
            <div className="relative pt-20 pb-16 px-6 overflow-hidden">
                <div className="container mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative h-32 w-32 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-4xl font-black text-zinc-400 overflow-hidden">
                                    {session.user?.name?.[0].toUpperCase() || <User className="h-12 w-12" />}
                                </div>
                                <div className="absolute bottom-1 right-1 bg-green-500 h-6 w-6 rounded-full border-4 border-white dark:border-black"></div>
                            </div>

                            <div className="text-center md:text-left space-y-3">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">{session.user?.name}</h1>
                                    {session.user?.role === 'admin' && (
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/20">
                                            <ShieldCheck className="h-3.5 w-3.5" /> Verified Creator
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-bold text-zinc-400">
                                    <span className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> {session.user?.email}
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <div className="flex items-center gap-3">
                                        <Link href="/profile/change-password">
                                            <button className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 hover:border-primary/30 transition-all">
                                                Update Security Key
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/upload">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative flex items-center gap-3 bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] transition-all"
                            >
                                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                                New Creation
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center shadow-sm">
                            <Layout className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-[0.2em]">Workshop</h2>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-1">
                                {mySections.length} Sections Published
                            </p>
                        </div>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[16/10] bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 animate-pulse shadow-sm" />
                            ))}
                        </div>
                    ) : mySections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {mySections.map((section) => (
                                <motion.div key={section.slug} variants={itemVariants}>
                                    <SectionCard section={section} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            variants={itemVariants}
                            className="group flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-zinc-950/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                        >
                            <div className="h-24 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 transition-transform group-hover:rotate-6">
                                <Layout className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                            </div>
                            <h3 className="text-2xl font-black mb-3">Your studio is empty</h3>
                            <p className="text-zinc-500 max-w-sm mb-10 font-medium">
                                Start building and sharing your custom Shopify sections with the world.
                            </p>
                            <Link href="/upload">
                                <button className="px-10 py-4 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">
                                    Initialize First Module →
                                </button>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
