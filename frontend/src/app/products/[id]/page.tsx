import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailContent, getProductById, getAllProductIds } from "@/features/catalog";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = getProductById(id);
    if (!product) return {};
    return {
        title: `${product.name} — ${product.brand}`,
        description: product.description,
        alternates: { canonical: `/products/${id}` },
    };
}

export function generateStaticParams(): { id: string }[] {
    return getAllProductIds().map((id) => ({ id }));
}

export default async function ProductDetailPage({ params }: Props): Promise<React.JSX.Element> {
    const { id } = await params;
    const product = getProductById(id);
    if (!product) notFound();
    return (
        <>
            <ProductDetailContent product={product} />
        </>
    );
}
