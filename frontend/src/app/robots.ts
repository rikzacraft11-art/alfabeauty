import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/shared/lib/config";

const baseUrl = SITE_BASE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/order/", "/api/", "/cart", "/checkout", "/my-account", "/login", "/register"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
