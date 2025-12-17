import { test } from '../../src/fixtures';
import { expect } from '@playwright/test';
import { DataFactory } from '../../src/utils/DataFactory';

const TEST_DATA = {
    PRODUCTS: ['Blue Top', 'Men Tshirt'],
    ORDER_COMMENT: 'Test Order - API Validation',
};

test.describe('TC14: End-to-End Purchase Flow with API Data Validation', () => {
    let user = DataFactory.generateFullUser();
    let apiProductPrices: { [key: string]: string } = {};

    test.beforeEach(async ({ automationExerciseLandingSteps, userApiSteps }) => {
        await userApiSteps.createAccount(user, user, user);
        await automationExerciseLandingSteps.navigateToHomepage();
    });

    test.afterEach(async ({ userApiSteps }) => {
        await userApiSteps.deleteAccount(user.email, user.password);
    });

    test('Scenario: Registered user completes purchase with API validation of Price and Address', async ({
        page,
        automationExerciseNavigationSteps,
        automationExerciseLoginSteps,
        automationExerciseProductsSteps,
        automationExerciseCartPage,
        automationExerciseCheckoutPage,
        automationExercisePaymentPage,
        automationExerciseOrderConfirmationPage,
        productsApiSteps,
        userApiSteps
    }) => {
        await test.step('Login as registered user', async () => {
            await automationExerciseNavigationSteps.clickSignupLogin();
            await automationExerciseLoginSteps.login(user.email, user.password);
            await automationExerciseNavigationSteps.verifyUserLoggedIn(user.name);
        });

        await test.step('Fetch product prices from API', async () => {
            for (const productName of TEST_DATA.PRODUCTS) {
                const products = await productsApiSteps.searchProductViaApi(productName);
                const match = products.find(p => p.name === productName);

                if (!match) {
                    throw new Error(`Product ${productName} not found via API`);
                }

                apiProductPrices[productName] = match.price;
            }
        });

        await test.step('Add products to cart via UI', async () => {
            await automationExerciseNavigationSteps.clickProducts();

            for (const productName of TEST_DATA.PRODUCTS) {
                await automationExerciseProductsSteps.addProductToCart(productName);
                await automationExerciseProductsSteps.verifySuccessMessage();
                await automationExerciseProductsSteps.clickContinueShopping();
            }
        });

        await test.step('Validate cart prices match API data', async () => {
            await automationExerciseNavigationSteps.clickCart();
            const cartItems = await automationExerciseCartPage.getCartItemsDetails();

            for (const item of cartItems) {
                const expectedPrice = apiProductPrices[item.name];
                expect(item.price, `Cart price for ${item.name} should match API price`).toContain(expectedPrice);
            }
        });

        await test.step('Fetch user address from API and proceed to checkout', async () => {
            const apiUserDetails = await userApiSteps.getUserDetails(user.email);
            await automationExerciseCartPage.proceedToCheckout();

            const pageContent = await page.content();
            expect(pageContent, 'Checkout page should display API address1').toContain(apiUserDetails.address1);
            expect(pageContent, 'Checkout page should display API city').toContain(apiUserDetails.city);
            expect(pageContent, 'Checkout page should display API zipcode').toContain(apiUserDetails.zipcode);
        });

        await test.step('Complete payment and verify order', async () => {
            await automationExerciseCheckoutPage.enterComment(TEST_DATA.ORDER_COMMENT);
            await automationExerciseCheckoutPage.clickPlaceOrder();
            await automationExercisePaymentPage.fillPaymentDetails();
            await automationExercisePaymentPage.clickPayAndConfirm();
            await automationExerciseOrderConfirmationPage.verifyOrderConfirmed();
        });

        await test.step('Verify cart is empty after order completion', async () => {
            await automationExerciseNavigationSteps.clickCart();
            await automationExerciseCartPage.verifyCartEmpty();
        });
    });
});
