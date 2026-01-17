import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      "img-src 'self' data: blob: https:",
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
          // Legacy/defense-in-depth (optional per spec).
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
