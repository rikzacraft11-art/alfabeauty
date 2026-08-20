import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    ChevronRight,
    Clock,
    User,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { WhatsAppCTA } from "@/shared/components/ui/whatsapp-cta";
import {
    type Article,
    articles,
} from "@/features/education/components/education-data";
import { formatDate } from "@/shared/lib/utils";
import { FadeIn } from "@/shared/components/motion/fade-in";

/* ─────────────────────────────────────────────────────────────────────
 * COMPONENT: ArticleDetailContent — Clean reading layout
 *
 *   §1. Breadcrumbs
 *   §2. Article header (title, meta, category)
 *   §3. Article body (prose)
 *   §4. Tags
 *   §5. WhatsApp CTA
 *   §6. Related articles
 *
 * Polish: scroll reveals, refined typography, consistent tokens
 * ───────────────────────────────────────────────────────────────────── */

export function ArticleDetailContent({
    article,
}: {
    article: Article;
}): React.JSX.Element {
    /* Get related articles (same category, exclude current) */
    const relatedArticles = articles
        .filter(
            (a) =>
                a.id !== article.id &&
                (a.category === article.category ||
                    a.tags.some((t) => article.tags.includes(t)))
        )
        .slice(0, 2);

    return (
        <main id="main-content" className="relative z-10 min-h-screen bg-background pt-[var(--header-height)]">
            {/* ─── Breadcrumbs ─── */}
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-1.5 py-6 text-[12px] text-text-muted"
                >
                    <Link
                        href="/"
                        className="transition-colors hover:text-foreground"
                    >
                        Home
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link
                        href="/education"
                        className="transition-colors hover:text-foreground"
                    >
                        Education
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-semibold text-foreground truncate max-w-[200px]">
                        {article.title}
                    </span>
                </nav>
            </div>

            <Separator className="bg-border-warm/40" />

            {/* ─── Article Content ─── */}
            <article className="mx-auto max-w-3xl px-6 py-14 sm:px-8 lg:py-20">
                {/* Category & read time */}
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                        {article.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                    </span>
                </div>

                {/* Title */}
                <h1 className="mt-5 heading-display text-foreground">
                    {article.title}
                </h1>

                {/* Author & date */}
                <div className="mt-7 flex items-center gap-4 border-y border-border-warm/40 py-4">
                    <div className="flex h-10 w-10 items-center justify-center bg-surface">
                        <User className="h-5 w-5 text-text-muted/40" />
                    </div>
                    <div>
                        <p className="text-[13px] font-semibold text-foreground">
                            {article.author}
                        </p>
                        <p className="text-[12px] text-text-muted">
                            {formatDate(article.date)}
                        </p>
                    </div>
                </div>

                {/* Excerpt */}
                <p className="mt-10 text-[15px] font-medium leading-[1.85] text-charcoal italic lg:text-[16px]">
                    {article.excerpt}
                </p>

                {/* Body prose */}
                <div className="mt-10 text-[14px] leading-[1.9] text-charcoal whitespace-pre-line lg:text-[15px]">
                    {article.content}
                </div>

                {/* Tags */}
                <div className="mt-12 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="outline"
                            className="border-border-warm/60 text-[10px] uppercase tracking-[0.15em] text-text-muted"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>

                <Separator className="my-12 bg-border-warm/40" />

                {/* WhatsApp CTA */}
                <FadeIn className="bg-surface p-8 text-center lg:p-10">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                        Questions about this topic?
                    </p>
                    <p className="mx-auto mt-3 max-w-md text-[13px] leading-[1.85] text-text-muted">
                        Our technical team is ready to help you implement
                        what you&apos;ve learned. Get in touch for
                        personalized advice.
                    </p>
                    <WhatsAppCTA
                        location="article_detail"
                        message={`Hi, saya ingin bertanya tentang artikel "${article.title}".`}
                        className="mt-6 inline-flex items-center gap-2.5 bg-foreground px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-foreground/90"
                    >
                        Consult via WhatsApp
                    </WhatsAppCTA>
                </FadeIn>
            </article>

            <Separator className="bg-border-warm/40" />

            {/* ─── Related Articles ─── */}
            {relatedArticles.length > 0 && (
                <section className="bg-surface py-20 lg:py-28">
                <FadeIn>
                    <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
                        <p className="eyebrow">
                            Related
                        </p>
                        <h2 className="mt-3 heading-section text-foreground">
                            More Insights
                        </h2>

                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {relatedArticles.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/education/articles/${rel.id}`}
                                    className="group block border border-border-warm/60 bg-background transition-all duration-300 hover:shadow-sm"
                                >
                                    <div className="flex aspect-[16/10] items-center justify-center bg-surface-elevated">
                                        <BookOpen className="h-8 w-8 text-text-muted/20" />
                                    </div>

                                    <div className="p-7">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                                {rel.category}
                                            </span>
                                            <span className="text-[11px] text-text-muted">
                                                {rel.readTime}
                                            </span>
                                        </div>

                                        <h3 className="mt-3 text-[14px] font-bold leading-snug text-foreground transition-colors group-hover:text-foreground/70 line-clamp-2">
                                            {rel.title}
                                        </h3>

                                        <p className="mt-2 text-[13px] leading-[1.75] text-text-muted line-clamp-2">
                                            {rel.excerpt}
                                        </p>

                                        <div className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
                                            Read Article
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </FadeIn>
                </section>
            )}
        </main>
    );
}


