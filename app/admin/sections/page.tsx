"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Layout,
    Search,
    Trash2,
    Shield,
    Loader2,
    Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useMounted } from "@/lib/hooks";
import { DeleteConfirmModal, SectionCreateModal } from "@/components/admin/CMSControls";
import { SectionEditor } from "@/components/shared/SectionEditor";

export default function AdminSectionsPage() {
    const { data: session, status } = useSession();
    const [sections, setSections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const mounted = useMounted();
    const [searchQuery, setSearchQuery] = useState("");

    // CMS Modal State
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [modalType, setModalType] = useState<"edit" | "delete" | "create" | null>(null);
    const [isEditingSection, setIsEditingSection] = useState(false);

    useEffect(() => {
        if (mounted) fetchSections();
    }, [mounted]);

    const fetchSections = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/admin");
            if (res.ok) {
                const result = await res.json();
                setSections(result.sections);
            }
        } catch (error) {
            toast.error("Registry sync error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSectionUpdate = async (updatedData: any) => {
        try {
            const res = await fetch("/api/sections", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: selectedItem.slug, ...updatedData }),
            });

            if (res.ok) {
                toast.success("Registry updated: Section synchronized globally");
                setIsEditingSection(false);
                setSelectedItem(null);
                setModalType(null);
                fetchSections();
            } else {
                toast.error("Sync failure");
            }
        } catch (error) {
            toast.error("Network synchronization error");
        }
    };

    const filteredSections = sections.filter((s: any) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!mounted || status === "loading" || isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none italic">
                        Studio <span className="text-primary italic">Index</span>
                    </h1>
                    <p className="text-zinc-500 font-medium mt-2">Manage and synchronize global component assets.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Filter sections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-6 py-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                        />
                    </div>
                    <button
                        onClick={() => setModalType("create")}
                        className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        <Plus className="h-3.5 w-3.5" /> Synthesize
                    </button>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[3rem] overflow-hidden shadow-xl"
            >
                <div className="overflow-x-auto min-h-[500px]">
                    <table className="w-full text-left">
                        <thead className="bg-[#fafafa] dark:bg-zinc-900/20">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Identification</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Publisher</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Timestamp</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                            <AnimatePresence mode="popLayout">
                                {filteredSections.map((item, idx) => (
                                    <motion.tr
                                        key={item.slug}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                                                    <Layout className="h-4 w-4 text-zinc-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-sm">{item.name}</span>
                                                    <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">ID: {item.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-zinc-500 font-bold text-xs">
                                            {item.userId}
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold">
                                                    {mounted ? new Date(item.createdAt).toLocaleDateString() : "---"}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Registered</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setIsEditingSection(true);
                                                    }}
                                                    className="h-10 w-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-primary transition-all"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setModalType("delete");
                                                    }}
                                                    className="h-10 w-10 flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modals */}
            <SectionCreateModal
                isOpen={modalType === "create"}
                onClose={() => setModalType(null)}
                onSuccess={fetchSections}
            />

            <DeleteConfirmModal
                type="section"
                target={selectedItem}
                isOpen={modalType === "delete"}
                onClose={() => {
                    setModalType(null);
                    setSelectedItem(null);
                }}
                onSuccess={fetchSections}
            />

            <AnimatePresence>
                {isEditingSection && selectedItem && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[100] bg-white dark:bg-black overflow-y-auto"
                    >
                        <SectionEditor
                            mode="edit"
                            initialName={selectedItem.name}
                            initialCode={selectedItem.code}
                            initialDescription={selectedItem.description}
                            initialCategory={selectedItem.category}
                            initialNiches={selectedItem.niches}
                            initialPreviewImage={selectedItem.preview}
                            onSave={handleSaveSectionUpdate}
                            onCancel={() => {
                                setIsEditingSection(false);
                                setSelectedItem(null);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
