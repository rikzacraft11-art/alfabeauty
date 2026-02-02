
const fs = require('fs');
const path = require('path');
const { z } = require('zod');

// Simulating schema imports (since actual schemas are TS and we are running JS script)
// In a real TS-node setup we could import directly. For now, we do a basic check.
// This script exists to verify JSON syntax and file presence in CI.

console.log("🔍 Starting Content Validation (Governance)...");

const DATA_DIR = path.join(process.cwd(), 'src/content/data');
const FILES = ['homepage.json', 'products.json'];

let hasError = false;

FILES.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ MISSING: ${file}`);
        hasError = true;
        return;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        JSON.parse(content);
        console.log(`✅ VALID JSON: ${file}`);
    } catch (err) {
        console.error(`❌ INVALID JSON: ${file}`, err.message);
        hasError = true;
    }
});

if (hasError) {
    console.error("🚨 Content Validation Failed!");
    process.exit(1);
} else {
    console.log("✨ All Content Files Valid.");
    process.exit(0);
}
