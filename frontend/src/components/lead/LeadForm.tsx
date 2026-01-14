"use client";

import { useMemo, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { t } from "@/lib/i18n";
import { getCurrentPageUrl, getInitialPageUrl } from "@/lib/telemetry";

import { useLocale } from "@/components/i18n/LocaleProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

type Result =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; id?: string }
  | { kind: "error"; message: string };

export default function LeadForm() {
  const { locale } = useLocale();
  const tx = t(locale);

  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [city, setCity] = useState("");
  const [salonType, setSalonType] = useState<"SALON" | "BARBER" | "BRIDAL" | "UNISEX" | "OTHER" | "">("");
  const [consent, setConsent] = useState(false);

  const [chairCount, setChairCount] = useState<string>("");
  const [specialization, setSpecialization] = useState("");
  const [currentBrandsUsed, setCurrentBrandsUsed] = useState("");
  const [monthlySpendRange, setMonthlySpendRange] = useState("");

  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const [idemKey, setIdemKey] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      businessName.trim().length >= 2 &&
      contactName.trim().length >= 2 &&
      phoneWhatsApp.trim().length >= 8 &&
      city.trim().length >= 2 &&
      salonType !== "" &&
      consent &&
      result.kind !== "submitting"
    );
  }, [businessName, city, consent, contactName, phoneWhatsApp, result.kind, salonType]);

  function nextIdempotencyKey(): string {
    if (idemKey) return idemKey;
    const next =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setIdemKey(next);
    return next;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult({ kind: "submitting" });

    const chairCountValue = chairCount.trim();
    const chairCountInt = chairCountValue ? Number.parseInt(chairCountValue, 10) : undefined;
    const chairCountNormalized =
      Number.isFinite(chairCountInt) && (chairCountInt as number) > 0 ? (chairCountInt as number) : undefined;

    const body = {
      business_name: businessName.trim(),
      contact_name: contactName.trim(),
      email: email.trim() || undefined,
      phone_whatsapp: phoneWhatsApp.trim(),
      city: city.trim(),
      salon_type: salonType,
      consent,
      chair_count: chairCountNormalized,
      specialization: specialization.trim() || undefined,
      current_brands_used: currentBrandsUsed.trim() || undefined,
      monthly_spend_range: monthlySpendRange.trim() || undefined,
      message: message.trim() || undefined,
      page_url_initial: getInitialPageUrl(),
      page_url_current: getCurrentPageUrl(),
      company: company.trim() || undefined,
    };

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": nextIdempotencyKey(),
      },
      body: JSON.stringify(body),
    }).catch(() => null);

    if (!res) {
      trackEvent("lead_submit_error", { reason: "network" });
      setResult({ kind: "error", message: tx.leadForm.errors.network });
      return;
    }

    if (res.status === 202) {
      let id: string | undefined;
      try {
        const json = (await res.json()) as { id?: string };
        id = json.id;
      } catch {
        // honeypot spam path can be 202 with no body.
      }

      trackEvent("lead_submit_success", { id });
      setResult({ kind: "success", id });
      return;
    }

    if (res.status === 429) {
      trackEvent("lead_submit_error", { reason: "rate_limited" });
      setResult({ kind: "error", message: tx.leadForm.errors.rateLimited });
      return;
    }

    let msg: string = tx.leadForm.errors.submitFailed;
    try {
      const json = (await res.json()) as { error?: string };
      if (json.error) msg = json.error;
    } catch {
      // ignore
    }

    trackEvent("lead_submit_error", { reason: "server", status: res.status, message: msg });
    setResult({ kind: "error", message: msg });
  }

  if (result.kind === "success") {
    return (
      <div className="space-y-3">
        <p className="type-h3">{tx.leadForm.success.title}</p>
        <p className="type-body">{tx.leadForm.success.body}</p>
        {result.id ? <p className="type-data">{tx.leadForm.success.ref}: {result.id}</p> : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block type-data-strong" htmlFor="business_name">
          {tx.leadForm.fields.businessName}
        </label>
        <Input
          id="business_name"
          className="mt-1 w-full"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          minLength={2}
          maxLength={120}
        />
      </div>

      <div>
        <label className="block type-data-strong" htmlFor="contact_name">
          {tx.leadForm.fields.contactName}
        </label>
        <Input
          id="contact_name"
          className="mt-1 w-full"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          required
          minLength={2}
          maxLength={80}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block type-data-strong" htmlFor="email">
            {tx.leadForm.fields.emailOptional}
          </label>
          <Input
            id="email"
            type="email"
            className="mt-1 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
          />
        </div>
        <div>
          <label className="block type-data-strong" htmlFor="phone_whatsapp">
            {tx.leadForm.fields.whatsAppNumber}
          </label>
          <Input
            id="phone_whatsapp"
            className="mt-1 w-full"
            value={phoneWhatsApp}
            onChange={(e) => setPhoneWhatsApp(e.target.value)}
            required
            maxLength={20}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block type-data-strong" htmlFor="city">
            {tx.leadForm.fields.city}
          </label>
          <Input
            id="city"
            className="mt-1 w-full"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            minLength={2}
            maxLength={80}
          />
        </div>
        <div>
          <label className="block type-data-strong" htmlFor="salon_type">
            {tx.leadForm.fields.salonType}
          </label>
          <Select
            id="salon_type"
            className="mt-1 w-full"
            value={salonType}
            onChange={(e) => {
              const v = e.target.value;
              if (
                v === "SALON" ||
                v === "BARBER" ||
                v === "BRIDAL" ||
                v === "UNISEX" ||
                v === "OTHER" ||
                v === ""
              ) {
                setSalonType(v);
              }
            }}
            required
          >
            <option value="">{tx.leadForm.fields.salonTypePlaceholder}</option>
            <option value="SALON">{tx.leadForm.salonTypes.salon}</option>
            <option value="BARBER">{tx.leadForm.salonTypes.barber}</option>
            <option value="BRIDAL">{tx.leadForm.salonTypes.bridal}</option>
            <option value="UNISEX">{tx.leadForm.salonTypes.unisex}</option>
            <option value="OTHER">{tx.leadForm.salonTypes.other}</option>
          </Select>
        </div>
      </div>

      <details className="border border-border p-4">
        <summary className="cursor-pointer type-body-strong text-foreground">
          {tx.leadForm.additionalDetails.summary}
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block type-data-strong" htmlFor="chair_count">
              {tx.leadForm.additionalDetails.chairCount}
            </label>
            <Input
              id="chair_count"
              inputMode="numeric"
              className="mt-1 w-full"
              value={chairCount}
              onChange={(e) => setChairCount(e.target.value)}
              placeholder={tx.leadForm.additionalDetails.chairCountPlaceholder}
            />
          </div>

          <div>
            <label className="block type-data-strong" htmlFor="specialization">
              {tx.leadForm.additionalDetails.specialization}
            </label>
            <Input
              id="specialization"
              className="mt-1 w-full"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder={tx.leadForm.additionalDetails.specializationPlaceholder}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block type-data-strong" htmlFor="current_brands_used">
              {tx.leadForm.additionalDetails.currentBrandsUsed}
            </label>
            <Input
              id="current_brands_used"
              className="mt-1 w-full"
              value={currentBrandsUsed}
              onChange={(e) => setCurrentBrandsUsed(e.target.value)}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block type-data-strong" htmlFor="monthly_spend_range">
              {tx.leadForm.additionalDetails.monthlySpendRange}
            </label>
            <Input
              id="monthly_spend_range"
              className="mt-1 w-full"
              value={monthlySpendRange}
              onChange={(e) => setMonthlySpendRange(e.target.value)}
              placeholder={tx.leadForm.additionalDetails.monthlySpendRangePlaceholder}
              maxLength={80}
            />
          </div>
        </div>
      </details>

      {/* Honeypot field: must be hidden from real users (Paket A / Lead API anti-spam) */}
      <div className="hidden" aria-hidden="true">
        <label className="block type-data-strong" htmlFor="company">
          {tx.leadForm.honeypot.companyLabel}
        </label>
        <Input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          className="mt-1 w-full"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          maxLength={200}
        />
      </div>

      <div>
        <label className="block type-data-strong" htmlFor="message">
          {tx.leadForm.fields.messageOptional}
        </label>
        <Textarea
          id="message"
          className="mt-1 w-full"
          rows={5}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 type-data">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>{tx.leadForm.consent}</span>
      </label>

      {result.kind === "error" ? (
        <div className="border border-red-200 bg-red-50 p-3 type-body text-red-800">
          {result.message}
        </div>
      ) : null}

      <Button type="submit" disabled={!canSubmit} className="w-full">
        {result.kind === "submitting" ? tx.leadForm.actions.submitting : tx.leadForm.actions.submit}
      </Button>
    </form>
  );
}
