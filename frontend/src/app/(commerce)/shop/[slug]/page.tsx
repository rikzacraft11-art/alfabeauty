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
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) notFound();
  const title = product.seo?.title || `${product.name} — ${product.brand}`;
  const description = product.seo?.description || product.description;
  const rawImage = product.seo?.image || product.image;
  const fullImageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${baseUrl}${rawImage}`
    : undefined;
  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/shop/${slug}` },
    robots: product.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/shop/${slug}`,
      type: "website",
      ...(fullImageUrl ? { images: [{ url: fullImageUrl, alt: product.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(fullImageUrl ? { images: [fullImageUrl] } : {}),
    },
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

  const fullProductImage = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${baseUrl}${product.image}`
    : undefined;

  const productJsonLd = {
    "@type": "Product",
    "@id": `${baseUrl}/shop/${slug}#product`,
    url: `${baseUrl}/shop/${slug}`,
    inLanguage: "id-ID",
    name: product.name,
    description: product.description,
    image: fullProductImage,
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
          url: `${baseUrl}/shop/${slug}`,
          seller: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        }
      : undefined,
  };

  const breadcrumbJsonLd = createBreadcrumbList([
    { name: "Home", item: baseUrl },
    { name: "Shop", item: `${baseUrl}/shop` },
    { name: product.name, item: `${baseUrl}/shop/${slug}` },
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [productJsonLd, breadcrumbJsonLd],
  };

  return (
    <main id="main-content" className="relative z-10 bg-background">
      <JsonLd data={structuredData} />
      <ProductDetailContent
        product={product}
        catalogProducts={catalog.products}
        catalogPath="/shop"
        offers={product.offers}
      />
    </main>
  );
}
