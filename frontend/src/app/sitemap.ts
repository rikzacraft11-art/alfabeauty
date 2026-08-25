import type { MetadataRoute } from "next";
import { SITE_DOMAIN } from "@/shared/lib/config";
import { getCatalogProductSlugs } from "@/shared/lib/sanity/catalog";
import { events, articles } from "@/features/education/components/education-data";
import { brands } from "@/features/brands/data/brands";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const productSlugs = await getCatalogProductSlugs();

  /* ── Static routes ── */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_DOMAIN, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_DOMAIN}/shop`, lastModified, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_DOMAIN}/brands`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_DOMAIN}/education`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_DOMAIN}/partnership`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_DOMAIN}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_DOMAIN}/contact`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_DOMAIN}/blog`, lastModified, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_DOMAIN}/faq`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_DOMAIN}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_DOMAIN}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  /* ── Dynamic: brand mini-sites ── */
  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${SITE_DOMAIN}/brands/${b.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  /* ── Dynamic: product pages ── */
  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_DOMAIN}/shop/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  /* ── Dynamic: event pages ── */
  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${SITE_DOMAIN}/education/events/${e.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  /* ── Dynamic: article pages ── */
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_DOMAIN}/education/articles/${a.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...brandRoutes, ...productRoutes, ...eventRoutes, ...articleRoutes];
}
