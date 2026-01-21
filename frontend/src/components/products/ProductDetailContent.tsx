"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { t } from "@/lib/i18n";

import { useLocale } from "@/components/i18n/LocaleProvider";
import AppLink from "@/components/ui/AppLink";
import Card from "@/components/ui/Card";
import { IconChevronRight, IconCheck, IconSparkle } from "@/components/ui/icons";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProductCTA from "@/components/products/ProductCTA";

type Props = {
  product: Product | null;
};

export default function ProductDetailContent({ product }: Props) {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;

  if (!product) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-6 text-center animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-subtle flex items-center justify-center">
          <IconSparkle className="h-8 w-8 text-muted" />
        </div>
        <div className="space-y-2">
          <h2 className="type-h3">{tx.productDetail.notFound.body}</h2>
          <p className="type-body text-muted max-w-md">
            {locale === "id"
              ? "Produk yang Anda cari mungkin telah dipindahkan atau tidak tersedia lagi."
              : "The product you're looking for may have been moved or is no longer available."
            }
          </p>
        </div>
        <AppLink
          href={`${base}/products`}
          className="inline-flex items-center gap-2 type-body-strong text-foreground hover:underline"
        >
          ← {tx.productDetail.notFound.back}
        </AppLink>
      </div>
    );
  }



  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1 type-data text-muted">
        <AppLink
          href={`${base}/products`}
          className="hover:text-foreground transition-colors"
        >
          {tx.nav.products}
        </AppLink>
        <IconChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      {/* Product Header */}
      <header className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square bg-subtle border border-border overflow-hidden group">
          <Image
            src="/images/products/product-placeholder.jpg"
            alt={`${product.brand} ${product.name}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <p className="type-kicker">{product.brand}</p>
            <h1 className="type-h1">{product.name}</h1>
            <p className="type-body text-muted-strong max-w-lg">{product.summary}</p>
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-2">
            {product.functions.slice(0, 3).map((fn) => (
              <span key={fn} className="inline-flex items-center px-3 py-1 bg-subtle border border-border type-data">
                {fn}
              </span>
            ))}
          </div>

          {/* CTA Section */}
          <ProductCTA productName={product.name} variant="inline" />
        </div>
      </header>

      {/* Product Details Grid */}
      <ScrollReveal>
        <section className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Benefits Card */}
          <Card className="p-6 lg:p-8 space-y-4 lg:col-span-2">
            <h2 className="type-h3 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <IconCheck className="h-4 w-4" />
              </span>
              {tx.productDetail.sections.keyBenefits}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 type-body">
                  <IconCheck className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recommended For Card */}
          <Card className="p-6 lg:p-8 space-y-4 bg-subtle">
            <h2 className="type-h3">{tx.productDetail.sections.recommendedFor}</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="type-data-strong text-foreground uppercase">
                  {tx.productDetail.labels.audience}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.audience.map((aud) => (
                    <span key={aud} className="inline-flex px-2.5 py-1 bg-background border border-border type-data">
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="type-data-strong text-foreground uppercase">
                  {tx.productDetail.labels.functions}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.functions.map((fn) => (
                    <span key={fn} className="inline-flex px-2.5 py-1 bg-background border border-border type-data">
                      {fn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* How To Use Card */}
          <Card className="p-6 lg:p-8 space-y-4 lg:col-span-3">
            <h2 className="type-h3">{tx.productDetail.sections.howToUse}</h2>
            <div className="prose prose-neutral max-w-none">
              <p className="type-body whitespace-pre-line">{product.howToUse}</p>
            </div>
          </Card>
        </section>
      </ScrollReveal>

      {/* Bottom CTA */}
      <ScrollReveal>
        <ProductCTA productName={product.name} variant="block" />
      </ScrollReveal>
    </div>
  );
}
