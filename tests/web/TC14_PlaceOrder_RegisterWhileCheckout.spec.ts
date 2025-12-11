import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { PRODUCT_NAMES } from '../../src/constants/ProductData';
import { Routes } from '../../src/constants/Routes';
import { RandomDataGenerator } from '../../src/utils/RandomDataGenerator';
import { User } from '../../src/models/UserModels';
import { PaymentDetails } from '../../src/models/PaymentModels';

test.describe('TC14: Place Order: Register while Checkout', { tag: '@Abdykarimov' }, () => {
    // 1. Shared Variables
    let user: User;
    let payment: PaymentDetails;
    const productToAdd = PRODUCT_NAMES[0];
    const randomStringLength = 8;

    // 2. Setup: Generate Data & Open App
    test.beforeEach(async ({ homePage, page }) => {
        user = DataFactory.generateUser();
        payment = DataFactory.generatePaymentDetails();

        await test.step('Navigate to Home', async () => {
            await homePage.goto();
            await expect(page, 'Home page should be opened').toHaveTitle(Routes.WEB.HOME_TITLE);
        });
    });

    // 3. Teardown: Clean up account
    test.afterEach(async ({ paymentPage, accountDeletedPage }) => {
        await test.step('Post-condition: Delete Account', async () => {
            await paymentPage.clickDeleteAccount();
            await expect(accountDeletedPage.deletedHeader, 'Account should be successfully deleted').toBeVisible();
            await accountDeletedPage.clickContinue();
        });
    });

    // 4. Test Body
    test('User registration during checkout and delete account after successfully placing order', async ({
        productsPage,
        cartSteps,
        registrationSteps,
        checkoutSteps,
    }) => {
        // Step 1: Add Products and View Cart
        await cartSteps.addProductAndGoToCart(productToAdd);

        // Step 2: Proceed to Checkout -> Expect Login Modal
        await checkoutSteps.proceedToCheckoutExpectLoginModal();

        // Step 3: Register New Account
        await registrationSteps.registerNewAccount(user);

        // Step 4: Navigate back to Cart & Proceed (Logged In)
        await test.step('Go to Cart and Proceed to Checkout (Logged In)', async () => {
            await productsPage.navigateToCart();
            await checkoutSteps.proceedToCheckoutSuccess();
        });

        // Step 5: Review & Place Order
        await test.step('Review Order and Place Order', async () => {
            const orderRef = RandomDataGenerator.getRandomString(randomStringLength);
            const comment = `Test Order Ref: ${orderRef} - Placed by ${payment.nameOnCard}`;

            await checkoutSteps.placeOrder(comment);
        });

        // Step 6: Payment
        await checkoutSteps.enterPaymentAndConfirm(payment);
    });
});