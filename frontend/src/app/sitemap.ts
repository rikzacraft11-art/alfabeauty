import type { MetadataRoute } from "next";

import { allProductSlugs } from "@/lib/catalog";
import { listArticles, listEvents } from "@/lib/education";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const locales: Array<"en" | "id"> = ["en", "id"];
  const staticRoutes = ["", "/products", "/education", "/partnership", "/partnership/become-partner", "/about", "/contact", "/privacy", "/terms"];

  const now = new Date();

  return [
    ...locales.flatMap((locale) =>
      staticRoutes.map((path) => {
        const p = path === "" ? `/${locale}` : `/${locale}${path}`;
        return {
          url: `${siteUrl}${p}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: path === "" ? 1 : 0.7,
        };
      }),
    ),
    ...locales.flatMap((locale) =>
      allProductSlugs().map((slug) => ({
        url: `${siteUrl}/${locale}/products/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ),
    ...locales.flatMap((locale) =>
      listEvents(locale).map((e) => ({
        url: `${siteUrl}/${locale}/education/events/${e.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ),
    ...locales.flatMap((locale) =>
      listArticles(locale).map((a) => ({
        url: `${siteUrl}/${locale}/education/articles/${a.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ),
  ];
}
