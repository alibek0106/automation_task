import { test } from '../../src/fixtures';
import { expect } from '@playwright/test';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC14: End-to-End Purchase Flow with API Data Validation', () => {
    let user = DataFactory.generateFullUser();
    let apiProductPrices: { [key: string]: string } = {};

    test.beforeEach(async ({ automationExerciseLandingSteps, userApiSteps }) => {
        await userApiSteps.registerUser(user, user, user);
        await automationExerciseLandingSteps.navigateToHomepage();
    });

    test.afterEach(async ({ userApiSteps }) => {
        await userApiSteps.deleteUser(user.email, user.password);
    });

    test('Scenario: Registered user completes purchase with API validation of Price and Address', async ({
        page,
        automationExerciseNavigationSteps,
        automationExerciseLoginSteps,
        automationExerciseProductsSteps,
        automationExerciseCartSteps,
        automationExerciseCheckoutSteps,
        automationExercisePaymentSteps,
        productsApiSteps,
        userApiSteps
    }) => {
        const TEST_DATA = {
            PRODUCTS: ['Blue Top', 'Men Tshirt'],
            ORDER_COMMENT: 'Test Order - API Validation',
        };

        // Login as registered user
        await automationExerciseNavigationSteps.clickSignupLogin();
        await automationExerciseLoginSteps.login(user.email, user.password);
        await automationExerciseNavigationSteps.verifyUserLoggedIn(user.name);

        // Fetch product prices from API
        for (const productName of TEST_DATA.PRODUCTS) {
            const products = await productsApiSteps.searchProductViaApi(productName);
            const match = products.find(p => p.name === productName);

            if (!match) {
                throw new Error(`Product ${productName} not found via API`);
            }

            apiProductPrices[productName] = match.price;
        }

        // Add products to cart via UI
        await automationExerciseNavigationSteps.clickProducts();

        for (const productName of TEST_DATA.PRODUCTS) {
            await automationExerciseProductsSteps.addProductToCart(productName);
            await automationExerciseProductsSteps.verifySuccessMessage();
            await automationExerciseProductsSteps.clickContinueShopping();
        }

        // Validate cart prices match API data
        await automationExerciseNavigationSteps.clickCart();
        const cartItems = await automationExerciseCartSteps.getCartItemsDetails();

        for (const item of cartItems) {
            const expectedPrice = apiProductPrices[item.name];
            expect(item.price, `Cart price for ${item.name} should match API price`).toContain(expectedPrice);
        }

        // Fetch user address from API and proceed to checkout
        const apiUserDetails = await userApiSteps.getUserDetails(user.email);
        await automationExerciseCartSteps.proceedToCheckout();
        await automationExerciseCheckoutSteps.verifyAddressFieldsInPage(
            apiUserDetails.address1,
            apiUserDetails.city,
            apiUserDetails.zipcode,
            page
        );

        // Complete payment and verify order
        await automationExerciseCheckoutSteps.enterCommentAndPlaceOrder(TEST_DATA.ORDER_COMMENT);
        await automationExercisePaymentSteps.fillPaymentDetailsAndConfirm();
        await automationExercisePaymentSteps.verifyOrderPlaced();

        // Verify cart is empty after order completion
        await automationExerciseNavigationSteps.clickCart();
        await automationExerciseCartSteps.verifyCartEmpty();
    });
});
