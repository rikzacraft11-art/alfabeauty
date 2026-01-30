import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { env } from "@/lib/env";
import { fontSans, fontSerif } from "@/lib/fonts"; // Removed fontPrint if unused
import "./globals.css";

// Metadata and Viewport omitted...

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const localeHeader = h.get("x-alfab-locale");
  // Security (Phase 5): Get CSP Nonce for inline scripts
  // Note: We don't strictly use it in <Script> here yet, but it's available for children.
  const nonce = h.get("x-nonce");
  const lang = localeHeader === "id" || localeHeader === "en" ? localeHeader : "en";

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`antialiased ${fontSans.variable} ${fontSerif.variable}`}>
        {/* Skip Link moved to [locale]/layout.tsx for localization */}
        {children}
        <Analytics />
      </body>
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID ?? ""} />
    </html>
  );
}
