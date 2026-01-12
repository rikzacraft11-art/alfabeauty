"use client";

import { useMemo, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { getCurrentPageUrl, getInitialPageUrl } from "@/lib/telemetry";

type Result =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; id?: string }
  | { kind: "error"; message: string };

export default function LeadForm() {
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
      setResult({ kind: "error", message: "Network error. Please try again." });
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
      setResult({ kind: "error", message: "Too many requests. Please try again in a moment." });
      return;
    }

    let msg = "Submission failed. Please try again.";
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
        <p className="text-lg font-semibold">Thank you — we received your details.</p>
        <p className="text-sm text-zinc-700">
          Our team will follow up. You can also message us on WhatsApp for faster consultation.
        </p>
        {result.id ? <p className="text-xs text-zinc-600">Reference: {result.id}</p> : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold" htmlFor="business_name">
          Business name
        </label>
        <input
          id="business_name"
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          minLength={2}
          maxLength={120}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold" htmlFor="contact_name">
          Contact name
        </label>
        <input
          id="contact_name"
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          required
          minLength={2}
          maxLength={80}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold" htmlFor="email">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold" htmlFor="phone_whatsapp">
            WhatsApp number
          </label>
          <input
            id="phone_whatsapp"
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            value={phoneWhatsApp}
            onChange={(e) => setPhoneWhatsApp(e.target.value)}
            required
            maxLength={20}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold" htmlFor="city">
            City
          </label>
          <input
            id="city"
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            minLength={2}
            maxLength={80}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold" htmlFor="salon_type">
            Salon type
          </label>
          <select
            id="salon_type"
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm"
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
            <option value="">Select…</option>
            <option value="SALON">Salon</option>
            <option value="BARBER">Barbershop</option>
            <option value="BRIDAL">Bridal</option>
            <option value="UNISEX">Unisex</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <details className="rounded-2xl border border-zinc-200 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-zinc-900">
          Additional details (optional)
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold" htmlFor="chair_count">
              Chair count
            </label>
            <input
              id="chair_count"
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
              value={chairCount}
              onChange={(e) => setChairCount(e.target.value)}
              placeholder="e.g. 6"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold" htmlFor="specialization">
              Specialization
            </label>
            <input
              id="specialization"
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. coloring, keratin"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold" htmlFor="current_brands_used">
              Current brands used
            </label>
            <input
              id="current_brands_used"
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
              value={currentBrandsUsed}
              onChange={(e) => setCurrentBrandsUsed(e.target.value)}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold" htmlFor="monthly_spend_range">
              Monthly spend range
            </label>
            <input
              id="monthly_spend_range"
              className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
              value={monthlySpendRange}
              onChange={(e) => setMonthlySpendRange(e.target.value)}
              placeholder="optional"
              maxLength={80}
            />
          </div>
        </div>
      </details>

      {/* Honeypot field: must be hidden from real users (Paket A / Lead API anti-spam) */}
      <div className="hidden" aria-hidden="true">
        <label className="block text-sm font-semibold" htmlFor="company">
          Company
        </label>
        <input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold" htmlFor="message">
          Message (optional)
        </label>
        <textarea
          id="message"
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          rows={5}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 text-xs text-zinc-700">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>
          I consent to be contacted for partnership follow-up.
        </span>
      </label>

      {result.kind === "error" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {result.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {result.kind === "submitting" ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
