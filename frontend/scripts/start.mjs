import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const appRoot = join(scriptDir, "..");
process.chdir(appRoot);

const port = process.env.PORT ?? "3000";
const standaloneServer = join(process.cwd(), ".next", "standalone", "server.js");

const env = {
  ...process.env,
  PORT: port,
};

let command;
let args;

if (existsSync(standaloneServer)) {
  command = process.execPath;
  args = [standaloneServer];
} else {
  // Fall back to Next's built-in start (non-standalone builds, e.g. Windows local builds or e2e)
  if (process.platform === "win32") {
    command = process.env.ComSpec ?? "cmd.exe";
    args = ["/d", "/s", "/c", "npx", "next", "start", "-p", port];
  } else {
    command = "npx";
    args = ["next", "start", "-p", port];
  }
}

const child = spawn(command, args, {
  stdio: "inherit",
  env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
