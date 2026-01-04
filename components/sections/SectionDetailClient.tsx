import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Monitor, Smartphone, Tablet, Copy, Check, Info, Edit, Trash2 } from "lucide-react";
import { Section } from "@/data/sections";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { SectionPreview } from "@/components/shared/SectionPreview";
import { DynamicPreview } from "@/components/shared/DynamicPreview";
import { SectionEditor } from "@/components/shared/SectionEditor";
import { useState } from "react";
import { toast } from "sonner";
import { useSectionStore } from "@/lib/section-store";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function SectionDetailClient({ section }: { section: Section }) {
    const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [isEditing, setIsEditing] = useState(false);
    const { removeSection, updateSection } = useSectionStore();
    const router = useRouter();

    const handleCopyCode = (code: string, type: string) => {
        navigator.clipboard.writeText(code);
        toast.success(`${type} code copied to clipboard!`);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this section? This cannot be undone.")) {
            removeSection(section.slug);
            toast.success("Section deleted successfully");
            router.push("/sections");
        }
    };

    const handleUpdate = async (data: any) => {
        try {
            await updateSection(section.slug, {
                name: data.name,
                description: data.description,
                category: data.category,
                niches: data.niches,
                preview: data.preview,
                code: data.code,
            });
            setIsEditing(false);
            // toast.success("Section updated successfully"); // Handled in store
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const isCustom = (section as any).isCustom;

    if (isEditing) {
        return (
            <SectionEditor
                mode="edit"
                initialCode={section.code}
                initialName={section.name}
                initialDescription={section.description}
                initialCategory={section.category}
                initialNiches={section.niches}
                initialPreviewImage={section.preview}
                onSave={handleUpdate}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-white">
            {/* Left: Preview Panel */}
            <div className="flex-1 bg-gray-100 flex flex-col relative border-r border-gray-200">
                {/* Preview Toolbar */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/sections" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Link>
                        <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                        <h1 className="font-semibold text-sm hidden sm:block truncate max-w-[200px]">{section.name}</h1>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-7 w-7 rounded-md transition-all ${viewport === 'desktop' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                                        onClick={() => setViewport("desktop")}
                                    >
                                        <Monitor className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Desktop</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-7 w-7 rounded-md transition-all ${viewport === 'tablet' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                                        onClick={() => setViewport("tablet")}
                                    >
                                        <Tablet className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Tablet</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-7 w-7 rounded-md transition-all ${viewport === 'mobile' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                                        onClick={() => setViewport("mobile")}
                                    >
                                        <Smartphone className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Mobile</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="hidden sm:block flex justify-end gap-2">
                        {isCustom && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-xs"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit className="h-3 w-3 mr-1.5" /> Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 px-3 text-xs"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-3 w-3 mr-1.5" /> Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center bg-[#f0f0f0]">
                    <div
                        className={`bg-white shadow-2xl transition-all duration-500 ease-in-out overflow-hidden origin-top ${viewport === 'desktop' ? 'w-full h-full rounded-md' :
                            viewport === 'tablet' ? 'w-[768px] h-[95%] rounded-xl border-[4px] border-zinc-700 my-auto' :
                                'w-[375px] h-[90%] rounded-[2rem] border-[8px] border-zinc-800 my-auto'
                            }`}
                    >
                        <div className="w-full h-full overflow-y-auto bg-white relative scrollbar-hide">
                            {isCustom ? (
                                <DynamicPreview code={section.code} />
                            ) : (
                                <SectionPreview section={section} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Code Panel */}
            <div className="w-full md:w-[500px] lg:w-[600px] bg-[#1e1e1e] flex flex-col text-white border-l border-zinc-800 shrink-0">
                <div className="p-6 border-b border-zinc-800 shrink-0">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-xl font-bold text-white">{section.name}</h2>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                                {section.category}
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{section.description}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-white text-black hover:bg-zinc-200 transition-colors font-medium h-11"
                            onClick={() => handleCopyCode(section.code, 'Section')}
                        >
                            <Copy className="mr-2 h-4 w-4" /> Copy Section Code
                        </Button>
                        {isCustom && (
                            <Button
                                variant="secondary"
                                className="bg-zinc-800 text-white hover:bg-zinc-700 h-11 px-4 lg:hidden"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
                    <div className="h-full overflow-hidden">
                        <CodeBlock code={section.code} language="html" />
                    </div>
                </div>
            </div>
        </div>
    );
}
