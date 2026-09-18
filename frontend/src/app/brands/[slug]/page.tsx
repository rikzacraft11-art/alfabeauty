import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug, getAllBrandSlugs } from "@/features/brands";
import { BrandDetailContent } from "@/features/brands";
import { products } from "@/features/catalog/data/products";
import { SITE_BASE_URL, SITE_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const brand = getBrandBySlug(slug);
    if (!brand) return { title: "Brand Not Found" };

    const title = `${brand.fullName} — Official Brand Portfolio | ${SITE_NAME}`;
    const imageUrl = brand.heroImage || brand.logo?.primary;
    const fullImageUrl = imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`) : undefined;

    return {
        title,
        description: brand.description,
        alternates: { canonical: `${baseUrl}/brands/${slug}` },
        openGraph: {
            title,
            description: brand.description,
            url: `${baseUrl}/brands/${slug}`,
            type: "website",
            ...(fullImageUrl ? { images: [{ url: fullImageUrl, alt: brand.fullName }] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: brand.description,
            ...(fullImageUrl ? { images: [fullImageUrl] } : {}),
        },
    };
}

export function generateStaticParams(): { slug: string }[] {
    return getAllBrandSlugs().map((slug) => ({ slug }));
}

export default async function BrandDetailPage({ params }: Props): Promise<React.JSX.Element> {
    const { slug } = await params;
    const brand = getBrandBySlug(slug);
    if (!brand) notFound();

    // Fetch all products matching this brand
    const brandProducts = products.filter((p) => {
        const pBrand = p.brand.toLowerCase();
        const bName = brand.name.toLowerCase();
        const bFullName = brand.fullName.toLowerCase();
        return pBrand.includes(bName) || pBrand === bFullName || p.id.startsWith(brand.slug);
    });

    const imageUrl = brand.heroImage || brand.logo?.primary;
    const fullImageUrl = imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`) : undefined;

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Brand",
                name: brand.fullName,
                description: brand.description,
                url: `${baseUrl}/brands/${slug}`,
                ...(fullImageUrl ? { logo: fullImageUrl } : {}),
            },
            createBreadcrumbList([
                { name: "Home", item: baseUrl },
                { name: "Brands", item: `${baseUrl}/brands` },
                { name: brand.fullName, item: `${baseUrl}/brands/${slug}` },
            ]),
        ],
    };

    return (
        <main id="main-content" className="relative z-10 bg-black">
            <JsonLd data={structuredData} />
            <BrandDetailContent brand={brand} products={brandProducts} />
        </main>
    );
}
