"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Loader2, ArrowLeft, Key } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ChangePasswordPage() {
    const { status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    if (status === "unauthenticated") {
        router.replace("/");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 8) {
            toast.error("Security key must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Security key updated successfully");
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setTimeout(() => router.push("/profile"), 2000);
            } else {
                toast.error(data.message || "Failed to update security key");
            }
        } catch (error) {
            toast.error("Comm link failure: Procedure aborted");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-black selection:bg-primary/30 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[3rem] p-12 shadow-2xl">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors mb-12 font-mono">
                        <ArrowLeft className="h-4 w-4" /> RET_PROFILE_MODULE
                    </Link>

                    <div className="space-y-8">
                        <header className="space-y-2">
                            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                                Access <span className="text-primary italic">Override</span>
                            </h1>
                            <p className="text-zinc-500 font-bold text-sm leading-relaxed">
                                Manually update your secure system credentials to maintain account integrity.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2">Current Secret</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        type="password"
                                        required
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className="pl-12 h-14 border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold bg-zinc-50 dark:bg-zinc-900 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2 font-mono">NEW_ENCRYPT_PROTO</Label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        type="password"
                                        required
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        className="pl-12 h-14 border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold bg-zinc-50 dark:bg-zinc-900 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2 font-mono">VERIFY_INTEGRITY</Label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        type="password"
                                        required
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="pl-12 h-14 border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold bg-zinc-50 dark:bg-zinc-900 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white dark:bg-white dark:text-black h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Authorize System Update"}
                            </Button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-10">
                    High Precision Verification &bull; Manual Procedure
                </p>
            </motion.div>
        </main>
    );
}
