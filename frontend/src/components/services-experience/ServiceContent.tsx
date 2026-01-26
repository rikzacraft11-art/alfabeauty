/**
 * ServiceContent - Molecule Component
 * 
 * @module components/molecules/ServiceContent
 * @description Composes ServiceNumber, ServiceTitle, description, and ServiceCTA
 * into a cohesive content overlay with orchestrated animations.
 * 
 * @example
 * <ServiceContent 
 *   service={service} 
 *   locale="en" 
 *   direction={1}
 *   isReducedMotion={false}
 * />
 */

'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

import type { Service, Locale, NavigationDirection } from '@/types/services.types';
import { getLocalizedService } from '@/content/services';
import { ServiceNumber } from './ServiceNumber';
import { ServiceTitle } from './ServiceTitle';
import { ServiceCTA } from './ServiceCTA';

// =============================================================================
// Types
// =============================================================================

export interface ServiceContentProps {
    readonly service: Service;
    readonly locale: Locale;
    readonly direction: NavigationDirection;
    readonly isReducedMotion: boolean;
}

// =============================================================================
// Animation Config
// =============================================================================

const STAGGER_BASE = 100; // ms between elements

// =============================================================================
// Component
// =============================================================================

export const ServiceContent = memo(function ServiceContent({
    service,
    locale,
    direction,
    isReducedMotion,
}: ServiceContentProps) {
    const content = getLocalizedService(service, locale);

    // Fast transition for exit
    const fastTransition = { duration: 0.3 };

    // Smooth transition for entrance
    const smoothTransition = {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
    };

    // Y offset based on direction
    const yOffset = direction >= 0 ? 30 : -30;
    const exitYOffset = direction >= 0 ? -20 : 20;

    if (isReducedMotion) {
        // Static content for reduced motion
        return (
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
                <div className="max-w-[var(--service-content-max-width)] mx-auto space-y-6">
                    <ServiceNumber number={service.number} skipAnimation />
                    <ServiceTitle title={content.name} skipAnimation />
                    <p className="type-body text-white/70 max-w-md mx-auto">
                        {content.description}
                    </p>
                    <ServiceCTA
                        label={content.ctaLabel}
                        href={service.cta.href}
                        locale={locale}
                        skipAnimation
                    />
                </div>
            </div>
        );
    }

    // Animated content
    return (
        <motion.div
            className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: fastTransition }}
        >
            <div className="max-w-[var(--service-content-max-width)] mx-auto space-y-6">
                {/* Number */}
                <ServiceNumber
                    number={service.number}
                    direction={direction}
                />

                {/* Title */}
                <ServiceTitle
                    title={content.name}
                    direction={direction}
                    delay={STAGGER_BASE}
                />

                {/* Tagline */}
                <motion.p
                    className="type-service-tagline text-white/50"
                    initial={{ y: yOffset, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { ...smoothTransition, delay: (STAGGER_BASE * 2) / 1000 } }}
                    exit={{ y: exitYOffset, opacity: 0, transition: fastTransition }}
                >
                    {content.tagline}
                </motion.p>

                {/* Description */}
                <motion.p
                    className="type-body text-white/70 max-w-md mx-auto"
                    initial={{ y: yOffset, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { ...smoothTransition, delay: (STAGGER_BASE * 3) / 1000 } }}
                    exit={{ y: exitYOffset, opacity: 0, transition: fastTransition }}
                >
                    {content.description}
                </motion.p>

                {/* CTA */}
                <ServiceCTA
                    label={content.ctaLabel}
                    href={service.cta.href}
                    locale={locale}
                    direction={direction}
                    delay={STAGGER_BASE * 4}
                />
            </div>
        </motion.div>
    );
});

ServiceContent.displayName = 'ServiceContent';
