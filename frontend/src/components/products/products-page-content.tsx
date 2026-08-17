"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    SlidersHorizontal,
    ArrowRight,
    MessageCircle,
    X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WhatsAppCTA } from "@/components/ui/whatsapp-cta";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ProductListItem } from "@/components/products/product-data";

type CategoryItem = { id: string; label: string };
type AudienceItem = { id: string; label: string };

interface ProductsPageContentProps {
    products: ProductListItem[];
    categories: CategoryItem[];
    brandFilters: string[];
    audienceFilters: AudienceItem[];
}

/* ─────────────────────────────────────────────────────────────────────
 * Products Page — Agency-Level Polish
 *
 *   • Search + Title header
 *   • Category tabs + filter toggle + sort
 *   • Sidebar with brand/audience/category filters
 *   • 3-col product grid with promo & partnership cards
 *   • Bottom CTA band
 * ───────────────────────────────────────────────────────────────────── */

export function ProductsPageContent({
    products,
    categories,
    brandFilters,
    audienceFilters,
}: ProductsPageContentProps): React.JSX.Element {
    const searchParams = useSearchParams();
    const categoryCount = React.useMemo(() => {
        const counts: Record<string, number> = { all: products.length };
        categories.forEach((cat) => {
            if (cat.id !== "all") {
                counts[cat.id] = products.filter((p) => p.category === cat.id).length;
            }
        });
        return counts;
    }, [products, categories]);
    const [activeCategory, setActiveCategory] = React.useState("all");
    const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
    const [selectedAudience, setSelectedAudience] = React.useState<string[]>([]);
    const [showFilters, setShowFilters] = React.useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
    const [sortBy, setSortBy] = React.useState("latest");
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        const catParam = searchParams.get("category");
        if (catParam) {
            const normalized = catParam.toLowerCase().replace(/\s+&?\s*/g, "-");
            const matched = categories.find((c) => c.id === normalized || c.id === catParam.toLowerCase());
            if (matched) setActiveCategory(matched.id);
        }
        const brandParam = searchParams.get("brand");
        if (brandParam) {
            const brandSlug = brandParam.toLowerCase().replace(/\s+/g, "-");
            const matchedBrand = brandFilters.find((b) => {
                const bSlug = b.toLowerCase().replace(/\s+/g, "-");
                return bSlug === brandSlug || bSlug.includes(brandSlug) || brandSlug.includes(bSlug);
            });
            if (matchedBrand) setSelectedBrands([matchedBrand]);
        }
    }, [searchParams, categories, brandFilters]);

    /* ── Filter logic ── */
    const filtered = React.useMemo(() => {
        let result = products;

        if (activeCategory !== "all") {
            result = result.filter((p) => p.category === activeCategory);
        }

        if (selectedBrands.length > 0) {
            result = result.filter((p) => selectedBrands.includes(p.brand));
        }

        if (selectedAudience.length > 0) {
            result = result.filter(
                (p) =>
                    p.audience === "both" || selectedAudience.includes(p.audience)
            );
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            );
        }

        if (sortBy === "name-asc") {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "name-desc") {
            result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === "brand") {
            result = [...result].sort((a, b) => a.brand.localeCompare(b.brand));
        }

        return result;
    }, [products, activeCategory, selectedBrands, selectedAudience, sortBy, searchQuery]);

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    const toggleAudience = (aud: string) => {
        setSelectedAudience((prev) =>
            prev.includes(aud) ? prev.filter((a) => a !== aud) : [...prev, aud]
        );
    };

    return (
        <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
            {/* ─── Page Title + Search ─── */}
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div className="flex items-end justify-between pb-6 pt-8 sm:pb-8 sm:pt-14">
                    <h1 className="heading-display text-foreground">
                        Product Catalogue
                    </h1>
                </div>

                {/* Search bar — always visible */}
                <div className="mb-6 flex items-center gap-3 border-b border-border-warm/40 pb-4">
                    <Search className="h-5 w-5 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search products, brands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search products"
                        className="flex-1 bg-transparent text-base font-medium outline-none placeholder:text-text-muted"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSearchQuery("")}
                            className="h-8 w-8 text-text-muted hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <Separator className="bg-border-warm/40" />

                {/* ─── Toolbar: Filters Toggle + Category Tabs + Sort ─── */}
                <div className="flex items-center gap-6 overflow-x-auto py-5">
                    {/* Desktop: toggle sidebar */}
                    <Button
                        variant="ghost"
                        onClick={() => setShowFilters(!showFilters)}
                        className="hidden shrink-0 items-center gap-2 px-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground hover:bg-transparent hover:text-foreground/70 lg:flex"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>

                    {/* Mobile: open filter sheet */}
                    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex shrink-0 items-center gap-2 px-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground hover:bg-transparent hover:text-foreground/70 lg:hidden"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                {(selectedBrands.length + selectedAudience.length) > 0 && (
                                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-[10px]">
                                        {selectedBrands.length + selectedAudience.length}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] overflow-y-auto p-6">
                            <SheetTitle className="mb-6 text-sm font-bold uppercase tracking-[0.15em]">Filters</SheetTitle>
                            {/* Brand filters */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Brands</h3>
                                <div className="space-y-3">
                                    {brandFilters.map((brand) => (
                                        <label key={brand} className="flex cursor-pointer items-center gap-3">
                                            <Checkbox
                                                checked={selectedBrands.includes(brand)}
                                                onCheckedChange={() => toggleBrand(brand)}
                                                className="border-border-warm/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                                            />
                                            <span className="text-[13px] text-foreground">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <Separator className="my-6 bg-border-warm/40" />
                            {/* Audience filters */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Audience</h3>
                                <div className="space-y-3">
                                    {audienceFilters.map((aud) => (
                                        <label key={aud.id} className="flex cursor-pointer items-center gap-3">
                                            <Checkbox
                                                checked={selectedAudience.includes(aud.id)}
                                                onCheckedChange={() => toggleAudience(aud.id)}
                                                className="border-border-warm/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                                            />
                                            <span className="text-[13px] text-foreground">{aud.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <Separator className="my-6 bg-border-warm/40" />
                            {/* Category checklist */}
                            <div>
                                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Categories</h3>
                                <div className="space-y-3">
                                    {categories.filter((c) => c.id !== "all").map((cat) => (
                                        <label key={cat.id} className="flex cursor-pointer items-center gap-3">
                                            <Checkbox
                                                checked={activeCategory === cat.id}
                                                onCheckedChange={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
                                                className="border-border-warm/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                                            />
                                            <span className="text-[13px] text-foreground">{cat.label}</span>
                                            <span className="ml-auto text-[11px] text-text-muted">{categoryCount[cat.id]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Separator orientation="vertical" className="h-5 bg-border-warm/40" />

                    {/* Category tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                aria-pressed={activeCategory === cat.id}
                                className={cn(
                                    "shrink-0 rounded-sm px-4 py-2.5 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    activeCategory === cat.id
                                        ? "bg-foreground text-white"
                                        : "text-text-muted hover:bg-surface hover:text-foreground"
                                )}
                            >
                                {cat.label}
                                <span className="ml-1 text-[10px] opacity-40">
                                    {categoryCount[cat.id]}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto flex shrink-0 items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                            Sort by:
                        </span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-8 w-[120px] border-none bg-transparent text-[12px] font-semibold shadow-none focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latest">Latest</SelectItem>
                                <SelectItem value="name-asc">Name A–Z</SelectItem>
                                <SelectItem value="name-desc">Name Z–A</SelectItem>
                                <SelectItem value="brand">Brand</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator className="bg-border-warm/40" />
            </div>

            {/* ─── Main Content: Sidebar + Grid ─── */}
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <div className="flex gap-10 pt-8 pb-20">
                    {/* ── Sidebar Filters ── */}
                    {showFilters && (
                        <aside className="hidden w-[220px] shrink-0 lg:block sticky top-[var(--header-height)] max-h-[calc(100vh-var(--header-height))] overflow-y-auto py-2">
                            {/* Brand filters */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                    Brands
                                </h3>
                                <div className="space-y-3">
                                    {brandFilters.map((brand) => (
                                        <label
                                            key={brand}
                                            className="flex cursor-pointer items-center gap-3"
                                        >
                                            <Checkbox
                                                checked={selectedBrands.includes(brand)}
                                                onCheckedChange={() => toggleBrand(brand)}
                                                className="border-border-warm/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                                            />
                                            <span className="text-[13px] text-foreground">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Separator className="my-6 bg-border-warm/40" />

                            {/* Audience filters */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                    Audience
                                </h3>
                                <div className="space-y-3">
                                    {audienceFilters.map((aud) => (
                                        <label
                                            key={aud.id}
                                            className="flex cursor-pointer items-center gap-3"
                                        >
                                            <Checkbox
                                                checked={selectedAudience.includes(aud.id)}
                                                onCheckedChange={() => toggleAudience(aud.id)}
                                                className="border-border-warm/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                                            />
                                            <span className="text-[13px] text-foreground">
                                                {aud.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Separator className="my-6 bg-border-warm/40" />

                            {/* Category checklist */}
                            <div>
                                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                    Categories
                                </h3>
                                <div className="space-y-3">
                                    {categories
                                        .filter((c) => c.id !== "all")
                                        .map((cat) => (
                                            <label
                                                key={cat.id}
                                                className="flex cursor-pointer items-center gap-3"
                                            >
                                                <Checkbox
                                                    checked={activeCategory === cat.id}
                                                    onCheckedChange={() =>
                                                        setActiveCategory(
                                                            activeCategory === cat.id ? "all" : cat.id
                                                        )
                                                    }
                                                    className="border-border-warm/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                                                />
                                                <span className="text-[13px] text-foreground">
                                                    {cat.label}
                                                </span>
                                                <span className="ml-auto text-[11px] text-text-muted">
                                                    {categoryCount[cat.id]}
                                                </span>
                                            </label>
                                        ))}
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* ── Product Grid ── */}
                    <div className="flex-1">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
                                <Search className="mb-4 h-12 w-12 text-text-muted/20" />
                                <h3 className="text-[16px] font-bold text-foreground">No products found</h3>
                                <p className="mt-3 max-w-sm text-[13px] leading-[1.75] text-text-muted">
                                    Try adjusting your filters or search to find what you&apos;re
                                    looking for. Our team is also available via WhatsApp.
                                </p>
                                <WhatsAppCTA
                                    location="products_empty"
                                    className="mt-7 inline-flex items-center gap-2.5 bg-foreground px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-foreground/90"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Contact Us
                                </WhatsAppCTA>
                            </div>
                        ) : (
                            <div
                                className={cn(
                                    "grid gap-x-5 gap-y-8",
                                    showFilters
                                        ? "grid-cols-2 sm:grid-cols-2 xl:grid-cols-3"
                                        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                )}
                            >
                                {/* Promo Banner */}
                                <div className="flex flex-col justify-between bg-foreground p-7 text-white sm:col-span-1">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                                            Professional Partners
                                        </p>
                                        <h3 className="mt-3 text-[1.125rem] font-bold leading-snug">
                                            Free consultation & product demos.
                                        </h3>
                                        <Separator className="my-5 bg-white/10" />
                                        <p className="text-[12px] leading-[1.75] text-white/50">
                                            Contact our team via WhatsApp for personalized
                                            recommendations for your salon or barbershop.
                                        </p>
                                    </div>
                                    <div className="mt-6">
                                        <WhatsAppCTA
                                            location="products_promo"
                                            variant="ghost"
                                            className="group inline-flex items-center gap-2 p-0 h-auto text-[12px] font-bold text-white transition-opacity hover:opacity-70 hover:bg-transparent hover:text-white"
                                        >
                                            <MessageCircle className="h-3.5 w-3.5" />
                                            Get in touch
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                        </WhatsAppCTA>
                                    </div>
                                </div>

                                {/* Product Cards */}
                                {filtered.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}

                                {/* Partnership Rewards CTA */}
                                {filtered.length > 5 && (
                                    <div className="flex flex-col justify-between bg-surface p-7 sm:col-span-1">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                                Partnership Benefits
                                            </p>
                                            <h3 className="mt-3 text-[16px] font-bold leading-snug text-foreground">
                                                Special pricing for authorized partners*
                                            </h3>
                                            <p className="mt-2 text-[12px] text-text-muted">
                                                *Terms & conditions apply
                                            </p>
                                        </div>
                                        <div className="mt-6">
                                            <Link
                                                href="/partnership#become-partner"
                                                className="group inline-flex items-center gap-2 text-[12px] font-bold text-foreground transition-colors hover:text-foreground/70"
                                            >
                                                Become a partner
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Bottom CTA Band ─── */}
            <div className="border-t border-border-warm/40 bg-surface">
                <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 px-6 py-10 sm:py-14 text-center sm:px-8 lg:flex-row lg:px-12 lg:text-left">
                    <div>
                        <h2 className="heading-section text-foreground">
                            Need help choosing the right products?
                        </h2>
                        <p className="mt-3 text-[14px] leading-[1.85] text-text-muted">
                            Our professional team can recommend the best brands and products
                            for your specific salon or barbershop needs.
                        </p>
                    </div>
                    <WhatsAppCTA
                        location="products_cta"
                        className="inline-flex items-center gap-2.5 bg-foreground px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-foreground/90"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Contact via WhatsApp
                    </WhatsAppCTA>
                </div>
            </div>
        </main>
    );
}

/* ─── Product Card ─── */

function ProductCard({ product }: { product: ProductListItem }) {
    return (
        <Link
            href={`/products/${product.id}`}
            className="group flex flex-col"
        >
            {/* Product image */}
            <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-surface">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div
                        className={cn(
                            "absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105",
                            product.brand === "Alfaparf Milano" &&
                            "bg-gradient-to-br from-surface via-grad-alfaparf-via to-grad-warm-to",
                            product.brand === "Farmavita" &&
                            "bg-gradient-to-br from-surface via-grad-farmavita-via to-grad-warm-to",
                            product.brand === "Montibello" &&
                            "bg-gradient-to-br from-surface via-grad-montibello-via to-grad-warm-to",
                            product.brand === "Gamma+ Professional" &&
                            "bg-gradient-to-br from-grad-gamma-from via-grad-gamma-via to-grad-gamma-to",
                            product.brand === "CORE" &&
                            "bg-gradient-to-br from-surface via-grad-core-via to-grad-core-to"
                        )}
                    >
                        <span
                            className={cn(
                                "text-center text-[11px] font-bold uppercase tracking-[0.2em]",
                                product.brand === "Gamma+ Professional"
                                    ? "text-white/20"
                                    : "text-text-muted/20"
                            )}
                        >
                            {product.brand}
                        </span>
                    </div>
                )}

                {/* NEW badge */}
                {product.isNew && (
                    <Badge className="absolute right-3 top-3 bg-foreground text-white text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-foreground px-2.5 py-0.5">
                        New
                    </Badge>
                )}
            </div>

            {/* Variant pills */}
            {product.variants && product.variants.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {product.variants.map((v) => (
                        <span
                            key={v}
                            className="border border-border-warm/60 px-2 py-0.5 text-[10px] font-semibold text-text-muted transition-all duration-300 group-hover:border-foreground/40 group-hover:text-foreground"
                        >
                            {v}
                        </span>
                    ))}
                </div>
            )}

            {/* Product info */}
            <h3 className="mt-3 text-[14px] font-bold leading-snug text-foreground transition-colors group-hover:text-foreground/70">
                {product.name}
            </h3>
            <p className="mt-1 text-[12px] text-text-muted">
                {product.brand}
            </p>
        </Link>
    );
}
