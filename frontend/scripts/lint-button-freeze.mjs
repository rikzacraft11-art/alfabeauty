#!/usr/bin/env node
/**
 * Button CTA Design Freeze Lint Script
 *
 * Validates that button styling matches Calvin Klein design system:
 * - Primary: solid black, NO border, white text
 * - Secondary: transparent bg, black border, inverts on hover
 * - Sharp corners (border-radius: 0)
 *
 * Run: npm run lint:button-freeze
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Files to lint
const FILES = {
    globals: path.join(ROOT, "src/app/globals.css"),
    button: path.join(ROOT, "src/components/ui/Button.tsx"),
    homeHero: path.join(ROOT, "src/components/home/HomeHero.tsx"),
};

// ============================================================
// CK-Style Button CSS Rules (design freeze)
// ============================================================
const CSS_RULES = [
    {
        name: "Sharp corners utility class",
        file: "globals",
        pattern: /\.ui-radius-none\s*\{\s*border-radius:\s*0;?\s*\}/,
        required: true,
    },
    {
        name: "Primary button: no visible border",
        file: "globals",
        pattern: /\.ui-btn-primary\s*\{[^}]*border-color:\s*transparent/,
        required: true,
    },
    {
        name: "Primary button: solid background",
        file: "globals",
        pattern: /\.ui-btn-primary\s*\{[^}]*background-color:\s*var\(--foreground\)/,
        required: true,
    },
    {
        name: "Secondary button: transparent background",
        file: "globals",
        pattern: /\.ui-btn-secondary\s*\{[^}]*background-color:\s*transparent/,
        required: true,
    },
    {
        name: "Secondary button: border visible",
        file: "globals",
        pattern: /\.ui-btn-secondary\s*\{[^}]*border-color:\s*var\(--foreground\)/,
        required: true,
    },
    {
        name: "Secondary hover: inverts to solid",
        file: "globals",
        pattern: /\.ui-btn-secondary:hover[^{]*\{[^}]*background-color:\s*var\(--foreground\)/,
        required: true,
    },
    {
        name: "Text CTA class exists",
        file: "globals",
        pattern: /\.ui-cta-text\s*\{[^}]*text-decoration:\s*underline/,
        required: true,
    },
];

// ============================================================
// Button.tsx Component Rules
// ============================================================
const COMPONENT_RULES = [
    {
        name: "Uses sharp corners (ui-radius-none)",
        file: "button",
        pattern: /ui-radius-none/,
        required: true,
    },
    {
        name: "No active scale effect on primary",
        file: "button",
        pattern: /primary:\s*["']ui-btn-primary["']/,
        required: true,
    },
];

// ============================================================
// Banned Patterns (should NOT exist)
// ============================================================
const BANNED_PATTERNS = [
    {
        name: "No rounded corners on buttons",
        file: "button",
        pattern: /ui-radius-tight/,
        reason: "CK uses sharp corners (ui-radius-none)",
    },
    {
        name: "No scale effect on active",
        file: "button",
        pattern: /active:scale-\[0\.98\]/,
        reason: "CK does not use press scale effects",
    },
    {
        name: "No border on primary button",
        file: "globals",
        pattern: /\.ui-btn-primary\s*\{[^}]*border-color:\s*var\(--foreground\)[^}]*\}/,
        reason: "CK primary button has no visible border",
    },
    {
        name: "No ButtonLink in HomeHero",
        file: "homeHero",
        pattern: /import\s+ButtonLink\s+from/,
        reason: "CK hero uses editorial text links, not buttons",
    },
    {
        name: "No arrow icons in hero CTAs",
        file: "homeHero",
        pattern: /IconArrowRight/,
        reason: "CK does not use arrow icons in hero text links",
    },
];

// ============================================================
// HomeHero Required Patterns (CK-style)
// ============================================================
const HERO_RULES = [
    {
        name: "Uses TextLink component",
        file: "homeHero",
        pattern: /import\s+TextLink\s+from/,
        required: true,
    },
    {
        name: "Has onDark prop for hero CTAs",
        file: "homeHero",
        pattern: /onDark/,
        required: true,
    },
];

// ============================================================
// Linting Logic
// ============================================================
function lint() {
    const errors = [];
    const warnings = [];

    // Read files
    const contents = {};
    for (const [key, filePath] of Object.entries(FILES)) {
        if (!fs.existsSync(filePath)) {
            errors.push(`❌ File not found: ${filePath}`);
            continue;
        }
        contents[key] = fs.readFileSync(filePath, "utf-8");
    }

    // Check required patterns
    for (const rule of [...CSS_RULES, ...COMPONENT_RULES, ...HERO_RULES]) {
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
            errors.push(`❌ [${banned.file}] Banned: ${banned.name} — ${banned.reason}`);
        }
    }

    // Report
    console.log("\n🎨 Button CTA Design Freeze Lint\n");
    console.log("━".repeat(50));

    if (errors.length === 0) {
        console.log("✅ All checks passed! Button CTAs match CK design system.\n");
        return 0;
    }

    console.log(`\n${errors.length} error(s) found:\n`);
    errors.forEach((e) => console.log(`  ${e}`));
    console.log("\n");
    return 1;
}

process.exit(lint());
