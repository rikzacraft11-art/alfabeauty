import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleDetailContent } from "@/features/education/components/article-detail-content";
import {
    getAllArticleIds,
    getArticleById,
} from "@/features/education/components/education-data";
import { SITE_BASE_URL, SITE_NAME, SITE_SHORT_NAME } from "@/shared/lib/config";
import { JsonLd, createBreadcrumbList } from "@/app/_components";

const baseUrl = SITE_BASE_URL;

/* Static generation for all article pages */
export function generateStaticParams(): { id: string }[] {
    return getAllArticleIds().map((id) => ({ id }));
}

type Props = {
    params: Promise<{ id: string }>;
};

/* Dynamic metadata */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const article = getArticleById(id);
    if (!article) return { title: "Article Not Found" };

    return {
        title: article.title,
        description: article.excerpt,
        alternates: { canonical: `${baseUrl}/education/articles/${id}` },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `${baseUrl}/education/articles/${id}`,
            type: "article",
            images: [
                {
                    url: `${baseUrl}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.excerpt,
            images: [`${baseUrl}/opengraph-image`],
        },
    };
}

export default async function ArticleDetailPage({ params }: Props): Promise<React.JSX.Element> {
    const { id } = await params;
    const article = getArticleById(id);

    if (!article) notFound();

    const articleJsonLd = {
        "@type": "Article",
        "@id": `${baseUrl}/education/articles/${id}#article`,
        url: `${baseUrl}/education/articles/${id}`,
        inLanguage: "id-ID",
        headline: article.title,
        description: article.excerpt,
        datePublished: article.date,
        author: {
            "@type": "Organization",
            name: `${SITE_SHORT_NAME} Editorial`,
        },
        publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: baseUrl,
        },
    };

    const breadcrumbJsonLd = createBreadcrumbList([
        { name: "Home", item: baseUrl },
        { name: "Education", item: `${baseUrl}/education` },
        { name: "Articles", item: `${baseUrl}/education/articles` },
        { name: article.title, item: `${baseUrl}/education/articles/${id}` },
    ]);

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [articleJsonLd, breadcrumbJsonLd],
    };

    return (
        <main id="main-content" className="relative z-10 bg-background">
            <JsonLd data={structuredData} />
            <ArticleDetailContent article={article} />
        </main>
    );
}
