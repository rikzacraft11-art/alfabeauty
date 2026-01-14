import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "src");

const FILE_EXTS = new Set([".ts", ".tsx"]);

const BANNED_PATTERNS = [
  {
    name: "Neutral palette utilities (use design tokens)",
    re: /\b(?:text|bg|border|ring|stroke|fill)-(?:zinc|gray|slate|neutral|stone)-\d{2,3}\b/g,
  },
  {
    name: "Neutral palette utilities with opacity (use design tokens)",
    re: /\b(?:text|bg|border|ring|stroke|fill)-(?:zinc|gray|slate|neutral|stone)-\d{2,3}\/\d{1,3}\b/g,
  },
  {
    name: "Neutral palette utilities in gradients (use design tokens)",
    re: /\b(?:from|via|to)-(?:zinc|gray|slate|neutral|stone)-\d{2,3}(?:\/\d{1,3})?\b/g,
  },
  {
    name: "Hard-coded white surfaces (use bg-background/bg-panel/bg-subtle)",
    re: /\b(?:bg|border)-white\b|\bbg-white\b/g,
  },
  {
    name: "Hard-coded bracket colors (use tokens / CSS variables)",
    re: /\b(?:text|bg|border|ring|stroke|fill)-\[(?:#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\()\b/g,
  },
];

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      const ext = path.extname(entry.name);
      if (FILE_EXTS.has(ext)) yield full;
    }
  }
}

function toRel(p) {
  return path.relative(process.cwd(), p);
}

function takeContext(text, index, len = 90) {
  const start = Math.max(0, index - Math.floor(len / 2));
  const end = Math.min(text.length, start + len);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

let violations = [];

for await (const file of walk(ROOT)) {
  const raw = await fs.readFile(file, "utf8");

  for (const { name, re } of BANNED_PATTERNS) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(raw)) !== null) {
      violations.push({
        file: toRel(file),
        rule: name,
        token: match[0],
        context: takeContext(raw, match.index),
      });

      // Avoid infinite loops on zero-length matches.
      if (match.index === re.lastIndex) re.lastIndex++;

      // Cap output to keep logs readable.
      if (violations.length > 200) break;
    }
    if (violations.length > 200) break;
  }
  if (violations.length > 200) break;
}

if (violations.length > 0) {
  console.error("\nToken lint failed: banned hard-coded palette/surface classes detected.\n");
  for (const v of violations) {
    console.error(`- ${v.file}`);
    console.error(`  Rule: ${v.rule}`);
    console.error(`  Token: ${v.token}`);
    console.error(`  Context: ${v.context}`);
  }
  console.error("\nFix: replace with design tokens (e.g. text-foreground, text-foreground-muted, bg-panel, border-border).\n");
  process.exit(1);
}

console.log("Token lint passed.");
