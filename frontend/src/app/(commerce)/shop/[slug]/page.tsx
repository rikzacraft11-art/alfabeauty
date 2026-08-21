import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailContent } from "@/features/brands/components/product-detail-content";
import {
  getCatalogProductBySlug,
  getCatalogProductSlugs,
} from "@/shared/lib/sanity/catalog";
import {
  getCommerceCatalogData,
  getCommerceProductBySlug,
} from "@/shared/lib/commerce/offers";

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

  return (
    <ProductDetailContent
      product={product}
      catalogProducts={catalog.products}
      catalogPath="/shop"
      offers={product.offers}
    />
  );
}
