"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { sections } from "@/data/sections";
import { motion } from "framer-motion";
import { Copy, ArrowLeft, Monitor, Tablet, Smartphone, Check, Loader2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSectionStore } from "@/lib/section-store";

export default function SectionDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { customSections, mounted } = useSectionStore();
    const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [isCopied, setIsCopied] = useState(false);

    const section = useMemo(() => {
        const staticSection = sections.find((s) => s.slug === slug);
        if (staticSection) return staticSection;
        if (!mounted) return undefined; // Don't look in customSections until mounted
        return customSections.find((s) => s.slug === slug);
    }, [slug, customSections, mounted]);

    if (!section) {
        if (!mounted) {
            return (
                <div className="flex min-h-screen items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Section not found</h1>
                <button onClick={() => router.push("/sections")} className="mt-4 text-primary hover:underline">
                    Back to all sections
                </button>
            </div>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(section.code);
        setIsCopied(true);
        toast.success("Code copied successfully!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const codeForPreview = section.code.replace(/\{% schema %\}([\s\S]*?)\{\% endschema %\}/g, "");

    const previewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; font-family: sans-serif; overflow-x: hidden; }
        </style>
      </head>
      <body>
        ${codeForPreview}
      </body>
    </html>
  `;

    return (
        <div className="flex flex-col lg:h-[calc(100vh-64px)] lg:flex-row overflow-hidden">
            <main className="flex flex-1 flex-col lg:flex-row overflow-hidden">
                {/* Left: Preview */}
                <div className="flex flex-col border-r bg-muted/30 lg:flex-[1.2]">
                    <div className="flex items-center justify-between border-b bg-background px-6 py-3">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="rounded-full p-2 hover:bg-muted"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <div>
                                <h1 className="text-sm font-semibold">{section.name}</h1>
                                <div className="flex gap-2">
                                    {(section.niches || []).map(n => (
                                        <span key={n} className="text-[10px] text-muted-foreground uppercase tracking-wider">{n}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border bg-background p-1">
                            <button
                                onClick={() => setViewport("desktop")}
                                className={cn("rounded p-1.5", viewport === "desktop" ? "bg-muted" : "hover:bg-muted/50")}
                            >
                                <Monitor className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewport("tablet")}
                                className={cn("rounded p-1.5", viewport === "tablet" ? "bg-muted" : "hover:bg-muted/50")}
                            >
                                <Tablet className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewport("mobile")}
                                className={cn("rounded p-1.5", viewport === "mobile" ? "bg-muted" : "hover:bg-muted/50")}
                            >
                                <Smartphone className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-muted/10">
                        <motion.div
                            animate={{ width: viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "375px" }}
                            className="h-full overflow-hidden rounded-xl border bg-white shadow-2xl"
                        >
                            <iframe
                                srcDoc={previewHtml}
                                className="h-full w-full"
                                title="Section Preview"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Right: Code */}
                <div className="flex flex-col bg-[#1e1e1e] lg:flex-1 lg:h-full">
                    <div className="flex items-center justify-between border-b border-white/10 bg-[#1e1e1e] px-6 py-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            custom-liquid-block.liquid
                        </div>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                        >
                            {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {isCopied ? "Copied!" : "Copy Code"}
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto bg-[#1e1e1e]">
                        <SyntaxHighlighter
                            language="html"
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: "24px",
                                background: "transparent",
                                fontSize: "13px",
                                minHeight: "300px",
                            }}
                            lineNumberStyle={{ color: "rgba(255,255,255,0.2)" }}
                            showLineNumbers
                        >
                            {section.code.trim()}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </main>
        </div>
    );
}
