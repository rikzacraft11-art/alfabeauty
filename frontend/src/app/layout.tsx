import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import OfflineIndicator from "@/components/site/OfflineIndicator";
import ServiceWorkerRegister from "@/components/site/ServiceWorkerRegister";
import { env } from "@/lib/env";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Alfa Beauty Cosmetica — Professional Beauty Distribution",
    template: "%s — Alfa Beauty Cosmetica",
  },
  alternates: {
    canonical: "./",
  },
  manifest: "/manifest.json",
  description:
    "Professional beauty distribution for salons and barbershops in Indonesia — products, education, and technical support.",
  openGraph: {
    type: "website",
    title: "Alfa Beauty Cosmetica",
    description:
      "Professional beauty distribution for salons and barbershops in Indonesia — products, education, and technical support.",
    url: "/",
    siteName: "Alfa Beauty Cosmetica",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Alfa Beauty Cosmetica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alfa Beauty Cosmetica — Professional Beauty Distribution",
    description:
      "Professional beauty distribution for salons and barbershops in Indonesia — products, education, and technical support.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const localeHeader = h.get("x-alfab-locale");
  const lang = localeHeader === "id" || localeHeader === "en" ? localeHeader : "en";

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="antialiased">
        {/* Offline Indicator (ITIL/UX) */}
        <OfflineIndicator />
        {/* Skip Link moved to [locale]/layout.tsx for localization */}
        {children}
        <ServiceWorkerRegister />
      </body>
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID ?? ""} />
    </html>
  );
}
