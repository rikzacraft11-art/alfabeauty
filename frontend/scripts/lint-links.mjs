import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "src");

const ALLOWLIST = new Set([
  // Link primitives are allowed to wrap next/link.
  path.resolve(process.cwd(), "src/components/ui/AppLink.tsx"),
  path.resolve(process.cwd(), "src/components/ui/ButtonLink.tsx"),
]);

function listFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

function isSourceFile(p) {
  return p.endsWith(".ts") || p.endsWith(".tsx");
}

function rel(p) {
  return path.relative(process.cwd(), p).replaceAll("\\", "/");
}

const importNextLinkRe = /from\s+["']next\/link["']/g;

const files = listFiles(ROOT).filter(isSourceFile);

const violations = [];

for (const file of files) {
  if (ALLOWLIST.has(file)) continue;
  const src = fs.readFileSync(file, "utf8");

  if (importNextLinkRe.test(src)) {
    violations.push({
      file,
      message:
        "Direct 'next/link' usage is not allowed here. Use AppLink or ButtonLink from src/components/ui/.",
    });
  }
}

if (violations.length > 0) {
  console.error("\nLink lint failed. Found disallowed next/link imports:\n");
  for (const v of violations) {
    console.error(`- ${rel(v.file)}\n  ${v.message}`);
  }
  console.error("\nFix: replace next/link with AppLink (for regular links) or ButtonLink (for button-styled links).\n");
  process.exit(1);
}

console.log("Link lint passed.");
