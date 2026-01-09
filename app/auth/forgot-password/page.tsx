"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setIsSubmitted(true);
                toast.success("Recovery link dispatched");
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to initiate recovery");
            }
        } catch (error) {
            toast.error("Network failure: Could not reach control server");
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
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors mb-12">
                        <ArrowLeft className="h-4 w-4" /> Return to Base
                    </Link>

                    {!isSubmitted ? (
                        <div className="space-y-8">
                            <header className="space-y-2">
                                <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                                    Identity <span className="text-primary italic">Recovery</span>
                                </h1>
                                <p className="text-zinc-500 font-bold text-sm leading-relaxed">
                                    Provide your registered credentials to initiate the secure recovery procedure.
                                </p>
                            </header>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2">Registered Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="operator@studio.inc"
                                            className="w-full pl-12 pr-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black text-white dark:bg-white dark:text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Sparkles className="h-4 w-4" />}
                                    Initiate Recovery
                                </button>
                            </form>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-8"
                        >
                            <div className="h-20 w-20 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto border border-green-100 dark:border-green-900 shadow-xl shadow-green-500/10">
                                <ShieldCheck className="h-10 w-10 text-green-500" />
                            </div>
                            <header className="space-y-2">
                                <h2 className="text-2xl font-black uppercase tracking-tight">Signal Distributed</h2>
                                <p className="text-zinc-500 font-bold text-sm leading-relaxed">
                                    If an account exists for <span className="text-black dark:text-white">{email}</span>, a secure recovery link has been dispatched to your inbox.
                                </p>
                            </header>
                            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-relaxed">
                                    Please verify your communication channels within the next 60 minutes.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                            >
                                Re-send Link
                            </button>
                        </motion.div>
                    )}
                </div>

                <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-10">
                    System Secure &bull; High Precision Auth
                </p>
            </motion.div>
        </main>
    );
}
