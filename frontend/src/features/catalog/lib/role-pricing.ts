import type { Product } from "../data/products.ts";

export type UserRole =
    | "guest"
    | "consumer"
    | "partner_pending"
    | "salon_verified"
    | "distributor_verified";

export interface RoleConfig {
    showMsrpToGuests: boolean;
    minOpeningOrderSalon: number;
    pointsPer500k: number;
    maxConsumerDiscountPercent: number;
}

export const DEFAULT_ROLE_CONFIG: RoleConfig = {
    showMsrpToGuests: true,
    minOpeningOrderSalon: 1500000,
    pointsPer500k: 5000,
    maxConsumerDiscountPercent: 10,
};

/* ─────────────────────────────────────────────────────────────────────
 * Multi-Role Pricing & Access Resolver
 * Implements Blueprint.md Bagian B1 (Matriks Peran) & Bagian D2 (Template PDP)
 * ───────────────────────────────────────────────────────────────────── */

export interface ProductRoleAccess {
    /** Apakah harga sudah ter-ACC oleh Owner (Prinsip A5 / Syarat P3) */
    isPriceApproved: boolean;

    /** Visibilitas MSRP & Harga Net */
    canViewMsrp: boolean;
    canViewNetPrice: boolean;
    canDirectBuy: boolean;

    /** Harga Efektif & Tampilan Format */
    msrpPrice: number | null;
    formattedMsrp: string | null;
    netPrice: number | null;
    formattedNetPrice: string | null;
    effectivePrice: number | null;
    formattedEffectivePrice: string;

    /** Tier Label & Diskon */
    tierLabel: string;
    discountPercent: number | null;
    pointsEarnedPreview: number;

    /** Pembatasan Khusus Konsumen (White-list M1 & Mitigasi Risiko Kimia) */
    isRestrictedForRole: boolean;
    restrictionReason?: string;
    showBpomBadge: boolean;
    bpomNumber: string | null;

    /** Status Stok & Kemasan yang Dapat Diakses */
    stockStatus: "ready" | "indent";
    packagingAvailable: "retail" | "salon_bulk" | "all";

    /** Call To Action */
    ctaType: "buy" | "login_required" | "partner_pending" | "professional_service_only" | "contact_sales";
    ctaLabel: string;
    ctaHref?: string;

    /** Akses Edukasi Teknis & SOP (N9) */
    technicalAccessLevel: "public_brief" | "consumer_safe" | "professional_sop";
    sopUrl?: string | null;
}

const idrFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

export function formatIDR(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return "Rp 0";
    }
    return idrFormatter.format(amount);
}

export function resolveProductRoleAccess(
    product: Product,
    role: UserRole,
    config: RoleConfig = DEFAULT_ROLE_CONFIG
): ProductRoleAccess {
    const isPriceApproved = product.isPriceApproved !== false;
    const isChemicalCategory = product.category === "treatments" || product.category === "hair-colour";
    const canBuyRetail = product.canBuyRetail ?? !isChemicalCategory;
    const stockStatus = product.stockStatus ?? "ready";
    const bpomNumber = product.bpomNumber ?? `NA1823${Math.abs(product.id.split("").reduce((a, b) => a + b.charCodeAt(0), 1000)).toString().slice(0, 7)}`;

    // Fallback baseline MSRP calculation if not explicitly set
    const msrp = product.msrp ?? 185000;
    const salonNet = product.salonPrice ?? Math.round(msrp * 0.65);
    const distributorNet = product.distributorPrice ?? Math.round(msrp * 0.50);

    // ─── CASE 1: Belum ada harga ter-ACC (Prinsip A5) ───
    if (!isPriceApproved) {
        return {
            isPriceApproved: false,
            canViewMsrp: false,
            canViewNetPrice: false,
            canDirectBuy: false,
            msrpPrice: null,
            formattedMsrp: null,
            netPrice: null,
            formattedNetPrice: null,
            effectivePrice: null,
            formattedEffectivePrice: "Hubungi Kami",
            tierLabel: "Belum Ada Harga Ter-ACC",
            discountPercent: null,
            pointsEarnedPreview: 0,
            isRestrictedForRole: false,
            showBpomBadge: true,
            bpomNumber,
            stockStatus,
            packagingAvailable: "all",
            ctaType: "contact_sales",
            ctaLabel: "Hubungi Kami",
            ctaHref: "/contact",
            technicalAccessLevel: "public_brief",
            sopUrl: product.sopUrl,
        };
    }

    // ─── CASE 2: Salon / Barber Terverifikasi (Matriks B1 / D2) ───
    if (role === "salon_verified") {
        const discount = Math.round(((msrp - salonNet) / msrp) * 100);
        const points = Math.floor(salonNet / 500000) * config.pointsPer500k;

        return {
            isPriceApproved: true,
            canViewMsrp: true,
            canViewNetPrice: true,
            canDirectBuy: true,
            msrpPrice: msrp,
            formattedMsrp: formatIDR(msrp),
            netPrice: salonNet,
            formattedNetPrice: formatIDR(salonNet),
            effectivePrice: salonNet,
            formattedEffectivePrice: formatIDR(salonNet),
            tierLabel: `Harga Net Salon (Hemat ${discount}%)`,
            discountPercent: discount,
            pointsEarnedPreview: points,
            isRestrictedForRole: false,
            showBpomBadge: true,
            bpomNumber,
            stockStatus,
            packagingAvailable: "all",
            ctaType: "buy",
            ctaLabel: "Order Mitra Salon",
            technicalAccessLevel: "professional_sop",
            sopUrl: product.sopUrl ?? "/docs/sop/sop-salon-application.pdf",
        };
    }

    // ─── CASE 3: Distributor Terverifikasi (Matriks B1 / D2) ───
    if (role === "distributor_verified") {
        const discount = Math.round(((msrp - distributorNet) / msrp) * 100);
        const points = Math.floor(distributorNet / 500000) * config.pointsPer500k;

        return {
            isPriceApproved: true,
            canViewMsrp: true,
            canViewNetPrice: true,
            canDirectBuy: true,
            msrpPrice: msrp,
            formattedMsrp: formatIDR(msrp),
            netPrice: distributorNet,
            formattedNetPrice: formatIDR(distributorNet),
            effectivePrice: distributorNet,
            formattedEffectivePrice: formatIDR(distributorNet),
            tierLabel: `Harga Net Distributor (Hemat ${discount}%)`,
            discountPercent: discount,
            pointsEarnedPreview: points,
            isRestrictedForRole: false,
            showBpomBadge: true,
            bpomNumber,
            stockStatus,
            packagingAvailable: "all",
            ctaType: "buy",
            ctaLabel: "Order Distributor (MOQ)",
            technicalAccessLevel: "professional_sop",
            sopUrl: product.sopUrl ?? "/docs/sop/sop-distributor-compliance.pdf",
        };
    }

    // ─── CASE 4: Pendaftar Mitra Menunggu Verifikasi (SLA <= 4 Jam) ───
    if (role === "partner_pending") {
        return {
            isPriceApproved: true,
            canViewMsrp: true,
            canViewNetPrice: false,
            canDirectBuy: false,
            msrpPrice: msrp,
            formattedMsrp: formatIDR(msrp),
            netPrice: null,
            formattedNetPrice: null,
            effectivePrice: msrp,
            formattedEffectivePrice: formatIDR(msrp),
            tierLabel: "Verifikasi Berkas Mitra Sedang Diproses",
            discountPercent: null,
            pointsEarnedPreview: 0,
            isRestrictedForRole: false,
            showBpomBadge: true,
            bpomNumber,
            stockStatus,
            packagingAvailable: "retail",
            ctaType: "partner_pending",
            ctaLabel: "Verifikasi Sedang Diproses (≤ 4 Jam)",
            ctaHref: "/partnership/status",
            technicalAccessLevel: "public_brief",
            sopUrl: null,
        };
    }

    // ─── CASE 5: Konsumen Terdaftar (White-list M1 & Perawatan di Rumah B7) ───
    if (role === "consumer") {
        if (!canBuyRetail) {
            return {
                isPriceApproved: true,
                canViewMsrp: true,
                canViewNetPrice: false,
                canDirectBuy: false,
                msrpPrice: msrp,
                formattedMsrp: formatIDR(msrp),
                netPrice: null,
                formattedNetPrice: null,
                effectivePrice: msrp,
                formattedEffectivePrice: formatIDR(msrp),
                tierLabel: "Khusus Aplikasi Profesional Salon",
                discountPercent: null,
                pointsEarnedPreview: 0,
                isRestrictedForRole: true,
                restrictionReason: "Produk kimia profesional ini membutuhkan sertifikasi & teknik pengerjaan salon. Silakan kunjungi salon mitra kami.",
                showBpomBadge: true,
                bpomNumber,
                stockStatus,
                packagingAvailable: "retail",
                ctaType: "professional_service_only",
                ctaLabel: "Konsultasi ke Salon Mitra",
                ctaHref: "/partnership",
                technicalAccessLevel: "consumer_safe",
                sopUrl: null,
            };
        }

        return {
            isPriceApproved: true,
            canViewMsrp: true,
            canViewNetPrice: false,
            canDirectBuy: true,
            msrpPrice: msrp,
            formattedMsrp: formatIDR(msrp),
            netPrice: null,
            formattedNetPrice: null,
            effectivePrice: msrp,
            formattedEffectivePrice: formatIDR(msrp),
            tierLabel: "Harga Konsumen (MSRP Ritel)",
            discountPercent: null,
            pointsEarnedPreview: 0,
            isRestrictedForRole: false,
            showBpomBadge: true,
            bpomNumber,
            stockStatus,
            packagingAvailable: "retail",
            ctaType: "buy",
            ctaLabel: "Tambah ke Keranjang",
            technicalAccessLevel: "consumer_safe",
            sopUrl: null,
        };
    }

    // ─── CASE 6: Guest / Pengunjung Tanpa Login (Matriks B1 & C1) ───
    const showMsrp = config.showMsrpToGuests;

    if (!canBuyRetail) {
        return {
            isPriceApproved: true,
            canViewMsrp: showMsrp,
            canViewNetPrice: false,
            canDirectBuy: false,
            msrpPrice: showMsrp ? msrp : null,
            formattedMsrp: showMsrp ? formatIDR(msrp) : null,
            netPrice: null,
            formattedNetPrice: null,
            effectivePrice: showMsrp ? msrp : null,
            formattedEffectivePrice: showMsrp ? formatIDR(msrp) : "Masuk untuk Harga",
            tierLabel: "Khusus Profesional Salon",
            discountPercent: null,
            pointsEarnedPreview: 0,
            isRestrictedForRole: true,
            restrictionReason: "Formula profesional untuk salon. Masuk atau daftarkan salon Anda untuk mendapatkan harga net kemitraan.",
            showBpomBadge: true,
            bpomNumber,
            stockStatus,
            packagingAvailable: "retail",
            ctaType: "login_required",
            ctaLabel: "Masuk / Daftar Akun Salon",
            ctaHref: "/partnership",
            technicalAccessLevel: "public_brief",
            sopUrl: null,
        };
    }

    return {
        isPriceApproved: true,
        canViewMsrp: showMsrp,
        canViewNetPrice: false,
        canDirectBuy: false,
        msrpPrice: showMsrp ? msrp : null,
        formattedMsrp: showMsrp ? formatIDR(msrp) : null,
        netPrice: null,
        formattedNetPrice: null,
        effectivePrice: showMsrp ? msrp : null,
        formattedEffectivePrice: showMsrp ? formatIDR(msrp) : "Masuk untuk Harga",
        tierLabel: "MSRP Ritel (Masuk untuk Harga Mitra)",
        discountPercent: null,
        pointsEarnedPreview: 0,
        isRestrictedForRole: false,
        showBpomBadge: true,
        bpomNumber,
        stockStatus,
        packagingAvailable: "retail",
        ctaType: "login_required",
        ctaLabel: "Masuk / Daftar untuk Membeli",
        ctaHref: "/partnership",
        technicalAccessLevel: "public_brief",
        sopUrl: null,
    };
}
