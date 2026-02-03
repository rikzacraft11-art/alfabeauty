import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const projectRoot = process.cwd();
const disableStandalone = process.env.NEXT_DISABLE_STANDALONE === "true";
const forceStandalone = process.env.NEXT_FORCE_STANDALONE === "true";
const isWindows = process.platform === "win32";
const enableStandalone = !disableStandalone && (!isWindows || forceStandalone);

const nextConfig: NextConfig = {
  // Hardening (Phase 16)
  poweredByHeader: false, // Security: Hide Next.js version header
  compress: true, // Performance: Enable Gzip/Brotli
  reactStrictMode: true, // Quality: Catch double-renders
  // Deployment: Generate standalone folder for Docker.
  // On Windows local builds, Next output tracing may fail copying `node:inspector` externals.
  output: enableStandalone ? "standalone" : undefined,
  // Prevent Next from inferring the wrong root when multiple lockfiles exist on disk.
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async headers() {
    // Paket A §15 — Website (HTML) security headers baseline.
    // Note: CSP here is intentionally minimal to avoid breaking Next.js runtime.
    // We only enforce the baseline directives required by the spec.
    // CSP Directives explained:
    // - Formerly handled here, now handled by Middleware (Phase 5)
    // - default-src 'self'
    // - script-src 'nonce-...' (Dynamic)
    const isProd = process.env.NODE_ENV === "production";

    // const csp = ... (Removed to avoid unused var)

    return [
      {
        // Apply broadly; these headers are safe for both HTML and static assets.
        source: "/:path*",
        headers: [
          // CSP handled by Middleware (Phase 5 Nonce-based security)
          // { key: "Content-Security-Policy", value: csp },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          ...(isProd
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
            : []),
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "X-Frame-Options", value: "DENY" }, // Clickjacking protection (SEC-06)
        ],
      },
    ];
  },
};

import withBundleAnalyzer from "@next/bundle-analyzer";

// Wrap the base config with Bundle Analyzer
const nextConfigWithAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);

// Conditional Sentry Configuration (Phase 10 CSI)
// Only enable Sentry build plugin if we have an Auth Token (CI/Prod).
// This prevents local build crashes when you don't have the token.
const isSentryEnabled = !!process.env.SENTRY_AUTH_TOKEN;

export default isSentryEnabled
  ? withSentryConfig(nextConfigWithAnalyzer, {
    org: "alfa-beauty-cosmetica",
    project: "frontend",
    silent: !process.env.CI,
    tunnelRoute: "/monitoring",
    disableLogger: !process.env.CI, // Log in CI, silent locally
    automaticVercelMonitors: true,
  })
  : nextConfigWithAnalyzer;
