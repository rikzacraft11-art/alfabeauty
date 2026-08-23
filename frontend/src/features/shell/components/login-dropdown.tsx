"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, User, Building2, ChevronDown, ShieldCheck, Check, RotateCcw, CreditCard } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUserRole, type UserRole } from "@/shared/components/providers/role-provider";

export const LoginDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { role, setRole, user, isGuest, isSalon, isDistributor, isConsumer, isPartnerPending } = useUserRole();

    const roleBadges: Record<UserRole, { label: string; icon: string; bg: string }> = {
        guest: { label: "Guest", icon: "👤", bg: "bg-neutral-100 text-neutral-800" },
        consumer: { label: "Konsumen", icon: "🛍️", bg: "bg-blue-100 text-blue-900" },
        partner_pending: { label: "Mitra (Pending)", icon: "⏳", bg: "bg-amber-100 text-amber-900" },
        salon_verified: { label: "Mitra Salon", icon: "✂️", bg: "bg-red-100 text-red-900" },
        distributor_verified: { label: "Distributor", icon: "🏢", bg: "bg-emerald-100 text-emerald-900" },
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    !isGuest
                        ? "bg-brand-crimson text-white hover:bg-brand-dark"
                        : "bg-foreground text-background hover:bg-foreground/85"
                }`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span>{roleBadges[role].icon}</span>
                <span className="max-w-[110px] truncate">{isGuest ? "Login" : user.name.split(" ")[0]}</span>
                <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Account & Role Switcher Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="h-account-dropdown absolute right-0 top-full z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-border/60 bg-background/95 p-5 shadow-2xl backdrop-blur-xl"
                    >
                        {/* Current User Role Info Card */}
                        <div className="rounded-xl border border-border-warm/60 bg-surface-elevated/70 p-3.5">
                            <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${roleBadges[role].bg}`}>
                                    {roleBadges[role].icon} {roleBadges[role].label}
                                </span>
                                {user.isVerified && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                        <ShieldCheck className="h-3 w-3" /> Terverifikasi
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 text-sm font-bold text-foreground truncate">
                                {user.name}
                            </p>
                            {user.businessName && (
                                <p className="text-[11px] text-muted-foreground truncate">
                                    {user.businessName}
                                </p>
                            )}

                            {/* Points & Plafon Counter for Partners */}
                            {(isSalon || isDistributor) && (
                                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border-warm/50 pt-2.5 text-[11px]">
                                    <div>
                                        <span className="block text-[10px] text-muted-foreground">Poin Loyalitas</span>
                                        <span className="font-bold text-emerald-700">Rp {user.pointsBalance.toLocaleString("id-ID")}</span>
                                    </div>
                                    {user.creditLimit && (
                                        <div>
                                            <span className="block text-[10px] text-muted-foreground">Sisa Plafon Tempo</span>
                                            <span className="font-bold text-foreground">
                                                Rp {((user.creditLimit || 0) - (user.usedCredit || 0)).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Interactive Role Switcher for Testing (Blueprint.md Principles) */}
                        <div className="mt-4">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Simulasi Peran Pengguna (Blueprint.md):
                            </p>
                            <div className="grid grid-cols-1 gap-1.5">
                                {(
                                    [
                                        { id: "guest", label: "Guest (Pengunjung)", sub: "MSRP publik (C1) · Login untuk harga mitra" },
                                        { id: "consumer", label: "Konsumen Terdaftar", sub: "MSRP · Checkout SKU white-list" },
                                        { id: "salon_verified", label: "Salon / Barber Resmi", sub: "Harga Net Salon (-35%) · Order grosir" },
                                        { id: "distributor_verified", label: "Distributor Resmi", sub: "Harga Net Distributor (-50%) · Tier MOQ" },
                                        { id: "partner_pending", label: "Pendaftar Mitra", sub: "Verifikasi dokumen SLA ≤ 4 jam" },
                                    ] as const
                                ).map((r) => {
                                    const isSelected = role === r.id;
                                    return (
                                        <button
                                            key={r.id}
                                            onClick={() => setRole(r.id)}
                                            className={`flex items-start justify-between rounded-lg border p-2 text-left transition-all ${
                                                isSelected
                                                    ? "border-brand-crimson bg-brand-crimson/5 text-brand-crimson"
                                                    : "border-border-warm/50 bg-background/50 hover:bg-surface-elevated text-foreground"
                                            }`}
                                        >
                                            <div>
                                                <span className="text-[12px] font-semibold flex items-center gap-1.5">
                                                    <span>{roleBadges[r.id].icon}</span>
                                                    <span>{r.label}</span>
                                                </span>
                                                <span className="block text-[10px] text-muted-foreground/80 mt-0.5">
                                                    {r.sub}
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <Check className="h-3.5 w-3.5 shrink-0 text-brand-crimson mt-0.5" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Direct Navigation Links */}
                        <div className="mt-4 border-t border-border-warm/50 pt-3 flex items-center justify-between text-[11.5px]">
                            <Link
                                href="/partnership"
                                className="font-semibold text-brand-crimson hover:underline"
                            >
                                Formulir Kemitraan
                            </Link>
                            <Link
                                href="/contact"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Hubungi CS
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
