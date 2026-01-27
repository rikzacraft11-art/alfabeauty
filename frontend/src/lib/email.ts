import nodemailer from "nodemailer";
import crypto from "crypto";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { LeadRecord } from "@/lib/types";
import { formatLeadEmail, formatLeadEmailHtml } from "@/lib/templates/lead-email";

// Re-export type if needed, or consumers should import from types
export type { LeadRecord };

const SMTP_HOST = env.SMTP_HOST;
const SMTP_PORT = Number(env.SMTP_PORT || "587");
const SMTP_USER = env.SMTP_USER;
const SMTP_PASS = env.SMTP_PASS;
const SMTP_FROM = env.SMTP_FROM || '"Alfa Beauty Website" <noreply@alfabeauty.co.id>';
const SMTP_TO = env.SMTP_TO; // Internal inbox

// Check if SMTP is configured
const SMTP_ENABLED = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_TO);

/**
 * Singleton transporter
 */
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
    if (!SMTP_ENABLED) return null;

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });
    }

    return transporter;
}

/**
 * Send lead notification email via SMTP.
 * Fails silently (logs error) to not block lead persistence.
 */
export async function sendLeadNotification(lead: LeadRecord): Promise<void> {
    if (!SMTP_ENABLED) {
        // Only log in dev to avoid noise
        if (process.env.NODE_ENV !== "production") {
            // console.log("SMTP not enabled, skipping email. Lead:", lead.name); 
        }
        return;
    }

    if (!SMTP_TO) {
        console.warn("[email] No recipient configured (SMTP_TO is empty)");
        return;
    }

    const mailer = getTransporter();
    if (!mailer) {
        console.warn("[email] Transporter not available (check SMTP_HOST)");
        return;
    }

    const subject = `New Lead: ${lead.name || "Unknown"}`;
    const textBody = formatLeadEmail(lead);
    const htmlBody = formatLeadEmailHtml(lead);

    try {
        await mailer.sendMail({
            from: SMTP_FROM,
            to: SMTP_TO,
            subject,
            text: textBody,
            html: htmlBody,
        });
    } catch (err) {
        logger.error("Failed to send notification", { error: String(err) });

        // TOGAF/COBIT Remediation: Cryptographic Hash of PII
        // This allows correlating the log with the database (if needed) without exposing the name in plain text.
        const nameHash = lead.name
            ? crypto.createHash("sha256").update(lead.name).digest("hex")
            : "null";

        logger.error("dead_letter_event", {
            recipient: "REDACTED",
            lead_name_hash: `sha256:${nameHash}`,
            timestamp: new Date().toISOString()
        });
        // Don't throw - lead is already saved, email is best-effort but traced.
    }
}
