import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { PRODUCT_NAMES } from '../../src/constants/ProductData';
import { Routes } from '../../src/constants/Routes';

test.describe('TC14: Place Order: Register while Checkout', { tag: '@Abdykarimov' }, () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('User registration during checkout and delete account after successfully placing order', async ({
        page,
        homePage,
        productsPage,
        cartSteps,
        registrationSteps,
        checkoutSteps,
        accountCreatedPage,
        paymentPage,
        homePage: { logoutLink }, // Destructuring for specific assertion
        accountDeletedPage
    }) => {
        // 1. Data Setup
        const user = DataFactory.generateUser();
        const payment = DataFactory.generatePaymentDetails();
        const productToAdd = PRODUCT_NAMES[0]; // "Blue Top"

        // 2. Navigate and Verify Home
        await test.step('Navigate to Home', async () => {
            await homePage.goto();
            await expect(page, 'Home page should be opened').toHaveTitle(Routes.WEB.HOME_TITLE);
        });

        // 3. Add Products and View Cart
        await test.step('Add products to cart', async () => {
            await cartSteps.addProductAndGoToCart(productToAdd);
        });

        // 4. Proceed to Checkout (Expect Login Modal)
        await test.step('Proceed to Checkout -> Redirect to Login/Register', async () => {
            await checkoutSteps.proceedToCheckoutExpectLoginModal();
        });

        // 5. Register User
        await test.step('Register New Account', async () => {
            await registrationSteps.performFullRegistration(user);
            await expect(accountCreatedPage.successMessage).toBeVisible();
            await registrationSteps.finishAccountCreation();

            // Verify "Logged in as..."
            await expect(homePage.loggedInText, 'User should be logged in').toContainText(user.name);
        });

        // 6. Navigate to Cart (Again) & Checkout
        await test.step('Go to Cart and Proceed to Checkout (Logged In)', async () => {
            // We use ProductsPage to navigate to cart (as established in previous refactor)
            await productsPage.navigateToCart();
            await checkoutSteps.proceedToCheckoutSuccess();
        });

        // 7. Verify Address & Place Order
        await test.step('Review Order and Place Order', async () => {
            // (Optional) Add specific address verification logic here if needed
            await checkoutSteps.placeOrder('Test Order Description: ' + payment.nameOnCard);
        });

        // 8. Payment
        await test.step('Enter Payment and Confirm', async () => {
            await checkoutSteps.enterPaymentAndConfirm(payment);
        });

        // 9. Delete Account
        await test.step('Delete Account', async () => {
            await paymentPage.deleteAccount();
            await expect(accountDeletedPage.deletedHeader, 'Account should be successfully deleted').toBeVisible();
            await accountDeletedPage.clickContinue();
        });
    });
});