import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { PRODUCT_NAMES } from '../../src/constants/ProductData';
import { Routes } from '../../src/constants/Routes';

test.describe('TC15: Place Order: Register before Checkout', { tag: '@Abdykarimov' }, () => {

    test('User registration before checkout and place order', async ({
        page,
        homePage,
        cartSteps,
        registrationSteps,
        checkoutSteps,
        paymentPage,
        accountCreatedPage,
        accountDeletedPage
    }) => {
        // 1. Data Setup
        const user = DataFactory.generateUser();
        const payment = DataFactory.generatePaymentDetails();
        const productToAdd = PRODUCT_NAMES[0];

        // 2. Steps 1-3: Launch & Verify Home
        await test.step('Navigate to Home', async () => {
            await homePage.goto();
            await expect(page, 'Page should have expected title').toHaveTitle(Routes.WEB.HOME_TITLE);
        });

        // 3. Steps 4-7: Register User (Before Shopping)
        await test.step('Register New Account', async () => {
            // Steps 4-5: Click Signup/Login & Fill details
            await registrationSteps.performFullRegistration(user);

            // Step 6: Verify Account Created
            await expect(accountCreatedPage.successMessage, 'Successfull account creation message should be visible').toBeVisible();
            await expect(accountCreatedPage.successMessage, 'Successfull account creation message should have expected text').toHaveText('Account Created!');
            await registrationSteps.finishAccountCreation(); // Clicks "Continue"

            // Step 7: Verify Logged in
            await expect(homePage.loggedInText, 'User should be logged in').toContainText(user.name);
        });

        // 4. Steps 8-10: Add Product & View Cart
        await test.step('Add products to cart', async () => {
            await cartSteps.addProductAndGoToCart(productToAdd);

            await expect(page, 'Page should have expected URL').toHaveURL(Routes.WEB.VIEW_CART);
        });

        // 5. Steps 11-12: Checkout & Review
        await test.step('Proceed to Checkout', async () => {
            await checkoutSteps.proceedToCheckoutSuccess();
        });

        // 6. Step 13: Comment & Place Order
        await test.step('Enter comment and Place Order', async () => {
            await checkoutSteps.placeOrder('TC15 Order Description: ' + payment.nameOnCard);
        });

        // 7. Steps 14-16: Payment
        await test.step('Enter Payment and Confirm', async () => {
            await checkoutSteps.enterPaymentAndConfirm(payment);
        });

        // 8. Steps 17-18: Delete Account
        await test.step('Delete Account', async () => {
            await paymentPage.deleteAccount();
            await expect(accountDeletedPage.deletedHeader, 'Account should be successfully deleted').toBeVisible();
            await accountDeletedPage.clickContinue();
        });
    });
});