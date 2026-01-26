"use client";

import * as React from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { categories, getCategoryLabel, getCategoryDescription, getCategoryStripTitle, defaultExploreBanner } from "@/content/homepage";

// =============================================================================
// Types
// =============================================================================

interface CategoryItem {
    key: string;
    image: string;
    exploreBanner: string;
    label: string;
    description: string;
    href: string;
}

// =============================================================================
// Custom Hook: useBannerNavigation
// =============================================================================

function useBannerNavigation() {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const [isHovering, setIsHovering] = React.useState(false);

    const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleItemHover = React.useCallback((index: number) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setActiveIndex(index);
        setIsHovering(true);
    }, []);

    const handleContainerLeave = React.useCallback(() => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsHovering(false);
            setActiveIndex(null);
        }, 150);
    }, []);

    const handleContainerEnter = React.useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }, []);

    return {
        activeIndex,
        isHovering,
        handleItemHover,
        handleContainerLeave,
        handleContainerEnter,
    };
}

// =============================================================================
// Sub-Components
// =============================================================================

interface NavItemProps {
    item: CategoryItem;
    isActive: boolean;
    isContainerHovered: boolean;
    onHover: () => void;
}

/**
 * NavItem with Discord-style hover effect:
 * - When container is NOT hovered: all items normal
 * - When container IS hovered: 
 *   - Active item: full opacity, no blur
 *   - Siblings: reduced opacity, slight blur
 */
function NavItem({ item, isActive, isContainerHovered, onHover }: NavItemProps) {
    // Calculate styles based on hover state
    const getItemStyles = () => {
        if (!isContainerHovered) {
            // Default state: all items normal
            return "opacity-100 blur-0 scale-100";
        }

        if (isActive) {
            // Hovered item: stays prominent
            return "opacity-100 blur-0 scale-100";
        }

        // Sibling items: fade and blur (Discord effect)
        return "opacity-30 blur-[1.5px] scale-100";
    };

    return (
        <div
            onMouseEnter={onHover}
            className="relative"
        >
            <AppLink
                href={item.href}
                underline="none"
                className={`
                    block py-3 px-1
                    transition-cinematic
                    ${getItemStyles()}
                `}
            >
                <span className="type-nav-minimal">
                    {item.label}
                </span>
            </AppLink>

            {/* Active Indicator (line below text) */}
            <div
                className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2
                    h-[2px] bg-foreground rounded-full
                    transition-cinematic
                    ${isActive && isContainerHovered
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0'
                    }
                `}
                aria-hidden="true"
            />
        </div>
    );
}

interface ExploreBannerProps {
    items: CategoryItem[];
    activeIndex: number | null;
    isHovering: boolean;
    defaultBanner: string;
    locale: string;
}

function ExploreBanner({
    items,
    activeIndex,
    isHovering,
    defaultBanner,
    locale,
}: ExploreBannerProps) {
    const activeItem = activeIndex !== null ? items[activeIndex] : null;

    return (
        <div className="relative w-full aspect-cinema overflow-hidden ui-radius-tight img-frame-inset container-2xl">
            {/* Default Banner (Base Layer) */}
            <Image
                src={defaultBanner}
                alt="Explore All Products"
                fill
                sizes="100vw"
                className={`
                    object-cover img-curated
                    transition-dramatic
                    ${isHovering && activeItem
                        ? 'opacity-0 scale-105'
                        : 'opacity-100 scale-100'
                    }
                `}
                priority
            />

            {/* Category Banners (Dynamic Layer) */}
            {items.map((item, index) => (
                <Image
                    key={item.key}
                    src={item.exploreBanner}
                    alt={item.label}
                    fill
                    sizes="100vw"
                    className={`
                        object-cover img-curated
                        transition-dramatic
                        ${isHovering && activeIndex === index
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                        }
                    `}
                />
            ))}

            {/* Cinematic Gradient Overlay + CK Subtle Tint */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 bg-black/[0.03] pointer-events-none"
                aria-hidden="true"
            />

            {/* Context Label (Bottom Left) */}
            <div className="absolute bottom-6 left-8 z-10">
                <p className={`
                    type-kicker-subtle text-white/90 
                    backdrop-blur-md bg-black/20 
                    px-4 py-2 rounded
                    transition-cinematic
                    ${isHovering
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-2 opacity-70'
                    }
                `}>
                    {activeItem?.description || (locale === 'id' ? 'Koleksi Profesional' : 'Professional Collection')}
                </p>
            </div>
        </div>
    );
}

interface MobileCategoryCardProps {
    item: CategoryItem;
}

function MobileCategoryCard({ item }: MobileCategoryCardProps) {
    return (
        <AppLink
            href={item.href}
            underline="none"
            className="block group"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-muted ui-radius-tight">
                <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="(max-width: 640px) 40vw, 120px"
                    className="object-cover transition-transform duration-300 
                              group-hover:scale-105 group-active:scale-[0.98]"
                />
            </div>
            <div className="pt-3 pb-1 min-h-[44px] flex items-start justify-center">
                <p className="type-data text-foreground text-center">
                    {item.label}
                </p>
            </div>
        </AppLink>
    );
}

// =============================================================================
// Main Component
// =============================================================================

export default function HeroImageStrip() {
    const { locale } = useLocale();
    const sectionTitle = getCategoryStripTitle(locale);

    const {
        activeIndex,
        isHovering,
        handleItemHover,
        handleContainerLeave,
        handleContainerEnter,
    } = useBannerNavigation();

    // Transform categories to include computed properties
    const categoryItems: CategoryItem[] = React.useMemo(() =>
        categories.map(cat => ({
            key: cat.key,
            image: cat.image,
            exploreBanner: cat.exploreBanner,
            label: getCategoryLabel(locale, cat.key),
            description: getCategoryDescription(locale, cat.key),
            href: `/${locale}/products?category=${cat.key}`,
        })), [locale]
    );

    return (
        <section
            className="relative bg-background border-t border-border"
            aria-labelledby="category-hero-title"
        >
            <h2 id="category-hero-title" className="sr-only">{sectionTitle}</h2>

            {/* ===================== MOBILE VIEW ===================== */}
            <div className="lg:hidden py-8">
                <p className="px-6 mb-5 type-ui-sm-wide uppercase text-foreground/50">
                    {locale === 'id' ? 'Telusuri Kategori' : 'Browse Categories'}
                </p>
                <div className="px-6 grid grid-cols-3 gap-3">
                    {categoryItems.map((item) => (
                        <MobileCategoryCard key={item.key} item={item} />
                    ))}
                </div>
            </div>

            {/* ===================== DESKTOP VIEW ===================== */}
            <div className="hidden lg:block container-2xl section-py-md mx-auto max-w-[120rem]">
                {/* Navigation Container */}
                <div
                    className="flex flex-col items-center"
                    onMouseEnter={handleContainerEnter}
                    onMouseLeave={handleContainerLeave}
                >
                    {/* Kicker Text - B2B Formal */}
                    <p className="type-kicker-subtle mb-6">
                        {locale === 'id' ? 'Jelajahi Produk' : 'Explore Products'}
                    </p>

                    {/* 
                        DISCORD-STYLE NAVIGATION
                        ========================
                        The magic happens via state passed to NavItem:
                        - isContainerHovered: tells each item if the nav area is being hovered
                        - isActive: tells each item if IT is the one being hovered
                        
                        Result:
                        - All items blur/fade when container is hovered
                        - Only the active item stays sharp
                    */}
                    <nav className="flex items-center justify-center gap-nav-lg lg:gap-nav-xl mb-8">
                        {categoryItems.map((item, index) => (
                            <NavItem
                                key={item.key}
                                item={item}
                                isActive={activeIndex === index}
                                isContainerHovered={isHovering}
                                onHover={() => handleItemHover(index)}
                            />
                        ))}
                    </nav>
                </div>

                {/* Dynamic Banner */}
                <ExploreBanner
                    items={categoryItems}
                    activeIndex={activeIndex}
                    isHovering={isHovering}
                    defaultBanner={defaultExploreBanner}
                    locale={locale}
                />
            </div>
        </section>
    );
}
