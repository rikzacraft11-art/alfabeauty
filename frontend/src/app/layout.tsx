import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_NAME, SITE_DOMAIN, CONTACT_EMAIL, INSTAGRAM_URL } from "@/shared/lib/config";
import { SiteHeader } from "@/features/shell";
import { MegaFooter } from "@/shared/components/layout/mega-footer";
import { LenisProvider } from "@/shared/components/providers/lenis-provider";
import { LanguageProvider } from "@/shared/components/providers/language-provider";
import { Preloader } from "@/shared/components/providers/preloader";
import { PageTransition } from "@/shared/components/providers/page-transition";
import { CookieConsent } from "@/shared/components/layout/cookie-consent";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#a4161a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: {
    default: `${SITE_NAME} — Professional Haircare Distribution`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Exclusive importer and distributor of leading Italian and Spanish professional haircare brands, serving Indonesia's salon and barber industry for over 18 years.",
  keywords: [
    "professional haircare",
    "salon products",
    "barber products",
    "hair distribution",
    "Indonesia",
    "Alfaparf Milano",
    "Farmavita",
    "Montibello",
    "Gamma+ Professional",
    "salon supplies",
    "barber supplies",
  ],
  openGraph: {
    title: SITE_NAME,
    description:
      "Connecting Global Hair Innovation to Indonesia's Salon and Barber Professionals",
    url: SITE_DOMAIN,
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME} — Professional Haircare Distribution` }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Connecting Global Hair Innovation to Indonesia's Salon and Barber Professionals",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo/alfa-beauty-mark.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
};

/* ── JSON-LD Structured Data ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_DOMAIN,
  email: CONTACT_EMAIL,
  description:
    "Exclusive importer and distributor of leading Italian and Spanish professional haircare brands in Indonesia.",
  sameAs: [INSTAGRAM_URL],
};

/* ── Analytics IDs ── */
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={montserrat.variable}>
        <LenisProvider>
          <LanguageProvider>
            <Preloader>
              {/* Skip to main content — keyboard accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-foreground focus:px-6 focus:py-3 focus:text-[11px] focus:font-bold focus:uppercase focus:tracking-[0.2em] focus:text-white"
              >
                Skip to content
              </a>
              <SiteHeader />
              <div className="relative z-10 bg-background shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <PageTransition>
                  {children}
                </PageTransition>
              </div>
              <MegaFooter />
              <CookieConsent />
            </Preloader>
          </LanguageProvider>
        </LenisProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {/* Microsoft Clarity — deferred to after page load */}
        {clarityId && (
          <Script
            id="clarity-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarityId}");`,
            }}
          />
        )}
        {/* Facebook Pixel — deferred to after page load */}
        {fbPixelId && (
          <Script
            id="fb-pixel-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixelId}');fbq('track','PageView');`,
            }}
          />
        )}
      </body>
    </html>
  );
}
