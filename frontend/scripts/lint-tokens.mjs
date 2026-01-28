#!/usr/bin/env node
/**
 * Design Tokens Lint (Comprehensive)
 *
 * Validates that all color/surface usage follows the design system:
 * - No raw Tailwind neutral palette (zinc, gray, slate, neutral, stone)
 * - No hard-coded white surfaces
 * - No hard-coded bracket hex/rgb colors
 * - No redundant/conflicting token usage
 *
 * Scans: All .ts/.tsx files in src/
 * 
 * Note: Typography tokens are in lint-typography.mjs (no overlap)
 * 
 * Run: npm run lint:tokens
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "src");

// ============================================================
// Allowlist - Files that CAN use raw color values
// ============================================================
const ALLOWLIST = new Set([
  "src/app/globals.css",
  "tailwind.config.ts",
]);

// ============================================================
// File Discovery
// ============================================================
function listFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p));
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

function rel(p) {
  return path.relative(process.cwd(), p).replaceAll("\\", "/");
}

function isAllowlisted(filePath) {
  return ALLOWLIST.has(rel(filePath));
}

function takeContext(text, index, len = 70) {
  const start = Math.max(0, index - 25);
  const end = Math.min(text.length, start + len);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

// ============================================================
// Banned Patterns
// ============================================================
const BANNED_PATTERNS = [
  // Neutral palette
  { name: "Neutral palette utility", re: /\b(?:text|bg|border|ring|stroke|fill)-(?:zinc|gray|slate|neutral|stone)-\d{2,3}\b/g, fix: "Use text-foreground, bg-background, border-border, etc." },
  { name: "Neutral palette with opacity", re: /\b(?:text|bg|border|ring|stroke|fill)-(?:zinc|gray|slate|neutral|stone)-\d{2,3}\/\d{1,3}\b/g, fix: "Use text-foreground/50, bg-panel, etc." },
  { name: "Neutral in gradients", re: /\b(?:from|via|to)-(?:zinc|gray|slate|neutral|stone)-\d{2,3}(?:\/\d{1,3})?\b/g, fix: "Use from-foreground, via-background, etc." },

  // Hard-coded surfaces
  { name: "Hard-coded bg-white", re: /\bbg-white\b/g, fix: "Use bg-background or bg-panel" },
  { name: "Hard-coded border-white", re: /\bborder-white\b/g, fix: "Use border-background or border-border" },

  // Bracket colors
  { name: "Bracket hex color", re: /\b(?:text|bg|border|ring|stroke|fill)-\[#[0-9a-fA-F]{3,8}\]/g, fix: "Use CSS variables: bg-[var(--custom-color)]" },
  { name: "Bracket rgb color", re: /\b(?:text|bg|border|ring|stroke|fill)-\[rgba?\([^)]+\)\]/g, fix: "Use CSS variables or design tokens" },
];

// ============================================================
// Redundancy Patterns (conflicting/duplicate tokens)
// ============================================================
const REDUNDANCY_PATTERNS = [
  // Multiple text colors on same element
  {
    name: "Redundant text colors",
    re: /className="[^"]*\btext-foreground\b[^"]*\btext-foreground-muted\b[^"]*"|className="[^"]*\btext-foreground-muted\b[^"]*\btext-foreground\b[^"]*"/g,
    fix: "Use only one text color token",
  },
  // Multiple bg colors
  {
    name: "Redundant background colors",
    re: /className="[^"]*\bbg-background\b[^"]*\bbg-panel\b[^"]*"|className="[^"]*\bbg-panel\b[^"]*\bbg-background\b[^"]*"/g,
    fix: "Use only one background token",
  },
  // Opacity override on same property
  {
    name: "Conflicting opacity modifiers",
    re: /className="[^"]*\b(text|bg|border)-[a-z]+\/\d+\b[^"]*\b\1-[a-z]+\/\d+\b[^"]*"/g,
    fix: "Use only one opacity modifier per property type",
  },
  // Duplicate exact tokens
  {
    name: "Duplicate token",
    re: /(?<![-\w])(text-foreground|bg-background|bg-panel|border-border)(?![-\w])[^"]*(?<![-\w])\1(?![-\w])/g,
    fix: "Remove duplicate token",
  },
  // Conflicting hover states
  {
    name: "Conflicting hover colors",
    re: /className="[^"]*\bhover:text-[a-z-]+\b[^"]*\bhover:text-[a-z-]+\b[^"]*"/g,
    fix: "Use only one hover text color",
  },
];

// ============================================================
// Main
// ============================================================
function lint() {
  const violations = [];
  const redundancies = [];
  const stats = { filesScanned: 0, tokenUsages: 0 };

  const files = listFiles(ROOT);

  for (const file of files) {
    if (isAllowlisted(file)) continue;

    const raw = fs.readFileSync(file, "utf8");
    stats.filesScanned++;

    // Count proper token usage
    const tokenMatches = raw.match(/\b(text|bg|border|ring)-(foreground|background|panel|subtle|border|muted)/g);
    if (tokenMatches) stats.tokenUsages += tokenMatches.length;

    // Check banned patterns
    for (const { name, re, fix } of BANNED_PATTERNS) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(raw)) !== null) {
        const line = raw.substring(0, match.index).split("\n").length;
        violations.push({
          file: rel(file),
          line,
          rule: name,
          token: match[0],
          context: takeContext(raw, match.index),
          fix,
        });
        if (match.index === re.lastIndex) re.lastIndex++;
        if (violations.length > 50) break;
      }
    }

    // Check redundancy patterns
    for (const { name, re, fix } of REDUNDANCY_PATTERNS) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(raw)) !== null) {
        const line = raw.substring(0, match.index).split("\n").length;
        redundancies.push({
          file: rel(file),
          line,
          rule: name,
          context: takeContext(raw, match.index, 100),
          fix,
        });
        if (match.index === re.lastIndex) re.lastIndex++;
        if (redundancies.length > 20) break;
      }
    }
  }

  // Report
  console.log("\n🎨 Design Tokens Lint (Comprehensive)\n");
  console.log("━".repeat(55));

  console.log("\n📊 Scan Statistics:");
  console.log(`   Files scanned:     ${stats.filesScanned}`);
  console.log(`   Token usages:      ${stats.tokenUsages}`);
  console.log(`   Allowlisted:       ${ALLOWLIST.size} files`);

  // Redundancy warnings (not blocking, but important)
  if (redundancies.length > 0) {
    console.log(`\n⚠️  ${redundancies.length} redundancy warning(s):`);
    for (const r of redundancies.slice(0, 15)) {
      console.log(`   - ${r.file}:${r.line}`);
      console.log(`     Issue: ${r.rule}`);
      console.log(`     Fix: ${r.fix}`);
    }
    if (redundancies.length > 5) console.log(`   ... and ${redundancies.length - 5} more`);
  }

  if (violations.length > 0) {
    console.error(`\n❌ Token lint failed. ${violations.length} violation(s):\n`);
    for (const v of violations.slice(0, 15)) {
      console.error(`   - ${v.file}`);
      console.error(`     Token: ${v.token}`);
      console.error(`     Fix: ${v.fix}`);
    }
    if (violations.length > 15) console.error(`   ... and ${violations.length - 15} more`);
    console.error("\nDesign tokens: text-foreground, bg-background, bg-panel, border-border, text-foreground-muted\n");
    process.exit(1);
  }

  console.log("\n✅ Token lint passed.\n");
}

lint();
