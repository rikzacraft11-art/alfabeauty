/**
 * ServiceCTA - Atomic Call-to-Action Button
 * 
 * @module components/atoms/ServiceCTA
 * @description Minimalist CTA button with:
 * - Hover arrow animation
 * - Focus states
 * - Clean, professional styling
 * 
 * @example
 * <ServiceCTA label="Explore Products" href="/products" />
 */

'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

// =============================================================================
// Types
// =============================================================================

export interface ServiceCTAProps {
    /** Button label */
    readonly label: string;
    /** Destination URL */
    readonly href: string;
    /** Animation direction */
    readonly direction?: -1 | 0 | 1;
    /** Skip animation */
    readonly skipAnimation?: boolean;
    /** Animation delay in ms */
    readonly delay?: number;
    /** Locale for URL prefix */
    readonly locale?: string;
    /** Additional CSS classes */
    readonly className?: string;
}

// =============================================================================
// Animation Variants
// =============================================================================

const ctaVariants: Variants = {
    enter: {
        y: 30,
        opacity: 0,
    },
    center: {
        y: 0,
        opacity: 1,
    },
    exit: {
        y: -20,
        opacity: 0,
    },
};

// =============================================================================
// Arrow Icon Component
// =============================================================================

function ArrowIcon({ className = '' }: { className?: string }) {
    return (
        <svg
            width="20"
            height="20"
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

export const ServiceCTA = memo(function ServiceCTA({
    label,
    href,
    direction = 0,
    skipAnimation = false,
    delay = 0,
    locale = 'en',
    className = '',
}: ServiceCTAProps) {
    const fullHref = href.startsWith('/') ? `/${locale}${href}` : href;

    const buttonContent = (
        <>
            <span className="relative">
                {label}
                <span
                    className="absolute bottom-0 left-0 w-0 h-px bg-current 
                     transition-all duration-300 group-hover:w-full"
                    aria-hidden="true"
                />
            </span>
            <ArrowIcon
                className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
        </>
    );

    const baseClasses = `
    group
    inline-flex items-center gap-3
    px-8 py-4
    bg-white/10 hover:bg-white/20
    backdrop-blur-sm
    border border-white/30 hover:border-white/50
    text-white
    type-ui
    transition-all duration-300
    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
    ${className}
  `;

    if (skipAnimation) {
        return (
            <Link href={fullHref} className={baseClasses}>
                {buttonContent}
            </Link>
        );
    }

    return (
        <motion.div
            variants={ctaVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: delay / 1000,
            }}
        >
            <Link href={fullHref} className={baseClasses}>
                {buttonContent}
            </Link>
        </motion.div>
    );
});

ServiceCTA.displayName = 'ServiceCTA';
