import { test, expect } from "@playwright/test";

/**
 * V2 Smoke Tests
 * ITIL OPS-10: Quality Gate for Design V2 routes
 * 
 * These tests verify critical V2 functionality before deployment.
 */

test.describe("V2 Homepage", () => {
    test.beforeEach(async ({ page }) => {
        // V2 routes are at root (not locale-prefixed yet)
        await page.goto("/", { waitUntil: "networkidle" });
    });

    test("should render Hero section with CTAs", async ({ page }) => {
        // Hero headline should be visible
        const heroHeadline = page.locator("h1");
        await expect(heroHeadline).toBeVisible();

        // CTAs should be present
        const exploreBrands = page.getByRole("link", { name: /explore.*brands/i });
        const partnerWithUs = page.getByRole("link", { name: /partner.*with.*us/i });

        await expect(exploreBrands).toBeVisible();
        await expect(partnerWithUs).toBeVisible();
    });

    test("should have working navigation", async ({ page }) => {
        // Desktop nav should be visible
        const nav = page.locator("nav");
        await expect(nav).toBeVisible();

        // Logo should link to home
        const logo = page.getByRole("link", { name: /alfa.*beauty/i }).first();
        await expect(logo).toBeVisible();
    });

    test("should show WhatsApp CTA after scroll", async ({ page }) => {
        // Scroll down to trigger WhatsApp CTA
        await page.evaluate(() => window.scrollBy(0, 500));
        await page.waitForTimeout(500); // Wait for animation

        // WhatsApp button should appear
        const whatsappCTA = page.locator("[aria-label*='WhatsApp']");
        await expect(whatsappCTA).toBeVisible();
    });
});

test.describe("V2 Products", () => {
    test("should load products grid", async ({ page }) => {
        await page.goto("/products", { waitUntil: "networkidle" });

        // Page title should be visible
        const pageTitle = page.getByRole("heading", { level: 1 });
        await expect(pageTitle).toBeVisible();

        // Product cards or grid should exist
        const productGrid = page.locator("[data-testid='product-grid'], .grid");
        await expect(productGrid).toBeVisible();
    });
});

test.describe("V2 Partnership", () => {
    test("should render partnership form", async ({ page }) => {
        await page.goto("/partnership", { waitUntil: "networkidle" });

        // Page should load
        const pageTitle = page.getByRole("heading", { level: 1 });
        await expect(pageTitle).toBeVisible();

        // Form or step indicator should exist
        const formContent = page.locator("form, [data-step]");
        await expect(formContent).toBeVisible();
    });
});

test.describe("V2 Static Pages", () => {
    test("About page loads", async ({ page }) => {
        await page.goto("/about", { waitUntil: "networkidle" });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("Contact page loads", async ({ page }) => {
        await page.goto("/contact", { waitUntil: "networkidle" });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("Privacy page loads", async ({ page }) => {
        await page.goto("/privacy", { waitUntil: "networkidle" });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("Terms page loads", async ({ page }) => {
        await page.goto("/terms", { waitUntil: "networkidle" });
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
});

test.describe("V2 Accessibility", () => {
    test("skip link should be focusable", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        // Tab to skip link
        await page.keyboard.press("Tab");

        // Skip link should be focused
        const skipLink = page.locator(".skip-link, [href='#main-content']");
        await expect(skipLink).toBeFocused();
    });

    test("main content should have id for skip link", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        // Main content landmark should exist
        const mainContent = page.locator("#main-content, main");
        await expect(mainContent).toBeVisible();
    });
});
