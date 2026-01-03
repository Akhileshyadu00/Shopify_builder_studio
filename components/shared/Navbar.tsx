"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Moon, Sun, Menu, X, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { data: session } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        toast.success("Logged out successfully");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/sections?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    const user = session?.user;




    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="bg-black dark:bg-white h-10 w-10 rounded-[0.75rem] flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                            <span className="text-white dark:text-black font-black font-serif text-xl italic leading-none">S</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-base tracking-tighter uppercase italic">Section</span>
                            <span className="font-black text-[10px] tracking-[0.4em] uppercase text-zinc-400">Studio</span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-[0.15em]">
                        <Link href="/" className="hover:text-primary transition-colors hover:translate-y-[-1px] active:translate-y-[1px]">Home</Link>
                        <Link href="/sections" className="hover:text-primary transition-colors hover:translate-y-[-1px] active:translate-y-[1px]">Library</Link>
                        <Link href="/upload" className="hover:text-primary transition-colors hover:translate-y-[-1px] active:translate-y-[1px]">Create</Link>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-end gap-6 text-sm font-medium">
                    <div className={cn(
                        "relative hidden w-full max-w-[240px] items-center transition-all xl:flex group",
                        isSearchFocused ? "max-w-[340px]" : "max-w-[240px]"
                    )}>
                        <Search className="absolute left-4 h-3.5 w-3.5 text-zinc-400 group-hover:text-black transition-colors" />
                        <form onSubmit={handleSearch} className="w-full">
                            <input
                                type="text"
                                placeholder="Search the drops..."
                                className="h-11 w-full rounded-full border border-zinc-100 bg-zinc-50/50 pl-11 pr-12 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-black/5 hover:border-zinc-200 transition-all placeholder:text-zinc-300 dark:bg-zinc-900/40 dark:border-zinc-800"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </form>
                        <div className="absolute right-4 hidden items-center gap-1 xl:flex">
                            <kbd className="pointer-events-none flex h-5 w-5 items-center justify-center rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700 font-mono text-[10px] text-zinc-400">⌘</kbd>
                            <kbd className="pointer-events-none flex h-5 w-5 items-center justify-center rounded border bg-white dark:bg-zinc-800 dark:border-zinc-700 font-mono text-[10px] text-zinc-400">K</kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => mounted && setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-90 relative"
                            aria-label="Toggle theme"
                        >
                            <Sun className={cn(
                                "h-4 w-4 rotate-0 scale-100 transition-all duration-500",
                                mounted && theme === "dark" ? "-rotate-90 scale-0" : ""
                            )} />
                            <Moon className={cn(
                                "absolute left-2.5 top-2.5 h-4 w-4 rotate-90 scale-0 transition-all duration-500",
                                mounted && theme === "dark" ? "rotate-0 scale-100" : ""
                            )} />
                            <span className="sr-only">Toggle theme</span>
                        </button>

                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-full border border-zinc-100 dark:border-zinc-800 transition-colors">
                                        <div className="h-5 w-5 rounded-full bg-black dark:bg-white flex items-center justify-center">
                                            <User className="h-2.5 w-2.5 text-white dark:text-black" />
                                        </div>
                                        <Link href="/profile" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                                            {user.name}
                                        </Link>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors flex items-center gap-2 group"
                                    >
                                        <LogOut className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        Exit
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <AuthModal defaultTab="login">
                                        <button className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 hover:text-primary transition-colors">Sign In</button>
                                    </AuthModal>
                                    <AuthModal defaultTab="signup">
                                        <button className="bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl dark:bg-white dark:text-black">Join Studio</button>
                                    </AuthModal>
                                </div>
                            )}
                        </div>

                        <button
                            className="md:hidden p-2 rounded-full hover:bg-muted"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t bg-background px-4 py-4"
                    >
                        <div className="flex flex-col gap-4">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                            <Link href="/sections" onClick={() => setIsMobileMenuOpen(false)}>Sections</Link>
                            <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)}>Create Section</Link>
                            <div className="relative flex items-center mb-2">
                                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <form onSubmit={handleSearch} className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Search sections..."
                                        className="h-10 w-full rounded-lg border bg-muted/50 pl-10 pr-4 text-sm focus:outline-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </form>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                {user ? (
                                    <>
                                        <Link href="/profile" className="flex items-center gap-3 px-1 active:bg-zinc-100 rounded-lg p-2 transition-colors">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <AuthModal defaultTab="login">
                                            <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Button>
                                        </AuthModal>
                                        <AuthModal defaultTab="signup">
                                            <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Button>
                                        </AuthModal>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

