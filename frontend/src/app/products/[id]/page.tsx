import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailContent, getProductById, getAllProductIds } from "@/features/catalog";

import { SITE_BASE_URL } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = getProductById(id);
    if (!product) return { title: "Product Not Found" };
    const title = `${product.name} — ${product.brand}`;
    const imageUrl = product.image ? (product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`) : undefined;
    return {
        title,
        description: product.description,
        alternates: { canonical: `${baseUrl}/products/${id}` },
        openGraph: {
            title,
            description: product.description,
            url: `${baseUrl}/products/${id}`,
            type: "website",
            ...(imageUrl ? { images: [{ url: imageUrl, alt: product.name }] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: product.description,
            ...(imageUrl ? { images: [imageUrl] } : {}),
        },
    };
}

export function generateStaticParams(): { id: string }[] {
    return getAllProductIds().map((id) => ({ id }));
}

export default async function ProductDetailPage({ params }: Props): Promise<React.JSX.Element> {
    const { id } = await params;
    const product = getProductById(id);
    if (!product) notFound();

    const fullImageUrl = product.image ? (product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`) : undefined;

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "@id": `${baseUrl}/products/${id}#product`,
                name: product.name,
                description: product.description,
                image: fullImageUrl,
                sku: product.id,
                inLanguage: "id-ID",
                brand: {
                    "@type": "Brand",
                    name: product.brand,
                },
                url: `${baseUrl}/products/${id}`,
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Products", item: `${baseUrl}/products` },
                { name: product.name, item: `${baseUrl}/products/${id}` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={structuredData} />
            <ProductDetailContent product={product} />
        </main>
    );
}
