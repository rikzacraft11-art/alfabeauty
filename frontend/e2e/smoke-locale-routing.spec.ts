import { expect, test } from "@playwright/test";

/**
 * Get cookie domain from Playwright baseURL or environment.
 * Allows tests to work in different environments (local, CI, staging).
 */
function getCookieDomain(): string {
  // Use env var if set (for CI with different hostnames)
  if (process.env.COOKIE_DOMAIN) {
    return process.env.COOKIE_DOMAIN;
  }
  // Default to localhost for local development
  return "localhost";
}

test("Non-locale root redirects to /en by default", async ({ page }) => {
  // Deterministic default: set cookie to en to ensure middleware chooses /en.
  await page.context().addCookies([
    {
      name: "alfab_locale",
      value: "en",
      domain: getCookieDomain(),
      path: "/",
    },
  ]);

  await page.goto("/");
  await expect(page).toHaveURL(/\/en(\/|$)/);
});

test("Non-locale paths redirect to locale-prefixed canonical URLs", async ({ page }) => {
  await page.context().addCookies([
    {
      name: "alfab_locale",
      value: "en",
      domain: getCookieDomain(),
      path: "/",
    },
  ]);

  await page.goto("/products");
  await expect(page).toHaveURL(/\/en\/products(\/|$)/);
});

test("Middleware respects locale cookie for redirects", async ({ page }) => {
  await page.context().addCookies([
    {
      name: "alfab_locale",
      value: "id",
      domain: getCookieDomain(),
      path: "/",
    },
  ]);

  await page.goto("/");
  await expect(page).toHaveURL(/\/id(\/|$)/);
});

test("Server-rendered HTML includes correct language hints", async ({ request }) => {
  const en = await request.get("/en");
  expect(en.ok()).toBeTruthy();
  const enHtml = await en.text();
  expect(enHtml).toMatch(/<html[^>]+lang=["']en["']/i);
  expect(enHtml).toMatch(/<meta[^>]+property=["']og:locale["'][^>]+content=["']en_US["']/i);

  const id = await request.get("/id");
  expect(id.ok()).toBeTruthy();
  const idHtml = await id.text();
  expect(idHtml).toMatch(/<html[^>]+lang=["']id["']/i);
  expect(idHtml).toMatch(/<meta[^>]+property=["']og:locale["'][^>]+content=["']id_ID["']/i);
});

test("Locale toggle preserves path + query", async ({ page }) => {
  await page.goto("/en/about?utm=playwright&x=1");

  // Switch to Indonesian using data-testid if available, fallback to role
  const idButton = page.getByTestId("locale-toggle-id").or(page.getByRole("button", { name: "ID" }));
  await idButton.click();

  await expect(page).toHaveURL(/\/id\/about\?utm=playwright&x=1$/);

  await expect
    .poll(async () => {
      const cookies = await page.context().cookies();
      return cookies.find((c) => c.name === "alfab_locale")?.value;
    })
    .toBe("id");
});
