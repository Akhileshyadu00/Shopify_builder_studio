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
import { Loader2, AlertTriangle, ShieldCheck, UserMinus, Shield, User, UserPlus, Layout, Plus, ExternalLink } from "lucide-react";

interface UserEditModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function UserEditModal({ user, isOpen, onClose, onSuccess }: UserEditModalProps) {
    const [role, setRole] = useState(user?.role || "user");
    const [newPassword, setNewPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    React.useEffect(() => {
        if (user) {
            setRole(user.role);
            setNewPassword("");
        }
    }, [user, isOpen]);

    const handleUpdateUser = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch("/api/admin", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user._id,
                    role,
                    newPassword: newPassword || undefined
                }),
            });

            if (res.ok) {
                toast.success(newPassword ? "User role and password updated" : `Role updated to ${role}`);
                onSuccess();
                onClose();
            } else {
                toast.error("Failed to update identity records");
            }
        } catch (error) {
            toast.error("Comm link failure: Update aborted");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter italic">Update <span className="text-primary italic">Privilege</span></DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Target Identity</Label>
                        <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                {user?.name?.[0].toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-sm truncate">{user?.name}</p>
                                <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Access Level Override</Label>
                        <Tabs value={role} onValueChange={setRole} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1.5 border border-zinc-200 dark:border-zinc-800">
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
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Manual Password Reset</Label>
                        <Input
                            type="password"
                            placeholder="New secure access key (leave blank to keep current)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-12 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 focus:ring-primary/20 text-xs"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleUpdateUser}
                        disabled={isUpdating}
                        className="w-full h-12 rounded-xl font-black uppercase text-xs tracking-widest bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 group"
                    >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />}
                        Commit Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface UserSectionsModalProps {
    user: any;
    sections: any[];
    isOpen: boolean;
    onClose: () => void;
}

export function UserSectionsModal({ user, sections, isOpen, onClose }: UserSectionsModalProps) {
    const userSections = sections.filter(s => s.userId === user?._id || s.userId === user?.email);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] p-10 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Asset <span className="text-primary italic">Inventory</span></DialogTitle>
                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs">
                        <span>Owner:</span>
                        <span className="text-zinc-100">{user?.name}</span>
                        <span className="text-zinc-600">({user?.email})</span>
                    </div>
                </DialogHeader>

                <div className="py-8 space-y-4">
                    {userSections.length === 0 ? (
                        <div className="p-10 text-center border-2 border-dashed border-zinc-800 rounded-[2rem] text-zinc-500">
                            <Layout className="h-8 w-8 mx-auto mb-4 opacity-20" />
                            <p className="text-xs font-black uppercase tracking-widest">No assets identified in this registry</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {userSections.map((section) => (
                                <div key={section.slug} className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                                            <Layout className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm">{section.name}</p>
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Slug: {section.slug}</p>
                                        </div>
                                    </div>
                                    <div className="bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                                        <span className="text-[9px] font-black uppercase text-primary tracking-widest">Active</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-500"
                    >
                        Close Registry
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface UserCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function UserCreateModal({ isOpen, onClose, onSuccess }: UserCreateModalProps) {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Identity records incomplete");
            return;
        }

        setIsCreating(true);
        try {
            const res = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("New identity registered in fleet");
                onSuccess();
                onClose();
                setFormData({ name: "", email: "", password: "", role: "user" });
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create user");
            }
        } catch (error) {
            toast.error("Signal lost during registration");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] p-10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">New <span className="text-primary italic">Identity</span></DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-6 border-b border-zinc-100 dark:border-zinc-900 mb-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2">Verification Name</Label>
                            <Input
                                placeholder="System Operator"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-12 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2">Secure Email</Label>
                            <Input
                                type="email"
                                placeholder="operator@studio.inc"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-12 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2">Access Key</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="h-12 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleCreate}
                        disabled={isCreating}
                        className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-[0.2em] bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black hover:scale-[1.02] transition-all shadow-xl"
                    >
                        {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                        Execute Registration
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface SectionCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function SectionCreateModal({ isOpen, onClose, onSuccess }: SectionCreateModalProps) {
    const [formData, setFormData] = useState({ name: "", code: "", description: "" });
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!formData.name || !formData.code) {
            toast.error("Asset records incomplete");
            return;
        }

        setIsCreating(true);
        try {
            const res = await fetch("/api/sections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    code: formData.code,
                    description: formData.description,
                    category: "General",
                    niches: ["Other"]
                }),
            });

            if (res.ok) {
                toast.success("New section synthesized in registry");
                onSuccess();
                onClose();
                setFormData({ name: "", code: "", description: "" });
            } else {
                toast.error("Synthesis rejection: Validation failed");
            }
        } catch (error) {
            toast.error("Signal lost during synthesis");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] p-10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Sythensize <span className="text-primary italic">Section</span></DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-mono">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2">Component Name</Label>
                            <Input
                                placeholder="Banner V1"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-12 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-2">Structural Code (Liquid/HTML)</Label>
                            <textarea
                                placeholder="<div>...</div>"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="w-full min-h-[200px] p-4 text-xs border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleCreate}
                        disabled={isCreating}
                        className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-[0.2em] bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black hover:scale-[1.02] transition-all shadow-xl"
                    >
                        {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        Inject to Registry
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
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter text-red-500 italic">Destructive <span className="italic">Action</span> required</DialogTitle>
                </DialogHeader>
                <div className="py-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                        <p className="text-xs font-bold text-red-600 dark:text-red-400">
                            Warning: This procedure is irreversible. All associated data records for this {type} will be purged from the fleet permanently.
                        </p>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Target Identity</p>
                        <p className="font-black text-lg">{type === 'section' ? target?.name : target?.email}</p>
                    </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest text-zinc-400"
                    >
                        Abort
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-[2] h-12 rounded-xl font-black uppercase text-xs tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserMinus className="h-4 w-4 mr-2" />}
                        Confirm Purge
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
