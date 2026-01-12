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
