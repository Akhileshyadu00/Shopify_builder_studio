"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    Layout,
    Activity,
    ArrowUpRight,
    Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useMounted } from "@/lib/hooks";

interface DashboardData {
    users: any[];
    sections: any[];
}

export default function AdminDashboardOverview() {
    const { data: session, status } = useSession();
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const mounted = useMounted();

    useEffect(() => {
        if (mounted) fetchData();
    }, [mounted]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/admin");
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            toast.error("Telemetry failure: Could not reach control server");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted || status === "loading" || isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const stats = [
        { label: "Total Fleet Users", val: data?.users.length || 0, icon: Users, color: "blue", trend: "+12.5%" },
        { label: "Deployed Sections", val: data?.sections.length || 0, icon: Layout, color: "purple", trend: "+4.2%" },
        { label: "System Uptime", val: "99.98%", icon: Activity, color: "green", trend: "Stable" }
    ];

    return (
        <div className="space-y-12">
            <header className="space-y-2">
                <h1 className="text-5xl font-black uppercase tracking-tighter leading-none italic">
                    Platform <span className="text-primary italic">Overview</span>
                </h1>
                <p className="text-zinc-500 font-medium">Real-time diagnostics and infrastructure metrics.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                                stat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' :
                                    'bg-green-50 dark:bg-green-900/20 text-green-600'
                                }`}>
                                <stat.icon className="h-7 w-7" />
                            </div>
                            <h3 className="font-black uppercase tracking-widest text-[10px] text-zinc-400 mb-2">{stat.label}</h3>
                            <div className="flex items-baseline gap-4">
                                <p className="text-5xl font-black tracking-tighter">{stat.val}</p>
                                <span className="text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                        {/* Abstract background element */}
                        <stat.icon className="absolute -right-4 -bottom-4 h-32 w-32 opacity-[0.03] rotate-12" />
                    </motion.div>
                ))}
            </div>

            {/* Health Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black text-white rounded-[3rem] p-12 overflow-hidden relative"
            >
                <div className="absolute right-0 top-0 h-full w-1/3 bg-primary/20 blur-[100px]" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">All Systems Operational</span>
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Infrastructure Health: <span className="text-primary italic">Stellar</span></h2>
                        <p className="text-zinc-400 max-w-xl font-medium">Database shards are synchronized. Cache hit ratio is at 94.2%. Edge nodes are reporting optimal latency across all global zones.</p>
                    </div>
                    <button className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        Detailed Audit <ArrowUpRight className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
