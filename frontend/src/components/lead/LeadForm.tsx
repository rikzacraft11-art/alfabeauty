"use client";

import { t } from "@/lib/i18n";
import { useLeadForm, type SalonType } from "./useLeadForm";

import { useLocale } from "@/components/i18n/LocaleProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import { getButtonClassName } from "@/components/ui/Button";
import {
  IconCheckCircle as IconCheck,
  IconAlertCircle,
  IconChevronDown,
} from "@/components/ui/icons";

/**
 * LeadForm Component
 * 
 * Renders the partner lead capture form with:
 * - Field validation and inline errors
 * - Success/error state handling
 * - Idempotent API submission
 * - Honeypot spam protection
 * 
 * Uses useLeadForm hook for state management (Single Responsibility Principle)
 */
export default function LeadForm() {
  const { locale } = useLocale();
  const tx = t(locale);

  // Initialize form hook with localized messages
  const {
    values,
    result,
    fieldErrors,
    canSubmit,
    setField,
    markTouched,
    handleSubmit,
    shouldShowError,
  } = useLeadForm(
    // Validation messages
    {
      businessNameRequired: tx.leadForm.validation.businessNameRequired,
      contactNameRequired: tx.leadForm.validation.contactNameRequired,
      phoneRequired: tx.leadForm.validation.phoneRequired,
      cityRequired: tx.leadForm.validation.cityRequired,
      salonTypeRequired: tx.leadForm.validation.salonTypeRequired,
      consentRequired: tx.leadForm.validation.consentRequired,
    },
    // Error messages
    {
      network: tx.leadForm.errors.network,
      rateLimited: tx.leadForm.errors.rateLimited,
      submitFailed: tx.leadForm.errors.submitFailed,
    }
  );

  // Success state - more engaging with clear next steps
  if (result.kind === "success") {
    return (
      <div className="ui-fade-in space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
          <IconCheck className="h-8 w-8 text-success" />
        </div>
        <div className="space-y-2">
          <h3 className="type-h3">{tx.leadForm.success.title}</h3>
          <p className="type-body max-w-md mx-auto">{tx.leadForm.success.body}</p>
        </div>
        {result.id ? (
          <p className="type-data text-muted-strong">{tx.leadForm.success.ref}: {result.id}</p>
        ) : null}
        <div className="pt-2">
          <WhatsAppLink
            className={getButtonClassName({ variant: "primary", size: "md" })}
            prefill={tx.leadForm.success.whatsappPrefill}
          >
            {tx.leadForm.success.whatsappCta}
          </WhatsAppLink>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Business Name - Required */}
      <div className="space-y-1.5">
        <label className="block type-data-strong" htmlFor="business_name">
          {tx.leadForm.fields.businessName} <span className="text-error">*</span>
        </label>
        <Input
          id="business_name"
          className="w-full"
          value={values.businessName}
          onChange={(e) => setField("businessName", e.target.value)}
          onBlur={() => markTouched("businessName")}
          error={!!shouldShowError("businessName")}
          aria-describedby={shouldShowError("businessName") ? "business_name_error" : undefined}
          autoComplete="organization"
          required
          minLength={2}
          maxLength={120}
        />
        {shouldShowError("businessName") && (
          <p id="business_name_error" className="type-data text-error flex items-center gap-1.5">
            <IconAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {fieldErrors.businessName}
          </p>
        )}
      </div>

      {/* Contact Name - Required */}
      <div className="space-y-1.5">
        <label className="block type-data-strong" htmlFor="contact_name">
          {tx.leadForm.fields.contactName} <span className="text-error">*</span>
        </label>
        <Input
          id="contact_name"
          className="w-full"
          value={values.contactName}
          onChange={(e) => setField("contactName", e.target.value)}
          onBlur={() => markTouched("contactName")}
          error={!!shouldShowError("contactName")}
          aria-describedby={shouldShowError("contactName") ? "contact_name_error" : undefined}
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
        />
        {shouldShowError("contactName") && (
          <p id="contact_name_error" className="type-data text-error flex items-center gap-1.5">
            <IconAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {fieldErrors.contactName}
          </p>
        )}
      </div>

      {/* Email (Optional) + WhatsApp (Required) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block type-data-strong" htmlFor="email">
            {tx.leadForm.fields.emailOptional}
          </label>
          <Input
            id="email"
            type="email"
            className="w-full"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            autoComplete="email"
            maxLength={254}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block type-data-strong" htmlFor="phone_whatsapp">
            {tx.leadForm.fields.whatsAppNumber} <span className="text-error">*</span>
          </label>
          <Input
            id="phone_whatsapp"
            className="w-full"
            value={values.phoneWhatsApp}
            onChange={(e) => setField("phoneWhatsApp", e.target.value)}
            onBlur={() => markTouched("phoneWhatsApp")}
            error={!!shouldShowError("phoneWhatsApp")}
            aria-describedby={shouldShowError("phoneWhatsApp") ? "phone_whatsapp_error" : undefined}
            autoComplete="tel"
            required
            maxLength={20}
          />
          {shouldShowError("phoneWhatsApp") && (
            <p id="phone_whatsapp_error" className="type-data text-error flex items-center gap-1.5">
              <IconAlertCircle className="h-3.5 w-3.5 shrink-0" />
              {fieldErrors.phoneWhatsApp}
            </p>
          )}
        </div>
      </div>

      {/* City + Salon Type - Both Required */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block type-data-strong" htmlFor="city">
            {tx.leadForm.fields.city} <span className="text-error">*</span>
          </label>
          <Input
            id="city"
            className="w-full"
            value={values.city}
            onChange={(e) => setField("city", e.target.value)}
            onBlur={() => markTouched("city")}
            error={!!shouldShowError("city")}
            aria-describedby={shouldShowError("city") ? "city_error" : undefined}
            autoComplete="address-level2"
            required
            minLength={2}
            maxLength={80}
          />
          {shouldShowError("city") && (
            <p id="city_error" className="type-data text-error flex items-center gap-1.5">
              <IconAlertCircle className="h-3.5 w-3.5 shrink-0" />
              {fieldErrors.city}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="block type-data-strong" htmlFor="salon_type">
            {tx.leadForm.fields.salonType} <span className="text-error">*</span>
          </label>
          <Select
            id="salon_type"
            className="w-full"
            value={values.salonType}
            onChange={(e) => {
              const v = e.target.value as SalonType;
              setField("salonType", v);
              markTouched("salonType");
            }}
            onBlur={() => markTouched("salonType")}
            error={!!shouldShowError("salonType")}
            aria-describedby={shouldShowError("salonType") ? "salon_type_error" : undefined}
            required
          >
            <option value="">{tx.leadForm.fields.salonTypePlaceholder}</option>
            <option value="SALON">{tx.leadForm.salonTypes.salon}</option>
            <option value="BARBER">{tx.leadForm.salonTypes.barber}</option>
            <option value="BRIDAL">{tx.leadForm.salonTypes.bridal}</option>
            <option value="UNISEX">{tx.leadForm.salonTypes.unisex}</option>
            <option value="OTHER">{tx.leadForm.salonTypes.other}</option>
          </Select>
          {shouldShowError("salonType") && (
            <p id="salon_type_error" className="type-data text-error flex items-center gap-1.5">
              <IconAlertCircle className="h-3.5 w-3.5 shrink-0" />
              {fieldErrors.salonType}
            </p>
          )}
        </div>
      </div>

      {/* Additional Details - Collapsible */}
      <details className="group border border-border bg-panel transition-colors hover:border-muted-strong">
        <summary className="cursor-pointer px-5 py-4 type-body-strong text-foreground select-none flex items-center justify-between">
          <span>{tx.leadForm.additionalDetails.summary}</span>
          <IconChevronDown
            className="h-4 w-4 text-muted transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="px-5 pb-5 space-y-4 border-t border-border">
          <div className="pt-4 space-y-1.5">
            <label className="block type-data-strong" htmlFor="chair_count">
              {tx.leadForm.additionalDetails.chairCount}
            </label>
            <Input
              id="chair_count"
              inputMode="numeric"
              className="w-full"
              value={values.chairCount}
              onChange={(e) => setField("chairCount", e.target.value)}
              placeholder={tx.leadForm.additionalDetails.chairCountPlaceholder}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block type-data-strong" htmlFor="specialization">
              {tx.leadForm.additionalDetails.specialization}
            </label>
            <Input
              id="specialization"
              className="w-full"
              value={values.specialization}
              onChange={(e) => setField("specialization", e.target.value)}
              placeholder={tx.leadForm.additionalDetails.specializationPlaceholder}
              maxLength={200}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block type-data-strong" htmlFor="current_brands_used">
              {tx.leadForm.additionalDetails.currentBrandsUsed}
            </label>
            <Input
              id="current_brands_used"
              className="w-full"
              value={values.currentBrandsUsed}
              onChange={(e) => setField("currentBrandsUsed", e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block type-data-strong" htmlFor="monthly_spend_range">
              {tx.leadForm.additionalDetails.monthlySpendRange}
            </label>
            <Input
              id="monthly_spend_range"
              className="w-full"
              value={values.monthlySpendRange}
              onChange={(e) => setField("monthlySpendRange", e.target.value)}
              placeholder={tx.leadForm.additionalDetails.monthlySpendRangePlaceholder}
              maxLength={80}
            />
          </div>
        </div>
      </details>

      {/* Honeypot field: hidden from real users (Lead API anti-spam) */}
      <div className="hidden" aria-hidden="true">
        <label className="block type-data-strong" htmlFor="company">
          {tx.leadForm.honeypot.companyLabel}
        </label>
        <Input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          className="w-full"
          value={values.company}
          onChange={(e) => setField("company", e.target.value)}
          maxLength={200}
        />
      </div>

      {/* Message - Optional */}
      <div className="space-y-1.5">
        <label className="block type-data-strong" htmlFor="message">
          {tx.leadForm.fields.messageOptional}
        </label>
        <Textarea
          id="message"
          className="w-full"
          rows={4}
          maxLength={2000}
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
        />
      </div>

      {/* Consent Checkbox with validation */}
      <div className="space-y-1.5">
        <label className="flex items-start gap-3 type-data cursor-pointer group">
          <input
            type="checkbox"
            className={`mt-0.5 h-4 w-4 accent-foreground transition-colors ${shouldShowError("consent") ? "outline outline-2 outline-error" : ""
              }`}
            checked={values.consent}
            onChange={(e) => {
              setField("consent", e.target.checked);
              markTouched("consent");
            }}
            required
          />
          <span className="group-hover:text-foreground transition-colors">{tx.leadForm.consent}</span>
        </label>
        {shouldShowError("consent") && (
          <p className="type-data text-error flex items-center gap-1.5 pl-7">
            <IconAlertCircle className="h-3.5 w-3.5 shrink-0" />
            {fieldErrors.consent}
          </p>
        )}
      </div>

      {/* Error Alert */}
      {
        result.kind === "error" && (
          <div role="alert" className="ui-alert-error flex items-start gap-3">
            <IconAlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{result.message}</span>
          </div>
        )
      }

      {/* Submit Button with loading state */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={result.kind === "submitting"}
        disabled={!canSubmit && result.kind !== "submitting"}
        className="w-full"
      >
        {tx.leadForm.actions.submit}
      </Button>
    </form >
  );
}
