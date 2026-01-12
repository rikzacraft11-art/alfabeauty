"use client";

import Link from "next/link";

import type { Product } from "@/lib/types";
import { t } from "@/lib/i18n";

import { useLocale } from "@/components/i18n/LocaleProvider";
import WhatsAppLink from "@/components/site/WhatsAppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import Card from "@/components/ui/Card";
import { getButtonClassName } from "@/components/ui/Button";

type Props = {
  product: Product | null;
};

export default function ProductDetailContent({ product }: Props) {
  const { locale } = useLocale();
  const tx = t(locale);
  const base = `/${locale}`;

  if (!product) {
    return (
      <div className="space-y-3">
        <p className="type-body text-zinc-700">{tx.productDetail.notFound.body}</p>
        <Link href={`${base}/products`} className="type-body font-semibold text-zinc-900 underline">
          {tx.productDetail.notFound.back}
        </Link>
      </div>
    );
  }

  const prefill = tx.productDetail.consult.prefill.replace("{{product}}", product.name);

  return (
    <div className="space-y-8">
      <nav className="type-body text-zinc-600">
        <Link href={`${base}/products`} className="hover:underline">
          {tx.nav.products}
        </Link>
        <span className="px-2">/</span>
        <span className="text-zinc-900">{product.name}</span>
      </nav>

      <header className="space-y-2">
        <p className="type-kicker">{product.brand}</p>
        <h1 className="type-h2">{product.name}</h1>
        <p className="type-body max-w-3xl">{product.summary}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="type-h3">{tx.productDetail.sections.keyBenefits}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 type-body">
              {product.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="type-h3">{tx.productDetail.sections.howToUse}</h2>
            <p className="mt-3 type-body whitespace-pre-line">{product.howToUse}</p>
          </Card>
        </div>

        <aside className="space-y-4">
          <div className="border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="type-h3">{tx.productDetail.consult.title}</h2>
            <p className="mt-2 type-body">{tx.productDetail.consult.body}</p>
            <div className="mt-4 flex flex-col gap-3">
              <WhatsAppLink className={getButtonClassName({ variant: "primary", size: "md" })} prefill={prefill}>
                {tx.cta.whatsappConsult}
              </WhatsAppLink>
              <ButtonLink href={`${base}/partnership/become-partner`} variant="secondary">
                {tx.cta.becomePartner}
              </ButtonLink>
            </div>
          </div>

          <Card className="p-6">
            <h2 className="type-h3">{tx.productDetail.sections.recommendedFor}</h2>
            <ul className="mt-3 space-y-1 type-body">
              <li>
                <span className="font-medium text-zinc-900">{tx.productDetail.labels.audience}:</span>{" "}
                {product.audience.join(", ")}
              </li>
              <li>
                <span className="font-medium text-zinc-900">{tx.productDetail.labels.functions}:</span>{" "}
                {product.functions.join(", ")}
              </li>
            </ul>
          </Card>
        </aside>
      </section>
    </div>
  );
}
