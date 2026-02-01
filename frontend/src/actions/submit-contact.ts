"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { rateLimitAsync } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";

/**
 * Contact Form Server Action
 * 
 * ISO 27001 A.18.1.4: Privacy by Design
 * - Requires explicit consent checkbox
 * - Validates all input with Zod
 * - Rate limited per IP (distributed via Upstash)
 * - Audit logged
 */

// Zod schema with consent requirement (ISO 27001 A.18.1.4)
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address").max(254),
    subject: z.string().max(200).optional(),
    message: z.string().min(10, "Message must be at least 10 characters").max(2000),
    consent: z.literal(true, {
        errorMap: () => ({ message: "You must agree to the privacy policy" })
    }),
    honeypot: z.string().optional(), // Bot trap
});

// HTML escape to prevent XSS in email content
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactResult = {
    success: boolean;
    error?: string;
    details?: Record<string, string[]>;
};

export async function submitContact(formData: ContactFormData): Promise<ContactResult> {
    const headerStore = await headers();
    const ip = headerStore.get("x-real-ip") || headerStore.get("x-forwarded-for") || "unknown";
    const userAgent = headerStore.get("user-agent") || "unknown";

    // 1. Rate Limiting (OWASP API4:2023) - Distributed via Upstash
    // Limit: 3 contact submissions per hour per IP
    const limiter = await rateLimitAsync(ip, { limit: 3, windowMs: 60 * 60 * 1000 });

    if (!limiter.success) {
        logger.warn("[Contact] Rate limit exceeded", { ip });
        return { success: false, error: "rate_limited" };
    }

    // 2. Validation (OWASP A03:2021 Injection)
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
        const flattened = result.error.flatten();
        logger.warn("[Contact] Validation failed", { errors: flattened.fieldErrors });
        return {
            success: false,
            error: "validation_error",
            details: flattened.fieldErrors as Record<string, string[]>
        };
    }

    const payload = result.data;

    // 3. Honeypot Check (Bot Detection)
    if (payload.honeypot) {
        logger.info("[Contact] Honeypot triggered - likely bot", { ip });
        return { success: true }; // Silent success for bots
    }

    // 4. Audit Log (COBIT APO13)
    logger.info("[Contact] Form submitted", {
        ip: ip.substring(0, 45),
        email: payload.email.substring(0, 50),
        subject: payload.subject?.substring(0, 50) || "No subject"
    });

    try {
        // 5. Persistence (if Supabase configured)
        if (isSupabaseConfigured()) {
            const { error } = await supabaseAdmin().from("contact_submissions").insert({
                name: payload.name,
                email: payload.email,
                subject: payload.subject || "",
                message: payload.message,
                ip_address: ip.substring(0, 45),
                user_agent: userAgent.substring(0, 255),
                consent_given: true,
                submitted_at: new Date().toISOString()
            });

            if (error) {
                logger.warn("[Contact] DB persistence failed, falling back to email", { error });
                // Continue to email fallback
            }
        }

        // 6. Email Notification (Best Effort)
        try {
            await sendEmail({
                subject: `[Contact Form] ${payload.subject || "New Message"} from ${payload.name}`,
                text: `
Name: ${payload.name}
Email: ${payload.email}
Subject: ${payload.subject || "N/A"}

Message:
${payload.message}

---
IP: ${ip.substring(0, 45)}
Submitted: ${new Date().toISOString()}
                `.trim(),
                html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
<p><strong>Subject:</strong> ${escapeHtml(payload.subject || "N/A")}</p>
<h3>Message:</h3>
<p>${escapeHtml(payload.message).replace(/\n/g, "<br>")}</p>
<hr>
<p style="color: #666; font-size: 12px;">IP: ${ip.substring(0, 45)} | Submitted: ${new Date().toISOString()}</p>
                `.trim()
            });
        } catch (emailErr) {
            logger.warn("[Contact] Email notification failed", { error: String(emailErr) });
            // Don't fail the request if email fails but DB succeeded
        }

        return { success: true };

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "internal_error";
        logger.error("[Contact] Internal error", { message: msg });
        return { success: false, error: "internal_error" };
    }
}
