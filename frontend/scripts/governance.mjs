#!/usr/bin/env node
/**
 * Unified Governance Script (TOGAF Phase 2)
 * 
 * Runs all structural linting (Architecture Compliance) in parallel.
 * Replaces individual calls to lint-*-freeze.mjs.
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CHECKS = [
    "lint-links.mjs",
    "lint-tokens.mjs",
    "lint-typography.mjs",
    "lint-summary.mjs",
];

console.log("\n🛡️  Running Governance Checks (TOGAF Architecture Compliance)...\n");

let failed = false;

async function runCheck(script) {
    return new Promise((resolve) => {
        const start = Date.now();
        const p = spawn("node", [path.join(__dirname, script)], { stdio: "inherit" });

        p.on("close", (code) => {
            const time = Date.now() - start;
            if (code !== 0) {
                console.error(`❌ ${script} FAILED (${time}ms)`);
                failed = true;
            } else {
                console.log(`✅ ${script} PASSED (${time}ms)`);
            }
            resolve();
        });
    });
}

// Run in parallel for speed (DevOps)
Promise.all(CHECKS.map(runCheck)).then(() => {
    console.log("━".repeat(50));
    if (failed) {
        console.error("\n❌ Governance checks failed. Blocking commit.\n");
        process.exit(1);
    } else {
        console.log("\n✅ All governance checks passed. Architecture is sound.\n");
        process.exit(0);
    }
});
