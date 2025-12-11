import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { PRODUCT_NAMES } from '../../src/constants/ProductData';
import { Routes } from '../../src/constants/Routes';
import { RandomDataGenerator } from '../../src/utils/RandomDataGenerator';
import { User } from '../../src/models/UserModels';
import { PaymentDetails } from '../../src/models/PaymentModels';

test.describe('TC15: Place Order: Register before Checkout', { tag: '@Abdykarimov' }, () => {
    // 1. Define shared variables
    let user: User;
    let payment: PaymentDetails;
    const productToAdd = PRODUCT_NAMES[0];

    // 2. Setup: Run before the test
    test.beforeEach(async ({ homePage, registrationSteps, page }) => {
        // Generate Data
        user = DataFactory.generateUser();
        payment = DataFactory.generatePaymentDetails();

        // Navigate and Register
        await test.step('Pre-condition: Register New Account', async () => {
            await homePage.goto();
            await expect(page, 'Page should have expected title').toHaveTitle(Routes.WEB.HOME_TITLE);
            await registrationSteps.registerNewAccount(user);
        });
    });

    // 3. Teardown: Run after the test (even if it fails)
    test.afterEach(async ({ paymentPage, accountDeletedPage }) => {
        await test.step('Post-condition: Delete Account', async () => {
            await paymentPage.clickDeleteAccount();
            await expect(accountDeletedPage.deletedHeader, 'Account should be successfully deleted').toBeVisible();
            await accountDeletedPage.clickContinue();
        });
    });

    // 4. The Main Test Logic
    test('User registration before checkout and place order', async ({
        page,
        cartSteps,
        checkoutSteps,
    }) => {
        // Steps 8-10: Add Product & View Cart
        await cartSteps.addProductAndGoToCart(productToAdd);
        await expect(page, 'Page should have expected URL').toHaveURL(Routes.WEB.VIEW_CART);

        // Steps 11-12: Checkout & Review
        await checkoutSteps.proceedToCheckoutSuccess();

        // Step 13: Comment & Place Order
        await test.step('Enter comment and Place Order', async () => {
            const orderRef = RandomDataGenerator.getRandomString(8);
            const comment = `Order Description: ${orderRef} - Placed by ${payment.nameOnCard}`;
            await checkoutSteps.placeOrder(comment);
        });

        // Steps 14-16: Payment
        await checkoutSteps.enterPaymentAndConfirm(payment);
    });
});