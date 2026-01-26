import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || '"Alfa Beauty Website" <noreply@alfabeauty.co.id>';
const SMTP_TO = process.env.SMTP_TO; // Internal inbox

// Check if SMTP is configured
const SMTP_ENABLED = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_TO);

export type LeadRecord = {
    name: string;
    phone: string;
    email: string;
    message: string;
    ip_address: string;
    page_url_current: string;
    page_url_initial: string;
    raw: unknown;
};

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
            console.log("[email] SMTP not enabled, skipping notification");
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
        const info = await mailer.sendMail({
            from: SMTP_FROM,
            to: SMTP_TO,
            subject,
            text: textBody,
            html: htmlBody,
        });
        console.log("[email] Lead notification sent:", info.messageId);
    } catch (err) {
        console.error("[email] Failed to send notification:", err);
        // Don't throw - lead is already saved, email is best-effort
    }
}

/**
 * Format lead data into email body
 */
function formatLeadEmail(lead: LeadRecord): string {
    const lines: string[] = [
        "=== New Lead Notification ===",
        "",
        `Name: ${lead.name || "-"}`,
        `Phone: ${lead.phone || "-"}`,
        `Email: ${lead.email || "-"}`,
        `Message: ${lead.message || "-"}`,
        "",
        "--- Partner Profile ---",
        `Business: ${(lead.raw as any).business_name || "-"}`,
        `City: ${(lead.raw as any).city || "-"}`,
        `Type: ${(lead.raw as any).salon_type || "-"}`,
        `Chair Count: ${(lead.raw as any).chair_count || "-"}`,
        `Specialization: ${(lead.raw as any).specialization || "-"}`,
        `Brands: ${(lead.raw as any).current_brands_used || "-"}`,
        `Spend: ${(lead.raw as any).monthly_spend_range || "-"}`,
        "",
        "--- Tech Info ---",
        `IP: ${lead.ip_address || "-"}`,
        `Source: ${lead.page_url_current || "-"}`,
        `Initial Page: ${lead.page_url_initial || "-"}`,
    ];

    return lines.join("\n");
}

/**
 * Format lead data into HTML email body
 */
function formatLeadEmailHtml(lead: LeadRecord): string {
    const raw = lead.raw as Record<string, unknown> | undefined;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Lead Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
        🎉 New Lead: ${escapeHtml(String(lead.name || "Unknown"))}
    </h2>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(String(lead.name || "-"))}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(String(lead.phone || "-"))}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(String(lead.email || "-"))}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Message</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(String(lead.message || "-"))}</td>
        </tr>
    </table>
    
    ${raw ? `
    <h3 style="color: #7f8c8d; margin-top: 30px;">Partner Profile Data</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 14px;">
        ${raw.business_name ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Business</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(String(raw.business_name))}</td></tr>` : ""}
        ${raw.city ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">City</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(String(raw.city))}</td></tr>` : ""}
        ${raw.salon_type ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(String(raw.salon_type))}</td></tr>` : ""}
        ${raw.chair_count ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Chairs</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(String(raw.chair_count))}</td></tr>` : ""}
        ${raw.specialization ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Specialization</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(String(raw.specialization))}</td></tr>` : ""}
        ${raw.current_brands_used ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Brands</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(String(raw.current_brands_used))}</td></tr>` : ""}
        ${raw.monthly_spend_range ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Spend</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(String(raw.monthly_spend_range))}</td></tr>` : ""}
    </table>
    ` : ""}

    <div style="margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
        <p>Source: ${escapeHtml(String(lead.page_url_current || "-"))}</p>
        <p>IP: ${escapeHtml(String(lead.ip_address || "unknown"))}</p>
    </div>
</body>
</html>
    `;
}

/**
 * Basic HTML escape to prevent injection in email body
 */
function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
