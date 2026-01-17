"use client";

import WhatsAppLink from "@/components/site/WhatsAppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getButtonClassName } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { IconWhatsApp, IconMail, IconLocation, IconClock } from "@/components/ui/icons";

export default function ContactContent({ fallbackEmail }: { fallbackEmail?: string }) {
  const { locale } = useLocale();
  const copy = t(locale);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="space-y-6 text-center max-w-3xl mx-auto">
        <p className="type-kicker">{copy.nav.contact}</p>
        <h1 className="type-h1">{copy.contact.title}</h1>
        <p className="type-body text-muted-strong">{copy.contact.body}</p>
      </header>

      {/* Contact Methods Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* WhatsApp Card */}
        <Card className="p-8 space-y-4 hover:border-muted-strong transition-colors group">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
            <IconWhatsApp className="h-7 w-7" />
          </span>
          <div className="space-y-2">
            <h2 className="type-h3">{copy.contact.whatsapp.title}</h2>
            <p className="type-body text-muted-strong">
              {copy.contact.whatsapp.body}
            </p>
          </div>
          <WhatsAppLink className={getButtonClassName({ variant: "primary", size: "md" }) + " w-full"}>
            {copy.cta.whatsappConsult}
          </WhatsAppLink>
        </Card>

        {/* Email Card */}
        {fallbackEmail && (
          <Card className="p-8 space-y-4 hover:border-muted-strong transition-colors group">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <IconMail className="h-7 w-7" />
            </span>
            <div className="space-y-2">
              <h2 className="type-h3">{copy.contact.email}</h2>
              <p className="type-body text-muted-strong">
                {copy.contact.emailCard.body}
              </p>
            </div>
            <a
              className={getButtonClassName({ variant: "secondary", size: "md" }) + " w-full"}
              href={`mailto:${fallbackEmail}`}
            >
              {fallbackEmail}
            </a>
          </Card>
        )}

        {/* Location Card */}
        <Card className="p-8 space-y-4 hover:border-muted-strong transition-colors group">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
            <IconLocation className="h-7 w-7" />
          </span>
          <div className="space-y-2">
            <h2 className="type-h3">{copy.contact.location.title}</h2>
            <p className="type-body text-muted-strong">
              {copy.contact.location.city}
            </p>
            <p className="type-data text-muted">
              PT Alfa Beauty Cosmetica
            </p>
          </div>
        </Card>
      </section>

      {/* Business Hours */}
      <section className="border-t border-b border-border py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <IconClock className="h-5 w-5 text-muted" />
            <span className="type-data-strong">{copy.contact.hours.title}</span>
          </div>
          <div className="flex items-center gap-6 type-body text-muted-strong">
            <span>{copy.contact.hours.weekdays}</span>
            <span className="hidden sm:inline">|</span>
            <span>{copy.contact.hours.saturday}</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ui-section-dark p-8 lg:p-12 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="type-h2">{copy.contact.cta.title}</h2>
          <p className="type-body opacity-80">
            {copy.contact.cta.body}
          </p>
          <WhatsAppLink className={getButtonClassName({ variant: "inverted", size: "lg" })}>
            {copy.contact.cta.button}
          </WhatsAppLink>
        </div>
      </section>
    </div>
  );
}
