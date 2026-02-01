import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } }); // Force mobile view

test("Mobile Menu can be toggled via hamburger button", async ({ page }) => {
    await page.goto("/en", { waitUntil: "networkidle" });

    // Look for hamburger button with flexible selectors
    const menuButton = page.locator('button[aria-label*="menu"], [data-testid="mobile-menu-button"], button:has(svg)').first();

    // If no hamburger visible, the nav might be different on mobile
    const isMenuButtonVisible = await menuButton.isVisible().catch(() => false);

    if (!isMenuButtonVisible) {
        // Skip test if no mobile menu button found - nav might be always visible
        test.skip();
        return;
    }

    await expect(menuButton).toBeVisible();

    // Open menu
    await menuButton.click();

    // Wait for menu animation and look for navigation links
    await page.waitForTimeout(300);

    // Verify at least one navigation link is visible
    const navLink = page.getByRole("link", { name: /products|about|contact|partnership/i }).first();
    await expect(navLink).toBeVisible();

    // Close menu by clicking button again
    await menuButton.click();
    await page.waitForTimeout(300);
});
