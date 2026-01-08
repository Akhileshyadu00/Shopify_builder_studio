"use client";

import React from "react";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMounted } from "@/lib/hooks";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const mounted = useMounted();

    // Check if we're on the root admin page (registration portal)
    const isRootAdmin = pathname === "/admin";

    if (!mounted || status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Protection logic for non-root routes
    if (!isRootAdmin && (!session || session.user.role !== "admin")) {
        // We use a clean redirect to the portal
        router.replace("/admin");
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If it's the root admin page, render without the sidebar shell
    if (isRootAdmin) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-black">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-10 lg:pl-0">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
