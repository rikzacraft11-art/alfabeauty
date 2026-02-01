import fs from "node:fs";
import net from "node:net";
import path from "node:path";

/**
 * Playwright Global Setup for Paket A
 * 
 * Lead API is implemented as Next.js API routes (/api/leads).
 * Next.js dev server is started by Playwright's webServer config.
 */

type PlaywrightState = {
  createdAt: string;
  baseUrl: string;
};

const STATE_FILE = path.resolve(__dirname, ".playwright-state.json");

function isPortOpen(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

export default async function globalSetup() {
  const host = "127.0.0.1";
  const port = Number.parseInt(process.env.PORT ?? "3001", 10);
  const baseUrl = `http://${host}:${port}`;

  // Wait for Next.js to be ready
  const maxWait = 30_000;
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    if (await isPortOpen(host, port)) {
      break;
    }
    await new Promise(r => setTimeout(r, 500));
  }

  if (!(await isPortOpen(host, port))) {
    console.warn(`[e2e] Next.js not detected on ${baseUrl}. Tests may fail.`);
  }

  // Store state for tests
  const state: PlaywrightState = {
    createdAt: new Date().toISOString(),
    baseUrl,
  };
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");

  console.log(`[e2e] Global setup complete. Lead API at ${baseUrl}/api/leads`);
}
