"use client";

import Card from "@/components/ui/Card";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

export default function Pillars() {
  const { locale } = useLocale();
  const copy = t(locale);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {[copy.pillars.products, copy.pillars.education, copy.pillars.partnership].map((x) => (
        <Card key={x.title} className="p-6">
          <h2 className="type-data-strong text-foreground">{x.title}</h2>
          <p className="mt-2 type-body">{x.body}</p>
        </Card>
      ))}
    </section>
  );
}
