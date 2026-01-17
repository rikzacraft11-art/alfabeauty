"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import LeadForm from "@/components/lead/LeadForm";
import Card from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { IconCheck, IconShield } from "@/components/ui/icons";

export default function BecomePartnerContent() {
  const { locale } = useLocale();
  const copy = t(locale);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="space-y-6 text-center max-w-3xl mx-auto">
        <p className="type-kicker">{copy.nav.partnership}</p>
        <h1 className="type-h1">{copy.becomePartner.title}</h1>
        <p className="type-body text-muted-strong">{copy.becomePartner.lede}</p>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
        {/* Left Column - Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* What Happens Next */}
          <Card className="p-6 lg:p-8 space-y-4" aria-labelledby="partner-next-steps-title">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <IconShield className="h-5 w-5" />
              </span>
              <h2 id="partner-next-steps-title" className="type-h3">
                {copy.becomePartner.next.title}
              </h2>
            </div>
            <ol className="space-y-4">
              {copy.becomePartner.next.items.map((item, idx) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center bg-subtle border border-border type-data-strong shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="type-body text-muted-strong">{item}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* Trust Indicators */}
          <div className="space-y-4 p-6 bg-subtle border border-border" aria-labelledby="partner-trust-title">
            <h3 id="partner-trust-title" className="type-data-strong text-foreground">
              {copy.becomePartner.whyTitle}
            </h3>
            <ul className="space-y-3" role="list">
              {copy.becomePartner.whyBenefits.map((point: string) => (
                <li key={point} className="flex items-center gap-2 type-body text-muted-strong">
                  <IconCheck className="h-4 w-4 text-foreground shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy Note */}
          <p className="type-data text-muted">
            {copy.becomePartner.privacyNote}
          </p>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-3">
          <div className="border border-border bg-panel p-6 lg:p-8 sticky top-24" aria-labelledby="partner-form-title">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 id="partner-form-title" className="type-h3">
                  {copy.becomePartner.formTitle}
                </h2>
                <p className="type-body text-muted-strong">
                  {copy.becomePartner.formLede}
                </p>
              </div>
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
