import type { Metadata, Viewport } from "next";
import { draftMode, headers } from "next/headers";
import { Montserrat, Lexend_Deca } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_NAME, SITE_SHORT_NAME, SITE_BASE_URL, BRAND_COLORS, CONTACT_EMAIL, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/shared/lib/config";
import { JsonLd } from "@/app/_components";
import { SiteHeader } from "@/features/shell";
import {
  MegaFooter,
  GlobalBreadcrumbs,
  CookieConsent,
} from "@/shared/components/layout";
import {
  LenisProvider,
  LanguageProvider,
  RoleProvider,
  Preloader,
  PageTransition,
} from "@/shared/components/providers";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: BRAND_COLORS.maroon,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const baseUrl = SITE_BASE_URL;

const SITE_DESCRIPTION =
  "Importir eksklusif dan distributor resmi produk perawatan rambut profesional Eropa (Alfaparf Milano, Montibello, Farmavita, Gamma+ Più) serta pusat pelatihan Alfa Beauty Salon & Academy.";
const SITE_OG_TITLE = `${SITE_NAME} — Distributor Resmi Produk Salon & Hair Academy`;
const SITE_OG_DESCRIPTION =
  "Importir eksklusif produk perawatan rambut profesional Eropa (Alfaparf Milano, Montibello, Farmavita, Gamma+ Più) dan pusat pelatihan salon berlisensi resmi di Indonesia.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME} — Distributor Resmi & Salon Academy Indonesia`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "distributor produk salon",
    "importir alfaparf milano indonesia",
    "distributor montibello indonesia",
    "distributor farmavita indonesia",
    "gamma piu indonesia",
    "alfa beauty salon academy",
    "haircare profesional",
    "kursus salon profesional",
    "suplier salon indonesia",
    SITE_NAME,
  ],
  openGraph: {
    title: SITE_OG_TITLE,
    description: SITE_OG_DESCRIPTION,
    url: baseUrl,
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME} — Distributor Resmi & Salon Academy Indonesia` }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_OG_TITLE,
    description: SITE_OG_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: baseUrl,
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

/* ── JSON-LD Structured Data (CITE Framework: Core Entity & WholesaleStore) ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "WholesaleStore"],
      "@id": `${baseUrl}/#organization`,
      name: SITE_NAME,
      legalName: SITE_NAME,
      alternateName: [SITE_SHORT_NAME, "Alfa Beauty Salon & Academy", "Alfa Beauty Cosmetica"],
      url: baseUrl,
      email: CONTACT_EMAIL,
      telephone: `+${WHATSAPP_NUMBER}`,
      foundingDate: "2007",
      description:
        "Importir eksklusif dan distributor resmi produk perawatan rambut profesional Eropa (Alfaparf Milano, Montibello, Farmavita, Gamma+ Più) serta operator Alfa Beauty Salon & Academy di Indonesia.",
      sameAs: [INSTAGRAM_URL],
      areaServed: {
        "@type": "Country",
        name: "Indonesia",
      },
      knowsAbout: [
        "Professional Haircare Distribution",
        "Alfaparf Milano Professional",
        "Montibello Haircare",
        "Farmavita Professional",
        "Gamma+ Più Barber Tools",
        "Alfa Beauty Salon & Academy",
        "Hair Coloring Technical Masterclasses",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: SITE_NAME,
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
      inLanguage: ["id-ID", "en-US"],
    },
  ],
};

/* ── Analytics IDs & Defensive Validation ── */
const rawGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const rawClarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const rawFbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

const TRACKING_ID_RE = /^[a-zA-Z0-9_-]+$/;
const gaId = rawGaId && TRACKING_ID_RE.test(rawGaId) ? rawGaId : null;
const clarityId = rawClarityId && TRACKING_ID_RE.test(rawClarityId) ? rawClarityId : null;
const fbPixelId = rawFbPixelId && TRACKING_ID_RE.test(rawFbPixelId) ? rawFbPixelId : null;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  const nonce = (await headers()).get("x-nonce") ?? "";
  const { isEnabled: isDraftMode } = await draftMode();
  const VisualEditing = isDraftMode
    ? (await import("next-sanity/visual-editing")).VisualEditing
    : null;

  return (
    <html lang="id" dir="ltr">
      <head>
        <JsonLd data={jsonLd} nonce={nonce} />
      </head>
      <body className={`${montserrat.variable} ${lexendDeca.variable}`}>
        <LenisProvider>
          <LanguageProvider>
            <RoleProvider>
              <Preloader>
                {/* Skip to main content — keyboard accessibility */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-foreground focus:px-6 focus:py-3 focus:text-cta focus:font-bold focus:text-white"
                >
                  Skip to content
                </a>
                <SiteHeader />
                <div className="relative z-20 bg-background shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
                  <GlobalBreadcrumbs />
                  <PageTransition>
                    {children}
                  </PageTransition>
                </div>
                <MegaFooter />
                <CookieConsent />
              </Preloader>
            </RoleProvider>
          </LanguageProvider>
        </LenisProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {/* Microsoft Clarity — deferred with CSP nonce */}
        {clarityId && (
          <Script
            id="clarity-script"
            strategy="lazyOnload"
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarityId}");`,
            }}
          />
        )}
        {/* Facebook Pixel — deferred with CSP nonce */}
        {fbPixelId && (
          <Script
            id="fb-pixel-script"
            strategy="lazyOnload"
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixelId}');fbq('track','PageView');`,
            }}
          />
        )}
        {VisualEditing && <VisualEditing />}
      </body>
    </html>
  );
}
