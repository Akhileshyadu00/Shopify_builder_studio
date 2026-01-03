"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SectionCard } from "@/components/shared/SectionCard";
import { useSectionStore } from "@/lib/section-store";
import { Loader2, Plus, Layout } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { mySections, fetchMySections, isLoading, mounted } = useSectionStore();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchMySections();
        }
    }, [status, fetchMySections]);

    if (!mounted || status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b dark:bg-zinc-950 dark:border-zinc-900 border-zinc-200">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">My Profile</h1>
                            <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium">
                                <span className="px-3 py-1 bg-zinc-100 rounded-full dark:bg-zinc-800">{session.user?.name}</span>
                                <span className="text-zinc-400">•</span>
                                <span>{session.user?.email}</span>
                            </div>
                        </div>
                        <Link href="/upload">
                            <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl dark:bg-white dark:text-black">
                                <Plus className="h-4 w-4" />
                                Create New
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Layout className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-black uppercase tracking-widest">My Collections</h2>
                    <span className="bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md text-[10px] font-bold dark:bg-zinc-800 dark:text-zinc-400">
                        {mySections.length}
                    </span>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[16/10] bg-zinc-200 dark:bg-zinc-900 rounded-[2rem] animate-pulse" />
                        ))}
                    </div>
                ) : mySections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mySections.map((section) => (
                            <SectionCard key={section.slug} section={section} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-zinc-200 rounded-[2rem] dark:border-zinc-800">
                        <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6 dark:bg-zinc-900">
                            <Layout className="h-8 w-8 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">No sections yet</h3>
                        <p className="text-zinc-500 max-w-sm mb-8">
                            You haven't created any custom sections yet. Start building your library today.
                        </p>
                        <Link href="/upload">
                            <button className="text-primary font-black uppercase tracking-widest text-xs hover:underline">
                                Start Building →
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
