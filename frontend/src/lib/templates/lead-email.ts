import { LeadRecord } from "@/lib/types";

/**
 * Format lead data into text email body
 */
export function formatLeadEmail(lead: LeadRecord): string {
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
export function formatLeadEmailHtml(lead: LeadRecord): string {
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
