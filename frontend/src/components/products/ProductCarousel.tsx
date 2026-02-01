"use client";

import { useCarousel } from "@/hooks/useCarousel";
import { CarouselArrow } from "@/components/ui/CarouselArrow";
import { ScrollProgressBar } from "@/components/ui/ScrollIndicators";

interface ProductCarouselProps {
    /** Number of items in the carousel */
    itemCount: number;
    /** Children to render inside the scrollable area */
    children: React.ReactNode;
    /** Optional aria label for accessibility */
    ariaLabel?: string;
}

/**
 * ProductCarousel - Horizontal scrollable carousel with navigation
 * 
 * Uses the useCarousel hook for scroll state management.
 * Design V2: Elegant motion with progress indicator.
 */
export default function ProductCarousel({
    itemCount,
    children,
    ariaLabel = "Product carousel"
}: ProductCarouselProps) {
    const {
        scrollRef,
        canScrollLeft,
        canScrollRight,
        progress,
        thumbRatio,
        scroll
    } = useCarousel(itemCount);

    return (
        <div className="relative">
            {/* Carousel Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                role="region"
                aria-label={ariaLabel}
                data-testid="product-carousel"
            >
                {children}
            </div>

            {/* Navigation Arrows */}
            <CarouselArrow
                direction="left"
                onClick={() => scroll("left")}
                visible={canScrollLeft}
            />
            <CarouselArrow
                direction="right"
                onClick={() => scroll("right")}
                visible={canScrollRight}
            />

            {/* Progress Bar */}
            <div className="mt-6 max-w-xs">
                <ScrollProgressBar
                    progress={progress}
                    thumbRatio={thumbRatio}
                    tone="dark"
                    ariaLabel="Carousel progress"
                />
            </div>
        </div>
    );
}
