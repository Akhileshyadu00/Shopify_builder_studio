"use client";

import React from "react";
import { Settings, Shield, Lock, Bell, Eye, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-12">
            <header className="space-y-2">
                <h1 className="text-5xl font-black uppercase tracking-tighter leading-none italic">
                    Central <span className="text-primary italic">Config</span>
                </h1>
                <p className="text-zinc-500 font-medium">Configure platform-wide security and system parameters.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[
                    { icon: Shield, title: "Access Control", desc: "Manage white-listed domains and IP ranges for admin access." },
                    { icon: Bell, title: "Telemetry Alerts", desc: "Configure system health notifications and error reporting thresholds." },
                    { icon: Eye, title: "Audit Logging", desc: "Define retention periods for administrative action logs." },
                    { icon: Database, title: "Data Governance", desc: "Manage database backup schedules and cleanup protocols." }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] shadow-sm flex items-start gap-6 group hover:border-primary/30 transition-all"
                    >
                        <div className="h-14 w-14 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black uppercase tracking-tight text-lg">{item.title}</h3>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary pt-2 flex items-center gap-1 opacity-50 cursor-not-allowed">
                                Under Construction <Lock className="h-2 w-2" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
