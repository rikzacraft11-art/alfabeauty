import StaggerReveal from "@/components/ui/StaggerReveal";
import AppLink from "@/components/ui/AppLink";
import { t } from "@/lib/i18n";
import { listEvents, listArticles, calculateReadTime } from "@/lib/education";

/**
 * Education Page
 * Design V2: Events + Articles with editorial layout
 * Migrated from (v2) to production route.
 */
export default async function EducationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = t(locale as "en" | "id");

  // Fetch dynamic content
  const events = listEvents(locale as "en" | "id");
  const articles = listArticles(locale as "en" | "id").map((article) => ({
    ...article,
    readTime: calculateReadTime(article.body),
  }));

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <StaggerReveal delay={0.1} className="mb-16">
          <p className="type-kicker text-muted mb-4">{dict.education.hub.kicker}</p>
          <h1 className="type-h1 text-foreground mb-4">
            {dict.education.hub.heroTitle}
          </h1>
          <p className="type-body text-foreground-muted max-w-2xl">
            {dict.education.hub.heroBody}
          </p>
        </StaggerReveal>

        {/* Stats Bar (Reintegrated from EducationHub) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-border py-8 mb-16 animate-fade-in">
          <div className="text-center space-y-1">
            <p className="type-h2 font-mono">{events.length}</p>
            <p className="type-data text-muted">{dict.education.hub.sections.events}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="type-h2 font-mono">{articles.length}</p>
            <p className="type-data text-muted">{dict.education.hub.sections.articles}</p>
          </div>
          <div className="text-center space-y-1">
            {/* Hardcoded stats for now as they are static in V1 */}
            <p className="type-h2 font-mono">B2B</p>
            <p className="type-data text-muted">{dict.education.hub.stats?.focus || "Industry Focus"}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="type-h2 font-mono">ID/EN</p>
            <p className="type-data text-muted">{dict.education.hub.stats?.languages || "Languages"}</p>
          </div>
        </div>

        {/* Events Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="type-h2 text-foreground">{dict.education.hub.sections.events}</h2>
            <AppLink href={`/${locale}/education/events`} className="type-nav text-muted hover:text-foreground transition-colors">
              {dict.education.hub.actions.viewAll}
            </AppLink>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <AppLink
                key={event.slug}
                href={`/${locale}/education/events/${event.slug}`}
                className="group p-6 rounded-2xl bg-panel transition-all duration-[var(--transition-elegant)] hover:scale-[1.02] block"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                {/* Event Type Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-background type-data text-muted mb-4">
                  {dict.education.hub.types[event.type.toLowerCase() as keyof typeof dict.education.hub.types] || event.type}
                </div>

                {/* Event Title */}
                <h3 className="type-h3 text-foreground group-hover:text-foreground mb-3">
                  {event.title}
                </h3>

                {/* Meta */}
                <div className="space-y-2 type-data text-muted">
                  <p>🏷️ {event.brand}</p>
                  <p>📅 {new Date(event.date).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  <p>📍 {event.city}</p>
                </div>
              </AppLink>
            ))}
          </div>
        </section>

        {/* Articles Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="type-h2 text-foreground">{dict.education.hub.sections.articles}</h2>
            <AppLink href={`/${locale}/education/articles`} className="type-nav text-muted hover:text-foreground transition-colors">
              {dict.education.hub.actions.viewAll}
            </AppLink>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {articles.slice(0, 2).map((article) => (
              <AppLink
                key={article.slug}
                href={`/${locale}/education/articles/${article.slug}`}
                className="group"
              >
                {/* Thumbnail */}
                <div
                  className="aspect-video rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 mb-4 overflow-hidden"
                  style={{ boxShadow: "var(--shadow-elegant)" }}
                >
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-[var(--transition-elegant)]">
                    <span className="type-ui-sm text-muted">{dict.education.hub.imageAlt}</span>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 type-data text-muted mb-2">
                  <span>{new Date(article.date).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { month: "short", day: "numeric" })}</span>
                  <span>•</span>
                  <span>{article.readTime} {dict.education.hub.labels.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="type-h3 text-foreground group-hover:text-foreground-muted transition-colors mb-2">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="type-body text-muted line-clamp-2">
                  {article.excerpt}
                </p>
              </AppLink>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
