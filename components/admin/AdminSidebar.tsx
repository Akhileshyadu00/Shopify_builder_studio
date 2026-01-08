"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useMounted } from "@/lib/hooks";
import {
    LayoutDashboard,
    Users,
    Layers,
    Shield,
    LogOut,
    ChevronRight,
    Sparkles,
    Settings
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "User Base", icon: Users, href: "/admin/users" },
    { label: "Sections", icon: Layers, href: "/admin/sections" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const mounted = useMounted();

    const handleLogout = () => {
        signOut({ callbackUrl: "/admin" });
    };

    if (!mounted) return null;

    return (
        <aside className="w-72 hidden lg:flex flex-col h-screen sticky top-0 p-6 space-y-8">
            <Link href="/" className="flex items-center gap-4 px-4 hover:opacity-80 transition-all group">
                <div className="h-10 w-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                    <Shield className="h-5 w-5 text-white dark:text-black" />
                </div>
                <div>
                    <h2 className="font-black uppercase tracking-tighter text-lg leading-tight text-black dark:text-white">Admin</h2>
                    <span className="text-[8px] font-black uppercase text-primary tracking-widest bg-primary/10 px-1.5 py-0.5 rounded-full inline-block">Studio v1.5</span>
                </div>
            </Link>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                ? "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-primary"
                                : "text-zinc-500 hover:text-black dark:hover:text-white"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-zinc-400 group-hover:text-black dark:group-hover:text-white"}`} />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </div>
                            {isActive && (
                                <motion.div layoutId="sidebar-active" className="h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                            {!isActive && <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-zinc-300" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all group font-black uppercase text-[10px] tracking-widest"
                >
                    <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Terminate Session
                </button>
            </div>
        </aside>
    );
}
