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
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold font-mono">S</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block">SectionStudio</span>
                    </Link>

                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/sections" className="hover:text-primary transition-colors">Sections</Link>
                        <Link href="/upload" className="hover:text-primary transition-colors">Create</Link>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-end gap-4 md:gap-4">
                    <div className={cn(
                        "relative hidden w-full max-w-[200px] items-center transition-all lg:flex",
                        isSearchFocused ? "max-w-[300px]" : "max-w-[200px]"
                    )}>
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <form onSubmit={handleSearch} className="w-full">
                            <input
                                type="text"
                                placeholder="Search sections..."
                                className="h-10 w-full rounded-full border bg-muted/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => mounted && setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full p-2 hover:bg-muted transition-colors relative mr-2"
                            aria-label="Toggle theme"
                        >
                            <Sun className={cn(
                                "h-5 w-5 rotate-0 scale-100 transition-all",
                                mounted && theme === "dark" ? "-rotate-90 scale-0" : ""
                            )} />
                            <Moon className={cn(
                                "absolute left-2 top-2 h-5 w-5 rotate-90 scale-0 transition-all",
                                mounted && theme === "dark" ? "rotate-0 scale-100" : ""
                            )} />
                            <span className="sr-only">Toggle theme</span>
                        </button>

                        <div className="hidden md:flex items-center gap-2">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 bg-muted rounded-full">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <span>{user.name}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <AuthModal defaultTab="login">
                                        <Button variant="ghost" size="sm">Sign In</Button>
                                    </AuthModal>
                                    <AuthModal defaultTab="signup">
                                        <Button size="sm">Sign Up</Button>
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
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
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

