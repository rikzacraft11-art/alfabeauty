"use client";

import * as React from "react";
import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { categories, getCategoryLabel, getCategoryDescription, getCategoryStripTitle } from "@/content/homepage";

// =============================================================================
// Types
// =============================================================================

interface CategoryItem {
    key: string;
    image: string;
    label: string;
    description: string;
    href: string;
}

interface HighlightPosition {
    left: number;
    width: number;
}

// =============================================================================
// Custom Hook: useNavigationHighlight
// =============================================================================

function useNavigationHighlight(containerRef: React.RefObject<HTMLDivElement | null>) {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const [highlightPos, setHighlightPos] = React.useState<HighlightPosition>({ left: 0, width: 0 });
    const [dropdownLeft, setDropdownLeft] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(false);

    const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const calculatePositions = React.useCallback((index: number) => {
        const container = containerRef.current;
        const item = itemRefs.current[index];
        if (!container || !item) return;

        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const relativeLeft = itemRect.left - containerRect.left;

        setHighlightPos({
            left: relativeLeft,
            width: itemRect.width,
        });
        setDropdownLeft(relativeLeft + itemRect.width / 2);
    }, [containerRef]);

    const handleItemHover = React.useCallback((index: number) => {
        setActiveIndex(index);
        setIsVisible(true);
        calculatePositions(index);
    }, [calculatePositions]);

    const handleContainerLeave = React.useCallback(() => {
        setIsVisible(false);
        setActiveIndex(null);
    }, []);

    const handleDropdownEnter = React.useCallback(() => {
        // Keep visible when mouse enters dropdown
        setIsVisible(true);
    }, []);

    const registerItemRef = React.useCallback((index: number, el: HTMLDivElement | null) => {
        itemRefs.current[index] = el;
    }, []);

    return {
        activeIndex,
        highlightPos,
        dropdownLeft,
        isVisible,
        handleItemHover,
        handleContainerLeave,
        handleDropdownEnter,
        registerItemRef,
    };
}

// =============================================================================
// Sub-Components
// =============================================================================

interface SlidingHighlightProps {
    position: HighlightPosition;
    isVisible: boolean;
}

function SlidingHighlight({ position, isVisible }: SlidingHighlightProps) {
    return (
        <div
            className="absolute -bottom-3 h-px bg-foreground pointer-events-none 
                       transition-all duration-300 ease-out"
            style={{
                left: position.left,
                width: position.width,
                opacity: isVisible ? 1 : 0,
            }}
            aria-hidden="true"
        />
    );
}

interface CategoryLinkItemProps {
    item: CategoryItem;
    isActive: boolean;
    onHover: () => void;
    registerRef: (el: HTMLDivElement | null) => void;
}

function CategoryLinkItem({ item, isActive, onHover, registerRef }: CategoryLinkItemProps) {
    return (
        <div ref={registerRef} onMouseEnter={onHover}>
            <AppLink
                href={item.href}
                underline="none"
                className="flex items-center gap-2 py-2"
            >
                <span className={`text-sm sm:text-base font-medium transition-colors duration-200
                    ${isActive ? 'text-foreground' : 'text-foreground/50'}`}>
                    {item.label}
                </span>

                <ArrowIcon isActive={isActive} />
            </AppLink>
        </div>
    );
}

interface ArrowIconProps {
    isActive: boolean;
}

function ArrowIcon({ isActive }: ArrowIconProps) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all duration-200
                ${isActive
                    ? 'text-foreground opacity-100 translate-x-0'
                    : 'text-foreground/30 opacity-0 -translate-x-1'}`}
            aria-hidden="true"
        >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
        </svg>
    );
}

interface CategoryPreviewDropdownProps {
    items: CategoryItem[];
    activeIndex: number | null;
    leftPosition: number;
    isVisible: boolean;
    locale: string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

function CategoryPreviewDropdown({
    items,
    activeIndex,
    leftPosition,
    isVisible,
    locale,
    onMouseEnter,
    onMouseLeave,
}: CategoryPreviewDropdownProps) {
    const activeItem = activeIndex !== null ? items[activeIndex] : null;

    return (
        <div
            className="absolute top-full pt-4 z-50
                       transition-all duration-300 ease-out"
            style={{
                left: leftPosition,
                opacity: isVisible ? 1 : 0,
                transform: `translateX(-50%) translateY(${isVisible ? '0' : '8px'})`,
                pointerEvents: isVisible ? 'auto' : 'none',
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <AppLink
                href={activeItem?.href ?? '#'}
                underline="none"
                className="block pointer-events-auto"
            >
                <div className="relative w-[260px] h-[340px] sm:w-[300px] sm:h-[400px] overflow-hidden">
                    {/* Stacked images with cross-fade */}
                    {items.map((item, index) => (
                        <CrossFadeImage
                            key={item.key}
                            src={item.image}
                            alt={item.label}
                            isActive={activeIndex === index}
                        />
                    ))}

                    <GradientOverlay />

                    {/* Stacked typography with cross-fade */}
                    {items.map((item, index) => (
                        <PreviewContent
                            key={item.key}
                            label={item.label}
                            description={item.description}
                            isActive={activeIndex === index}
                            locale={locale}
                        />
                    ))}
                </div>
            </AppLink>
        </div>
    );
}

interface CrossFadeImageProps {
    src: string;
    alt: string;
    isActive: boolean;
}

function CrossFadeImage({ src, alt, isActive }: CrossFadeImageProps) {
    return (
        <div className={`absolute inset-0 transition-opacity duration-300
            ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <Image
                src={src}
                alt={alt}
                fill
                sizes="300px"
                className="object-cover"
            />
        </div>
    );
}

function GradientOverlay() {
    return (
        <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
            aria-hidden="true"
        />
    );
}

interface PreviewContentProps {
    label: string;
    description: string;
    isActive: boolean;
    locale: string;
}

function PreviewContent({ label, description, isActive, locale }: PreviewContentProps) {
    return (
        <div className={`absolute inset-x-0 bottom-0 p-5 sm:p-6 transition-opacity duration-300
            ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-white text-lg sm:text-xl font-medium tracking-wide mb-2">
                {label}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
                {description}
            </p>
            <span className="inline-flex items-center gap-2 text-white/80 text-xs uppercase tracking-[0.2em]">
                {locale === "id" ? "Jelajahi" : "Explore"}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </span>
        </div>
    );
}

// =============================================================================
// Main Component
// =============================================================================

export default function HeroImageStrip() {
    const { locale } = useLocale();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const sectionTitle = getCategoryStripTitle(locale);

    const {
        activeIndex,
        highlightPos,
        dropdownLeft,
        isVisible,
        handleItemHover,
        handleContainerLeave,
        handleDropdownEnter,
        registerItemRef,
    } = useNavigationHighlight(containerRef);

    // Transform categories to include computed properties
    const categoryItems: CategoryItem[] = React.useMemo(() =>
        categories.map(cat => ({
            key: cat.key,
            image: cat.image,
            label: getCategoryLabel(locale, cat.key),
            description: getCategoryDescription(locale, cat.key),
            href: `/${locale}/products?category=${cat.key}`,
        })), [locale]
    );

    return (
        <section className="relative bg-background" aria-labelledby="category-hero-title">
            <div className="border-y border-border">
                <div className="mx-auto max-w-[120rem] px-6 sm:px-10 lg:px-16 py-5 sm:py-6">

                    <h2 id="category-hero-title" className="sr-only">{sectionTitle}</h2>

                    <div
                        ref={containerRef}
                        className="relative flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12 lg:gap-x-16"
                        onMouseLeave={handleContainerLeave}
                    >
                        <SlidingHighlight position={highlightPos} isVisible={isVisible} />

                        {categoryItems.map((item, index) => (
                            <CategoryLinkItem
                                key={item.key}
                                item={item}
                                isActive={activeIndex === index}
                                onHover={() => handleItemHover(index)}
                                registerRef={(el) => registerItemRef(index, el)}
                            />
                        ))}

                        <CategoryPreviewDropdown
                            items={categoryItems}
                            activeIndex={activeIndex}
                            leftPosition={dropdownLeft}
                            isVisible={isVisible}
                            locale={locale}
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleContainerLeave}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
