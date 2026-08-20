"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { FormField, fieldClass } from "@/shared/components/ui/form-field";
import { WHATSAPP_URL, SITE_SHORT_NAME } from "@/shared/lib/config";
import { contactSchema } from "@/shared/lib/validations/contact";
import { flattenErrors } from "@/shared/lib/validations/validation-utils";
import { submitContact } from "@/actions/submit-contact";
import { trackEvent } from "@/shared/lib/analytics";

/* ─────────────────────────────────────────────────────────────────────
 * Contact Form — General inquiry
 *
 * Adapted from Yucca.co.za/contact/ form pattern.
 * Uses shadcn/ui Select + Checkbox primitives.
 *
 * Fields: name, email, phone (WhatsApp), subject (Select), message
 * Anti-spam: company honeypot (hidden)
 * Submit: Zod validation → submitContact server action
 * ───────────────────────────────────────────────────────────────────── */

type FormData = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    consent: boolean;
    company: string; // honeypot
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialData: FormData = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
    company: "",
};

const subjects = [
    { value: "product-inquiry", label: "Product Inquiry" },
    { value: "partnership", label: "Partnership Opportunity" },
    { value: "training", label: "Training & Education" },
    { value: "technical-support", label: "Technical Support" },
    { value: "general", label: "General Question" },
    { value: "other", label: "Other" },
];

export function ContactForm(): React.JSX.Element {
    const [data, setData] = React.useState<FormData>(initialData);
    const [errors, setErrors] = React.useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [serverError, setServerError] = React.useState<string | null>(null);

    /* ─── Field handlers ─── */

    function onChange(
        field: keyof FormData,
        value: string | boolean
    ) {
        setData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    }

    /* ─── Validation (Zod) ─── */

    function validate(): FormErrors {
        const result = contactSchema.safeParse(data);
        if (result.success) return {};
        return flattenErrors(result) as FormErrors;
    }

    /* ─── Submit ─── */

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Honeypot
        if (data.company) return;

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        const result = await submitContact({
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
            consent: data.consent,
            company: data.company,
        });

        setIsSubmitting(false);

        if (!result.success) {
            if ("errors" in result) {
                setErrors(result.errors as FormErrors);
            } else if ("error" in result) {
                setServerError(result.error);
            }
            return;
        }

        trackEvent("lead_form_submit", {
            salon_type: "contact",
            city: "—",
        });
        setIsSuccess(true);
    }

    /* ─── Success State ─── */

    if (isSuccess) {
        const whatsappMsg = encodeURIComponent(
            `Hi, saya ${data.name}. Saya sudah mengirim pesan melalui formulir kontak di website tentang "${subjects.find((s) => s.value === data.subject)?.label ?? data.subject}". Mohon bisa ditindaklanjuti.`
        );

        return (
            <div className="py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center bg-brand-crimson/10">
                    <CheckCircle className="h-7 w-7 text-brand-crimson" />
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
                    Message Sent!
                </h3>
                <p className="mt-2 text-sm leading-7 text-charcoal">
                    Thank you for reaching out. We&apos;ll get back
                    to you within 1–2 business days.
                </p>
                <p className="mt-5 text-xs font-semibold text-foreground">
                    Need a faster reply?
                </p>
                <Button asChild className="mt-3 bg-brand-crimson px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white hover:bg-brand-dark-crimson">
                    <a
                        href={`${WHATSAPP_URL}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                            trackEvent("cta_whatsapp_click", {
                                location: "contact_form_success",
                            })
                        }
                    >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Continue on WhatsApp
                    </a>
                </Button>
            </div>
        );
    }

    /* ─── Form ─── */

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Server error banner */}
            {serverError && (
                <div className="flex items-start gap-3 border border-brand-crimson/30 bg-brand-crimson/5 p-4" role="alert">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-crimson" />
                    <p className="text-sm text-brand-crimson">{serverError}</p>
                </div>
            )}

            {/* Honeypot */}
            <div
                className="absolute -left-[9999px] opacity-0"
                aria-hidden="true"
            >
                <label htmlFor="contact-company">Company</label>
                <input
                    id="contact-company"
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

            {/* Name */}
            <FormField label="Your Name *" error={errors.name}>
                <input
                    type="text"
                    placeholder="Full name"
                    value={data.name}
                    onChange={(e) =>
                        onChange("name", e.target.value)
                    }
                    autoComplete="name"
                    className={fieldClass(errors.name)}
                />
            </FormField>

            {/* Email + Phone row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                    label="Email Address *"
                    error={errors.email}
                >
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={data.email}
                        onChange={(e) =>
                            onChange("email", e.target.value)
                        }
                        autoComplete="email"
                        className={fieldClass(errors.email)}
                    />
                </FormField>

                <FormField
                    label="WhatsApp / Phone"
                    error={errors.phone}
                >
                    <input
                        type="tel"
                        placeholder="+628xxx or 08xxx"
                        value={data.phone}
                        onChange={(e) =>
                            onChange("phone", e.target.value)
                        }
                        autoComplete="tel"
                        inputMode="tel"
                        className={fieldClass(errors.phone)}
                    />
                </FormField>
            </div>

            {/* Subject */}
            <FormField label="Subject *" error={errors.subject}>
                <Select
                    value={data.subject}
                    onValueChange={(val) =>
                        onChange("subject", val)
                    }
                >
                    <SelectTrigger
                        className={cn(
                            "w-full border bg-background py-2.5 text-sm",
                            errors.subject
                                ? "border-brand-crimson"
                                : "border-border-warm"
                        )}
                    >
                        <SelectValue placeholder="What can we help you with?" />
                    </SelectTrigger>
                    <SelectContent>
                        {subjects.map((s) => (
                            <SelectItem
                                key={s.value}
                                value={s.value}
                            >
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            {/* Message */}
            <FormField label="Message *" error={errors.message}>
                <textarea
                    rows={5}
                    placeholder="Tell us a bit about your needs..."
                    value={data.message}
                    onChange={(e) =>
                        onChange("message", e.target.value)
                    }
                    className={cn(
                        fieldClass(errors.message),
                        "resize-y"
                    )}
                />
            </FormField>

            {/* Consent */}
            <div>
                <div className="flex items-start gap-3">
                    <Checkbox
                        id="contact-consent"
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
                        htmlFor="contact-consent"
                        className="text-xs leading-relaxed text-charcoal cursor-pointer"
                    >
                        I agree to be contacted by {SITE_SHORT_NAME}
                        Cosmetica regarding this inquiry. My data
                        will be used for communication purposes only
                        and will not be shared with third parties.{" "}
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

            {/* Submit */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 bg-brand-crimson px-8 py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white hover:bg-brand-dark-crimson disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    "Send Message"
                )}
            </Button>
        </form>
    );
}

