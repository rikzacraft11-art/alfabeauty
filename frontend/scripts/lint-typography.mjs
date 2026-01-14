import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "src");

const FILE_EXTS = new Set([".ts", ".tsx"]);

const BANNED_PATTERNS = [
  {
    name: "Tailwind text size (use type-* tokens)",
    re: /\btext-(xs|sm|base|lg|xl|[2-9]xl)\b|text-\[/g,
  },
  {
    name: "Tailwind font weight (use type-*-strong/type-strong)",
    re: /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g,
  },
  {
    name: "Tailwind tracking (use type-* tokens)",
    re: /\btracking-(tighter|tight|normal|wide|wider|widest)\b/g,
  },
  {
    name: "Tailwind leading (use type-* tokens)",
    re: /\bleading-(none|tight|snug|normal|relaxed|loose|\d+)\b|leading-\[/g,
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

function takeContext(text, index, len = 80) {
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

      // Cap per file/rule to keep output readable.
      if (violations.length > 200) break;
    }
    if (violations.length > 200) break;
  }
  if (violations.length > 200) break;
}

if (violations.length > 0) {
  console.error("\nTypography lint failed: banned Tailwind typography classes detected.\n");
  for (const v of violations) {
    console.error(`- ${v.file}`);
    console.error(`  Rule: ${v.rule}`);
    console.error(`  Token: ${v.token}`);
    console.error(`  Context: ${v.context}`);
  }
  console.error("\nFix: replace with type-* tokens (see docs/typography.md).\n");
  process.exit(1);
}

console.log("Typography lint passed.");
