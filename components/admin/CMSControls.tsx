"use client";

import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, AlertTriangle, ShieldCheck, UserMinus, Shield, User } from "lucide-react";

interface UserEditModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function UserEditModal({ user, isOpen, onClose, onSuccess }: UserEditModalProps) {
    const [role, setRole] = useState(user?.role || "user");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateRole = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch("/api/admin", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, role }),
            });

            if (res.ok) {
                toast.success(`Role updated to ${role}`);
                onSuccess();
                onClose();
            } else {
                toast.error("Failed to update role");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter">Edit User Protocol</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Target User</Label>
                        <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                {user?.name?.[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{user?.name}</p>
                                <p className="text-xs text-zinc-400">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Access Level Override</Label>
                        <Tabs value={role} onValueChange={setRole} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1.5">
                                <TabsTrigger
                                    value="user"
                                    className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-lg"
                                >
                                    <User className="h-3 w-3 mr-2" /> Standard
                                </TabsTrigger>
                                <TabsTrigger
                                    value="admin"
                                    className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-lg"
                                >
                                    <Shield className="h-3 w-3 mr-2" /> Admin
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleUpdateRole}
                        disabled={isUpdating}
                        className="w-full h-12 rounded-xl font-black uppercase text-xs tracking-widest bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 group"
                    >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />}
                        Commit Permissions
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface DeleteConfirmModalProps {
    type: "user" | "section";
    target: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function DeleteConfirmModal({ type, target, isOpen, onClose, onSuccess }: DeleteConfirmModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const id = type === "section" ? target.slug : target._id;
            const res = await fetch(`/api/admin?type=${type}&id=${id}`, { method: "DELETE" });

            if (res.ok) {
                toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`);
                onSuccess();
                onClose();
            } else {
                toast.error(`Failed to remove ${type}`);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter text-red-500">Destructive Action Required</DialogTitle>
                </DialogHeader>
                <div className="py-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                        <p className="text-xs font-bold text-red-600 dark:text-red-400">
                            Warning: This procedure is irreversible. All associated data records for this {type} will be purged.
                        </p>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Target Identity</p>
                        <p className="font-black text-lg">{type === 'section' ? target?.name : target?.email}</p>
                    </div>
                </div>
                <DialogFooter className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-12 rounded-xl font-bold border-zinc-200 dark:border-zinc-800"
                    >
                        Abort Mission
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="h-12 rounded-xl font-black uppercase text-xs tracking-widest bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserMinus className="h-4 w-4 mr-2" />}
                        Confirm Deletion
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
