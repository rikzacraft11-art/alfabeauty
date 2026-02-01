import { test, expect } from "@playwright/test";

/**
 * V2 Smoke Tests
 * ITIL OPS-10: Quality Gate for Design V2 routes
 * 
 * These tests verify critical V2 functionality before deployment.
 * All paths use /en locale prefix as required by middleware.
 */

test.describe("V2 Homepage", () => {
    test.beforeEach(async ({ page }) => {
        // Use locale-prefixed path (required by middleware)
        await page.goto("/en", { waitUntil: "networkidle" });
    });

    test("should render Hero section with CTAs", async ({ page }) => {
        // Hero headline should be visible
        const heroHeadline = page.locator("h1");
        await expect(heroHeadline).toBeVisible();

        // CTAs should be present - use more flexible selectors
        const exploreBrands = page.getByRole("link", { name: /explore|brands|products/i }).first();
        const partnerWithUs = page.getByRole("link", { name: /partner|join|become/i }).first();

        // At least one CTA should be visible
        const explorerVisible = await exploreBrands.isVisible().catch(() => false);
        const partnerVisible = await partnerWithUs.isVisible().catch(() => false);

        expect(explorerVisible || partnerVisible).toBe(true);
    });

    test("should have working navigation", async ({ page }) => {
        // Desktop nav should be visible
        const nav = page.locator("nav");
        await expect(nav).toBeVisible();

        // Logo should link to home
        const logo = page.locator("nav a").first();
        await expect(logo).toBeVisible();
    });

    test("should show WhatsApp CTA after scroll", async ({ page }) => {
        // Scroll down to trigger WhatsApp CTA
        await page.evaluate(() => window.scrollBy(0, 500));

        // Wait for any WhatsApp element (floating button or link)
        const whatsappCTA = page.locator("a[href*='wa.me'], [aria-label*='WhatsApp'], [data-testid='whatsapp-cta']").first();

        // Give it time to appear after scroll
        await expect(whatsappCTA).toBeVisible({ timeout: 5000 });
    });
});

test.describe("V2 Products", () => {
    test("should load products page", async ({ page }) => {
        await page.goto("/en/products", { waitUntil: "networkidle" });

        // Page should load with heading
        const pageTitle = page.getByRole("heading", { level: 1 });
        await expect(pageTitle).toBeVisible();
    });
});

test.describe("V2 Partnership", () => {
    test("should render partnership page", async ({ page }) => {
        await page.goto("/en/partnership", { waitUntil: "networkidle" });

        // Page should load
        const pageTitle = page.getByRole("heading", { level: 1 });
        await expect(pageTitle).toBeVisible();
    });
});

test.describe("V2 Static Pages", () => {
    test("About page loads", async ({ page }) => {
        await page.goto("/en/about", { waitUntil: "networkidle" });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("Contact page loads", async ({ page }) => {
        await page.goto("/en/contact", { waitUntil: "networkidle" });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("Privacy page loads", async ({ page }) => {
        await page.goto("/en/privacy", { waitUntil: "networkidle" });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("Terms page loads", async ({ page }) => {
        await page.goto("/en/terms", { waitUntil: "networkidle" });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
});

test.describe("V2 Accessibility", () => {
    test("main content should exist", async ({ page }) => {
        await page.goto("/en", { waitUntil: "networkidle" });

        // Main content landmark should exist
        const mainContent = page.locator("main");
        await expect(mainContent).toBeVisible();
    });
});
