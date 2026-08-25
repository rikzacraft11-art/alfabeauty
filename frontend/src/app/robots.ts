import type { MetadataRoute } from "next";
import { SITE_DOMAIN } from "@/shared/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/order/", "/api/", "/cart", "/checkout", "/my-account"],
    },
    sitemap: `${SITE_DOMAIN}/sitemap.xml`,
  };
}
