
import { test, expect } from '../../fixtures/pageFixtures';

/**
 * TC09: Product Category and Brand Filtering
 *
 * Priority: Medium
 * Type: Functional
 * Requires: Any user state
 *
 * Objective: Verify users can filter products by categories and brands, and results are accurate.
 */

test.describe('TC09: Product Category and Brand Filtering', () => {

    test('should verify product filtering by category and brand', async ({
        page,
        homePage,
        productsPage
    }) => {
        // Step 1: Navigate to homepage
        await test.step('Navigate to homepage', async () => {
            await homePage.navigateToHome();
            await homePage.verifyHomepageLoaded();
        });

        // Step 2: Verify category sidebar is visible
        await test.step('Verify category sidebar is visible', async () => {
            // Category sidebar is #accordian
            await expect(page.locator('#accordian')).toBeVisible();
            await expect(page.getByText('Category', { exact: true })).toBeVisible();
        });

        // Step 3-7: Filter by "Women" > "Dress"
        await test.step('Filter by Category: Women > Dress', async () => {
            await productsPage.selectCategory('Women', 'Dress');
            await productsPage.verifyCategoryTitle('Women - Dress Products');

            // Verify products match category (check count > 0)
            const count = await page.locator('.features_items .col-sm-4').count();
            expect(count).toBeGreaterThan(0);
        });

        // Step 8-10: Filter by "Men" > "Jeans"
        await test.step('Filter by Category: Men > Jeans', async () => {
            await productsPage.selectCategory('Men', 'Jeans');
            await productsPage.verifyCategoryTitle('Men - Jeans Products');

            // Verify products match category
            const count = await page.locator('.features_items .col-sm-4').count();
            expect(count).toBeGreaterThan(0);
        });

        // Step 11-12: Navigate to brands section (verify visibility)
        await test.step('Verify brands sidebar is visible', async () => {
            await expect(page.locator('.brands_products')).toBeVisible();
            await expect(page.getByText('Brands', { exact: true })).toBeVisible();
        });

        // Step 13-15: Click on "Polo" brand
        await test.step('Filter by Brand: Polo', async () => {
            await productsPage.selectBrand('Polo');
            await productsPage.verifyCategoryTitle('Brand - Polo Products');

            const count = await page.locator('.features_items .col-sm-4').count();
            expect(count).toBeGreaterThan(0);
        });

        // Step 16-17: Click on "H&M" brand
        await test.step('Filter by Brand: H&M', async () => {
            await productsPage.selectBrand('H&M');
            await productsPage.verifyCategoryTitle('Brand - H&M Products');

            const count = await page.locator('.features_items .col-sm-4').count();
            expect(count).toBeGreaterThan(0);
        });
    });
});
