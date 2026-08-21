"use client";

import React from "react";
import Link from "next/link";
import { Truck, Sparkles, ArrowRight } from "lucide-react";

export const DeliveryPromoCard: React.FC = () => {
    return (
        <article className="s-delivery relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl border border-border/40 bg-muted/20 p-5 sm:p-6">
            <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Distribusi Salon
                </span>
                <h3 className="mt-2 font-serif text-xl font-light leading-snug text-foreground sm:text-2xl">
                    Pengiriman Cepat Seluruh Indonesia.
                </h3>
            </div>

            {/* Line-art Graphic */}
            <div className="my-2 flex items-center justify-center text-muted-foreground/50">
                <Truck className="h-14 w-14 stroke-[1.2]" />
            </div>

            <div className="border-t border-border/30 pt-3">
                <p className="text-xs text-muted-foreground">
                    Bebas ongkir untuk pesanan salon & distributor di atas Rp 2.000.000
                </p>
            </div>
        </article>
    );
};

export const RewardsPromoCard: React.FC = () => {
    return (
        <article className="s-ad relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl bg-[#12271D] p-5 text-[#FAF9F5] sm:p-6">
            <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FAF9F5]/70">
                    <Sparkles className="h-3 w-3" />
                    <span>Alfa Rewards</span>
                </div>
                <h3 className="mt-3 font-serif text-xl font-light leading-snug text-[#FAF9F5] sm:text-2xl">
                    Cashback 5% untuk Setiap Pembelian Mitra.
                </h3>
            </div>

            <div className="border-t border-[#FAF9F5]/20 pt-3">
                <Link
                    href="/partnership"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF9F5] transition-opacity hover:opacity-80"
                >
                    <span>Daftar Mitra Salon</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="mt-1 text-[10px] text-[#FAF9F5]/50">
                    *Khusus salon & hair artist terdaftar
                </p>
            </div>
        </article>
    );
};
