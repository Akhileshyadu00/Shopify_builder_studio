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
import { ArrowLeft, Loader2, Sparkles, Smartphone, Tablet, Monitor, Zap, ArrowRight, Image as ImageIcon, Upload, X } from "lucide-react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import Image from "next/image";

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
    const [previewImage, setPreviewImage] = useState("");
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

    // Resize State
    const [leftWidth, setLeftWidth] = useState(50); // Percentage
    const [isResizing, setIsResizing] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [mounted, setMounted] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    // Initial mount check
    useEffect(() => {
        setMounted(true);
        setIsLargeScreen(window.innerWidth >= 768);
        const handleResize = () => setIsLargeScreen(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auth check
    useEffect(() => {
        if (mounted && status === "unauthenticated") {
            toast.error("Please login to upload sections");
            router.push("/");
        }
    }, [status, router, mounted]);

    // Resize Effect
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

    if (!mounted || status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
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
                niches: niches as Niche[],
                preview: previewImage || "/custom_section_placeholder.png",
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                toast.success("Image uploaded successfully!");
            };
            reader.readAsDataURL(file);
        }
    };

    const startResizing = (e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    };


    const getPreviewWidth = () => {
        switch (previewDevice) {
            case 'mobile': return '375px';
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    return (
        <div className={`min-h-screen bg-white dark:bg-black ${isResizing ? "cursor-col-resize select-none" : ""}`}>
            {/* Overlay */}
            {isResizing && (
                <div className="fixed inset-0 z-50 cursor-col-resize" onMouseUp={() => setIsResizing(false)} />
            )}

            <div className="mx-auto w-full px-4 lg:px-12 py-8">
                <div className="flex items-center justify-between mb-10 border-b border-zinc-100 pb-6">
                    <Link href="/sections" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors group">
                        <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" /> Back to Workspace
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-2xl">
                            <Zap className="h-5 w-5 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Studio <span className="text-zinc-300 italic">v2.0</span></h1>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Direct Theme Integration</p>
                        </div>
                    </div>
                    <div className="w-24"></div>
                </div>

                <div className="flex flex-col md:flex-row gap-0 min-h-[calc(100vh-200px)] relative items-stretch">
                    {/* Left: Input Form */}
                    <div
                        className="space-y-8 md:pr-6 lg:pr-12 pb-20 overflow-y-auto"
                        style={{
                            width: isLargeScreen ? `${leftWidth}%` : '100%',
                            flex: 'none'
                        }}
                    >
                        <div className={`grid gap-6 ${leftWidth < 45 ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"}`}>
                            <Card className="border-none surface p-1">
                                <CardHeader className="p-5 pb-2">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Section Identity</CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 pt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-[10px] font-black uppercase text-zinc-500 tracking-wider dark:text-zinc-300">Internal Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Premium Hero Video"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 text-sm font-bold border-none shadow-none surface-high focus-visible:ring-black rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-[10px] font-black uppercase text-zinc-500 tracking-wider dark:text-zinc-300">Theme Category</Label>
                                        <Input
                                            id="category"
                                            placeholder="e.g. Hero"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="h-12 text-sm font-bold border-none shadow-none surface-high focus-visible:ring-black rounded-xl"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none surface p-1">
                                <CardHeader className="p-5 pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Visual Preview</CardTitle>
                                        <ImageIcon className="h-3 w-3 text-zinc-300" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 pt-0 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider dark:text-zinc-300">Image Source</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="previewImage"
                                                placeholder="https://... or paste link"
                                                value={previewImage}
                                                onChange={(e) => setPreviewImage(e.target.value)}
                                                className="h-10 text-xs font-bold border-none shadow-none surface-high focus-visible:ring-black rounded-xl"
                                            />
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="fileUpload"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => document.getElementById('fileUpload')?.click()}
                                                    variant="outline"
                                                    className="h-10 w-10 p-0 rounded-xl surface-high border-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {previewImage && (
                                        <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                                            <Image
                                                src={previewImage}
                                                alt="Section Preview"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                            <button
                                                onClick={() => setPreviewImage("")}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-none surface p-1">
                                <CardHeader className="p-5 pb-2">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Niche Tags</CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 pt-0">
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {availableNiches.map((niche) => (
                                            <button
                                                key={niche}
                                                type="button"
                                                onClick={() => setNiches(prev =>
                                                    prev.includes(niche) ? prev.filter(n => n !== niche) : [...prev, niche]
                                                )}
                                                className={`rounded-xl px-4 py-2.5 text-[10px] font-black transition-all border-2 active:scale-95 ${niches.includes(niche)
                                                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                                                    : "bg-white text-zinc-500 border-transparent hover:border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400"
                                                    }`}
                                            >
                                                {niche}
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-none surface p-1">
                            <CardHeader className="p-5 pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Metadata Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 pt-0">
                                <Textarea
                                    id="description"
                                    placeholder="Technical description for other developers..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[100px] text-sm font-medium border-none shadow-none surface-high focus-visible:ring-black rounded-xl resize-none p-4"
                                />
                            </CardContent>
                        </Card>

                        <div className="relative group/editor rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white/10">
                            <div className="bg-[#0a0a0a] px-8 py-5 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-6">
                                    <div className="flex gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.3)]"></div>
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.3)]"></div>
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.3)]"></div>
                                    </div>
                                    <div className="h-4 w-px bg-white/10"></div>
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Module.liquid</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Syntax Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#0d0d0d]">
                                <form onSubmit={handleSubmit} className="relative">
                                    <Textarea
                                        id="code"
                                        className="font-mono text-[14px] min-h-[700px] p-10 leading-[1.8] bg-transparent text-zinc-300 border-0 focus-visible:ring-0 rounded-none scrollbar-hide selection:bg-primary/40"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        spellCheck={false}
                                    />
                                    <div className="absolute bottom-12 right-12 z-10">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className={`group relative overflow-hidden h-16 px-12 rounded-[1.25rem] font-black transition-all active:scale-95 ${isLoading ? "bg-zinc-800" : "bg-white text-black hover:scale-105"
                                                }`}
                                            disabled={isLoading}
                                        >
                                            <span className="relative z-10 flex items-center gap-3">
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Deploying Module...
                                                    </>
                                                ) : (
                                                    <>
                                                        Ship Section <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </span>
                                            {!isLoading && <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Resizer */}
                    <div
                        onMouseDown={startResizing}
                        className={`hidden md:flex w-2 hover:w-3 bg-transparent cursor-col-resize items-center justify-center transition-all group z-40 relative touch-none select-none ${isResizing ? "w-3" : ""}`}
                    >
                        <div className={`absolute inset-y-0 w-[2px] bg-zinc-100 group-hover:bg-black/20 transition-colors ${isResizing ? "bg-black/40 w-[3px]" : ""}`} />
                        <div className={`w-6 h-12 bg-white border border-zinc-200 shadow-2xl rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110 active:scale-125 ${isResizing ? "opacity-100 scale-125" : ""}`}>
                            <div className="flex gap-[1px]">
                                <div className="w-[1.5px] h-3 bg-zinc-300 rounded-full" />
                                <div className="w-[1.5px] h-3 bg-zinc-300 rounded-full" />
                                <div className="w-[1.5px] h-3 bg-zinc-300 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Preview */}
                    <div
                        className="md:pl-6 lg:pl-16 flex-1 bg-zinc-50/20"
                        style={{
                            width: isLargeScreen ? `${100 - leftWidth}%` : '100%',
                            flex: 'none'
                        }}
                    >
                        <div className="md:sticky md:top-8 space-y-8 pt-4">
                            {/* Device Switcher */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 p-1.5 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                                        {[
                                            { id: 'mobile', icon: Smartphone },
                                            { id: 'tablet', icon: Tablet },
                                            { id: 'desktop', icon: Monitor }
                                        ].map((device) => (
                                            <button
                                                key={device.id}
                                                onClick={() => setPreviewDevice(device.id as any)}
                                                className={`p-2 rounded-xl transition-all ${previewDevice === device.id
                                                    ? "bg-black text-white shadow-lg"
                                                    : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                                                    }`}
                                            >
                                                <device.icon className="h-4 w-4" />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="h-4 w-px bg-zinc-200"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 italic">Liquid Engine Alpha</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black pointer-events-none text-zinc-300 uppercase tracking-[0.2em]">Scale: Auto</span>
                                </div>
                            </div>

                            {/* Preview Container */}
                            <div className="flex justify-center transition-all duration-500 ease-in-out">
                                <div
                                    className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-zinc-100 overflow-hidden relative group h-[calc(100vh-280px)] max-h-[1000px] transition-all duration-500"
                                    style={{ width: getPreviewWidth() }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/2 z-10 pointer-events-none">
                                        <div className="bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            Interactive Canvas
                                        </div>
                                    </div>
                                    <div className="w-full h-full overflow-hidden">
                                        <DynamicPreview code={code} className="w-full h-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Technical Specs */}
                            <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-black"></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Module Specifications</h4>
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-400">Ver: 1.0.4</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-50 rounded-2xl">
                                        <code className="text-[10px] block font-black mb-1 opacity-50">{"{% SCHEMA %}"}</code>
                                        <p className="text-[10px] font-bold text-zinc-600 leading-tight">Configures theme settings panel.</p>
                                    </div>
                                    <div className="p-4 bg-zinc-50 rounded-2xl">
                                        <code className="text-[10px] block font-black mb-1 opacity-50">{"{% BLOCKS %}"}</code>
                                        <p className="text-[10px] font-bold text-zinc-600 leading-tight">Enables dynamic content stacking.</p>
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
