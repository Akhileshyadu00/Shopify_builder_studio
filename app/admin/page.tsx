"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Layout, Trash2, Shield, Search, BarChart3, TrendingUp, ArrowUpRight, Activity, Filter, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardData {
    users: any[];
    sections: any[];
}

import { UserEditModal, DeleteConfirmModal } from "@/components/admin/CMSControls";
import { SectionEditor } from "@/components/shared/SectionEditor";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<'sections' | 'users'>('sections');

    // CMS Modal State
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [modalType, setModalType] = useState<"edit-user" | "delete-user" | "delete-section" | "edit-section" | null>(null);

    const [isEditingSection, setIsEditingSection] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated" || (session && session.user.role !== "admin")) {
            router.push("/");
        }
    }, [status, session, router]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/admin");
            if (res.ok) {
                const result = await res.json();
                setData(result);
            } else {
                toast.error("Failed to fetch admin data");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Internal Server Error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.role === "admin") {
            fetchData();
        }
    }, [session]);

    const handleDeleteSection = (section: any) => {
        setSelectedItem(section);
        setModalType("delete-section");
    };

    const handleDeleteUser = (user: any) => {
        setSelectedItem(user);
        setModalType("delete-user");
    };

    const handleEditUser = (user: any) => {
        setSelectedItem(user);
        setModalType("edit-user");
    };

    const handleEditSection = (section: any) => {
        setSelectedItem(section);
        setIsEditingSection(true);
    };

    const handleSaveSectionUpdate = async (updatedData: any) => {
        try {
            const res = await fetch("/api/sections", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: selectedItem.slug, ...updatedData }),
            });

            if (res.ok) {
                toast.success("Section updated globally");
                setIsEditingSection(false);
                setSelectedItem(null);
                fetchData();
            } else {
                toast.error("Failed to update section");
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session || session.user.role !== "admin") return null;

    const filteredSections = data?.sections.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUsers = data?.users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#f8f9fa] dark:bg-black p-4 md:p-10 selection:bg-primary/20">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Premium Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-900 shadow-sm"
                >
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-black dark:bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-3">
                            <Shield className="h-8 w-8 text-white dark:text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Command Center</h1>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                                <Activity className="h-3 w-3 text-green-500" /> Platform Administration v1.2
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-black uppercase text-zinc-400">Current Admin</p>
                            <p className="text-sm font-bold">{session.user.name}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-xs font-black">
                            {session.user.name?.[0]}
                        </div>
                    </div>
                </motion.div>

                {/* Growth Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Users", val: data?.users.length || 0, icon: Users, color: "blue", trend: "+12%" },
                        { label: "Active Sections", val: data?.sections.length || 0, icon: Layout, color: "purple", trend: "+5%" },
                        { label: "Daily Activity", val: "84%", icon: BarChart3, color: "green", trend: "+2.4%" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2rem] p-8 shadow-sm group hover:border-primary/50 transition-all hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                                    stat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' :
                                        'bg-green-50 dark:bg-green-900/20 text-green-600'
                                    }`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                    <TrendingUp className="h-3 w-3" /> {stat.trend}
                                </div>
                            </div>
                            <h3 className="font-black uppercase tracking-widest text-[10px] text-zinc-400 mb-1">{stat.label}</h3>
                            <div className="flex items-end justify-between">
                                <p className="text-4xl font-black tracking-tighter">{stat.val}</p>
                                <div className="h-8 w-16 bg-zinc-50 dark:bg-zinc-900 rounded-lg overflow-hidden flex items-end opacity-40">
                                    {/* Mock chart mini */}
                                    {[30, 70, 45, 90, 60, 80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-primary/40 mx-[1px]" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Management Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[3rem] overflow-hidden shadow-xl"
                >
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col xl:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full xl:w-auto">
                            <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl w-full md:w-auto">
                                <button
                                    onClick={() => setActiveTab('sections')}
                                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sections' ? "bg-white dark:bg-black shadow-lg text-primary scale-105" : "text-zinc-400 hover:text-zinc-600"
                                        }`}
                                >
                                    Sections
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? "bg-white dark:bg-black shadow-lg text-primary scale-105" : "text-zinc-400 hover:text-zinc-600"
                                        }`}
                                >
                                    User Base
                                </button>
                            </div>
                            <Button
                                onClick={() => activeTab === 'sections' ? router.push("/upload") : toast.info("Manual user creation coming soon")}
                                className="w-full md:w-auto h-12 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest px-8"
                            >
                                <Layout className="h-3 w-3 mr-2" /> New {activeTab === 'sections' ? 'Section' : 'Internal User'}
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder={`Filter ${activeTab}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-6 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                />
                            </div>
                            <button className="h-11 w-11 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-black">
                                <Filter className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[500px]">
                        <table className="w-full text-left">
                            <thead className="bg-[#fafafa] dark:bg-zinc-900/20">
                                <tr>
                                    {activeTab === 'sections' ? (
                                        <>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Identification</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Publisher</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Timestamp</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">User Profile</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Access Level</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">System ID</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Settings</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                                <AnimatePresence mode="popLayout">
                                    {(activeTab === 'sections' ? filteredSections : filteredUsers)?.map((item: any, idx: number) => (
                                        <motion.tr
                                            key={item._id || item.slug}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                                        >
                                            {activeTab === 'sections' ? (
                                                <>
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center">
                                                                <Layout className="h-4 w-4 text-zinc-400" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-sm">{item.name}</span>
                                                                <span className="text-[10px] text-zinc-400 font-bold tracking-widest">slug: {item.slug}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-black">
                                                                {item.userId?.substring(0, 1)}
                                                            </div>
                                                            <span className="text-xs font-bold text-zinc-500">{item.userId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                            <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Registered</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEditSection(item)}
                                                                className="h-10 w-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-primary transition-all"
                                                            >
                                                                <Shield className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSection(item)}
                                                                className="h-10 w-10 flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs">
                                                                {item.name[0].toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-sm">{item.name}</span>
                                                                <span className="text-xs text-zinc-400 font-bold">{item.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.role === 'admin'
                                                            ? "bg-primary/10 text-primary border border-primary/20"
                                                            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                                                            }`}>
                                                            {item.role || 'user'}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-6 font-mono text-[10px] text-zinc-400">
                                                        {item._id}
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEditUser(item)}
                                                                className="h-9 w-9 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-primary transition-all"
                                                            >
                                                                <Shield className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(item)}
                                                                className="h-9 w-9 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-300 hover:text-red-500 transition-all"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {((activeTab === 'sections' ? filteredSections : filteredUsers)?.length || 0) === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-32 text-center text-zinc-500 font-bold italic opacity-30">
                                            No system logs match the current query
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Performance Banner Mock */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-primary to-blue-600 p-1 rounded-[2.5rem] shadow-2xl"
                >
                    <div className="bg-white dark:bg-black rounded-[2.2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
                        {/* Dynamic background element */}
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-primary/5 -skew-x-12 translate-x-10"></div>

                        <div className="flex-1 space-y-4 relative z-10">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Platform Health: Stellar</h2>
                            <p className="text-zinc-500 font-medium max-w-xl">
                                System cores are operating at 100% efficiency. Database latencies are within optimal ranges ( &lt; 45ms ). All security protocols active.
                            </p>
                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Database Live</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Auth Service Up</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-black text-white dark:bg-white dark:text-black px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3 relative z-10 hover:scale-105 transition-transform">
                            Run Diagnostic <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>

                {/* CMS Modals */}
                <UserEditModal
                    user={selectedItem}
                    isOpen={modalType === "edit-user"}
                    onClose={() => {
                        setModalType(null);
                        setSelectedItem(null);
                    }}
                    onSuccess={fetchData}
                />

                <DeleteConfirmModal
                    type={modalType === "delete-user" ? "user" : "section"}
                    target={selectedItem}
                    isOpen={modalType === "delete-user" || modalType === "delete-section"}
                    onClose={() => {
                        setModalType(null);
                        setSelectedItem(null);
                    }}
                    onSuccess={fetchData}
                />

                {/* Full Screen Section Editor Overlay */}
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
        </main>
    );
}
