#!/usr/bin/env node
/**
 * Category Card Design Freeze Lint
 * 
 * Enforces the minimalist professional card design:
 * - External hover indicator (outside card)
 * - Simple image reveal on hover
 * - Ring-based borders (not border-color)
 * - No shadows
 * - 1px icon strokes
 * - Clean transitions
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const COMPONENT_PATH = resolve("src/components/home/HeroImageStrip.tsx");
const GLOBALS_PATH = resolve("src/app/globals.css");

// ============================================================
// Required Patterns (must exist)
// ============================================================
const REQUIRED_PATTERNS = [
    {
        name: "External indicator outside card",
        file: "component",
        pattern: /absolute\s+-top-\d+|absolute.*-top-/,
        reason: "Hover indicator must be positioned outside (above) the card",
    },
    {
        name: "Ring-based border (not border-color)",
        file: "component",
        pattern: /ring-1\s+ring-border/,
        reason: "Use ring utility for reliable border hover effects",
    },
    {
        name: "Ring hover effect",
        file: "component",
        pattern: /hover:ring-foreground|hover:ring-2/,
        reason: "Border should thicken or change color on hover via ring",
    },
    {
        name: "1px icon strokes",
        file: "component",
        pattern: /strokeWidth=["']1["']/,
        reason: "Minimalist icons use 1px strokes",
    },
    {
        name: "Image opacity transition on hover",
        file: "component",
        pattern: /opacity-0\s+group-hover:opacity-100/,
        reason: "Image should fade in on hover",
    },
    {
        name: "Clean overlay (40-50% black)",
        file: "component",
        pattern: /bg-black\/4[0-9]|bg-black\/50/,
        reason: "Image overlay should be subtle (40-50% opacity)",
    },
    {
        name: "Fade-in animation on cards",
        file: "component",
        pattern: /animate-fade-in-up/,
        reason: "Cards should have staggered entrance animation",
    },
    {
        name: "Transition duration 200-300ms",
        file: "component",
        pattern: /duration-2[0-9]{2}|duration-300/,
        reason: "Transitions should be snappy (200-300ms)",
    },
];

// ============================================================
// Banned Patterns (must NOT exist)
// ============================================================
const BANNED_PATTERNS = [
    {
        name: "Shadow effects on cards",
        file: "component",
        pattern: /shadow-lg|shadow-xl|shadow-2xl|shadow-\[/,
        reason: "Minimalist design: no shadow effects on cards",
    },
    {
        name: "Complex slide animations",
        file: "component",
        pattern: /translate-y-full|translate-y-4\s+group-hover:translate-y-0/,
        reason: "Keep hover animations simple (just opacity)",
    },
    {
        name: "Internal corner indicators",
        file: "component",
        pattern: /absolute\s+top-0\s+right-0.*w-8|absolute\s+top-4\s+right-4/,
        reason: "Indicator should be external (outside card), not internal corner",
    },
    {
        name: "Border-color for hover (unreliable)",
        file: "component",
        pattern: /hover:border-foreground[^/]|border\s+border-.*hover:border-/,
        reason: "Use ring utilities instead of border-color for reliable hover",
    },
    {
        name: "Backdrop blur on cards",
        file: "component",
        pattern: /backdrop-blur/,
        reason: "Minimalist design: no glassmorphism effects",
    },
    {
        name: "Rounded corners on cards",
        file: "component",
        pattern: /rounded-2xl|rounded-xl|rounded-lg/,
        reason: "CK-style: sharp corners (no rounded cards)",
    },
];

// ============================================================
// Runner
// ============================================================
function main() {
    console.log("\n🎴 Category Card Design Freeze Lint\n");
    console.log("━".repeat(50));

    const errors = [];
    const warnings = [];

    // Load files
    const files = {
        component: existsSync(COMPONENT_PATH) ? readFileSync(COMPONENT_PATH, "utf-8") : null,
        globals: existsSync(GLOBALS_PATH) ? readFileSync(GLOBALS_PATH, "utf-8") : null,
    };

    if (!files.component) {
        errors.push("❌ HeroImageStrip.tsx not found");
    }

    // Check required patterns
    for (const rule of REQUIRED_PATTERNS) {
        const content = files[rule.file];
        if (!content) continue;

        if (!rule.pattern.test(content)) {
            errors.push(`❌ Missing: ${rule.name}`);
            errors.push(`   Reason: ${rule.reason}`);
        }
    }

    // Check banned patterns
    for (const rule of BANNED_PATTERNS) {
        const content = files[rule.file];
        if (!content) continue;

        if (rule.pattern.test(content)) {
            errors.push(`❌ Found banned pattern: ${rule.name}`);
            errors.push(`   Reason: ${rule.reason}`);
        }
    }

    // Results
    console.log("");
    if (errors.length === 0) {
        console.log("✅ All checks passed! Category cards follow minimalist design freeze.\n");
        process.exit(0);
    } else {
        for (const e of errors) console.log(e);
        console.log(`\n❌ ${errors.length / 2} issue(s) found.\n`);
        process.exit(1);
    }
}

main();
