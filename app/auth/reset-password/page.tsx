"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Key, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid state: Reset token missing");
            router.replace("/");
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            toast.error("Security key must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (res.ok) {
                setIsSuccess(true);
                toast.success("Security key updated");
                setTimeout(() => router.push("/"), 3000);
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to reset security key");
            }
        } catch (error) {
            toast.error("Comm link failure: Procedure aborted");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null;

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-black selection:bg-primary/30 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[3rem] p-12 shadow-2xl">
                    {!isSuccess ? (
                        <div className="space-y-8">
                            <header className="space-y-2">
                                <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                                    New <span className="text-primary italic">Secret</span>
                                </h1>
                                <p className="text-zinc-500 font-bold text-sm leading-relaxed">
                                    Define a robust access key to conclude the identity recovery procedure.
                                </p>
                            </header>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2 font-mono">ENCRYPTED_KEY_V1</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter new access key"
                                            className="w-full pl-12 pr-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2 font-mono">VERIFY_KEY_STRENGTH</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new access key"
                                            className="w-full pl-12 pr-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black text-white dark:bg-white dark:text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <ShieldAlert className="h-4 w-4" />}
                                    Finalize Override
                                </button>
                            </form>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8 py-10"
                        >
                            <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_-10px_rgba(255,255,255,0.5)] dark:shadow-primary/30">
                                <CheckCircle2 className="h-12 w-12 text-black" />
                            </div>
                            <header className="space-y-2">
                                <h2 className="text-3xl font-black uppercase tracking-tight">Identity Restored</h2>
                                <p className="text-zinc-500 font-bold text-sm leading-relaxed">
                                    Your secure access credentials have been synchronized successfully.
                                </p>
                            </header>
                            <div className="pt-4">
                                <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "linear" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-4 animate-pulse">
                                    Redirecting to Control Center...
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-10">
                    High Security Environment &bull; AES-256 Equivalent
                </p>
            </motion.div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
