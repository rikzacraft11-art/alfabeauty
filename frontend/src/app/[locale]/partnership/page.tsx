"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaggerReveal from "@/components/ui/StaggerReveal";
import { useTranslations } from "@/hooks/useTranslations";
import { useLeadForm, type SalonType } from "@/components/lead/useLeadForm";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import { getButtonClassName } from "@/components/ui/Button";

/**
 * Partnership Page
 * Design V2: Typeform-style multi-step form
 * Migrated from (v2) to production route.
 */
export default function PartnershipPage() {
  const tx = useTranslations();
  const [step, setStep] = useState(1);

  // Initialize form hook with localized messages
  const {
    values,
    result,
    fieldErrors,
    setField,
    submit,
    shouldShowError,
    markTouched
  } = useLeadForm(
    // Validation messages
    {
      businessNameRequired: tx.leadForm?.validation?.businessNameRequired || "Business name is required",
      contactNameRequired: tx.leadForm?.validation?.contactNameRequired || "Contact name is required",
      phoneRequired: tx.leadForm?.validation?.phoneRequired || "Phone is required",
      cityRequired: tx.leadForm?.validation?.cityRequired || "City is required",
      salonTypeRequired: tx.leadForm?.validation?.salonTypeRequired || "Business type is required",
      consentRequired: tx.leadForm?.validation?.consentRequired || "Consent is required",
    },
    // Error messages
    {
      network: tx.leadForm?.errors?.network || "Network error",
      rateLimited: tx.leadForm?.errors?.rateLimited || "Too many attempts",
      submitFailed: tx.leadForm?.errors?.submitFailed || "Submission failed",
    }
  );

  const STEPS = [
    { id: 1, label: tx.partnership.steps[1] },
    { id: 2, label: tx.partnership.steps[2] },
    { id: 3, label: tx.partnership.steps[3] },
    { id: 4, label: tx.partnership.steps[4] },
  ];

  const BUSINESS_TYPES: SalonType[] = [
    "SALON",
    "BARBER",
    "BRIDAL",
    "OTHER",
  ];

  // Display labels for business types
  const BUSINESS_TYPE_LABELS: Record<string, string> = {
    "SALON": "Professional Salon",
    "BARBER": "Barbershop",
    "BRIDAL": "Beauty Academy", // Mapping 'BRIDAL' to Academy for now based on previous UI, or add ACADEMY to enum
    "OTHER": "Other/Distributor"
  };

  const nextStep = () => {
    // Basic validation before next step
    if (step === 1) {
      if (!values.businessName || !values.city || !values.salonType) {
        markTouched("businessName");
        markTouched("city");
        markTouched("salonType");
        return; // Block if invalid
      }
    }
    if (step === 2) {
      if (!values.contactName || !values.phoneWhatsApp) {
        markTouched("contactName");
        markTouched("phoneWhatsApp");
        return;
      }
    }

    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = () => {
    submit();
  };

  // Success Screen
  if (result.kind === "success") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-foreground">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center p-12"
        >
          <div className="type-display mb-6">✓</div>
          <h1 className="type-h1 text-background mb-4">{tx.partnership.success.title}</h1>
          <p className="type-body text-background/70 mb-8 max-w-md">
            {tx.partnership.success.body}
          </p>
          {/* Fallback to simple link if WhatsAppLink is missing/broken, but try to use standard one */}
          <a
            href={`https://wa.me/6281234567890?text=${encodeURIComponent(tx.leadForm?.success?.whatsappPrefill || "Hello")}`}
            className="inline-block px-8 py-4 bg-[#25D366] text-white rounded-full type-nav"
          >
            {tx.partnership.success.cta}
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-2xl">
        {/* Header */}
        <StaggerReveal delay={0.1} className="mb-12 text-center">
          <p className="type-kicker text-muted mb-4">{tx.partnership.hero.kicker}</p>
          <h1 className="type-h1 text-foreground mb-4">
            {tx.partnership.hero.title}
          </h1>
          <p className="type-body text-foreground-muted">
            {tx.partnership.hero.body}
          </p>
        </StaggerReveal>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-12">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center type-data transition-all duration-[var(--transition-elegant)] ${step >= s.id
                  ? "bg-foreground text-background"
                  : "bg-panel text-muted"
                  }`}
              >
                {s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-12 lg:w-24 h-0.5 mx-2 transition-all duration-[var(--transition-elegant)] ${step > s.id ? "bg-foreground" : "bg-border"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Step 1: Business Info */}
            {step === 1 && (
              <>
                <h2 className="type-h3 text-foreground mb-6">{tx.partnership.form.step1.title}</h2>

                <div>
                  <label className="type-data text-muted block mb-2">{tx.partnership.form.step1.businessName} *</label>
                  <input
                    type="text"
                    value={values.businessName}
                    onChange={(e) => setField("businessName", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-panel border focus:outline-none transition-colors ${shouldShowError("businessName") ? "border-error" : "border-border focus:border-foreground"}`}
                    placeholder={tx.partnership.form.step1.businessNamePlaceholder}
                  />
                  {shouldShowError("businessName") && <p className="text-error type-data mt-1">{fieldErrors.businessName}</p>}
                </div>

                <div>
                  <label className="type-data text-muted block mb-2">{tx.partnership.form.step1.businessType} *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setField("salonType", type)}
                        className={`px-4 py-3 rounded-xl type-data transition-all duration-[var(--transition-elegant)] ${values.salonType === type
                          ? "bg-foreground text-background"
                          : "bg-panel text-foreground hover:bg-border"
                          }`}
                      >
                        {BUSINESS_TYPE_LABELS[type] || type}
                      </button>
                    ))}
                  </div>
                  {shouldShowError("salonType") && <p className="text-error type-data mt-1">{fieldErrors.salonType}</p>}
                </div>

                <div>
                  <label className="type-data text-muted block mb-2">{tx.partnership.form.step1.city} *</label>
                  <input
                    type="text"
                    value={values.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-panel border focus:outline-none transition-colors ${shouldShowError("city") ? "border-error" : "border-border focus:border-foreground"}`}
                    placeholder={tx.partnership.form.step1.cityPlaceholder}
                  />
                  {shouldShowError("city") && <p className="text-error type-data mt-1">{fieldErrors.city}</p>}
                </div>
              </>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <>
                <h2 className="type-h3 text-foreground mb-6">{tx.partnership.form.step2.title}</h2>

                <div>
                  <label className="type-data text-muted block mb-2">{tx.partnership.form.step2.contactName} *</label>
                  <input
                    type="text"
                    value={values.contactName}
                    onChange={(e) => setField("contactName", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-panel border focus:outline-none transition-colors ${shouldShowError("contactName") ? "border-error" : "border-border focus:border-foreground"}`}
                    placeholder={tx.partnership.form.step2.contactNamePlaceholder}
                  />
                  {shouldShowError("contactName") && <p className="text-error type-data mt-1">{fieldErrors.contactName}</p>}
                </div>

                <div>
                  <label className="type-data text-muted block mb-2">{tx.partnership.form.step2.email} *</label>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-panel border border-border focus:border-foreground focus:outline-none transition-colors"
                    placeholder={tx.partnership.form.step2.emailPlaceholder}
                  />
                </div>

                <div>
                  <label className="type-data text-muted block mb-2">{tx.partnership.form.step2.phone} *</label>
                  <input
                    type="tel"
                    value={values.phoneWhatsApp}
                    onChange={(e) => setField("phoneWhatsApp", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-panel border focus:outline-none transition-colors ${shouldShowError("phoneWhatsApp") ? "border-error" : "border-border focus:border-foreground"}`}
                    placeholder={tx.partnership.form.step2.phonePlaceholder}
                  />
                  {shouldShowError("phoneWhatsApp") && <p className="text-error type-data mt-1">{fieldErrors.phoneWhatsApp}</p>}
                </div>
              </>
            )}

            {/* Step 3: Profiling */}
            {step === 3 && (
              <>
                <h2 className="type-h3 text-foreground mb-6">{tx.partnership.form.step3.title}</h2>

                <div>
                  <label className="type-data text-muted block mb-2">{tx.partnership.form.step3.currentBrands}</label>
                  <textarea
                    value={values.currentBrandsUsed}
                    onChange={(e) => setField("currentBrandsUsed", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-panel border border-border focus:border-foreground focus:outline-none transition-colors resize-none"
                    placeholder={tx.partnership.form.step3.currentBrandsPlaceholder}
                  />
                </div>

                {/* Using specialization field to store 'interest' for now as hook schema is strict */}
                <div>
                  <label className="type-data text-muted block mb-2">{tx.partnership.form.step3.interest}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Alfaparf Milano", "Farmavita", "Montibello", "Gamma+"].map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          const current = values.specialization.split(",").filter(Boolean);
                          const updated = current.includes(brand)
                            ? current.filter((b) => b !== brand)
                            : [...current, brand];
                          setField("specialization", updated.join(","));
                        }}
                        className={`px-4 py-3 rounded-xl type-data transition-all duration-[var(--transition-elegant)] ${values.specialization.includes(brand)
                          ? "bg-foreground text-background"
                          : "bg-panel text-foreground hover:bg-border"
                          }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Consent */}
            {step === 4 && (
              <>
                <h2 className="type-h3 text-foreground mb-6">{tx.partnership.form.step4.title}</h2>

                <div className="p-6 rounded-2xl bg-panel" style={{ boxShadow: "var(--shadow-elegant)" }}>
                  <h3 className="type-h4 text-foreground mb-4">{tx.partnership.form.step4.summary}</h3>
                  <dl className="space-y-2 type-body text-foreground-muted">
                    <div><span className="text-muted">{tx.partnership.form.step1.businessName}:</span> {values.businessName}</div>
                    <div><span className="text-muted">{tx.partnership.form.step1.businessType}:</span> {values.salonType}</div>
                    <div><span className="text-muted">{tx.partnership.form.step1.city}:</span> {values.city}</div>
                    <div><span className="text-muted">{tx.partnership.form.step2.contactName}:</span> {values.contactName}</div>
                    <div><span className="text-muted">{tx.partnership.form.step2.email}:</span> {values.email}</div>
                    <div><span className="text-muted">{tx.partnership.form.step2.phone}:</span> {values.phoneWhatsApp}</div>
                  </dl>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values.consent}
                      onChange={(e) => setField("consent", e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-border"
                    />
                    <span className="type-body text-foreground-muted">
                      {tx.partnership.form.step4.agreeTerms} *
                    </span>
                  </label>
                  {shouldShowError("consent") && <p className="text-error type-data ml-8">{fieldErrors.consent}</p>}

                  {/* Honeypot */}
                  <div className="hidden">
                    <input
                      value={values.company}
                      onChange={(e) => setField("company", e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {result.kind === "error" && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg type-body">
                    {result.message}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-3 rounded-full type-nav transition-all duration-[var(--transition-elegant)] ${step === 1
              ? "opacity-0 pointer-events-none"
              : "bg-panel text-foreground hover:bg-border"
              }`}
          >
            ← {tx.partnership.form.nav.back}
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-8 py-3 rounded-full type-nav bg-foreground text-background hover:opacity-90 transition-all duration-[var(--transition-elegant)]"
            >
              {tx.partnership.form.nav.continue} →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!values.consent || result.kind === "submitting"}
              className={`px-8 py-3 rounded-full type-nav transition-all duration-[var(--transition-elegant)] ${values.consent
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-panel text-muted cursor-not-allowed"
                }`}
            >
              {result.kind === "submitting" ? "Submitting..." : tx.partnership.form.nav.submit}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
