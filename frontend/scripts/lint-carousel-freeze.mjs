#!/usr/bin/env node
/**
 * Editorial Carousel Design Freeze Lint Script
 *
 * Validates that EditorialCarouselSection follows expert-level frontend practices:
 * - CSS-first card widths (no JS calculations)
 * - Responsive aspect ratios
 * - Refined scroll indicators (pill-shaped dots)
 * - Intelligent positioning using CSS variables
 *
 * Run: npm run lint:carousel-freeze
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Files to lint
const FILES = {
    carousel: path.join(ROOT, "src/components/home/EditorialCarouselSection.tsx"),
    globals: path.join(ROOT, "src/app/globals.css"),
    scrollIndicators: path.join(ROOT, "src/components/ui/ScrollIndicators.tsx"),
};

// ============================================================
// CSS Rules (design freeze)
// ============================================================
const CSS_RULES = [
    {
        name: "carousel-card class with clamp() widths",
        file: "globals",
        pattern: /\.carousel-card\s*\{[^}]*width:\s*clamp\(/,
        required: true,
    },
    {
        name: "Section overlap variable defined",
        file: "globals",
        pattern: /--section-overlap:\s*clamp\(/,
        required: true,
    },
    {
        name: "Desktop section overlap increased",
        file: "globals",
        pattern: /@media.*min-width:\s*1024px.*--section-overlap:\s*10rem/s,
        required: true,
    },
    {
        name: "Card padding variable defined",
        file: "globals",
        pattern: /--card-padding:\s*clamp\(/,
        required: true,
    },
];

// ============================================================
// Component Rules (EditorialCarouselSection)
// ============================================================
const COMPONENT_RULES = [
    {
        name: "Uses carousel-card CSS class",
        file: "carousel",
        pattern: /carousel-card/,
        required: true,
    },
    {
        name: "Uses data-carousel-card attribute",
        file: "carousel",
        pattern: /data-carousel-card/,
        required: true,
    },
    {
        name: "Responsive hero aspect ratio (lg:aspect)",
        file: "carousel",
        pattern: /aspect-\[1\.6\/1\].*lg:aspect-\[2\.5\/1\]/,
        required: true,
    },
    {
        name: "Dots positioned above overlap zone",
        file: "carousel",
        pattern: /bottom-\[calc\(var\(--section-overlap\)/,
        required: true,
    },
    {
        name: "Static arrow positioning (top-1/4)",
        file: "carousel",
        pattern: /topClassName.*top-1\/4/,
        required: true,
    },
];

// ============================================================
// ScrollIndicators Rules (refined dots)
// ============================================================
const INDICATOR_RULES = [
    {
        name: "Dots use rounded-full (pill shape)",
        file: "scrollIndicators",
        pattern: /rounded-full/,
        required: true,
    },
    {
        name: "Active dot expands (w-6)",
        file: "scrollIndicators",
        pattern: /isActive.*w-6/,
        required: true,
    },
    {
        name: "Inactive dot is circular (w-1.5)",
        file: "scrollIndicators",
        pattern: /w-1\.5/,
        required: true,
    },
    {
        name: "Smooth transition on dots",
        file: "scrollIndicators",
        pattern: /transition-all.*duration-300/,
        required: true,
    },
];

// ============================================================
// Banned Patterns (over-engineering we removed)
// ============================================================
const BANNED_PATTERNS = [
    {
        name: "JS getCardWidth function",
        file: "carousel",
        pattern: /getCardWidth\s*=\s*useCallback|function\s+getCardWidth/,
        reason: "Use CSS-first approach (.carousel-card class with clamp())",
    },
    {
        name: "cardWidth state variable",
        file: "carousel",
        pattern: /useState.*cardWidth|cardWidth.*useState/,
        reason: "Card widths should be CSS-controlled, not JS state",
    },
    {
        name: "Inline width style on ProductCard",
        file: "carousel",
        pattern: /style=\{\{[^}]*width:\s*cardWidth/,
        reason: "Use .carousel-card CSS class instead of inline widths",
    },
    {
        name: "Dynamic arrow positioning CSS variable",
        file: "carousel",
        pattern: /--editorial-carousel-arrow-y.*cardWidth/,
        reason: "Use static positioning (top-1/4)",
    },
    {
        name: "productCardWidth constant",
        file: "carousel",
        pattern: /productCardWidth:\s*\d+/,
        reason: "Card widths are CSS-controlled now",
    },
    {
        name: "Square dot indicators (rounded-none)",
        file: "scrollIndicators",
        pattern: /h-2\.5\s+w-2\.5.*rounded-none/,
        reason: "Use refined pill-shaped indicators",
    },
    {
        name: "Ring on dot indicators",
        file: "scrollIndicators",
        pattern: /ring-1.*ring-indicator/,
        reason: "Refined dots don't use rings",
    },
];

// ============================================================
// Linting Logic
// ============================================================
function lint() {
    const errors = [];
    const contents = {};

    // Read files
    for (const [key, filePath] of Object.entries(FILES)) {
        if (!fs.existsSync(filePath)) {
            errors.push(`❌ File not found: ${filePath}`);
            continue;
        }
        contents[key] = fs.readFileSync(filePath, "utf-8");
    }

    // Check required patterns
    const allRules = [...CSS_RULES, ...COMPONENT_RULES, ...INDICATOR_RULES];
    for (const rule of allRules) {
        const content = contents[rule.file];
        if (!content) continue;

        if (rule.required && !rule.pattern.test(content)) {
            errors.push(`❌ [${rule.file}] Missing: ${rule.name}`);
        }
    }

    // Check banned patterns
    for (const banned of BANNED_PATTERNS) {
        const content = contents[banned.file];
        if (!content) continue;

        if (banned.pattern.test(content)) {
            errors.push(`❌ [${banned.file}] BANNED: ${banned.name}`);
            errors.push(`   → ${banned.reason}`);
        }
    }

    // Report
    console.log("\n🎠 Editorial Carousel Design Freeze Lint\n");
    console.log("━".repeat(50));

    if (errors.length === 0) {
        console.log("✅ All checks passed! Carousel follows expert practices.\n");
        return 0;
    }

    console.log(`\n${errors.length} issue(s) found:\n`);
    errors.forEach((e) => console.log(`  ${e}`));
    console.log("\n");
    return 1;
}

process.exit(lint());
