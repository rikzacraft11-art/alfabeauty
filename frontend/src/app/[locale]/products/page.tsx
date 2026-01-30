import StaggerReveal from "@/components/ui/StaggerReveal";
import { t } from "@/lib/i18n";
import ProductFilters from "@/components/products/ProductFilters";

/**
 * Products Page
 * Design V2: Bento Grid layout with floating filter bar
 * Migrated from (v2) to production route.
 */
export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = t(locale as "en" | "id");

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <StaggerReveal delay={0.1} className="mb-12">
          <p className="type-kicker text-muted mb-4">{dict.products.kicker}</p>
          <h1 className="type-h1 text-foreground mb-4">
            {dict.products.heroTitle}
          </h1>
          <p className="type-body text-foreground-muted max-w-2xl">
            {dict.products.heroBody}
          </p>
        </StaggerReveal>

        {/* Dynamic Product Grid with Filters */}
        <ProductFilters />
      </div>
    </main>
  );
}
