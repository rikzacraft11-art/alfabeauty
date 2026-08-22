import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug, getAllBrandSlugs } from "@/features/brands";
import { BrandDetailContent } from "@/features/brands";
import { products } from "@/features/catalog/data/products";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const brand = getBrandBySlug(slug);
    if (!brand) return {};

    return {
        title: `${brand.fullName} — Official Brand Portfolio | PT Alfa Beauty Cosmetica`,
        description: brand.description,
        alternates: { canonical: `/brands/${slug}` },
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

    return (
        <main className="relative z-10 bg-[#000000]">
            <BrandDetailContent brand={brand} products={brandProducts} />
        </main>
    );
}
