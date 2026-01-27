import type { Product } from "@/lib/types";

type Props = {
    product: Product;
};

/**
 * Product JSON-LD structured data.
 * Provides rich snippets for search engines (Name, Description, Brand, Image).
 */
export default function ProductSchema({ product }: Props) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const productUrl = `${siteUrl.replace(/\/$/, "")}/products/${product.slug}`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: [
            // Fallback to placeholder if no specific images (Phase 20 simplification)
            `${siteUrl.replace(/\/$/, "")}/images/products/product-placeholder.jpg`
        ],
        description: product.summary,
        brand: {
            "@type": "Brand",
            name: product.brand,
        },
        url: productUrl,
        // Add dummy offer to make it valid for Merchant Center (optional but good practice)
        offers: {
            "@type": "Offer",
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            url: productUrl,
            // Price is hidden/call-to-action based, so we omit specific price or use 0 with "Call for price" intent implication
            price: "0",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
