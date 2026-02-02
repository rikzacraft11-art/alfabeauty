import { expect, test } from "@playwright/test";

async function advanceToStep4(page: any, businessName: string) {
  await page.goto("/en/partnership");

  // Step 1
  await page.getByLabel(/business name/i).fill(businessName);
  await page.getByLabel(/city/i).fill("Bandung");
  await page.getByRole("button", { name: /salon/i }).first().click();
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 2
  await expect(page.getByLabel(/contact name/i)).toBeVisible();
  await page.getByLabel(/contact name/i).fill("Dewi");
  await page.getByLabel(/email/i).fill("dewi@example.com");
  await page.getByLabel(/whatsapp/i).fill("081234567890");
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 3 (optional)
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 4
  await expect(page.getByRole("checkbox")).toBeVisible();
}

test("Become Partner form can submit successfully", async ({ page }) => {
  const runId = process.env.PLAYWRIGHT_E2E_RUN_ID ?? String(Date.now());
  await advanceToStep4(page, `Salon Mawar (E2E ${runId})`);

  const submit = page.getByRole("button", { name: /^submit$/i });
  await expect(submit).toBeDisabled();

  await page.getByRole("checkbox").check();
  await expect(submit).toBeEnabled();

  await submit.click();

  await expect(page.getByText(/thank you/i)).toBeVisible();
  await expect(page.getByText(/we received your details/i)).toBeVisible();
});

test("Become Partner form requires consent before enabling submit", async ({ page }) => {
  await advanceToStep4(page, "Salon Mawar");

  const submit = page.getByRole("button", { name: /^submit$/i });
  await expect(submit).toBeDisabled();

  await page.getByRole("checkbox").check();
  await expect(submit).toBeEnabled();
});

test("Become Partner shows friendly message on rate limit (429)", async ({ page }) => {
  await advanceToStep4(page, "Salon Trigger TRIGGER_429");

  const submit = page.getByRole("button", { name: /^submit$/i });
  await page.getByRole("checkbox").check();
  await submit.click();

  await expect(page.getByText(/too many requests/i)).toBeVisible();
  await expect(submit).toBeEnabled();
});

test("Become Partner shows server error message (>=400)", async ({ page }) => {
  await advanceToStep4(page, "Salon Trigger TRIGGER_500");

  const submit = page.getByRole("button", { name: /^submit$/i });
  await page.getByRole("checkbox").check();
  await submit.click();

  await expect(page.getByText(/submission failed/i)).toBeVisible();
  await expect(submit).toBeEnabled();
});
