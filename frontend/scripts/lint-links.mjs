#!/usr/bin/env node
/**
 * Link Usage Lint (Comprehensive)
 *
 * Validates that all link usage follows the design system:
 * - No direct next/link imports (except allowlisted primitives)
 * - All links should use AppLink, ButtonLink, or TextLink
 * - No redundant/conflicting link components
 *
 * Scans: All .ts/.tsx files in src/
 * 
 * Run: npm run lint:links
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "src");

// ============================================================
// Allowlist
// ============================================================
const ALLOWLIST = new Set([
  path.resolve(process.cwd(), "src/components/ui/AppLink.tsx"),
  path.resolve(process.cwd(), "src/components/ui/ButtonLink.tsx"),
  path.resolve(process.cwd(), "src/components/ui/TextLink.tsx"),
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

function takeContext(text, index, len = 80) {
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, start + len);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

// ============================================================
// Patterns
// ============================================================
const BANNED_PATTERNS = [
  {
    name: "Direct next/link import",
    re: /from\s+["']next\/link["']/g,
    fix: "Use AppLink, ButtonLink, or TextLink",
  },
];

// ============================================================
// Redundancy Patterns
// ============================================================
const REDUNDANCY_PATTERNS = [
  // Import multiple link components when one would suffice
  {
    name: "Multiple link component imports",
    re: /import\s+(?:AppLink|ButtonLink|TextLink)[^;]*;[^]*import\s+(?:AppLink|ButtonLink|TextLink)[^;]*;/g,
    fix: "Consider consolidating link component usage",
    severity: "info",  // Not a violation, just info
  },
  // Using both ButtonLink and TextLink for same purpose
  {
    name: "Mixed CTA types",
    re: /<ButtonLink[^>]*>[^<]*<\/ButtonLink>[^]*<TextLink[^>]*>[^<]*<\/TextLink>|<TextLink[^>]*>[^<]*<\/TextLink>[^]*<ButtonLink[^>]*>[^<]*<\/ButtonLink>/g,
    fix: "Consider consistent CTA style (buttons or text links)",
    severity: "info",
  },
  // Nested links (accessibility issue)
  {
    name: "Nested link components",
    re: /<AppLink[^>]*>(?:(?!<\/AppLink>)[^])*<AppLink|<ButtonLink[^>]*>(?:(?!<\/ButtonLink>)[^])*<ButtonLink|<TextLink[^>]*>(?:(?!<\/TextLink>)[^])*<TextLink/g,
    fix: "Links should not be nested (accessibility issue)",
    severity: "error",
  },
  // Link wrapping non-link semantic element
  {
    name: "Link wrapping button",
    re: /<AppLink[^>]*>\s*<button|<ButtonLink[^>]*>\s*<button|<TextLink[^>]*>\s*<button/g,
    fix: "Don't wrap <button> in link, use ButtonLink instead",
    severity: "error",
  },
];

// ============================================================
// Main
// ============================================================
function lint() {
  const violations = [];
  const redundancies = [];
  const stats = { filesScanned: 0, appLinkUsages: 0, buttonLinkUsages: 0, textLinkUsages: 0 };

  const files = listFiles(ROOT);

  for (const file of files) {
    if (ALLOWLIST.has(file)) continue;

    const src = fs.readFileSync(file, "utf8");
    stats.filesScanned++;

    // Count proper link usages
    if (/import.*AppLink|<AppLink/.test(src)) stats.appLinkUsages++;
    if (/import.*ButtonLink|<ButtonLink/.test(src)) stats.buttonLinkUsages++;
    if (/import.*TextLink|<TextLink/.test(src)) stats.textLinkUsages++;

    // Check banned patterns
    for (const { name, re, fix } of BANNED_PATTERNS) {
      re.lastIndex = 0;
      if (re.test(src)) {
        violations.push({ file: rel(file), rule: name, fix });
      }
    }

    // Check redundancy patterns
    for (const { name, re, fix, severity } of REDUNDANCY_PATTERNS) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(src)) !== null) {
        const item = { file: rel(file), rule: name, context: takeContext(src, match.index), fix, severity };
        if (severity === "error") {
          violations.push(item);
        } else {
          redundancies.push(item);
        }
        if (match.index === re.lastIndex) re.lastIndex++;
        if (redundancies.length > 20) break;
      }
    }
  }

  // Report
  console.log("\n🔗 Link Usage Lint (Comprehensive)\n");
  console.log("━".repeat(55));

  console.log("\n📊 Scan Statistics:");
  console.log(`   Files scanned:      ${stats.filesScanned}`);
  console.log(`   AppLink usages:     ${stats.appLinkUsages}`);
  console.log(`   ButtonLink usages:  ${stats.buttonLinkUsages}`);
  console.log(`   TextLink usages:    ${stats.textLinkUsages}`);

  console.log("\n📁 Allowlisted Files:");
  for (const allowed of ALLOWLIST) {
    console.log(`   ✓ ${rel(allowed)}`);
  }

  // Redundancy info
  if (redundancies.length > 0) {
    console.log(`\nℹ️  ${redundancies.length} redundancy note(s):`);
    for (const r of redundancies.slice(0, 5)) {
      console.log(`   - ${r.file}: ${r.rule}`);
    }
    if (redundancies.length > 5) console.log(`   ... and ${redundancies.length - 5} more`);
  }

  if (violations.length > 0) {
    console.error(`\n❌ Link lint failed. ${violations.length} violation(s):\n`);
    for (const v of violations) {
      console.error(`   - ${v.file}`);
      console.error(`     Issue: ${v.rule}`);
      console.error(`     Fix: ${v.fix}`);
    }
    console.error("\nFix: Replace next/link with AppLink (navigation), ButtonLink (CTA), or TextLink (editorial).\n");
    process.exit(1);
  }

  console.log("\n✅ Link lint passed.\n");
}

lint();
