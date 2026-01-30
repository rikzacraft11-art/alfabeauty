import type { EducationArticle } from "@/lib/types";

type Props = {
    article: EducationArticle;
};

/**
 * Article JSON-LD structured data.
 * Provides rich snippets for search engines (Headline, Date, Author).
 */
export default function ArticleSchema({ article }: Props) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const articleUrl = `${siteUrl.replace(/\/$/, "")}/education/articles/${article.slug}`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        image: [
            // Fallback placeholder
            `${siteUrl.replace(/\/$/, "")}/images/education/article-placeholder.jpg`
        ],
        datePublished: article.date,
        dateModified: article.date,
        author: {
            "@type": "Organization",
            name: "Alfa Beauty Education Team",
            url: siteUrl
        },
        publisher: {
            "@type": "Organization",
            name: "PT Alfa Beauty Cosmetica",
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl.replace(/\/$/, "")}/logo.png`
            }
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
