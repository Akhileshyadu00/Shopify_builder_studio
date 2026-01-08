"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Search,
    Shield,
    Trash2,
    Loader2,
    UserPlus,
    Layout,
    Eye,
    Fingerprint
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useMounted } from "@/lib/hooks";
import { UserEditModal, DeleteConfirmModal, UserCreateModal, UserSectionsModal } from "@/components/admin/CMSControls";

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const mounted = useMounted();
    const [searchQuery, setSearchQuery] = useState("");

    // CMS Modal State
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [modalType, setModalType] = useState<"edit-user" | "delete-user" | "create-user" | "view-sections" | null>(null);

    useEffect(() => {
        if (mounted) fetchFleetData();
    }, [mounted]);

    const fetchFleetData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/admin");
            if (res.ok) {
                const result = await res.json();
                setUsers(result.users);
                setSections(result.sections);
            }
        } catch (error) {
            toast.error("Failed to load user archives");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter((u: any) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u._id.toLowerCase().includes(searchQuery.toLowerCase())
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
                        User <span className="text-primary italic">Base</span>
                    </h1>
                    <p className="text-zinc-500 font-medium mt-2">Complete registry of registered identities and fleet status.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-6 py-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-black uppercase tracking-widest"
                        />
                    </div>
                    <button
                        onClick={() => setModalType("create-user")}
                        className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap"
                    >
                        <UserPlus className="h-3.5 w-3.5" /> Register Identity
                    </button>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[3rem] overflow-hidden shadow-xl"
            >
                <div className="overflow-x-auto min-h-[500px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#fafafa] dark:bg-zinc-900/20">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 dark:border-zinc-900">User Profile / ID</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 text-center">Status / Role</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 text-center">Asset Count</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 text-center">Date Created</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 text-right">CMS Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                            <AnimatePresence mode="popLayout">
                                {filteredUsers.map((user, idx) => {
                                    const userSectionsCount = sections.filter(s => s.userId === user._id || s.userId === user.email).length;

                                    return (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                                        >
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 font-black text-xs border border-zinc-200 dark:border-zinc-800 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-500">
                                                        {user.name?.[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-sm text-black dark:text-white capitalize">{user.name}</span>
                                                        <span className="text-[10px] font-bold text-zinc-400">{user.email}</span>
                                                        <code className="text-[8px] text-zinc-500 dark:text-zinc-600 mt-1 uppercase tracking-tighter">HEX_ID: {user._id}</code>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${user.role === 'admin'
                                                        ? "bg-primary text-black"
                                                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                                                        }`}>
                                                        {user.role || 'user'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                                        <span className="text-[8px] font-black uppercase text-zinc-500 tracking-tighter">Verified</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setModalType("view-sections");
                                                    }}
                                                    className="inline-flex flex-col items-center gap-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-primary/30 transition-all group/btn"
                                                >
                                                    <span className="text-sm font-black text-black dark:text-white">{userSectionsCount}</span>
                                                    <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1 group-hover/btn:text-primary transition-colors">
                                                        Sections <Eye className="h-2 w-2" />
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs font-black">
                                                        {mounted && user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Jan 01, 2026"}
                                                    </span>
                                                    <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mt-1">Registry Date</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setModalType("edit-user");
                                                        }}
                                                        className="h-10 w-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary/20 transition-all"
                                                        title="Edit Permissions"
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setModalType("delete-user");
                                                        }}
                                                        className="h-10 w-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-300 hover:text-red-500 hover:border-red-500/20 transition-all"
                                                        title="Purge Identity"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* CMS Modals */}
            <UserCreateModal
                isOpen={modalType === "create-user"}
                onClose={() => setModalType(null)}
                onSuccess={fetchFleetData}
            />

            <UserEditModal
                user={selectedUser}
                isOpen={modalType === "edit-user"}
                onClose={() => {
                    setModalType(null);
                    setSelectedUser(null);
                }}
                onSuccess={fetchFleetData}
            />

            <UserSectionsModal
                user={selectedUser}
                sections={sections}
                isOpen={modalType === "view-sections"}
                onClose={() => {
                    setModalType(null);
                    setSelectedUser(null);
                }}
            />

            <DeleteConfirmModal
                type="user"
                target={selectedUser}
                isOpen={modalType === "delete-user"}
                onClose={() => {
                    setModalType(null);
                    setSelectedUser(null);
                }}
                onSuccess={fetchFleetData}
            />
        </div>
    );
}
