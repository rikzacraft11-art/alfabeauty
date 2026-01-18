/**
 * Hero Section Design Freeze Lint (v2)
 * 
 * Validates that the HomeHero component matches the frozen design specification.
 * Updated: 2026-01-19 with new typography system and CK-style text CTAs.
 * 
 * Usage: node scripts/lint-hero-freeze.mjs
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const HERO_FILE = path.resolve(process.cwd(), "src/components/home/HomeHero.tsx");

// =============================================================================
// Frozen Design Specification (v2 - CK Style)
// =============================================================================

/**
 * Required structural elements that MUST be present in the Hero section.
 * These are derived from the frozen HTML output.
 */
const REQUIRED_PATTERNS = [
    // Section structure
    {
        name: "Hero section with proper aria-label",
        re: /aria-label.*Hero/,
        required: true,
    },
    // Simplified responsive: h-[70vh] on mobile, sm:aspect-[16/9] on tablet+
    {
        name: "Simplified responsive (h-[70vh] mobile, sm:aspect-[16/9] tablet+)",
        re: /h-\[70vh\].*sm:.*aspect-\[16\/9\]/,
        required: true,
    },
    // Max height constraint
    {
        name: "Max height viewport constraint",
        re: /max-h-\[85vh\]/,
        required: true,
    },
    // Video background
    {
        name: "Video element with autoplay/muted/loop/playsInline",
        re: /<video[^>]*autoPlay[^>]*muted[^>]*loop[^>]*playsInline/s,
        required: true,
    },
    // Gradient overlays for readability
    {
        name: "Right-to-left gradient overlay",
        re: /bg-gradient-to-r.*from-foreground\/(80|70)/,
        required: true,
    },
    {
        name: "Bottom-to-top gradient overlay",
        re: /bg-gradient-to-t.*from-foreground\/(30|40)/,
        required: true,
    },
    // Bottom-left positioning (CK style)
    {
        name: "Content positioned at bottom (items-end)",
        re: /items-end.*pb-12/,
        required: true,
    },
    // Content container
    {
        name: "Content max-width constraint (120rem)",
        re: /max-w-\[120rem\]/,
        required: true,
    },
    // Typography classes (v2 - hero-specific)
    {
        name: "Hero typography: type-hero-kicker",
        re: /type-hero-kicker.*ui-hero-on-media/,
        required: true,
    },
    {
        name: "Hero typography: type-hero (headline)",
        re: /type-hero\s+ui-hero-on-media|type-hero.*ui-hero-on-media/,
        required: true,
    },
    {
        name: "Hero typography: type-hero-body (description)",
        re: /type-hero-body.*ui-hero-on-media-muted/,
        required: true,
    },
    {
        name: "Hero typography: type-hero-note (supporting text)",
        re: /type-hero-note.*ui-hero-on-media-subtle/,
        required: true,
    },
    // CTA style (CK editorial text links)
    {
        name: "CK-style text CTAs (TextLink with onDark)",
        re: /TextLink[^>]*onDark|ui-cta-text.*ui-hero-on-media/,
        required: true,
    },
];

/**
 * Banned patterns that should NOT appear in the Hero section.
 * These violate the CK-inspired minimalism design.
 */
const BANNED_PATTERNS = [
    {
        name: "Text shadow (violates minimalism)",
        re: /ui-text-shadow|text-shadow/,
        reason: "CK minimalism prohibits text shadows",
    },
    {
        name: "Shadow on CTA (violates minimalism)",
        re: /shadow-lg|shadow-xl|shadow-2xl/,
        reason: "CK minimalism prohibits heavy shadows on CTAs",
    },
    {
        name: "TrustBar component (removed)",
        re: /<TrustBar|TrustItem/,
        reason: "TrustBar has been removed from Hero",
    },
    {
        name: "ButtonLink in Hero (use TextLink)",
        re: /<ButtonLink[^/]*\/?>|ButtonLink\s*href/,
        reason: "CK hero uses editorial text links (TextLink), not buttons",
    },
    {
        name: "IconArrowRight in Hero CTAs",
        re: /IconArrowRight/,
        reason: "CK hero CTAs do not use arrow icons",
    },
    {
        name: "Grayscale filter on Hero",
        re: /grayscale.*Hero|Hero.*grayscale/,
        reason: "Grayscale filters are not part of the Hero design",
    },
    {
        name: "Old type-h1 in Hero (use type-hero)",
        re: /type-h1.*ui-hero-on-media/,
        reason: "Hero headline should use type-hero class, not type-h1",
    },
    {
        name: "Old type-kicker in Hero (use type-hero-kicker)",
        re: /type-kicker\s+ui-hero|"type-kicker.*ui-hero-on-media/,
        reason: "Hero kicker should use type-hero-kicker class",
    },
    {
        name: "Old type-body in Hero (use type-hero-body)",
        re: /type-body\s+ui-hero|"type-body.*ui-hero-on-media/,
        reason: "Hero description should use type-hero-body class",
    },
    {
        name: "Old type-data in Hero (use type-hero-note)",
        re: /type-data\s+ui-hero|"type-data.*ui-hero-on-media/,
        reason: "Hero note should use type-hero-note class",
    },
    {
        name: "Center alignment (use bottom-left)",
        re: /items-center[^}]*ui-hero-on-media/,
        reason: "CK positions hero content at bottom-left, not center",
    },
];

// =============================================================================
// Lint Logic
// =============================================================================

async function main() {
    const violations = [];

    // Check file exists
    try {
        await fs.access(HERO_FILE);
    } catch {
        console.error(`Hero file not found: ${HERO_FILE}`);
        process.exit(1);
    }

    const raw = await fs.readFile(HERO_FILE, "utf8");
    const relPath = path.relative(process.cwd(), HERO_FILE);

    // Check required patterns
    for (const { name, re, required } of REQUIRED_PATTERNS) {
        if (required && !re.test(raw)) {
            violations.push({
                type: "MISSING",
                file: relPath,
                rule: name,
                message: `Required pattern not found: ${name}`,
            });
        }
    }

    // Check banned patterns
    for (const { name, re, reason } of BANNED_PATTERNS) {
        if (re.test(raw)) {
            violations.push({
                type: "BANNED",
                file: relPath,
                rule: name,
                message: reason,
            });
        }
    }

    // Report results
    console.log("\n🎬 Hero Section Design Freeze Lint (v2)\n");
    console.log("━".repeat(50));

    if (violations.length > 0) {
        console.error("\n❌ Lint FAILED:\n");

        const missing = violations.filter(v => v.type === "MISSING");
        const banned = violations.filter(v => v.type === "BANNED");

        if (missing.length > 0) {
            console.error("Missing required patterns:");
            for (const v of missing) {
                console.error(`  ❌ ${v.rule}`);
            }
            console.error("");
        }

        if (banned.length > 0) {
            console.error("Banned patterns found:");
            for (const v of banned) {
                console.error(`  ❌ ${v.rule}`);
                console.error(`     → ${v.message}`);
            }
            console.error("");
        }

        console.error("Fix: Ensure Hero matches the frozen CK-style design.\n");
        process.exit(1);
    }

    console.log("✅ All checks passed! Hero matches CK design freeze.\n");
}

main().catch((err) => {
    console.error("Lint error:", err);
    process.exit(1);
});
