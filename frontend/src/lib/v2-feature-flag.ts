/**
 * V2 Feature Flag Utilities
 * ITIL 4: Service Transition - Gradual Rollout Support
 * 
 * This module provides utilities for controlling the V2 design rollout.
 * Supports:
 * - Full enable/disable
 * - Percentage-based A/B testing
 * - Cookie-based sticky sessions
 */

import { env } from "@/lib/env";

type V2Config = {
    enabled: boolean;
    percentage: number | null;
    variant: "v1" | "v2";
};

/**
 * Parse V2 feature flag value
 */
export function parseV2Config(): V2Config {
    const flag = env.ENABLE_V2_DESIGN;

    // Not set = V1 (production default)
    if (!flag) {
        return { enabled: false, percentage: null, variant: "v1" };
    }

    // Explicit boolean
    if (flag === "true") {
        return { enabled: true, percentage: null, variant: "v2" };
    }
    if (flag === "false") {
        return { enabled: false, percentage: null, variant: "v1" };
    }

    // Percentage-based: "percentage:20" means 20% get V2
    const percentMatch = flag.match(/^percentage:(\d+)$/);
    if (percentMatch && percentMatch[1]) {
        const percent = parseInt(percentMatch[1], 10);
        return {
            enabled: true,
            percentage: Math.min(100, Math.max(0, percent)),
            variant: "v2", // Will be determined by cookie/random
        };
    }

    // Unknown format = fallback to V1
    return { enabled: false, percentage: null, variant: "v1" };
}

/**
 * Determine which variant to show for a user
 * Uses cookie for sticky session, or random for new users
 */
export function getV2Variant(cookieVariant?: string): "v1" | "v2" {
    const config = parseV2Config();

    // Full disable
    if (!config.enabled) {
        return "v1";
    }

    // Full enable (no percentage)
    if (config.percentage === null) {
        return "v2";
    }

    // Percentage-based: use cookie if available
    if (cookieVariant === "v1" || cookieVariant === "v2") {
        return cookieVariant;
    }

    // New user: random assignment based on percentage
    const random = Math.random() * 100;
    return random < config.percentage ? "v2" : "v1";
}

/**
 * Check if V2 rollback is needed
 * ITIL 4: Service Operation - Incident Management
 */
export function shouldRollbackV2(errorCount: number, threshold = 10): boolean {
    // Simple threshold-based rollback trigger
    // In production, integrate with monitoring (Sentry, etc.)
    return errorCount >= threshold;
}

/**
 * V2 Rollback Strategy Documentation
 * ITIL 4: Service Transition - Release and Deployment Management
 * 
 * ROLLBACK PROCEDURE:
 * 1. Set ENABLE_V2_DESIGN=false in environment
 * 2. Redeploy (Vercel auto-deploys on env change)
 * 3. Clear CDN cache if applicable
 * 4. Monitor error rates in Sentry
 * 5. Communicate status to stakeholders
 * 
 * RECOVERY PROCEDURE:
 * 1. Identify and fix root cause
 * 2. Deploy fix to staging
 * 3. QA verification
 * 4. Set ENABLE_V2_DESIGN=percentage:5 (canary)
 * 5. Monitor for 24 hours
 * 6. Gradually increase percentage
 * 7. Full rollout at ENABLE_V2_DESIGN=true
 */
