/**
 * VideoBackground - Molecule Component
 * 
 * @module components/molecules/VideoBackground
 * @description Composes VideoPlayer with gradient overlay for service backgrounds.
 * Handles video transitions and fallback states.
 * 
 * @example
 * <VideoBackground service={service} isReducedMotion={false} />
 */

'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

import type { Service } from '@/types/services.types';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

// =============================================================================
// Types
// =============================================================================

export interface VideoBackgroundProps {
    readonly service: Service;
    readonly isReducedMotion: boolean;
}

// =============================================================================
// Component
// =============================================================================

export const VideoBackground = memo(function VideoBackground({
    service,
    isReducedMotion,
}: VideoBackgroundProps) {
    // Transition timing
    const transition = {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
    };

    return (
        <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={transition}
        >
            {/* Video Layer */}
            <VideoPlayer
                src={service.video}
                posterOnly={isReducedMotion}
                autoPlay={!isReducedMotion}
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full"
            />

            {/* Fallback Gradient (shown when video fails or for reduced motion) */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, ${service.accentColor} 0%, hsl(0, 0%, 8%) 100%)`,
                    opacity: isReducedMotion ? 0.9 : 0,
                }}
                aria-hidden="true"
            />

            {/* Gradient Overlay (always visible) */}
            <div
                className="absolute inset-0 z-[2] pointer-events-none"
                style={{
                    background: 'var(--service-overlay-gradient)',
                }}
                aria-hidden="true"
            />
        </motion.div>
    );
});

VideoBackground.displayName = 'VideoBackground';
