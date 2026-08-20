import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_SHORT_NAME } from "@/shared/lib/config";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE_NAME,
        short_name: SITE_SHORT_NAME,
        description:
            "Exclusive importer and distributor of leading Italian and Spanish professional haircare brands in Indonesia.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#a4161a",
        icons: [
            {
                src: "/images/logo/alfa-beauty-mark.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "any",
            },
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon-512-maskable.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
