import { promises as fs } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const srcDir = path.join(projectRoot, "src");

const TEXT_EXTS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".md",
  ".mdx",
  ".css",
  ".json",
]);

const ASSET_EXTS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
  ".mp4",
  ".webm",
  ".ogg",
  ".mp3",
  ".wav",
  ".pdf",
]);

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // Skip Next build output or caches if someone runs from repo root.
      if (ent.name === ".next" || ent.name === "node_modules") continue;
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

function toPosix(p) {
  return p.replaceAll(path.sep, "/");
}

function relToPublic(fileAbs) {
  const rel = path.relative(publicDir, fileAbs);
  return toPosix(rel);
}

function assetUrl(relPublicPath) {
  return "/" + relPublicPath;
}

function isTextFile(fileAbs) {
  return TEXT_EXTS.has(path.extname(fileAbs).toLowerCase());
}

function isAssetFile(fileAbs) {
  return ASSET_EXTS.has(path.extname(fileAbs).toLowerCase());
}

function shouldIgnorePublicPath(relPublicPath) {
  // Never flag these; they’re special by convention.
  const lower = relPublicPath.toLowerCase();
  if (lower === "favicon.ico") return true;
  if (lower === "robots.txt") return true;
  if (lower === "manifest.json") return true;
  if (lower === "sitemap.xml") return true;
  if (lower === "sw.js") return true;
  return false;
}

async function main() {
  const [srcFiles, publicFiles] = await Promise.all([walk(srcDir), walk(publicDir)]);

  const textFiles = srcFiles.filter(isTextFile);
  const assetFiles = publicFiles.filter((p) => isAssetFile(p) && !shouldIgnorePublicPath(relToPublic(p)));

  const corpusPieces = await Promise.all(
    textFiles.map(async (file) => {
      const buf = await fs.readFile(file);
      // Best-effort; ignore encoding issues.
      return buf.toString("utf8");
    })
  );
  const corpus = corpusPieces.join("\n\n/*---FILE---*/\n\n");

  const results = [];
  let used = 0;

  for (const assetAbs of assetFiles) {
    const rel = relToPublic(assetAbs);
    const url = assetUrl(rel);

    // Common ways assets appear in code:
    // - "/images/foo.png"
    // - '/images/foo.png'
    // - url(/images/foo.png)
    // - url("/images/foo.png")
    const needles = [
      url,
      url.replaceAll(" ", "%20"),
      rel,
      rel.replaceAll(" ", "%20"),
    ];

    const found = needles.some((n) => corpus.includes(n));
    const stat = await fs.stat(assetAbs);

    results.push({ rel, url, found, size: stat.size });
    if (found) used++;
  }

  const unused = results.filter((r) => !r.found).sort((a, b) => b.size - a.size);
  const usedList = results.filter((r) => r.found).sort((a, b) => b.size - a.size);

  const fmtBytes = (n) => {
    if (n < 1024) return `${n} B`;
    const kb = n / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  console.log("\n🧹 Public Asset Usage Audit (heuristic)\n");
  console.log(`Project: ${projectRoot}`);
  console.log(`Scanned text files: ${textFiles.length}`);
  console.log(`Scanned assets: ${results.length}`);
  console.log(`Used (string-referenced): ${used}`);
  console.log(`Potentially unused: ${unused.length}`);

  const topN = 30;
  if (unused.length) {
    console.log(`\nLargest potentially-unused assets (top ${Math.min(topN, unused.length)}):`);
    for (const r of unused.slice(0, topN)) {
      console.log(`- ${r.rel}  (${fmtBytes(r.size)})`);
    }
  }

  const usedTop = 15;
  if (usedList.length) {
    console.log(`\nLargest used assets (top ${Math.min(usedTop, usedList.length)}):`);
    for (const r of usedList.slice(0, usedTop)) {
      console.log(`- ${r.rel}  (${fmtBytes(r.size)})`);
    }
  }

  console.log("\nNotes:");
  console.log("- This is conservative and string-based; CMS-driven assets may show as unused.");
  console.log("- Do NOT delete automatically; verify via routes/content first.");
}

main().catch((err) => {
  console.error("\n❌ Asset audit failed:\n", err);
  process.exit(1);
});
