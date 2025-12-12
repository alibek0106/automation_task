import { isolatedTest as test, expect } from "../../../src/fixtures";
import { DataFactory } from "../../../src/utils/DataFactory";

test.describe("TC20: Search Products and Verify Cart After Login", () => {
    test("should search products, add to cart, login, and verify cart persists", async ({
        homePage,
        loginPage,
        signupPage,
        accountCreatedPage,
        productsPage,
        cartPage,
        accountDeletedPage,
    }) => {
        const userData = DataFactory.generateUser();
        const searchTerm = "Dress";
        let addedProductNames: string[] = [];

        // Step 1-2: Navigate to home
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 3-4: Click Products and verify ALL PRODUCTS page
        await test.step("Navigate to products page", async () => {
            await homePage.clickProducts();
            await productsPage.verifyPageOpened();
        });

        // Step 5: Search for products
        await test.step(`Search for "${searchTerm}"`, async () => {
            await productsPage.search(searchTerm);
        });

        // Step 6: Verify SEARCHED PRODUCTS is visible
        await test.step("Verify searched products heading", async () => {
            await expect(productsPage.searchedProductsHeading).toBeVisible();
        });

        // Step 7: Verify products related to search are visible
        await test.step("Verify search results are displayed", async () => {
            const productCount = await productsPage.productItems.count();
            expect(productCount, `Should have products matching "${searchTerm}"`).toBeGreaterThan(0);
        });

        // Step 8: Add first 2 search results to cart
        await test.step("Add search results to cart", async () => {
            // Get product names before adding
            const firstProductName = await productsPage.productItems.nth(0).locator(".productinfo p").textContent();
            const secondProductName = await productsPage.productItems.nth(1).locator(".productinfo p").textContent();

            if (firstProductName) addedProductNames.push(firstProductName.trim());
            if (secondProductName) addedProductNames.push(secondProductName.trim());

            // Add first product
            await productsPage.addProductToCart(0);
            await productsPage.clickContinueShopping();

            // Add second product
            await productsPage.addProductToCart(1);
            await productsPage.clickViewCart();
        });

        // Step 9: Verify products in cart
        await test.step("Verify products are in cart", async () => {
            const items = await cartPage.getCartItems();
            expect(items.length, "Should have 2 products in cart").toBeGreaterThanOrEqual(2);
        });

        // Step 10: Click Signup/Login and register
        await test.step("Register new account", async () => {
            await homePage.clickSignupLogin();
            await loginPage.signup(userData.name, userData.email);
            await signupPage.fillAccountDetails(userData);
            await signupPage.clickCreateAccount();
            await expect(accountCreatedPage.successMessage).toBeVisible();
            await accountCreatedPage.clickContinue();
        });

        // Step 11: Go to cart page again
        await test.step("Navigate back to cart", async () => {
            await homePage.navigation.clickCart();
        });

        // Step 12: Verify products still visible in cart after login
        await test.step("Verify cart products persist after login", async () => {
            const items = await cartPage.getCartItems();
            expect(items.length, "Products should still be in cart after login").toBeGreaterThanOrEqual(2);

            // Verify the specific products we added are still there
            const cartProductNames = items.map(item => item.name);
            addedProductNames.forEach(productName => {
                const found = cartProductNames.some(cartName => cartName.includes(productName) || productName.includes(cartName));
                expect(found, `Product "${productName}" should be in cart after login`).toBeTruthy();
            });
        });

        // Cleanup: Delete account
        await test.step("Delete account", async () => {
            await homePage.navigation.clickDeleteAccount();
            await accountDeletedPage.verifyAccountDeleted();
            await accountDeletedPage.clickContinue();
        });
    });
});
