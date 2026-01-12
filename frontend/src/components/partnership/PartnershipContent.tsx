"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import ButtonLink from "@/components/ui/ButtonLink";
import Card from "@/components/ui/Card";
import { t } from "@/lib/i18n";

export default function PartnershipContent() {
  const { locale } = useLocale();
  const copy = t(locale);
  const base = `/${locale}`;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="type-h2">{copy.partnership.title}</h1>
        <p className="type-body text-zinc-700">{copy.partnership.lede}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[copy.partnership.cards.curated, copy.partnership.cards.education, copy.partnership.cards.b2b].map(
          (x) => (
            <Card key={x.title} className="p-6">
              <h2 className="type-data font-semibold text-zinc-900">{x.title}</h2>
              <p className="mt-2 type-body text-zinc-700">{x.body}</p>
            </Card>
          ),
        )}
      </section>

      <div className="border border-zinc-200 bg-zinc-50 p-6">
        <h2 className="type-data font-semibold text-zinc-900">{copy.partnership.readyBlock.title}</h2>
        <p className="mt-2 type-body text-zinc-700">{copy.partnership.readyBlock.body}</p>
        <div className="mt-4">
          <ButtonLink href={`${base}/partnership/become-partner`}>{copy.cta.becomePartner}</ButtonLink>
        </div>
      </div>
    </div>
  );
}
