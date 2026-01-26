import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Hardening (Phase 16)
  poweredByHeader: false, // Security: Hide Next.js version header
  compress: true, // Performance: Enable Gzip/Brotli
  reactStrictMode: true, // Quality: Catch double-renders

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
      },
    ],
  },

  async headers() {
    // Paket A §15 — Website (HTML) security headers baseline.
    // Note: CSP here is intentionally minimal to avoid breaking Next.js runtime.
    // We only enforce the baseline directives required by the spec.
    const isProd = process.env.NODE_ENV === "production";

    // IMPORTANT: `upgrade-insecure-requests` and HSTS can break local http dev.
    // Enable them only in production.

    // CSP Directives explained:
    // - default-src 'self': fallback for all resource types
    // - script-src: 'unsafe-inline' + 'unsafe-eval' required by Next.js
    // - style-src: 'unsafe-inline' required by Next.js, Google Fonts for external styles
    // - img-src: 'self' for local images, data: for base64, https: for external images
    // - font-src: 'self' for local fonts, Google Fonts CDN
    // - connect-src: 'self' for API calls, https: for external analytics
    // - base-uri: prevent base tag hijacking
    // - object-src: prevent Flash/plugin-based attacks
    // - frame-ancestors: prevent clickjacking
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://cdn.brandfetch.io https://*.supabase.co https://placehold.co",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https:",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      ...(isProd ? ["upgrade-insecure-requests"] : []),
    ].join("; ");

    return [
      {
        // Apply broadly; these headers are safe for both HTML and static assets.
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
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
    disableLogger: true,
    automaticVercelMonitors: true,
  })
  : nextConfigWithAnalyzer;
