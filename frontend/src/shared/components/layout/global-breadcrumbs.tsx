"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/shared/components/providers/language-provider";
import { brands } from "@/features/brands/data/brands";
import { products } from "@/features/catalog/data/products";
import { cn } from "@/shared/lib/utils";

// Static Route Translation Map
const ROUTE_LABELS: Record<string, { en: string; id: string }> = {
    brands: { en: "Brand Portfolios", id: "Portofolio Brand" },
    shop: { en: "Shop", id: "Katalog Produk" },
    products: { en: "Shop", id: "Katalog Produk" },
    education: { en: "Education", id: "Edukasi & Pelatihan" },
    partnership: { en: "Partnership", id: "Kemitraan Salon" },
    about: { en: "About Us", id: "Tentang Kami" },
    contact: { en: "Contact", id: "Kontak" },
    articles: { en: "Articles", id: "Artikel Edukasi" },
    events: { en: "Seminars & Events", id: "Seminar & Event" },
    cart: { en: "Cart", id: "Keranjang" },
    checkout: { en: "Checkout", id: "Pembayaran" },
    account: { en: "Account", id: "Akun Mitra" },
};

function formatSlugToTitle(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function GlobalBreadcrumbs(): React.JSX.Element | null {
    const pathname = usePathname();
    const { language } = useLanguage();
    const isId = language === "id";

    // 1. Hide completely on Homepage
    if (!pathname || pathname === "/" || pathname === "") {
        return null;
    }

    // 2. Parse URL path segments
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
        return null;
    }

    // 3. Build Breadcrumb Trail
    const breadcrumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const lowerSegment = segment.toLowerCase();

        let label = "";

        // Check if it's a known static route
        if (ROUTE_LABELS[lowerSegment]) {
            label = isId ? ROUTE_LABELS[lowerSegment].id : ROUTE_LABELS[lowerSegment].en;
        }
        // Check if it's a brand slug (e.g. /brands/smoovee)
        else if (index > 0 && segments[index - 1] === "brands") {
            const brandMatch = brands.find((b) => b.slug.toLowerCase() === lowerSegment);
            label = brandMatch ? brandMatch.fullName : formatSlugToTitle(segment);
        }
        // Check if it's a product slug (e.g. /shop/[id])
        else if (index > 0 && (segments[index - 1] === "shop" || segments[index - 1] === "products")) {
            const productMatch = products.find((p) => p.id.toLowerCase() === lowerSegment);
            label = productMatch ? productMatch.name : formatSlugToTitle(segment);
        }
        // Fallback: title-cased slug
        else {
            label = formatSlugToTitle(segment);
        }

        return {
            href,
            label,
            isLast,
        };
    });

    return (
        <section
            aria-label="Breadcrumb Navigation Section"
            className="w-full bg-transparent transition-colors pt-[var(--header-height,80px)]"
        >
            <div className="mx-auto flex max-w-[1440px] items-center px-6 sm:px-8 lg:px-12 py-3">
                <ol className="flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-wide text-muted-foreground/75">
                    {/* Home Root */}
                    <li className="flex items-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground group"
                        >
                            <Home className="h-3.5 w-3.5 text-muted-foreground/70 transition-colors group-hover:text-foreground" />
                            <span>{isId ? "Beranda" : "Home"}</span>
                        </Link>
                    </li>

                    {/* Dynamic Trail */}
                    {breadcrumbs.map((crumb, idx) => (
                        <li key={crumb.href || idx} className="flex items-center gap-2">
                            <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                            {crumb.isLast ? (
                                <span
                                    className="font-semibold text-foreground truncate max-w-[280px] sm:max-w-[420px]"
                                    aria-current="page"
                                >
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="transition-colors hover:text-foreground hover:underline underline-offset-4 decoration-border-warm"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
