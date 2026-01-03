"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSectionStore } from "@/lib/section-store";
import { toast } from "sonner";
import { DynamicPreview } from "@/components/shared/DynamicPreview";
import { Niche } from "@/data/sections";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useSession } from "next-auth/react";

const availableNiches: Niche[] = [
    "Beauty", "Electronics", "Dropshipping", "Fashion", "Fitness",
    "Home Decor", "Jewelry", "Luxury", "Minimal", "Ready-To-Use Templates"
];

export default function UploadPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { addSection } = useSectionStore();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Custom");
    const [niches, setNiches] = useState<string[]>([]);

    // Single Block Code
    const [code, setCode] = useState<string>(`{% stylesheet %}
  /* Add your CSS here */
  .my-section { padding: 40px; text-align: center; }
  .title { font-size: 2rem; color: #333; }
{% endstylesheet %}

{% javascript %}
  console.log('Section Loaded');
{% endjavascript %}

<div class="my-section">
  <h2 class="title">{{ section.settings.heading }}</h2>
  <p>Start editing the Liquid code to see changes live!</p>
</div>

{% schema %}
{
  "name": "My Custom Section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Hello World"
    }
  ]
}
{% endschema %}`);

    // Auth check
    useEffect(() => {
        if (status === "unauthenticated") {
            toast.error("Please login to upload sections");
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!name || !code) {
            toast.error("Name and Code are required");
            setIsLoading(false);
            return;
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        try {
            await addSection({
                slug,
                name,
                description,
                category,
                niches: niches as any,
                preview: "/custom_section_placeholder.png",
                code: code,
            });

            // toast.success is handled inside addSection now, but we can add more if needed
            router.push(`/sections/${slug}?custom=true`);
        } catch (error) {
            // Error handled in store toast
        } finally {
            setIsLoading(false);
        }
    };


    // Resize State
    const [leftWidth, setLeftWidth] = useState(50); // Percentage
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = (e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    };

    useEffect(() => {
        const resize = (e: MouseEvent) => {
            if (isResizing) {
                // Use a small buffer to prevent snapping at edges
                const newWidth = (e.clientX / window.innerWidth) * 100;
                if (newWidth > 15 && newWidth < 85) {
                    setLeftWidth(newWidth);
                }
            }
        };

        const stopResizing = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResizing);
            // Disable scroll while resizing for better precision
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
            document.body.style.overflow = '';
        };
    }, [isResizing]);

    return (
        <div className={`min-h-screen bg-white ${isResizing ? "cursor-col-resize select-none" : ""}`}>
            {/* Overlay to prevent iframe theft of mouse events during resize */}
            {isResizing && (
                <div className="fixed inset-0 z-50 cursor-col-resize" onMouseUp={() => setIsResizing(false)} />
            )}

            <div className="mx-auto w-full px-4 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <Link href="/sections" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold tracking-tight">Custom Section Studio</h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Editor</span>
                    </div>
                    <div className="w-24"></div> {/* Spacer */}
                </div>

                <div className="flex flex-col md:flex-row gap-0 min-h-[calc(100vh-160px)] relative items-stretch">
                    {/* Left: Input Form (Scrollable) */}
                    <div
                        className="space-y-6 md:pr-4 lg:pr-8 pb-12 overflow-y-auto"
                        style={{
                            width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${leftWidth}%` : '100%',
                            flex: 'none'
                        }}
                    >
                        <div className={`grid gap-4 ${leftWidth < 40 ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"}`}>
                            <Card className="border-zinc-200 shadow-sm">
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base font-bold">Identity</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Section Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Hero Video"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-10 text-sm focus-visible:ring-black border-zinc-200 bg-zinc-50/30"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Category</Label>
                                        <Input
                                            id="category"
                                            placeholder="e.g. Hero"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="h-10 text-sm focus-visible:ring-black border-zinc-200 bg-zinc-50/30"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-zinc-200 shadow-sm">
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base font-bold">Niches</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {availableNiches.map((niche) => (
                                            <button
                                                key={niche}
                                                type="button"
                                                onClick={() => setNiches(prev =>
                                                    prev.includes(niche) ? prev.filter(n => n !== niche) : [...prev, niche]
                                                )}
                                                className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold transition-all border ${niches.includes(niche)
                                                    ? "bg-black text-white border-black"
                                                    : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300 active:scale-95"
                                                    }`}
                                            >
                                                {niche}
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-zinc-200 shadow-sm">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base font-bold">Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="What does this section do?..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="h-20 text-sm resize-none focus-visible:ring-black border-zinc-200 bg-zinc-50/30"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-black shadow-2xl overflow-hidden ring-1 ring-black/5">
                            <div className="bg-black px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner"></div>
                                    </div>
                                    <div className="h-4 w-px bg-zinc-800 mx-1"></div>
                                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.2em]">Liquid Studio</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase">UTF-8</span>
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Liquid</span>
                                </div>
                            </div>
                            <CardContent className="p-0 bg-[#1e1e1e]">
                                <form onSubmit={handleSubmit} className="relative group/editor">
                                    <Textarea
                                        id="code"
                                        className="font-mono text-[13px] min-h-[600px] p-6 lg:p-8 leading-relaxed bg-transparent text-zinc-300 border-0 focus-visible:ring-0 rounded-none scrollbar-hide selection:bg-primary/30"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        spellCheck={false}
                                    />
                                    <div className="absolute bottom-8 right-8 z-10 transition-transform hover:scale-105 active:scale-95">
                                        <Button type="submit" size="lg" className="bg-white text-black hover:bg-zinc-200 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] font-black px-8 py-6 h-auto text-base rounded-xl" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin text-black" /> : "Deploy Section"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Premium VS Code Resize Handle */}
                    <div
                        onMouseDown={startResizing}
                        className={`hidden md:flex w-1.5 hover:w-2 bg-transparent cursor-col-resize items-center justify-center transition-all group z-40 relative touch-none select-none ${isResizing ? "w-2" : ""}`}
                    >
                        <div className={`absolute inset-y-0 w-px bg-zinc-200 group-hover:bg-primary/50 transition-colors ${isResizing ? "bg-primary w-0.5" : ""}`} />
                        <div className={`w-4 h-12 bg-white border border-zinc-200 shadow-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 active:scale-110 ${isResizing ? "opacity-100 scale-110" : ""}`}>
                            <div className="flex gap-0.5">
                                <div className="w-0.5 h-3 bg-zinc-300 rounded-full" />
                                <div className="w-0.5 h-3 bg-zinc-300 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Preview (Sticky) */}
                    <div
                        className="md:pl-4 lg:pl-10 flex-1 bg-zinc-50/30"
                        style={{
                            width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${100 - leftWidth}%` : '100%',
                            flex: 'none'
                        }}
                    >
                        <div className="md:sticky md:top-8 space-y-6 pt-2">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75"></div>
                                    </div>
                                    <h3 className="font-black text-sm text-gray-900 tracking-tighter uppercase italic">Live Engine Preview</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase bg-white border border-zinc-200 px-3 py-1 rounded-full shadow-sm">Syncing...</span>
                                </div>
                            </div>

                            <div className="w-full bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-zinc-200 overflow-hidden relative group h-[calc(100vh-250px)] max-h-[900px]">
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 z-10 pointer-events-none">
                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[11px] font-bold shadow-2xl border border-white/50 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        ⚡ Shopify Render Logic Active
                                    </div>
                                </div>
                                <div className="w-full h-full overflow-hidden">
                                    <DynamicPreview code={code} className="w-full h-full" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 text-black font-black uppercase tracking-tighter text-xs">
                                    <div className="w-1 h-3 bg-black"></div>
                                    <span>Dev Instructions</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex gap-3 items-start">
                                        <code className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded font-bold">{"{% schema %}"}</code>
                                        <p className="text-[11px] text-zinc-500 leading-normal">Settings defined here populate current theme mock data.</p>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <code className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded font-bold">{"{% for %}"}</code>
                                        <p className="text-[11px] text-zinc-500 leading-normal">Dynamic blocks and loops are rendered using the preview engine.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
