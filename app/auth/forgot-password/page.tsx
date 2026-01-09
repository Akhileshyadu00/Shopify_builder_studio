"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setIsSubmitted(true);
            toast.success("Reset link sent!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-primary/50 flex items-center justify-center p-6 relative overflow-hidden font-mono">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>

            <div className="max-w-md w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl space-y-8"
                >
                    <div className="space-y-4 text-center">
                        <div className="mx-auto w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                            Forgot <span className="text-primary italic">Password</span>
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                            {isSubmitted ? "Recovery Sequence Initialized" : "Enter your email for access recovery"}
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest ml-2">Registered Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                    <Input
                                        type="email"
                                        placeholder="arch@studio.inc"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-12 h-14 bg-black/40 border-zinc-800 rounded-2xl font-bold focus:ring-primary/20 text-white"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full h-16 bg-primary text-black rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl space-y-3">
                                <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
                                <p className="text-sm font-bold text-zinc-300">
                                    If an account exists for <span className="text-primary">{email}</span>, you will receive a reset link shortly.
                                </p>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                Check your inbox and spam folder
                            </p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-zinc-800 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-3 w-3" /> Back to Secure Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
