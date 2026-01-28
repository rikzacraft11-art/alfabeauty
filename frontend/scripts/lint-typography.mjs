#!/usr/bin/env node
/**
 * Typography Lint (Comprehensive)
 *
 * Validates that all typography follows the design system:
 * - No raw Tailwind text sizes (use type-* tokens)
 * - No raw font weights (use type-*-strong)
 * - No raw tracking/leading (use type-* tokens)
 * - No redundant/conflicting typography
 *
 * Scans: All .ts/.tsx files in src/
 * 
 * Run: npm run lint:typography
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "src");

// ============================================================
// Allowlist
// ============================================================
const ALLOWLIST = new Set([
  "src/components/ui/ImageTransition.tsx",
  "src/app/globals.css",
  "src/components/ui/Button.tsx",
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
  { name: "Tailwind text size", re: /\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/g, fix: "Use type-* tokens" },
  { name: "Arbitrary text size", re: /\btext-\[\d+(\.\d+)?(px|rem|em)\]/g, fix: "Use type-* tokens" },
  { name: "Tailwind font weight", re: /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g, fix: "Use type-*-strong" },
  { name: "Arbitrary font weight", re: /\bfont-\[\d+\]/g, fix: "Use type-*-strong" },
  { name: "Tailwind tracking", re: /\btracking-(tighter|tight|normal|wide|wider|widest)\b/g, fix: "Use type-* tokens" },
  { name: "Arbitrary tracking", re: /\btracking-\[[\d.]+[a-z]*\]/g, fix: "Use type-* tokens" },
  { name: "Tailwind leading", re: /\bleading-(none|tight|snug|normal|relaxed|loose|\d+)\b/g, fix: "Use type-* tokens" },
  { name: "Arbitrary leading", re: /\bleading-\[[\d.]+[a-z]*\]/g, fix: "Use type-* tokens" },
];

// Warnings (not blocking)
const WARNING_PATTERNS = [
  { name: "Hard-coded text-white", re: /\btext-white\b/g, fix: "Consider text-background or ui-*-on-media" },
  { name: "Hard-coded text-black", re: /\btext-black\b/g, fix: "Consider text-foreground" },
];

// ============================================================
// Redundancy Patterns
// ============================================================
const REDUNDANCY_PATTERNS = [
  // Multiple type-* tokens on same element
  {
    name: "Multiple type-* tokens",
    re: /className="[^"]*\btype-[a-z0-9-]+\b[^"]*\btype-[a-z0-9-]+\b[^"]*"/g,
    fix: "Use only one type-* token per element",
  },
  // Conflicting responsive text sizes
  {
    name: "Conflicting responsive sizes",
    re: /className="[^"]*\b(sm|md|lg|xl):text-\w+\b[^"]*\b\1:text-\w+\b[^"]*"/g,
    fix: "Use only one text size per breakpoint",
  },
  // Duplicate type token
  {
    name: "Duplicate type token",
    re: /\b(type-(?:h[1-6]|hero|body|nav|data|kicker|caption))\b[^"]*\b\1\b/g,
    fix: "Remove duplicate type token",
  },
  // Mixed font system (type-* with raw tailwind)
  {
    name: "Mixed typography systems",
    re: /className="[^"]*\btype-[a-z0-9-]+\b[^"]*(text-(?:xs|sm|base|lg|xl)|font-(?:light|medium|semibold|bold))[^"]*"|className="[^"]*(text-(?:xs|sm|base|lg|xl)|font-(?:light|medium|semibold|bold))[^"]*\btype-[a-z0-9-]+\b[^"]*"/g,
    fix: "Use type-* tokens exclusively, don't mix with raw Tailwind",
  },
];

// ============================================================
// Main
// ============================================================
function lint() {
  const violations = [];
  const warnings = [];
  const redundancies = [];
  const stats = { filesScanned: 0, typeTokenUsages: 0 };

  const files = listFiles(ROOT);

  for (const file of files) {
    if (isAllowlisted(file)) continue;

    const raw = fs.readFileSync(file, "utf8");
    stats.filesScanned++;

    // Count proper type-* usage
    const typeMatches = raw.match(/\btype-(h[1-6]|hero|body|nav|data|kicker|caption)/g);
    if (typeMatches) stats.typeTokenUsages += typeMatches.length;

    // Check banned patterns
    for (const { name, re, fix } of BANNED_PATTERNS) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(raw)) !== null) {
        violations.push({ file: rel(file), rule: name, token: match[0], context: takeContext(raw, match.index), fix });
        if (match.index === re.lastIndex) re.lastIndex++;
        if (violations.length > 100) break;
      }
    }

    // Check warning patterns
    for (const { name, re, fix } of WARNING_PATTERNS) {
      re.lastIndex = 0;
      if (re.test(raw)) {
        warnings.push({ file: rel(file), rule: name, fix });
      }
    }

    // Check redundancy patterns
    for (const { name, re, fix } of REDUNDANCY_PATTERNS) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(raw)) !== null) {
        redundancies.push({ file: rel(file), rule: name, context: takeContext(raw, match.index, 90), fix });
        if (match.index === re.lastIndex) re.lastIndex++;
        if (redundancies.length > 20) break;
      }
    }
  }

  // Report
  console.log("\n🔤 Typography Lint (Comprehensive)\n");
  console.log("━".repeat(55));

  console.log("\n📊 Scan Statistics:");
  console.log(`   Files scanned:     ${stats.filesScanned}`);
  console.log(`   type-* usages:     ${stats.typeTokenUsages}`);
  console.log(`   Allowlisted:       ${ALLOWLIST.size} files`);

  // Redundancy warnings
  if (redundancies.length > 0) {
    console.log(`\n⚠️  ${redundancies.length} redundancy warning(s):`);
    for (const r of redundancies.slice(0, 5)) {
      console.log(`   - ${r.file}`);
      console.log(`     Issue: ${r.rule}`);
      console.log(`     Fix: ${r.fix}`);
    }
    if (redundancies.length > 5) console.log(`   ... and ${redundancies.length - 5} more`);
  }

  // Color warnings
  if (warnings.length > 0 && violations.length === 0) {
    console.log(`\n⚠️  ${warnings.length} color warning(s) (not blocking):`);
    for (const w of warnings.slice(0, 5)) {
      console.log(`   - ${w.file}: ${w.rule}`);
    }
  }

  if (violations.length > 0) {
    console.error(`\n❌ Typography lint failed. ${violations.length} violation(s):\n`);
    for (const v of violations.slice(0, 15)) {
      console.error(`   - ${v.file}`);
      console.error(`     Token: ${v.token}`);
      console.error(`     Fix: ${v.fix}`);
    }
    if (violations.length > 15) console.error(`   ... and ${violations.length - 15} more`);
    console.error("\nTokens: type-h1, type-h2, type-h3, type-body, type-nav, type-data, type-kicker, type-hero\n");
    process.exit(1);
  }

  console.log("\n✅ Typography lint passed.\n");
}

lint();
