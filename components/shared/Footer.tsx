"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, Mail } from "lucide-react";

export const Footer = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Product",
            links: [
                { label: "Sections Library", href: "/sections" },
                { label: "Create Your Own", href: "/upload" },
                { label: "Premium Blocks", href: "/sections?premium=true" },
                { label: "Search Sections", href: "/sections" },
                { label: "User Profile", href: "#" },
                { label: "Custom Solutions", href: "#" },

            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Documentation", href: "#" },
                { label: "Liquid Guide", href: "#" },
                { label: "Showcase", href: "#" },
                { label: "Support", href: "#" },
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "License", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Cookies", href: "#" },
            ]
        }
    ];

    return (
        <footer className="border-t bg-muted/20 pb-12 pt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold font-mono text-sm">S</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight">SectionStudio</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Premium Shopify sections designed for high performance and maximum conversion. Elevate your store without the apps.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Github className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Linkedin className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="flex flex-col gap-5">
                            <h3 className="font-semibold text-foreground">{section.title}</h3>
                            <ul className="flex flex-col gap-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {currentYear} Section Studio. Built for Shopify Merchants.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            Subscribe to Updates
                        </Link>
                        <div className="h-4 w-px bg-border hidden md:block"></div>
                        <p className="text-xs text-muted-foreground font-medium">
                            Designed with ❤️ by Akhilesh Yadav
                        </p>

                    </div>
                </div>
            </div>
        </footer>
    );
};

