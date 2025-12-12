import { test, expect } from "../../../src/fixtures";

test.describe("TC09: Product Category and Brand Filtering", () => {
    test("should filter products by category", async ({ homePage, productsPage }) => {
        // Step 1: Navigate to homepage
        await test.step("Navigate to homepage", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 2: Verify category sidebar is visible
        await test.step("Verify category sidebar is visible", async () => {
            await expect(
                productsPage.categorySidebar,
                "Category sidebar should be visible"
            ).toBeVisible();
        });

        // Step 3: Click on Women > Dress category
        await test.step("Select Women > Dress category", async () => {
            await productsPage.selectCategory("Women", "Dress");
        });

        // Step 4: Verify category title is displayed
        await test.step("Verify Women - Dress products page", async () => {
            await productsPage.verifyCategoryTitle("Women - Dress");
            await productsPage.verifyProductsListVisible();
        });

        // Step 5: Get product count for this category
        await test.step("Verify products are displayed", async () => {
            const productCount = await productsPage.getProductCount();
            expect(productCount, "Category should have at least one product").toBeGreaterThan(0);
        });

        // Step 6: Switch to different category (Men > Jeans)
        await test.step("Select Men > Jeans category", async () => {
            await productsPage.selectCategory("Men", "Jeans");
        });

        // Step 7: Verify new category products displayed
        await test.step("Verify Men - Jeans products page", async () => {
            await productsPage.verifyCategoryTitle("Men - Jeans");
            await productsPage.verifyProductsListVisible();

            const productCount = await productsPage.getProductCount();
            expect(productCount, "Category should have at least one product").toBeGreaterThan(0);
        });
    });

    test("should filter products by brand", async ({ homePage, productsPage }) => {
        // Step 1: Navigate to products page
        await test.step("Navigate to products page", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.verifyPageOpened();
        });

        // Step 2: Verify brands sidebar is visible
        await test.step("Verify brands sidebar is visible", async () => {
            await expect(
                productsPage.brandsSidebar,
                "Brands sidebar should be visible"
            ).toBeVisible();
        });

        // Step 3: Click on Polo brand
        await test.step("Select Polo brand", async () => {
            await productsPage.selectBrand("Polo");
        });

        // Step 4: Verify brand title is displayed
        await test.step("Verify Polo brand products page", async () => {
            await productsPage.verifyBrandTitle("Polo");
            await productsPage.verifyProductsListVisible();
        });

        // Step 5: Verify products are displayed
        await test.step("Verify brand has products", async () => {
            const productCount = await productsPage.getProductCount();
            expect(productCount, "Brand should have at least one product").toBeGreaterThan(0);
        });

        // Step 6: Switch to different brand (H&M)
        await test.step("Select H&M brand", async () => {
            await productsPage.selectBrand("H&M");
        });

        // Step 7: Verify new brand products displayed
        await test.step("Verify H&M brand products page", async () => {
            await productsPage.verifyBrandTitle("H&M");
            await productsPage.verifyProductsListVisible();

            const productCount = await productsPage.getProductCount();
            expect(productCount, "Brand should have at least one product").toBeGreaterThan(0);
        });
    });
});
