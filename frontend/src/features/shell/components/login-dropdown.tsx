"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ChevronDown,
    User,
    LogOut,
    Package,
    Building2,
    Headphones,
    ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUserRole, type UserRole } from "@/shared/components/providers/role-provider";
import { cn } from "@/shared/lib/utils";

export const LoginDropdown: React.FC<{ isSolid?: boolean }> = ({ isSolid = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { role, setRole, user, isGuest, isSalon, isDistributor } = useUserRole();

    const roleLabels: Record<UserRole, string> = {
        guest: "Pengunjung",
        consumer: "Konsumen",
        partner_pending: "Mitra (Verifikasi)",
        salon_verified: "Mitra Salon",
        distributor_verified: "Distributor",
    };

    const handleLogout = () => {
        setRole("guest");
        setIsOpen(false);
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Standard E-Commerce Header Account Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 text-caption font-medium tracking-[0.01em] transition-colors cursor-pointer rounded-full",
                    isSolid
                        ? "text-foreground/80 hover:text-foreground"
                        : "text-white/90 hover:text-white"
                )}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <User className="h-4 w-4" />
                <span className="max-w-[100px] truncate">
                    {isGuest ? "Masuk" : user.name.split(" ")[0]}
                </span>
                <ChevronDown
                    className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isSolid ? "text-muted-foreground" : "text-white/70",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {/* Standard E-Commerce Account Popover */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full z-50 mt-1 w-64 rounded-md border border-border bg-background p-3 shadow-lg"
                    >
                        {isGuest ? (
                            /* ─── Standard E-Commerce Guest State ─── */
                            <div>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex h-10 w-full items-center justify-center rounded bg-foreground px-4 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
                                >
                                    Masuk
                                </Link>
                                <p className="mt-2.5 text-center text-xs text-muted-foreground">
                                    Pengguna baru?{" "}
                                    <Link
                                        href="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="font-semibold text-brand-crimson hover:underline"
                                    >
                                        Daftar di sini
                                    </Link>
                                </p>

                                <div className="my-2.5 border-t border-border" />

                                <div className="space-y-0.5">
                                    <Link
                                        href="/my-account"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2.5 rounded px-2.5 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                                    >
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <span>Lacak & Riwayat Pesanan</span>
                                    </Link>
                                    <Link
                                        href="/partnership"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2.5 rounded px-2.5 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                                    >
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span>Kemitraan Salon & B2B</span>
                                    </Link>
                                    <Link
                                        href="/contact"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2.5 rounded px-2.5 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                                    >
                                        <Headphones className="h-4 w-4 text-muted-foreground" />
                                        <span>Pusat Bantuan & CS</span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            /* ─── Standard E-Commerce Authenticated State ─── */
                            <div>
                                <div className="px-2.5 py-2">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-xs font-bold text-foreground truncate">
                                            {user.name}
                                        </p>
                                        {user.isVerified && (
                                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                        {user.businessName || user.email || roleLabels[role]}
                                    </p>
                                    {(isSalon || isDistributor) && user.pointsBalance > 0 && (
                                        <p className="mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                            Poin: Rp {user.pointsBalance.toLocaleString("id-ID")}
                                        </p>
                                    )}
                                </div>

                                <div className="my-1.5 border-t border-border" />

                                <div className="space-y-0.5">
                                    <Link
                                        href="/my-account"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2.5 rounded px-2.5 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                                    >
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <span>Dashboard & Pesanan</span>
                                    </Link>
                                    <Link
                                        href="/partnership"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2.5 rounded px-2.5 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                                    >
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span>Program Kemitraan</span>
                                    </Link>
                                    <Link
                                        href="/contact"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2.5 rounded px-2.5 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                                    >
                                        <Headphones className="h-4 w-4 text-muted-foreground" />
                                        <span>Pusat Bantuan & CS</span>
                                    </Link>
                                </div>

                                <div className="my-1.5 border-t border-border" />

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-xs font-medium text-brand-crimson hover:bg-brand-crimson/5 transition-colors cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Keluar dari Akun</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
