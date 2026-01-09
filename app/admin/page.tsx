"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Lock,
    Cpu,
    Fingerprint,
    Loader2,
    Terminal,
    AlertCircle,
    CheckCircle2,
    Database,
    Zap,
    Mail,
    Key,
    User as UserIcon,
    ArrowRight
} from "lucide-react";
import { useMounted } from "@/lib/hooks";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminIntakePortal() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const mounted = useMounted();

    // Intake States
    const [step, setStep] = useState<"authentication" | "scanning" | "clearance">("authentication");
    const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const [isProcessing, setIsProcessing] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    // Form States
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const isAdmin = session?.user?.role === "admin";

    // Immediate redirect if already admin
    useEffect(() => {
        if (mounted && status === "authenticated" && isAdmin) {
            router.replace("/admin/dashboard");
        }
    }, [mounted, status, isAdmin, router]);

    // Log Simulation
    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            if (authMode === "signup") {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Signup failed");

                toast.success("Account created! Initializing biometric sync...");
                // Automatically log in after signup
                const loginRes = await signIn("credentials", {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                });
                if (loginRes?.error) throw new Error(loginRes.error);
            } else {
                const loginRes = await signIn("credentials", {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                });
                if (loginRes?.error) throw new Error(loginRes.error);
                toast.success("Identity verified.");
            }
        } catch (error: any) {
            toast.error(error.message || "Authentication aborted");
            setIsProcessing(false);
        }
    };

    const startIntakeProtocol = async () => {
        if (!session) {
            toast.error("Identity unknown: Authentication required");
            return;
        }

        setStep("scanning");
        setIsProcessing(true);

        // Simulation Phase 1: Identity Sync
        addLog("Initializing biometric handshake...");
        await new Promise(r => setTimeout(r, 800));
        setScanProgress(25);
        addLog("Target: " + session.user.name);

        // Simulation Phase 2: Permission Audit
        await new Promise(r => setTimeout(r, 600));
        addLog("Auditing system architecture clearance...");
        setScanProgress(50);

        // Final Authorization Call
        try {
            const res = await fetch("/api/admin", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.user.id, role: "admin" }),
            });

            if (res.ok) {
                setScanProgress(75);
                addLog("Authorization link established.");
                await new Promise(r => setTimeout(r, 800));
                setScanProgress(100);
                addLog("Clearance level upgraded to: SYSTEM_ARCHITECT");

                await update(); // Refreshes session
                setStep("clearance");
            } else {
                throw new Error("Authorization Rejected");
            }
        } catch (error) {
            toast.error("Security Override Failed: Insufficient Link Strength");
            setStep("authentication");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!mounted || status === "loading") {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
                    <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-zinc-100 selection:bg-primary/50 flex items-center justify-center p-6 relative overflow-hidden font-mono">
            {/* Matrix/Glitch Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
            </div>

            <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center">

                <AnimatePresence mode="wait">
                    {step === "authentication" && (
                        <motion.div
                            key="auth"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-md space-y-10"
                        >
                            {/* Central Icon Container */}
                            <div className="relative mx-auto w-24 h-24">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
                                />
                                <div className="absolute inset-2 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] group">
                                    <Shield className={`h-8 w-8 ${status === 'authenticated' ? 'text-primary' : 'text-zinc-500'} group-hover:scale-110 transition-transform duration-500`} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                                    Central <span className="text-primary italic">Intake</span>
                                </h1>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto">
                                    Administrative Shell v2.0 // Platform Authorization Required
                                </p>
                            </div>

                            {status === "unauthenticated" ? (
                                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                    <div className="flex gap-4 mb-8">
                                        <button
                                            onClick={() => setAuthMode("login")}
                                            className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${authMode === 'login' ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => setAuthMode("signup")}
                                            className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${authMode === 'signup' ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            Signup
                                        </button>
                                    </div>

                                    <form onSubmit={handleAuth} className="space-y-4 text-left">
                                        {authMode === "signup" && (
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest ml-2">Verification Name</label>
                                                <div className="relative">
                                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                                    <Input
                                                        placeholder="Identity"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="pl-12 h-14 bg-black/40 border-zinc-800 rounded-2xl font-bold focus:ring-primary/20"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest ml-2">Secure Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                                <Input
                                                    type="email"
                                                    placeholder="arch@studio.inc"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="pl-12 h-14 bg-black/40 border-zinc-800 rounded-2xl font-bold focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 pb-6">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Access Key</label>
                                                <Link
                                                    href="/auth/forgot-password"
                                                    className="text-[8px] font-black uppercase text-zinc-500 hover:text-primary transition-colors tracking-widest"
                                                >
                                                    Recovery
                                                </Link>
                                            </div>
                                            <div className="relative">
                                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="pl-12 h-14 bg-black/40 border-zinc-800 rounded-2xl font-bold focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            disabled={isProcessing}
                                            className="w-full h-16 bg-primary text-black rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
                                        >
                                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <>Identify <ArrowRight className="h-4 w-4" /></>}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 p-6 rounded-[2rem] text-left">
                                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 text-primary font-black">
                                            {session?.user?.name?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">{session?.user?.name}</p>
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Identity Match Confirmed</p>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={startIntakeProtocol}
                                            disabled={isProcessing}
                                            className="inline-flex items-center gap-4 bg-primary text-black px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(var(--primary),0.3)] group disabled:opacity-50"
                                        >
                                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Initialize Intake <Zap className="h-4 w-4 group-hover:scale-125 transition-transform" /></>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {step === "scanning" && (
                        <motion.div
                            key="scan"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-2xl space-y-12"
                        >
                            <div className="relative h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scanProgress}%` }}
                                    className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)]"
                                />
                            </div>

                            <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-3xl text-left space-y-4 shadow-2xl backdrop-blur-md">
                                <div className="flex items-center gap-3 text-primary mb-6">
                                    <Terminal className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">System Diagnostics</span>
                                </div>
                                <div className="space-y-3 min-h-[140px]">
                                    {logs.map((log, i) => (
                                        <motion.p
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-xs text-zinc-400 font-bold"
                                        >
                                            {log}
                                        </motion.p>
                                    ))}
                                    <motion.div
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="h-4 w-2 bg-primary inline-block"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === "clearance" && (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-10"
                        >
                            <div className="h-32 w-32 bg-primary text-black rounded-full mx-auto flex items-center justify-center shadow-[0_0_80px_rgba(var(--primary),0.5)]">
                                <CheckCircle2 className="h-16 w-16" />
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-6xl font-black uppercase tracking-tighter italic">
                                    Clearance <span className="text-primary italic">Granted</span>
                                </h1>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Administrative Session Synchronized</p>
                            </div>

                            <button
                                onClick={() => router.push("/admin/dashboard")}
                                className="bg-white text-black px-16 py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-primary hover:text-white transition-all"
                            >
                                Enter Workspace
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
