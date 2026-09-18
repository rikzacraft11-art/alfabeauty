import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/shared/lib/config";
import { getCatalogProductSlugs } from "@/shared/lib/sanity/catalog";
import { getAllProductIds } from "@/features/catalog";
import { events, articles } from "@/features/education/components/education-data";
import { brands } from "@/features/brands/data/brands";
import { logError } from "@/shared/lib/logger";

const baseUrl = SITE_BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Resilient catalog slug retrieval with graceful fallback
  let productSlugs: string[] = [];
  try {
    productSlugs = await getCatalogProductSlugs();
  } catch (error) {
    logError("sitemap", "Failed to fetch catalog product slugs", error);
  }

  /* ── Static routes ── */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/shop`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/products`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/brands`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/education`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/education/articles`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/education/events`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/partnership`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  /* ── Dynamic: brand mini-sites ── */
  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${baseUrl}/brands/${b.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  /* ── Dynamic: commerce shop product pages ── */
  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/shop/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  /* ── Dynamic: static catalog product pages ── */
  const catalogProductRoutes: MetadataRoute.Sitemap = getAllProductIds().map((id) => ({
    url: `${baseUrl}/products/${id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  /* ── Dynamic: event pages ── */
  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${baseUrl}/education/events/${e.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  /* ── Dynamic: article pages ── */
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/education/articles/${a.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...brandRoutes,
    ...productRoutes,
    ...catalogProductRoutes,
    ...eventRoutes,
    ...articleRoutes,
  ];
}
