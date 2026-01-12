import fs from "node:fs";
import path from "node:path";

const STATE_FILE = path.resolve(__dirname, ".playwright-state.json");

function isDebugEnabled(): boolean {
  const v = (process.env.PLAYWRIGHT_STATE_DEBUG ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function getDebugLogPath(): string {
  const outDir = (process.env.PLAYWRIGHT_OUTPUT_DIR ?? "test-results").trim() || "test-results";
  // Keep this outside the repo root state file to avoid polluting the workspace.
  return path.resolve(process.cwd(), outDir, "playwright-state.log");
}

function safeAppendLog(line: string): void {
  if (!isDebugEnabled()) return;

  const msg = `[playwright-state] ${new Date().toISOString()} ${line}`;
  // Console helps CI logs; file helps local debugging.
  // Avoid throwing from teardown.
  try {
    console.log(msg);
  } catch {
    // ignore
  }

  try {
    const filePath = getDebugLogPath();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.appendFileSync(filePath, msg + "\n", "utf8");
  } catch {
    // ignore
  }
}

function summarizeLeadApiState(leadApi: unknown): string {
  if (!leadApi || typeof leadApi !== "object") return "leadApi=invalid";
  const obj = leadApi as Record<string, unknown>;
  const reuse = obj.reuse;
  const pid = obj.pid;
  const baseUrl = obj.baseUrl;
  return `reuse=${String(reuse)} pid=${typeof pid === "number" ? pid : ""} baseUrl=${typeof baseUrl === "string" ? baseUrl : ""}`.trim();
}

function isProcessAlive(pid: number): boolean {
  try {
    // Signal 0 checks existence without killing.
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export default async function globalTeardown() {
  if (!fs.existsSync(STATE_FILE)) return;

  let state: unknown;
  try {
    state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    safeAppendLog("state read: invalid JSON (skipping teardown)");
    return;
  } finally {
    // Best effort cleanup so stale pids don't accumulate.
    try {
      fs.unlinkSync(STATE_FILE);
    } catch {
      // ignore
    }
  }

  if (!state || typeof state !== "object") {
    safeAppendLog("state read: empty/invalid object (skipping teardown)");
    return;
  }
  const leadApi = (state as { leadApi?: unknown }).leadApi;
  if (!leadApi || typeof leadApi !== "object") {
    safeAppendLog("state read: missing leadApi (skipping teardown)");
    return;
  }

  safeAppendLog(`loaded state: ${summarizeLeadApiState(leadApi)}`);
  const reuse = (leadApi as { reuse?: boolean }).reuse;
  if (reuse) {
    safeAppendLog("leadApi reuse=true (no kill)");
    return;
  }
  const pid = (leadApi as { pid?: number }).pid;
  if (!pid) {
    safeAppendLog("leadApi reuse=false but pid missing (no kill)");
    return;
  }

  if (!isProcessAlive(pid)) {
    safeAppendLog(`pid ${pid} not alive (nothing to kill)`);
    return;
  }
  try {
    process.kill(pid);
    safeAppendLog(`killed pid ${pid}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    safeAppendLog(`failed to kill pid ${pid}: ${msg}`);
  }
}
