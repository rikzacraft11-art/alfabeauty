"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, User, Building2, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const LoginDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"retail" | "b2b">("retail");

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger Button (Pill Button 1:1 Yucca) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform duration-200 hover:scale-105"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span>Login</span>
                <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dual-Pane Dropdown Menu (1:1 Yucca .h-account-dropdown) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="h-account-dropdown absolute right-0 top-full z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-border/50 bg-background/95 p-5 shadow-2xl backdrop-blur-xl"
                    >
                        {/* Tab Switcher (Shop vs B2B Portal) */}
                        <div className="flex border-b border-border/40 pb-3">
                            <button
                                onClick={() => setActiveTab("retail")}
                                className={`relative flex-1 pb-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                                    activeTab === "retail"
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span className="flex items-center justify-center gap-1.5">
                                    <User className="h-3.5 w-3.5" />
                                    <span>Mitra Salon</span>
                                </span>
                                {activeTab === "retail" && (
                                    <motion.div
                                        layoutId="login-tab-line"
                                        className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-foreground"
                                    />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab("b2b")}
                                className={`relative flex-1 pb-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                                    activeTab === "b2b"
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span className="flex items-center justify-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" />
                                    <span>B2B Portal</span>
                                </span>
                                {activeTab === "b2b" && (
                                    <motion.div
                                        layoutId="login-tab-line"
                                        className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-foreground"
                                    />
                                )}
                            </button>
                        </div>

                        {/* Tab Content Panes */}
                        <div className="mt-4">
                            {activeTab === "retail" ? (
                                <div className="space-y-4">
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Masuk untuk belanja produk salon resmi, pantau pesanan, dan dapatkan cashback 5% melalui Alfa Rewards.
                                    </p>

                                    <Link
                                        href="/login"
                                        className="flex w-full items-center justify-center rounded-xl bg-foreground py-2.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
                                    >
                                        Login Mitra Salon
                                    </Link>

                                    <p className="text-center text-[11px] text-muted-foreground">
                                        Belum punya akun?{" "}
                                        <Link href="/register" className="font-semibold text-foreground underline underline-offset-2">
                                            Daftar disini
                                        </Link>
                                    </p>

                                    {/* Alfa Rewards Banner */}
                                    <div className="rounded-xl bg-[#12271D] p-3 text-[#FAF9F5]">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FAF9F5]/70">
                                            <Sparkles className="h-3 w-3" />
                                            <span>Alfa Rewards</span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-[#FAF9F5]/90">
                                            Dapatkan cashback 5% untuk setiap pembelanjaan rutin.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Portal khusus untuk distributor terverifikasi, maklon formulasi kustom, dan pesanan grosir volume besar.
                                    </p>

                                    <Link
                                        href="/partnership"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
                                    >
                                        <span>Buka Portal B2B / Maklon</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>

                                    <p className="text-center text-[11px] text-muted-foreground">
                                        Ingin menjadi distributor resmi?{" "}
                                        <Link href="/partnership" className="font-semibold text-foreground underline underline-offset-2">
                                            Pelajari syarat
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
