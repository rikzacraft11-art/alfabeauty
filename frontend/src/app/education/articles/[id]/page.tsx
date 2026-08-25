import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleDetailContent } from "@/features/education/components/article-detail-content";
import {
    getAllArticleIds,
    getArticleById,
} from "@/features/education/components/education-data";
import { SITE_DOMAIN, SITE_NAME } from "@/shared/lib/config";

/* Static generation for all article pages */
export function generateStaticParams(): { id: string }[] {
    return getAllArticleIds().map((id) => ({ id }));
}

/* Dynamic metadata */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const article = getArticleById(id);
    if (!article) return { title: "Article Not Found" };

    return {
        title: article.title,
        description: article.excerpt,
        alternates: { canonical: `/education/articles/${id}` },
    };
}

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
    const { id } = await params;
    const article = getArticleById(id);

    if (!article) notFound();

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        author: {
            "@type": "Organization",
            name: `${SITE_NAME} Editorial`,
        },
        publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_DOMAIN,
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_DOMAIN,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Education",
                item: `${SITE_DOMAIN}/education`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: `${SITE_DOMAIN}/education/articles/${id}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ArticleDetailContent article={article} />
        </>
    );
}
