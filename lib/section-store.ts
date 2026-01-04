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
    const [mySections, setMySections] = useState<CustomSection[]>([]);
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

    const fetchMySections = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/sections?mine=true");
            if (res.ok) {
                const data = await res.json();
                setMySections(data);
            }
        } catch (error) {
            console.error("Failed to fetch my sections:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const [likedSlugs, setLikedSlugs] = useState<string[]>([]);
    const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

    const fetchInteractions = useCallback(async () => {
        try {
            const res = await fetch("/api/interact");
            if (res.ok) {
                const data = await res.json();
                setLikedSlugs(data.likedSlugs || []);
                setSavedSlugs(data.savedSlugs || []);
            }
        } catch (error) {
            console.error("Failed to fetch interactions:", error);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchSections();
        fetchInteractions();

        const handleStorageChange = () => {
            fetchSections();
            fetchMySections();
            fetchInteractions();
        };

        window.addEventListener("section-change", handleStorageChange);
        return () => window.removeEventListener("section-change", handleStorageChange);
    }, [fetchSections, fetchMySections, fetchInteractions]);

    const toggleInteraction = async (slug: string, action: "like" | "save") => {
        // Optimistic UI Update
        if (action === "like") {
            setLikedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
        } else {
            setSavedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
        }

        try {
            const res = await fetch("/api/interact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, action }),
            });

            if (!res.ok) throw new Error("Failed to update interaction");

            // No need to refetch immediately if optimistic update worked, but...
            // window.dispatchEvent(new Event("section-change")); // updates counts for others
        } catch (error) {
            console.error("Interaction failed:", error);
            // Revert on failure
            fetchInteractions();
            toast.error("Action failed");
        }
    };

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
            await fetchMySections();
            window.dispatchEvent(new Event("section-change"));
            toast.success("Section saved successfully!");
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            console.error("Add section error:", error);
            toast.error(message);
            throw error;
        }
    };

    const updateSection = async (slug: string, updates: Partial<CustomSection>) => {
        try {
            const res = await fetch("/api/sections", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, ...updates }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update section");
            }

            await fetchSections();
            await fetchMySections();
            window.dispatchEvent(new Event("section-change"));
            toast.success("Section updated successfully!");
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred";
            console.error("Update section error:", error);
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
            await fetchMySections();
            window.dispatchEvent(new Event("section-change"));
        } catch (error) {
            console.error("Delete section error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete section");
            throw error;
        }
    };

    return {
        customSections,
        mySections,
        likedSlugs,
        savedSlugs,
        addSection,
        updateSection,
        removeSection,
        toggleInteraction,
        fetchMySections,
        mounted,
        isLoading,
        refresh: fetchSections
    };
}
