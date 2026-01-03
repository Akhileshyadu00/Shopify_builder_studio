"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CodeBlockProps {
    code: string;
    language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl overflow-hidden border border-gray-800 bg-[#1e1e1e]">
            <div className="absolute top-3 right-3 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-3 text-xs bg-white/10 hover:bg-white/20 text-white border-0"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 mr-1.5" /> Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
                        </>
                    )}
                </Button>
            </div>
            <div className="max-h-[600px] overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
