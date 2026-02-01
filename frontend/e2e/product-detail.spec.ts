import { test, expect } from '@playwright/test';

test.describe('Product Detail Journey', () => {
    test('should load products page with catalog', async ({ page }) => {
        // Go to Products Page (Catalog)
        await page.goto('/en/products', { waitUntil: 'networkidle' });

        // Verify page loads with heading
        const pageTitle = page.getByRole('heading', { level: 1 });
        await expect(pageTitle).toBeVisible();

        // Look for any product content
        const productContent = page.locator('article, [data-testid="product-card"], .product-card, .grid').first();
        await expect(productContent).toBeVisible();
    });

    test('should load correct locale content (ID)', async ({ page }) => {
        await page.goto('/id/products', { waitUntil: 'networkidle' });

        // Verify URL contains /id/
        await expect(page).toHaveURL(/\/id\/products/);

        // Page should load
        const pageTitle = page.getByRole('heading', { level: 1 });
        await expect(pageTitle).toBeVisible();
    });
});
