import { isolatedTest as test, expect } from "../../../src/fixtures";
import { DataFactory } from "../../../src/utils/DataFactory";
import { User } from "../../../src/models/UserModels";

test.describe("TC03-Hybrid: Add Multiple Products to Cart (API Setup)", () => {
    let testUser: User;

    test.beforeEach(async ({ userApiSteps, homePage, loginPage }) => {
        // Step 1: Create user via API (faster than UI registration)
        testUser = DataFactory.generateUser();
        await userApiSteps.createUserViaApi(testUser);

        // Step 2: Login via UI (validates login flow)
        await homePage.goto();
        await homePage.clickSignupLogin();
        await loginPage.login(testUser.email, testUser.password);
        await expect(
            homePage.loggedInText,
            "User should be logged in after API creation"
        ).toContainText(testUser.name);
    });

    test.afterEach(async ({ userApiSteps }) => {
        // Cleanup: Delete user via API
        await userApiSteps.deleteUserViaApi(testUser.email, testUser.password);
    });

    test("should add multiple products with different quantities and verify cart with API price validation", async ({
        homePage,
        productsPage,
        productDetailPage,
        cartPage,
        productApiSteps,
    }) => {
        let firstProductName: string;
        let secondProductName: string;
        let firstProductApiPrice: string;
        let secondProductApiPrice: string;
        const firstProductQuantity = 3;

        // Step 1: Get all products via API for price validation
        await test.step("Get all products via API", async () => {
            const apiProducts = await productApiSteps.getAllProductsViaApi();
            expect(
                apiProducts.length,
                "API should return products"
            ).toBeGreaterThan(0);
        });

        // Step 2: Navigate to products page
        await test.step("Navigate to products page", async () => {
            await homePage.goto();
            await homePage.clickProducts();
            await productsPage.verifyPageOpened();
            await productsPage.verifyProductsListVisible();
        });

        // Step 3: Select first product and view details
        await test.step("View first product details and get API price", async () => {
            await productsPage.clickViewProduct(0);
            await productDetailPage.verifyProductDetailVisible();
            firstProductName = await productDetailPage.getProductName();

            // Get product details from API
            const apiProducts = await productApiSteps.getAllProductsViaApi();
            const apiProduct = productApiSteps.getProductByNameViaApi(apiProducts, firstProductName);
            expect(
                apiProduct,
                `Product "${firstProductName}" should exist in API`
            ).toBeDefined();
            
            if (!apiProduct) {
                throw new Error(`Product "${firstProductName}" not found in API products list`);
            }
            
            firstProductApiPrice = apiProduct.price;
        });

        // Step 4: Set quantity to 3 and add to cart
        await test.step("Add first product with quantity 3", async () => {
            await productDetailPage.setQuantity(firstProductQuantity);
            await productDetailPage.addToCart();
            await productDetailPage.clickContinueShopping();
        });

        // Step 5: Navigate back to products
        await test.step("Return to products page", async () => {
            await productsPage.goto();
            await productsPage.verifyProductsListVisible();
        });

        // Step 6: Add second product (different from first)
        await test.step("Add second product with quantity 1 and get API price", async () => {
            await productsPage.goto();
            await productsPage.clickViewProduct(1);
            secondProductName = await productDetailPage.getProductName();

            // Get second product details from API
            const apiProducts = await productApiSteps.getAllProductsViaApi();
            const apiProduct = productApiSteps.getProductByNameViaApi(apiProducts, secondProductName);
            expect(
                apiProduct,
                `Product "${secondProductName}" should exist in API`
            ).toBeDefined();
            
            if (!apiProduct) {
                throw new Error(`Product "${secondProductName}" not found in API products list`);
            }
            
            secondProductApiPrice = apiProduct.price;

            await productDetailPage.addToCart();
            await productDetailPage.clickViewCart();
        });

        // Step 7: Verify cart contains both products
        await test.step("Verify both products in cart", async () => {
            await cartPage.verifyCartTableVisible();
            await cartPage.verifyProductInCart(firstProductName);
            await cartPage.verifyProductInCart(secondProductName);
        });

        // Step 8: Verify quantities
        await test.step("Verify product quantities", async () => {
            const firstQty = await cartPage.getProductQuantity(firstProductName);
            const secondQty = await cartPage.getProductQuantity(secondProductName);

            expect(
                firstQty,
                `First product should have quantity ${firstProductQuantity}`
            ).toBe(firstProductQuantity);
            expect(secondQty, "Second product should have quantity 1").toBe(1);
        });

        // Step 9: Verify cart prices match API product prices
        await test.step("Verify cart prices match API product prices", async () => {
            const items = await cartPage.getCartItems();
            
            // Find first product in cart
            const firstCartItem = items.find(item => item.name === firstProductName);
            expect(firstCartItem, "First product should be in cart").toBeDefined();
            if (firstCartItem) {
                const pricesMatch = productApiSteps.verifyProductPricesMatch(
                    { name: firstProductName, price: firstProductApiPrice, id: 0, brand: "" },
                    firstCartItem.price
                );
                expect(
                    pricesMatch,
                    `First product price in cart (${firstCartItem.price}) should match API price (${firstProductApiPrice})`
                ).toBe(true);
            }

            // Find second product in cart
            const secondCartItem = items.find(item => item.name === secondProductName);
            expect(secondCartItem, "Second product should be in cart").toBeDefined();
            if (secondCartItem) {
                const pricesMatch = productApiSteps.verifyProductPricesMatch(
                    { name: secondProductName, price: secondProductApiPrice, id: 0, brand: "" },
                    secondCartItem.price
                );
                expect(
                    pricesMatch,
                    `Second product price in cart (${secondCartItem.price}) should match API price (${secondProductApiPrice})`
                ).toBe(true);
            }
        });

        // Step 10: Verify cart item count
        await test.step("Verify cart has 2 products", async () => {
            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount, "Cart should contain 2 products").toBe(2);
        });

        // Step 11: Verify total calculation matches API prices
        await test.step("Verify total calculation from API prices", async () => {
            const items = await cartPage.getCartItems();
            
            // Calculate expected total from API prices
            const firstApiPriceNum = productApiSteps.parsePriceToNumber(firstProductApiPrice);
            const secondApiPriceNum = productApiSteps.parsePriceToNumber(secondProductApiPrice);
            const expectedTotal = (firstApiPriceNum * firstProductQuantity) + (secondApiPriceNum * 1);

            // Get actual cart total (sum of item totals)
            let actualTotal = 0;
            items.forEach(item => {
                actualTotal += productApiSteps.parsePriceToNumber(item.total);
            });

            // Allow small difference for rounding
            const difference = Math.abs(expectedTotal - actualTotal);
            expect(
                difference,
                `Cart total (${actualTotal}) should match calculated total from API prices (${expectedTotal})`
            ).toBeLessThan(0.01);
        });
    });
});


