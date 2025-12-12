import { test, expect } from "../../../src/fixtures";

test.describe.serial("TC17: Remove Products From Cart", () => {
    test("should add product to cart and successfully remove it", async ({
        homePage,
        productsPage,
        productDetailPage,
        cartPage,
    }) => {
        let productName: string;

        // Step 1-3: Navigate to home
        await test.step("Navigate to home page", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 4: Add product to cart
        await test.step("Add product to cart", async () => {
            await homePage.clickProducts();
            await productsPage.clickViewProduct(0);
            productName = await productDetailPage.getProductName();
            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 5-6: Verify cart page displayed
        await test.step("Verify cart page and product exists", async () => {
            await cartPage.verifyPageOpened();
            await cartPage.verifyCartTableVisible();
            await cartPage.verifyProductInCart(productName);
        });

        // Step 7: Click X button to remove product
        await test.step("Remove product from cart", async () => {
            await cartPage.removeProductByName(productName);
            // Wait for removal to complete
            await cartPage.page.waitForLoadState("networkidle");
            await cartPage.page.waitForTimeout(2000);
        });

        // Step 8: Verify product is removed
        await test.step("Verify product removed from cart", async () => {
            // Verify the specific product no longer exists
            const productExists = await cartPage.page.locator(`tr:has-text("${productName}")`).count();
            expect(productExists, `Product "${productName}" should not exist in cart`).toBe(0);
        });
    });
});
