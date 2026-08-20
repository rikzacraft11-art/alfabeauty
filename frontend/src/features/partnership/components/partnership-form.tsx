"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle, Loader2, MessageCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { FormField, fieldClass } from "@/shared/components/ui/form-field";
import { cn } from "@/shared/lib/utils";
import { WHATSAPP_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { submitLead, type SubmitLeadResult } from "@/actions/submit-lead";
import { leadSchema, flattenErrors } from "@/shared/lib/validations/lead";
import { trackEvent } from "@/shared/lib/analytics";

/* ─────────────────────────────────────────────────────────────────────
 * Partnership Form — Become Partner lead capture
 *
 * Field spec from paket-a.md §5:
 *   Required: business_name, contact_name, phone_whatsapp, city,
 *             salon_type (enum), consent (checkbox)
 *   Optional: chair_count, specialization, current_brands_used,
 *             monthly_spend_range
 *   Anti-spam: company (honeypot, hidden)
 *
 * Validation:
 *   - Client-side: Zod schema (shared with server)
 *   - Server-side: Zod + honeypot + rate-limit
 *   - Phone: E.164-like (lenient), normalized on server
 *   - Consent: must be true
 *
 * Pipeline: form → server action → Supabase + email notification
 * ───────────────────────────────────────────────────────────────────── */

type FormData = {
    business_name: string;
    contact_name: string;
    phone_whatsapp: string;
    email: string;
    city: string;
    salon_type: string;
    chair_count: string;
    specialization: string;
    current_brands_used: string;
    monthly_spend_range: string;
    message: string;
    consent: boolean;
    company: string; // honeypot
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialData: FormData = {
    business_name: "",
    contact_name: "",
    phone_whatsapp: "",
    email: "",
    city: "",
    salon_type: "",
    chair_count: "",
    specialization: "",
    current_brands_used: "",
    monthly_spend_range: "",
    message: "",
    consent: false,
    company: "", // honeypot
};

const salonTypes = [
    { value: "SALON", label: "Salon" },
    { value: "BARBER", label: "Barbershop" },
    { value: "BRIDAL", label: "Bridal" },
    { value: "UNISEX", label: "Unisex" },
    { value: "OTHER", label: "Other" },
];

const spendRanges = [
    { value: "under-3jt", label: "Under Rp 3 juta" },
    { value: "3-5jt", label: "Rp 3 – 5 juta" },
    { value: "5-10jt", label: "Rp 5 – 10 juta" },
    { value: "10-25jt", label: "Rp 10 – 25 juta" },
    { value: "above-25jt", label: "Above Rp 25 juta" },
];

export function PartnershipForm(): React.JSX.Element {
    const [data, setData] = React.useState<FormData>(initialData);
    const [errors, setErrors] = React.useState<FormErrors>({});
    const [serverError, setServerError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [showOptional, setShowOptional] = React.useState(false);

    // Capture initial page URL on mount
    const initialUrl = React.useRef<string>("");
    React.useEffect(() => {
        initialUrl.current = window.location.href;
    }, []);

    /* ─── Field handlers ─── */

    function onChange(
        field: keyof FormData,
        value: string | boolean
    ) {
        setData((prev) => ({ ...prev, [field]: value }));
        // Clear error on edit
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
        if (serverError) setServerError(null);
    }

    /* ─── Client-side validation (Zod — shared schema) ─── */

    function validate(): FormErrors {
        const result = leadSchema.safeParse({
            ...data,
            consent: data.consent ? true : undefined,
            chair_count: data.chair_count || undefined,
            monthly_spend_range: data.monthly_spend_range || undefined,
        });
        if (result.success) return {};
        return flattenErrors(result) as FormErrors;
    }

    /* ─── Submit → Server Action ─── */

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError(null);

        // Honeypot check (client-side mirror)
        if (data.company) return;

        // Client-side validation first (fast feedback)
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...data,
                consent: data.consent ? (true as const) : undefined,
                chair_count: data.chair_count || undefined,
                monthly_spend_range: data.monthly_spend_range || undefined,
                page_url_initial: initialUrl.current,
                page_url_current: window.location.href,
            };

            const result: SubmitLeadResult = await submitLead(payload);

            if (result.success) {
                setIsSuccess(true);
                trackEvent("lead_form_submit", {
                    salon_type: data.salon_type,
                    city: data.city,
                });
            } else if ("errors" in result) {
                // Server validation errors
                setErrors(result.errors as FormErrors);
            } else {
                // Rate limit or general error
                setServerError(result.error);
            }
        } catch {
            setServerError(
                "An unexpected error occurred. Please try again or contact us via WhatsApp."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    /* ─── Success State ─── */

    if (isSuccess) {
        const whatsappMsg = encodeURIComponent(
            `Hi, saya ${data.contact_name} dari ${data.business_name} (${data.city}). Saya sudah mengisi formulir partnership di website dan ingin menindaklanjuti.`
        );

        return (
            <div className="mx-auto max-w-lg py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center bg-brand-crimson/10">
                    <CheckCircle className="h-8 w-8 text-brand-crimson" />
                </div>

                <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                    Thank you for your interest!
                </h3>

                <p className="mt-3 text-sm leading-7 text-charcoal">
                    We&apos;ve received your partnership inquiry. Our
                    team will review your information and get back to you
                    within 2 business days.
                </p>

                <p className="mt-6 text-sm font-semibold text-foreground">
                    Want a faster response?
                </p>
                <p className="mt-1 text-xs text-text-muted">
                    Reach out to us directly on WhatsApp for immediate
                    assistance.
                </p>

                <Button asChild className="mt-6 bg-brand-crimson px-8 py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white hover:bg-brand-dark-crimson">
                    <a
                        href={`${WHATSAPP_URL}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent("cta_whatsapp_click", { location: "lead_form_success" })}
                    >
                        <MessageCircle className="h-4 w-4" />
                        Continue on WhatsApp
                    </a>
                </Button>
            </div>
        );
    }

    /* ─── Form ─── */

    return (
        <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-10" noValidate>
            {/* ─── Server error banner ─── */}
            {serverError && (
                <div className="flex items-start gap-3 border border-brand-crimson/30 bg-brand-crimson/5 p-4" role="alert">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-crimson" />
                    <p className="text-sm text-brand-crimson">{serverError}</p>
                </div>
            )}

            {/* Honeypot — hidden from users */}
            <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={data.company}
                    onChange={(e) =>
                        onChange("company", e.target.value)
                    }
                />
            </div>

            {/* ─── Group 1: Business Information ─── */}
            <fieldset>
                <legend className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">
                    Business Information
                </legend>

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                        label="Business Name *"
                        error={errors.business_name}
                    >
                        <input
                            type="text"
                            placeholder="e.g. Salon Cantik"
                            value={data.business_name}
                            onChange={(e) =>
                                onChange(
                                    "business_name",
                                    e.target.value
                                )
                            }
                            autoComplete="organization"
                            className={fieldClass(
                                errors.business_name
                            )}
                        />
                    </FormField>

                    <FormField
                        label="Business Type *"
                        error={errors.salon_type}
                    >
                        <Select
                            value={data.salon_type}
                            onValueChange={(val) =>
                                onChange("salon_type", val)
                            }
                        >
                            <SelectTrigger
                                className={cn(
                                    "w-full border bg-background py-2.5 text-sm",
                                    errors.salon_type
                                        ? "border-brand-crimson"
                                        : "border-border-warm"
                                )}
                            >
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {salonTypes.map((t) => (
                                    <SelectItem
                                        key={t.value}
                                        value={t.value}
                                    >
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField label="City *" error={errors.city}>
                        <input
                            type="text"
                            placeholder="e.g. Surabaya"
                            value={data.city}
                            onChange={(e) =>
                                onChange("city", e.target.value)
                            }
                            autoComplete="address-level2"
                            className={fieldClass(errors.city)}
                        />
                    </FormField>
                </div>
            </fieldset>

            {/* ─── Group 2: Contact Information ─── */}
            <fieldset>
                <legend className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">
                    Contact Information
                </legend>

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                        label="Contact Name *"
                        error={errors.contact_name}
                    >
                        <input
                            type="text"
                            placeholder="Your name"
                            value={data.contact_name}
                            onChange={(e) =>
                                onChange(
                                    "contact_name",
                                    e.target.value
                                )
                            }
                            autoComplete="name"
                            className={fieldClass(
                                errors.contact_name
                            )}
                        />
                    </FormField>

                    <FormField
                        label="WhatsApp Number *"
                        error={errors.phone_whatsapp}
                    >
                        <input
                            type="tel"
                            placeholder="+628xxx or 08xxx"
                            value={data.phone_whatsapp}
                            onChange={(e) =>
                                onChange(
                                    "phone_whatsapp",
                                    e.target.value
                                )
                            }
                            autoComplete="tel"
                            inputMode="tel"
                            className={fieldClass(
                                errors.phone_whatsapp
                            )}
                        />
                    </FormField>

                    <FormField label="Email (optional)">
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={data.email}
                            onChange={(e) =>
                                onChange("email", e.target.value)
                            }
                            autoComplete="email"
                            className={fieldClass()}
                        />
                    </FormField>
                </div>
            </fieldset>

            {/* ─── Group 3: Additional Details (Progressive) ─── */}
            <div>
                <button
                    type="button"
                    onClick={() => setShowOptional(!showOptional)}
                    className="group inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-crimson hover:text-brand-dark-crimson transition-colors"
                >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-brand-crimson/30 bg-brand-crimson/5 transition-all duration-300 group-hover:border-brand-crimson group-hover:bg-brand-crimson/10">
                        <ChevronRight
                            className={cn(
                                "h-3 w-3 text-brand-crimson transition-transform duration-300 ease-out",
                                showOptional && "rotate-90"
                            )}
                        />
                    </span>
                    <span>Additional Details (optional — helps us prepare)</span>
                </button>

                {showOptional && (
                    <fieldset className="mt-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <FormField label="Number of Chairs">
                                <input
                                    type="number"
                                    min={1}
                                    placeholder="e.g. 6"
                                    value={data.chair_count}
                                    onChange={(e) =>
                                        onChange(
                                            "chair_count",
                                            e.target.value
                                        )
                                    }
                                    inputMode="numeric"
                                    className={fieldClass()}
                                />
                            </FormField>

                            <FormField label="Monthly Product Spend">
                                <Select
                                    value={
                                        data.monthly_spend_range
                                    }
                                    onValueChange={(val) =>
                                        onChange(
                                            "monthly_spend_range",
                                            val
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full border border-border-warm bg-background py-2.5 text-sm">
                                        <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {spendRanges.map((r) => (
                                            <SelectItem
                                                key={r.value}
                                                value={r.value}
                                            >
                                                {r.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>

                            <FormField label="Specialization">
                                <input
                                    type="text"
                                    placeholder="e.g. coloring, keratin, barbering"
                                    value={data.specialization}
                                    onChange={(e) =>
                                        onChange(
                                            "specialization",
                                            e.target.value
                                        )
                                    }
                                    className={fieldClass()}
                                />
                            </FormField>

                            <FormField label="Current Brands Used">
                                <input
                                    type="text"
                                    placeholder="e.g. Brand A, Brand B"
                                    value={
                                        data.current_brands_used
                                    }
                                    onChange={(e) =>
                                        onChange(
                                            "current_brands_used",
                                            e.target.value
                                        )
                                    }
                                    className={fieldClass()}
                                />
                            </FormField>
                        </div>
                    </fieldset>
                )}
            </div>

            {/* ─── Message ─── */}
            <FormField label="Message (optional)">
                <textarea
                    rows={4}
                    placeholder="Tell us about your interest in partnering..."
                    value={data.message}
                    onChange={(e) =>
                        onChange("message", e.target.value)
                    }
                    className={cn(fieldClass(), "resize-y")}
                />
            </FormField>

            {/* ─── Consent ─── */}
            <div>
                <div className="flex items-start gap-3">
                    <Checkbox
                        id="consent"
                        checked={data.consent}
                        onCheckedChange={(checked) =>
                            onChange("consent", checked === true)
                        }
                        className={cn(
                            "mt-0.5",
                            errors.consent &&
                            "border-brand-crimson"
                        )}
                    />
                    <label
                        htmlFor="consent"
                        className="text-xs leading-relaxed text-charcoal cursor-pointer"
                    >
                        I agree to be contacted by {SITE_SHORT_NAME} Cosmetica
                        regarding this partnership inquiry. My data will
                        be used for business contact purposes only and
                        will not be sold to third parties.{" "}
                        <Link
                            href="/privacy"
                            className="text-brand-crimson underline underline-offset-2 hover:text-brand-dark-crimson"
                        >
                            Privacy Policy
                        </Link>
                    </label>
                </div>
                {errors.consent && (
                    <p className="mt-2 text-xs text-brand-crimson">
                        {errors.consent}
                    </p>
                )}
            </div>

            {/* ─── Submit ─── */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 bg-brand-crimson px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white hover:bg-brand-dark-crimson disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit Partnership Inquiry"
                )}
            </Button>
        </form>
    );
}


