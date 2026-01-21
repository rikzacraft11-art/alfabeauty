import type { Metadata } from "next";
import { headers } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Alfa Beauty Cosmetica — Professional Beauty Distribution",
    template: "%s — Alfa Beauty Cosmetica",
  },
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
    images: ["/twitter-image"],
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
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
    </html>
  );
}
