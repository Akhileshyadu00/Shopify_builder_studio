import { Section } from "@/data/sections";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface CustomSection extends Section {
    isCustom: true;
    createdAt: string;
    _id?: string;
}

export function useSectionStore() {
    const [customSections, setCustomSections] = useState<CustomSection[]>([]);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSections = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/sections");
            if (res.ok) {
                const data = await res.json();
                setCustomSections(data);
            }
        } catch (error) {
            console.error("Failed to fetch custom sections:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchSections();

        const handleStorageChange = () => {
            fetchSections();
        };

        window.addEventListener("section-change", handleStorageChange);
        return () => window.removeEventListener("section-change", handleStorageChange);
    }, [fetchSections]);

    const addSection = async (section: Omit<CustomSection, "createdAt" | "isCustom">) => {
        try {
            const res = await fetch("/api/sections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(section),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to save section");
            }

            await fetchSections();
            window.dispatchEvent(new Event("section-change"));
            toast.success("Section saved successfully!");
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            console.error("Add section error:", error);
            toast.error(message);
            throw error;
        }
    };

    const removeSection = async (slug: string) => {
        try {
            const res = await fetch(`/api/sections?slug=${slug}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to delete section");
            }

            toast.success("Section deleted successfully");
            await fetchSections();
            window.dispatchEvent(new Event("section-change"));
        } catch (error) {
            console.error("Delete section error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete section");
            throw error;
        }
    };

    return {
        customSections,
        addSection,
        removeSection,
        mounted,
        isLoading,
        refresh: fetchSections
    };
}
