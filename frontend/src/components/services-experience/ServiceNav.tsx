/**
 * ServiceNav - Molecule Component
 * 
 * @module components/molecules/ServiceNav
 * @description Navigation component for service selection with:
 * - Dot indicators
 * - Service labels
 * - Arrow navigation buttons
 * - Progress counter
 * 
 * @example
 * <ServiceNav 
 *   services={services}
 *   activeIndex={0}
 *   locale="en"
 *   onNavigate={(index) => {}}
 *   onPrev={() => {}}
 *   onNext={() => {}}
 * />
 */

'use client';

import { memo } from 'react';

import type { Service, Locale } from '@/types/services.types';
import { NavigationDot } from '@/components/ui/NavigationDot';

// =============================================================================
// Types
// =============================================================================

export interface ServiceNavProps {
    readonly services: readonly Service[];
    readonly activeIndex: number;
    readonly locale: Locale;
    readonly onNavigate: (index: number) => void;
    readonly onPrev: () => void;
    readonly onNext: () => void;
}

// =============================================================================
// Arrow Icon Components
// =============================================================================

function ArrowLeftIcon({ className = '' }: { className?: string }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
        </svg>
    );
}

function ArrowRightIcon({ className = '' }: { className?: string }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
        </svg>
    );
}

// =============================================================================
// Component
// =============================================================================

export const ServiceNav = memo(function ServiceNav({
    services,
    activeIndex,
    locale,
    onNavigate,
    onPrev,
    onNext,
}: ServiceNavProps) {
    const canGoPrev = activeIndex > 0;
    const canGoNext = activeIndex < services.length - 1;
    const total = services.length;
    const current = activeIndex + 1;

    return (
        <nav
            className="absolute bottom-0 left-0 right-0 z-30 pb-12 lg:pb-16"
            aria-label="Service navigation"
        >
            {/* Desktop Arrow Buttons */}
            <div className="hidden lg:flex items-center justify-between absolute inset-x-0 top-1/2 -translate-y-1/2 px-8 pointer-events-none">
                {/* Prev Button */}
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={!canGoPrev}
                    className={`
            pointer-events-auto
            w-14 h-14
            flex items-center justify-center
            bg-indicator-fixed/5 hover:bg-indicator-fixed/10
            backdrop-blur-sm
            border border-indicator-fixed/10 hover:border-indicator-fixed/20
            text-background
            transition-all duration-300
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indicator-fixed/50
            ${!canGoPrev ? 'opacity-30 cursor-not-allowed' : ''}
          `}
                    aria-label="Previous service"
                >
                    <ArrowLeftIcon />
                </button>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canGoNext}
                    className={`
            pointer-events-auto
            w-14 h-14
            flex items-center justify-center
            bg-indicator-fixed/5 hover:bg-indicator-fixed/10
            backdrop-blur-sm
            border border-indicator-fixed/10 hover:border-indicator-fixed/20
            text-indicator-fixed
            transition-all duration-300
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indicator-fixed/50
            ${!canGoNext ? 'opacity-30 cursor-not-allowed' : ''}
          `}
                    aria-label="Next service"
                >
                    <ArrowRightIcon />
                </button>
            </div>

            {/* Navigation Dots & Labels */}
            <div className="flex flex-col items-center gap-6">
                {/* Dots */}
                <div className="flex items-center gap-8" role="tablist">
                    {services.map((service, index) => (
                        <NavigationDot
                            key={service.id}
                            isActive={index === activeIndex}
                            label={service.name[locale]}
                            onClick={() => onNavigate(index)}
                            showLabel={true}
                        />
                    ))}
                </div>

                {/* Counter */}
                <div
                    className="flex items-center gap-3 type-data text-indicator-fixed/40"
                    aria-hidden="true"
                >
                    <span className="font-mono">{String(current).padStart(2, '0')}</span>
                    <span className="w-8 h-px bg-indicator-fixed/20" />
                    <span className="font-mono">{String(total).padStart(2, '0')}</span>
                </div>
            </div>
        </nav>
    );
});

ServiceNav.displayName = 'ServiceNav';
