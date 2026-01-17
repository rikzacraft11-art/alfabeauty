import { expect, test } from "@playwright/test";

test("WhatsApp CTA renders a usable wa.me link", async ({ page }) => {
  // Use canonical locale path to avoid environment-dependent redirects.
  await page.goto("/en");

  const link = page.getByRole("link", { name: /whatsapp consult/i }).first();
  await expect(link).toBeVisible();

  const href = await link.getAttribute("href");
  expect(href, "WhatsApp CTA must have an href").toBeTruthy();
  expect(href!).not.toBe("#");

  // Prefer WA deeplink; if env is misconfigured, fallback is a mailto.
  expect(href!).toMatch(/^(https:\/\/wa\.me\/|mailto:)/);
});

/**
 * UAT-05/§7: Verify cta_whatsapp_click event is logged when CTA is clicked.
 * This validates conversion SLI "WA click success rate (event logged)".
 */
test("WhatsApp CTA click sends analytics event", async ({ page }) => {
  await page.goto("/en");

  // Set up request interception before clicking
  const eventRequestPromise = page.waitForRequest(
    (req) => req.url().includes("/api/events") && req.method() === "POST",
    { timeout: 5000 }
  );

  const link = page.getByRole("link", { name: /whatsapp consult/i }).first();
  await link.click();

  const request = await eventRequestPromise;
  const body = JSON.parse(request.postData() ?? "{}");

  expect(body.event_name).toBe("cta_whatsapp_click");
  expect(body).toHaveProperty("href");
  expect(body).toHaveProperty("target");
});
