import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SITE_BASE_URL, SITE_NAME, SITE_SHORT_NAME } from "@/shared/lib/config";
import { PreFooterCTA } from "@/features/home";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

const PAGE_DESCRIPTION =
  `Read the latest articles about professional haircare trends, techniques, and industry news from ${SITE_SHORT_NAME}.`;

export const metadata: Metadata = {
  title: "Blog — Industry Insights & News",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${baseUrl}/blog` },
};

export default function BlogPage(): React.JSX.Element {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${baseUrl}/blog#blog`,
        name: `${SITE_SHORT_NAME} Blog — Industry Insights`,
        description: PAGE_DESCRIPTION,
        url: `${baseUrl}/blog`,
        inLanguage: "id-ID",
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: baseUrl,
        },
      },
      createBreadcrumbList([
        { name: "Home", item: baseUrl },
        { name: "Blog", item: `${baseUrl}/blog` },
      ]),
    ],
  };

  return (
    <main id="main-content" className="relative z-10 bg-background pt-[var(--header-height)]">
      <JsonLd data={structuredData} />
      <section className="container mx-auto px-4 py-20 min-h-[50dvh]">
        <h1 className="text-h1 font-bold tracking-tight text-foreground mb-4">
          Blog & Industry Insights
        </h1>
        <p className="text-body text-muted-foreground max-w-2xl">
          Industry insights, professional styling guides, and brand updates are being curated by the {SITE_SHORT_NAME} Editorial team. Check back soon for exclusive masterclass notes.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="bg-foreground px-6 text-cta font-bold text-white hover:bg-foreground/90 transition-colors">
            <Link href="/education/articles">
              <BookOpen className="mr-2 h-4 w-4" />
              Explore Academy Articles
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-border-warm px-6 text-cta font-bold transition-colors">
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Catalog
            </Link>
          </Button>
        </div>
      </section>
      <PreFooterCTA />
    </main>
  );
}
