import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";

type LeadApiState = {
  host: string;
  port: number;
  baseUrl: string;
  reuse: boolean;
  pid?: number;
  health?: unknown;
};

type PlaywrightState = {
  leadApi: LeadApiState;
  createdAt: string;
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

function isPlaceholderSecret(v: string | undefined): boolean {
  const s = (v ?? "").trim().toUpperCase();
  return s === "__CHANGE_ME__" || s.includes("CHANGE_ME");
}

async function fetchJSON(url: string, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    let json: unknown = undefined;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      throw new Error(`http_${res.status}: ${typeof json === "string" ? json : JSON.stringify(json)}`);
    }
    return json;
  } finally {
    clearTimeout(t);
  }
}

async function readHealth(baseUrl: string): Promise<unknown> {
  return fetchJSON(`${baseUrl.replace(/\/$/, "")}/health`, 1200);
}

async function waitForPort(host: string, port: number, timeoutMs: number): Promise<void> {
  const startedAt = Date.now();
  for (;;) {
    // Fast path
    if (await isPortOpen(host, port)) return;

    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(`Timed out waiting for ${host}:${port} to be ready`);
    }

    await new Promise((r) => setTimeout(r, 200));
  }
}

async function waitForLeadApiHealthy(
  baseUrl: string,
  timeoutMs: number,
  proc?: { exited: boolean; exitCode?: number | null; signal?: NodeJS.Signals | null },
): Promise<unknown> {
  const startedAt = Date.now();
  // Wait for socket first, then validate /health payload.
  const u = new URL(baseUrl);
  const host = u.hostname;
  const port = Number.parseInt(u.port || "80", 10);

  await waitForPort(host, port, Math.min(timeoutMs, 30_000));

  for (;;) {
    if (proc?.exited) {
      throw new Error(`Lead API process exited early (code=${proc.exitCode ?? "?"} signal=${proc.signal ?? "?"})`);
    }

    try {
      const health = await readHealth(baseUrl);
      // Minimal contract: { status: "ok" }
      if (
        typeof health === "object" &&
        health !== null &&
        "status" in health &&
        (health as { status?: unknown }).status === "ok"
      ) {
        return health;
      }
      throw new Error(`unexpected_health_payload:${JSON.stringify(health)}`);
    } catch {
      // retry
    }

    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(`Timed out waiting for Lead API health at ${baseUrl}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}

export default async function globalSetup() {
  const host = "127.0.0.1";
  const port = Number.parseInt(process.env.LEAD_API_PORT ?? "8082", 10);

  const baseUrl = `http://${host}:${port}`;

  // Fail-fast guard for optional integrations that would otherwise surface as
  // confusing timeouts (e.g., spawned API exits immediately due to config error).
  if (process.env.LEAD_API_AWIN_ENABLED === "true") {
    const token = process.env.LEAD_API_AWIN_TOKEN;
    if (!token || isPlaceholderSecret(token)) {
      throw new Error(
        "LEAD_API_AWIN_ENABLED=true but LEAD_API_AWIN_TOKEN is missing/placeholder. Set a real token or disable the feature for tests.",
      );
    }
  }

  // If something is already listening (developer running API), reuse it only
  // when it passes the /health contract.
  if (await isPortOpen(host, port)) {
    const health = await readHealth(baseUrl).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Port ${port} is in use, but ${baseUrl}/health is not OK. Stop the process using the port, or set LEAD_API_PORT. Details: ${msg}`,
      );
    });

    const state: PlaywrightState = {
      createdAt: new Date().toISOString(),
      leadApi: { host, port, baseUrl, reuse: true, health },
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
    return;
  }

  const repoRoot = path.resolve(__dirname, "..", "..");

  // Start the Go Lead API using memory repositories by default.
  // IMPORTANT: LEAD_API_ADMIN_TOKEN is required by the API even in dev.
  const child = spawn(
    "go",
    ["run", "./cmd/server"],
    {
      cwd: repoRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        APP_ENV: process.env.APP_ENV ?? "development",
        HOST: process.env.HOST ?? "127.0.0.1",
        PORT: String(port),
        LEAD_API_ADMIN_TOKEN: process.env.LEAD_API_ADMIN_TOKEN ?? "dev-admin-token",
        // Keep tests stable (avoid rate limiting a single runner)
        LEAD_API_RATE_LIMIT_RPS: process.env.LEAD_API_RATE_LIMIT_RPS ?? "50",
      },
    },
  );

  if (!child.pid) {
    throw new Error("Failed to start Go Lead API (no pid)");
  }

  const proc = { exited: false as boolean, exitCode: null as number | null, signal: null as NodeJS.Signals | null };
  child.once("exit", (code, signal) => {
    proc.exited = true;
    proc.exitCode = code;
    proc.signal = signal;
  });

  // Wait until the API is healthy.
  const health = await waitForLeadApiHealthy(baseUrl, 30_000, proc);

  const state: PlaywrightState = {
    createdAt: new Date().toISOString(),
    leadApi: { host, port, baseUrl, reuse: false, pid: child.pid, health },
  };
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}
