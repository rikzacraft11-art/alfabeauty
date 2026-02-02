import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { env } from "@/lib/env";
import { fontSans, fontSerif } from "@/lib/fonts";
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
  const cspNonce = h.get("x-nonce") || undefined;
  const lang = localeHeader === "id" || localeHeader === "en" ? localeHeader : "en";

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`antialiased ${fontSans.variable} ${fontSerif.variable}`}>
        {/* Skip Link moved to [locale]/layout.tsx for localization */}
        {children}
        <Analytics />
        {env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script
              nonce={cspNonce}
              src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script nonce={cspNonce} id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
