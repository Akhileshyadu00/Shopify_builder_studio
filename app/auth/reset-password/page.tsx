"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2, AlertCircle, Key, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token");
            router.push("/auth/forgot-password");
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setIsSuccess(true);
            toast.success("Password reset successful!");
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center space-y-8 py-10">
                <div className="h-20 w-20 bg-primary/10 border border-primary/20 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Access <span className="text-primary italic">Restored</span></h2>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Redirecting to primary terminal...</p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
                >
                    Manual Entry <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest ml-2">New Access Key</label>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-12 h-14 bg-black/40 border-zinc-800 rounded-2xl font-bold focus:ring-primary/20 text-white"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest ml-2">Confirm Access Key</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="pl-12 h-14 bg-black/40 border-zinc-800 rounded-2xl font-bold focus:ring-primary/20 text-white"
                        />
                    </div>
                </div>
            </div>

            <button
                disabled={isLoading}
                className="w-full h-16 bg-primary text-black rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Identity & Reset"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-primary/50 flex items-center justify-center p-6 relative overflow-hidden font-mono">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>

            <div className="max-w-md w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl space-y-8"
                >
                    <div className="space-y-4 text-center">
                        <div className="mx-auto w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                            Reset <span className="text-primary italic">Access</span>
                        </h1>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                            Overwrite credentials sequence v4.2
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Initializing Reset Module...</p>
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>

                    <div className="pt-4 border-t border-zinc-800 text-center">
                        <p className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                            Secure Reset Protocol 4096-bit Encryption
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
