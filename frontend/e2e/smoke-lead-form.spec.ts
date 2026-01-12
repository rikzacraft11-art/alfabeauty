import { expect, test } from "@playwright/test";

test("Become Partner form can submit successfully", async ({ page }) => {
  const allowRealLeadSubmit = process.env.PLAYWRIGHT_ALLOW_REAL_LEAD_SUBMIT === "true";
  const runId = process.env.PLAYWRIGHT_E2E_RUN_ID ?? String(Date.now());

  // Safety: by default, do not create real leads when running against staging/prod.
  // Set PLAYWRIGHT_ALLOW_REAL_LEAD_SUBMIT=true to enable a real submit.
  let apiWasCalled = false;
  if (!allowRealLeadSubmit) {
    await page.route("**/api/leads", async (route) => {
      apiWasCalled = true;
      await route.fulfill({
        status: 202,
        contentType: "application/json; charset=utf-8",
        body: JSON.stringify({ status: "accepted", source: "playwright", run_id: runId }),
      });
    });
  }

  // Use canonical locale path to avoid environment-dependent redirects.
  await page.goto("/en/partnership/become-partner");

  const submit = page.getByRole("button", { name: /^submit$/i });
  await expect(submit).toBeVisible();
  await expect(submit).toBeDisabled();

  await page.getByLabel(/business name/i).fill(`Salon Mawar (E2E ${runId})`);
  await page.getByLabel(/contact name/i).fill(`Dewi (E2E ${runId})`);
  await page.getByLabel(/whatsapp number/i).fill("081234567890");
  await page.getByLabel(/city/i).fill("Bandung");
  await page.getByLabel(/salon type/i).selectOption("SALON");

  // Consent is required.
  const consent = page.getByRole("checkbox", { name: /consent to be contacted/i });
  await consent.check();

  await expect(submit).toBeEnabled();

  await submit.click();

  await expect(page.getByText(/thank you/i)).toBeVisible();
  await expect(page.getByText(/we received your details/i)).toBeVisible();

  if (!allowRealLeadSubmit) {
    expect(apiWasCalled, "UI must attempt to call /api/leads").toBe(true);
  }
});

test("Become Partner form requires consent before enabling submit", async ({ page }) => {
  await page.goto("/en/partnership/become-partner");

  const submit = page.getByRole("button", { name: /^submit$/i });
  await expect(submit).toBeVisible();

  await page.getByLabel(/business name/i).fill("Salon Mawar");
  await page.getByLabel(/contact name/i).fill("Dewi");
  await page.getByLabel(/whatsapp number/i).fill("081234567890");
  await page.getByLabel(/city/i).fill("Bandung");
  await page.getByLabel(/salon type/i).selectOption("SALON");

  // Without consent, submit must stay disabled.
  await expect(submit).toBeDisabled();

  await page.getByRole("checkbox", { name: /consent to be contacted/i }).check();
  await expect(submit).toBeEnabled();
});

test("Become Partner shows friendly message on rate limit (429)", async ({ page }) => {
  await page.route("**/api/leads", async (route) => {
    await route.fulfill({
      status: 429,
      contentType: "application/json; charset=utf-8",
      body: JSON.stringify({ error: "rate_limited" }),
    });
  });

  await page.goto("/en/partnership/become-partner");

  await page.getByLabel(/business name/i).fill("Salon Mawar");
  await page.getByLabel(/contact name/i).fill("Dewi");
  await page.getByLabel(/whatsapp number/i).fill("081234567890");
  await page.getByLabel(/city/i).fill("Bandung");
  await page.getByLabel(/salon type/i).selectOption("SALON");
  await page.getByRole("checkbox", { name: /consent to be contacted/i }).check();

  const submit = page.getByRole("button", { name: /^submit$/i });
  await submit.click();

  await expect(page.getByText(/too many requests/i)).toBeVisible();
  await expect(submit).toBeEnabled();
});

test("Become Partner shows server error message (>=400)", async ({ page }) => {
  await page.route("**/api/leads", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json; charset=utf-8",
      body: JSON.stringify({ error: "Something broke" }),
    });
  });

  await page.goto("/en/partnership/become-partner");

  await page.getByLabel(/business name/i).fill("Salon Mawar");
  await page.getByLabel(/contact name/i).fill("Dewi");
  await page.getByLabel(/whatsapp number/i).fill("081234567890");
  await page.getByLabel(/city/i).fill("Bandung");
  await page.getByLabel(/salon type/i).selectOption("SALON");
  await page.getByRole("checkbox", { name: /consent to be contacted/i }).check();

  const submit = page.getByRole("button", { name: /^submit$/i });
  await submit.click();

  await expect(page.getByText(/something broke/i)).toBeVisible();
  await expect(submit).toBeEnabled();
});
