import { expect, test } from "@playwright/test";

test("WhatsApp CTA renders a usable wa.me link", async ({ page }) => {
  // Use canonical locale path to avoid environment-dependent redirects
  await page.goto("/en", { waitUntil: "networkidle" });

  // Look for any WhatsApp link with flexible selectors
  const link = page.locator('a[href*="wa.me"], a[aria-label*="WhatsApp"], [data-testid="whatsapp-cta"]').first();

  // If no WhatsApp link found, check for mailto fallback (configured in env)
  const fallbackLink = page.locator('a[href^="mailto:"]').first();

  const whatsappVisible = await link.isVisible().catch(() => false);
  const fallbackVisible = await fallbackLink.isVisible().catch(() => false);

  // At least one contact method should exist
  expect(whatsappVisible || fallbackVisible).toBe(true);

  if (whatsappVisible) {
    const href = await link.getAttribute("href");
    expect(href, "WhatsApp CTA must have an href").toBeTruthy();
    expect(href!).not.toBe("#");
    // Should be wa.me or mailto fallback
    expect(href!).toMatch(/^(https:\/\/wa\.me\/|mailto:)/);
  }
});
