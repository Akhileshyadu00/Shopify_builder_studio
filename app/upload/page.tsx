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
                const newWidth = (e.clientX / window.innerWidth) * 100;
                if (newWidth > 25 && newWidth < 75) {
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
        }
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizing]);

    return (
        <div className={`min-h-screen bg-white ${isResizing ? "cursor-col-resize select-none" : ""}`}>
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
                        className="space-y-6 md:pr-4 lg:pr-8 pb-12 transition-none"
                        style={{
                            width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${leftWidth}%` : '100%',
                            flex: 'none'
                        }}
                    >
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            <Card className="border-zinc-200 shadow-sm">
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base">Identity</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Hero Video"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-9 text-sm focus-visible:ring-black"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-xs font-semibold uppercase text-muted-foreground">Category</Label>
                                        <Input
                                            id="category"
                                            placeholder="e.g. Hero"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="h-9 text-sm focus-visible:ring-black"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-zinc-200 shadow-sm">
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base">Niches</CardTitle>
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
                                                className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all border ${niches.includes(niche)
                                                    ? "bg-black text-white border-black"
                                                    : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300"
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
                                <CardTitle className="text-base">Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-semibold uppercase text-muted-foreground">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="What does this section do?..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="h-16 text-sm resize-none focus-visible:ring-black"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-black shadow-lg overflow-hidden">
                            <div className="bg-black px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                                    </div>
                                    <span className="ml-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Section.liquid</span>
                                </div>
                            </div>
                            <CardContent className="p-0">
                                <form onSubmit={handleSubmit} className="relative">
                                    <Textarea
                                        id="code"
                                        className="font-mono text-xs min-h-[500px] p-4 lg:p-6 leading-relaxed bg-[#1e1e1e] text-zinc-300 border-0 focus-visible:ring-0 rounded-none scrollbar-hide"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        spellCheck={false}
                                    />
                                    <div className="absolute bottom-6 right-6">
                                        <Button type="submit" size="lg" className="bg-white text-black hover:bg-zinc-200 shadow-xl font-bold" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" /> : "Deploy to Library"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resize Handle */}
                    <div
                        onMouseDown={startResizing}
                        className="hidden md:flex w-4 hover:w-6 bg-transparent cursor-col-resize items-center justify-center transition-all group z-30 -mx-2 touch-none"
                    >
                        <div className={`w-1 h-12 bg-zinc-200 group-hover:bg-primary rounded-full transition-colors ${isResizing ? "bg-primary" : ""}`} />
                    </div>

                    {/* Right: Live Preview (Sticky) */}
                    <div
                        className="md:pl-4 lg:pl-8 flex-1"
                        style={{
                            width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${100 - leftWidth}%` : '100%',
                            flex: 'none'
                        }}
                    >
                        <div className="md:sticky md:top-8 space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <h3 className="font-bold text-sm text-gray-900 tracking-tight">Live Preview</h3>
                                </div>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded">Mocking Shopify Engine</span>
                            </div>

                            <div className="aspect-square w-full bg-zinc-50 rounded-2xl shadow-inner border border-zinc-200 overflow-hidden relative group max-h-[70vh] md:max-h-[85vh]">
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 z-10 pointer-events-none">
                                    <span className="bg-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">Previewing changes...</span>
                                </div>
                                <DynamicPreview code={code} className="w-full h-full" />
                            </div>

                            <div className="bg-zinc-900 text-zinc-400 text-[11px] p-5 rounded-xl border border-zinc-800 space-y-3 leading-relaxed">
                                <div className="flex items-center gap-2 text-zinc-200 font-bold uppercase tracking-wider text-[10px]">
                                    <span>Instructions</span>
                                </div>
                                <p className="text-zinc-500 leading-normal">
                                    Define settings in <code className="text-blue-400 font-semibold">{'{% schema %}'}</code>. They will be auto-populated in this preview.
                                    Blocks and loops are simulated using mock Shopify objects.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
