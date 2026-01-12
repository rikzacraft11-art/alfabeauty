import { defineConfig, devices } from "@playwright/test";

const htmlReportDir = process.env.PLAYWRIGHT_HTML_REPORT_DIR ?? "playwright-report";
const outputDir = process.env.PLAYWRIGHT_OUTPUT_DIR ?? "test-results";
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "true" ? true : !process.env.CI;
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "true";

// Paket A quality gate: Playwright smoke tests for
// - WhatsApp CTA always works
// - Become Partner lead form does not break
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: htmlReportDir }]]
    : [["html", { open: "on-failure", outputFolder: htmlReportDir }]],
  outputDir,
  use: {
    // Prefer localhost on Windows to avoid IPv4/IPv6 binding mismatches.
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  globalSetup: require.resolve("./e2e/global-setup"),
  globalTeardown: require.resolve("./e2e/global-teardown"),
  webServer: skipWebServer
    ? undefined
    : {
        // Use a production-like server for deterministic middleware/redirect behavior.
        command: "npm run build && npm run start",
        // Root (/) is intentionally non-routable in this app (locale-prefixed URLs only).
        // Use a canonical locale path so Playwright can detect server readiness.
        url: "http://localhost:3000/en",
        reuseExistingServer,
        timeout: 120_000,
        env: {
          // Website runtime config for e2e.
          LEAD_API_BASE_URL: process.env.LEAD_API_BASE_URL ?? "http://localhost:8082",
          NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

          // Ensure WhatsApp CTA produces a wa.me link in UI smoke tests.
          NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890",
          NEXT_PUBLIC_WHATSAPP_PREFILL:
            process.env.NEXT_PUBLIC_WHATSAPP_PREFILL ?? "Hello Alfa Beauty, I would like to consult.",
          NEXT_PUBLIC_FALLBACK_EMAIL: process.env.NEXT_PUBLIC_FALLBACK_EMAIL ?? "hello@example.com",
        },
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
