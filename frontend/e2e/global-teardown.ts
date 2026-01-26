import fs from "node:fs";
import path from "node:path";

/**
 * Playwright Global Teardown for Paket A
 * 
 * Next.js dev server is managed by Playwright's webServer config.
 * We just clean up the state file.
 */

const STATE_FILE = path.resolve(__dirname, ".playwright-state.json");

export default async function globalTeardown() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
    }
  } catch {
    // Ignore cleanup errors
  }

  console.log("[e2e] Global teardown complete.");
}
