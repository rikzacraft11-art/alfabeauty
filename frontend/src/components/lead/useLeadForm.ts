"use client";

import { useCallback, useMemo, useState } from "react";
import { submitLead } from "@/actions/submit-lead";
import { trackEvent } from "@/lib/telemetry";
import { getCurrentPageUrl, getInitialPageUrl } from "@/lib/telemetry";

/** Form submission result states */
export type SubmitResult =
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "success"; id?: string }
    | { kind: "error"; message: string };

/** Salon type enum */
export type SalonType = "SALON" | "BARBER" | "BRIDAL" | "UNISEX" | "OTHER" | "";

/** Field-level validation errors */
export type FieldErrors = {
    businessName?: string;
    contactName?: string;
    phoneWhatsApp?: string;
    city?: string;
    salonType?: string;
    consent?: string;
};

/** Form field values */
export type LeadFormValues = {
    businessName: string;
    contactName: string;
    email: string;
    phoneWhatsApp: string;
    city: string;
    salonType: SalonType;
    consent: boolean;
    chairCount: string;
    specialization: string;
    currentBrandsUsed: string;
    monthlySpendRange: string;
    message: string;
    company: string; // honeypot
};

/** Translation messages for validation */
export type ValidationMessages = {
    businessNameRequired: string;
    contactNameRequired: string;
    phoneRequired: string;
    cityRequired: string;
    salonTypeRequired: string;
    consentRequired: string;
};

/** Error messages for submission */
export type ErrorMessages = {
    network: string;
    rateLimited: string;
    submitFailed: string;
};

const INITIAL_VALUES: LeadFormValues = {
    businessName: "",
    contactName: "",
    email: "",
    phoneWhatsApp: "",
    city: "",
    salonType: "",
    consent: false,
    chairCount: "",
    specialization: "",
    currentBrandsUsed: "",
    monthlySpendRange: "",
    message: "",
    company: "",
};

/**
 * Normalize phone number to E.164-like format.
 * Paket A §5: "WhatsApp number must be E.164-like (lenient) + normalize"
 * - Strips formatting characters (spaces, dashes, parentheses)
 * - Converts Indonesian 08... to 62...
 */
function normalizePhone(input: string): string {
    let phone = input.replace(/[\s\-().]/g, "").trim();

    // Convert Indonesian local format (08...) to international (62...)
    if (phone.startsWith("08")) {
        phone = "62" + phone.slice(1);
    }
    // Strip leading + if present (E.164 stores without +)
    if (phone.startsWith("+")) {
        phone = phone.slice(1);
    }

    return phone;
}

/**
 * Validate phone number is E.164-like (lenient).
 * Accepts: +62..., 62..., 08..., or 10+ digit international numbers.
 */
function isValidPhoneE164Like(input: string): boolean {
    const normalized = normalizePhone(input);
    if (normalized.length < 10) return false;
    // Accept optional + prefix, then 10-15 digits
    return /^\+?\d{10,15}$/.test(normalized);
}

const FIELD_ID_MAP: Record<string, string> = {
    businessName: "business_name",
    contactName: "contact_name",
    phoneWhatsApp: "phone_whatsapp",
    city: "city",
    salonType: "salon_type",
};

/**
 * Custom hook for lead form state management.
 * Handles: field state, validation, touched tracking, submit logic, and result state.
 */
export function useLeadForm(
    validationMessages: ValidationMessages,
    errorMessages: ErrorMessages
) {
    const [values, setValues] = useState<LeadFormValues>(INITIAL_VALUES);
    const [result, setResult] = useState<SubmitResult>({ kind: "idle" });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showErrors, setShowErrors] = useState(false);

    const fieldErrors = useMemo<FieldErrors>(() => {
        const errors: FieldErrors = {};
        if (values.businessName.trim().length < 2) {
            errors.businessName = validationMessages.businessNameRequired;
        }
        if (values.contactName.trim().length < 2) {
            errors.contactName = validationMessages.contactNameRequired;
        }
        if (!isValidPhoneE164Like(values.phoneWhatsApp)) {
            errors.phoneWhatsApp = validationMessages.phoneRequired;
        }
        if (values.city.trim().length < 2) {
            errors.city = validationMessages.cityRequired;
        }
        if (!values.salonType) {
            errors.salonType = validationMessages.salonTypeRequired;
        }
        if (!values.consent) {
            errors.consent = validationMessages.consentRequired;
        }
        return errors;
    }, [values, validationMessages]);

    const canSubmit = useMemo(
        () => Object.keys(fieldErrors).length === 0 && result.kind !== "submitting",
        [fieldErrors, result.kind]
    );

    const setField = useCallback(<K extends keyof LeadFormValues>(
        field: K,
        value: LeadFormValues[K]
    ) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    }, []);

    const markTouched = useCallback((field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }, []);

    const shouldShowError = useCallback(
        (field: keyof FieldErrors) => (showErrors || touched[field]) && fieldErrors[field],
        [showErrors, touched, fieldErrors]
    );



    const focusFirstError = useCallback(() => {
        const firstErrorField = Object.keys(fieldErrors)[0];
        if (firstErrorField) {
            const el = document.getElementById(FIELD_ID_MAP[firstErrorField] || firstErrorField);
            el?.focus();
        }
    }, [fieldErrors]);

    const submit = useCallback(async () => {
        setShowErrors(true);

        if (!canSubmit) {
            focusFirstError();
            return;
        }

        setResult({ kind: "submitting" });

        const chairCountValue = values.chairCount.trim();
        const chairCountInt = chairCountValue ? Number.parseInt(chairCountValue, 10) : undefined;
        const chairCountNormalized =
            Number.isFinite(chairCountInt) && (chairCountInt as number) > 0
                ? (chairCountInt as number)
                : undefined;

        const body = {
            business_name: values.businessName.trim(),
            contact_name: values.contactName.trim(),
            email: values.email.trim() || undefined,
            phone_whatsapp: normalizePhone(values.phoneWhatsApp),
            city: values.city.trim(),
            salon_type: values.salonType,
            consent: values.consent,
            chair_count: chairCountNormalized,
            specialization: values.specialization.trim() || undefined,
            current_brands_used: values.currentBrandsUsed.trim() || undefined,
            monthly_spend_range: values.monthlySpendRange.trim() || undefined,
            message: values.message.trim() || undefined,
            page_url_initial: getInitialPageUrl(),
            page_url_current: getCurrentPageUrl(),
            company: values.company.trim() || undefined,
        };

        // Server Action Migration (Phase 37)
        // Note: We cast to any because the exact Zod types are in the server action file,
        // and duplicating them fully here is redundant given we have runtime validation there.
        // The shape matches 'LeadRequest'.
        const payload = body as any;

        try {
            const res = await submitLead(payload);

            if (res.success) {
                const id = "CONFIRMED"; // Server actions don't return ID in this simplified version yet, or we can add it.
                trackEvent("lead_submit_success", { id });
                setResult({ kind: "success", id });
                return;
            }

            // Handle Error
            if (res.error === "rate_limited") {
                trackEvent("lead_submit_error", { reason: "rate_limited" });
                setResult({ kind: "error", message: errorMessages.rateLimited });
                return;
            }

            if (res.warning === "persistence_failed") {
                // Fallback success
                setResult({ kind: "success", id: "OFFLINE_SAVED" });
                return;
            }

            const msg = res.error === "validation_error" ? "Please check your inputs." : errorMessages.submitFailed;
            trackEvent("lead_submit_error", { reason: "server", message: res.error });
            setResult({ kind: "error", message: msg });

        } catch (err) {
            trackEvent("lead_submit_error", { reason: "network" });
            setResult({ kind: "error", message: errorMessages.network });
        }
    }, [canSubmit, values, errorMessages, focusFirstError]);

    return {
        values,
        result,
        fieldErrors,
        canSubmit,
        setField,
        markTouched,
        submit,
        shouldShowError,
        handleSubmit: (e: React.FormEvent) => {
            e.preventDefault();
            submit();
        },
    };
}

export type UseLeadFormReturn = ReturnType<typeof useLeadForm>;
