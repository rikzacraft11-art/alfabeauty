import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailContent } from "@/features/catalog/components/product-detail-content";
import {
  getCatalogProductBySlug,
  getCatalogProductSlugs,
} from "@/shared/lib/sanity/catalog";
import {
  getCommerceCatalogData,
  getCommerceProductBySlug,
} from "@/shared/lib/commerce/offers";
import { SITE_DOMAIN, SITE_NAME } from "@/shared/lib/config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) notFound();
  return {
    title: product.seo?.title || `${product.name} — ${product.brand}`,
    description: product.seo?.description || product.description,
    alternates: { canonical: `/shop/${slug}` },
    robots: product.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: product.seo?.image
      ? { images: [{ url: product.seo.image, alt: product.name }] }
      : undefined,
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getCatalogProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductDetailPage({
  params,
}: Props): Promise<React.JSX.Element> {
  const { slug } = await params;
  const [product, catalog] = await Promise.all([
    getCommerceProductBySlug(slug),
    getCommerceCatalogData(),
  ]);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.commerceProductId || product.id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: product.startingPriceIdr
      ? {
          "@type": "Offer",
          priceCurrency: "IDR",
          price: product.startingPriceIdr,
          availability: product.purchasable
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${SITE_DOMAIN}/shop/${slug}`,
          seller: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_DOMAIN,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${SITE_DOMAIN}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_DOMAIN}/shop/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailContent
        product={product}
        catalogProducts={catalog.products}
        catalogPath="/shop"
        offers={product.offers}
      />
    </>
  );
}
