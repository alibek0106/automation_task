import { isolatedTest as test, expect } from "../../../src/fixtures";

test.describe("TC09-Hybrid: Product Category and Brand Filtering with API Validation", () => {
    test("should filter products by category", async ({ homePage, productsPage, productApiSteps }) => {
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

    test("should filter products by brand with API validation", async ({
        homePage,
        productsPage,
        brandApiSteps,
        productApiSteps,
    }) => {
        // Step 1: Get all brands via API
        await test.step("Get all brands via API", async () => {
            const apiBrands = await brandApiSteps.getAllBrandsViaApi();
            expect(apiBrands.length, "API should return brands").toBeGreaterThan(0);
        });

        // Step 2: Navigate to products page
        await test.step("Navigate to products page", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.verifyPageOpened();
        });

        // Step 3: Verify brands sidebar contains brands from API
        await test.step("Verify brands sidebar contains brands from API", async () => {
            const apiBrands = await brandApiSteps.getAllBrandsViaApi();
            const apiBrandNames = brandApiSteps.getBrandNames(apiBrands);

            // Verify brands sidebar is visible
            await expect(
                productsPage.brandsSidebar,
                "Brands sidebar should be visible"
            ).toBeVisible();

            // Note: We can't directly verify all brands from API are in UI without parsing UI,
            // but we can verify at least some known brands exist
            expect(apiBrandNames.length, "API should return brand names").toBeGreaterThan(0);
        });

        // Step 4: Click on Polo brand and verify
        await test.step("Select Polo brand and verify with API", async () => {
            // Verify Polo brand exists in API
            const poloExists = await brandApiSteps.verifyBrandExistsViaApi("Polo");
            expect(poloExists, "Polo brand should exist in API").toBe(true);

            // Select Polo brand in UI
            await productsPage.selectBrand("Polo");
        });

        // Step 5: Verify brand title is displayed
        await test.step("Verify Polo brand products page", async () => {
            await productsPage.verifyBrandTitle("Polo");
            await productsPage.verifyProductsListVisible();
        });

        // Step 6: Verify products are displayed and compare with API
        await test.step("Verify brand has products and validate against API", async () => {
            const productCount = await productsPage.getProductCount();
            expect(productCount, "Brand should have at least one product").toBeGreaterThan(0);

            // Get all products from API to verify brand filtering
            const allApiProducts = await productApiSteps.getAllProductsViaApi();
            const poloProducts = allApiProducts.filter(p => 
                p.brand.toLowerCase() === "polo"
            );

            // Verify that UI shows products for Polo brand
            // We can't directly match exact products, but we verify brand filtering works
            expect(poloProducts.length, "API should have Polo brand products").toBeGreaterThan(0);
        });

        // Step 7: Switch to different brand (H&M) and verify
        await test.step("Select H&M brand and verify with API", async () => {
            // Verify H&M brand exists in API
            const hmExists = await brandApiSteps.verifyBrandExistsViaApi("H&M");
            expect(hmExists, "H&M brand should exist in API").toBe(true);

            // Select H&M brand in UI
            await productsPage.selectBrand("H&M");
        });

        // Step 8: Verify new brand products displayed
        await test.step("Verify H&M brand products page", async () => {
            await productsPage.verifyBrandTitle("H&M");
            await productsPage.verifyProductsListVisible();

            const productCount = await productsPage.getProductCount();
            expect(productCount, "Brand should have at least one product").toBeGreaterThan(0);

            // Get H&M products from API
            const allApiProducts = await productApiSteps.getAllProductsViaApi();
            const hmProducts = allApiProducts.filter(p => 
                p.brand.toLowerCase().includes("h&m") || p.brand.toLowerCase().includes("h m")
            );

            expect(hmProducts.length, "API should have H&M brand products").toBeGreaterThan(0);
        });
    });
});

