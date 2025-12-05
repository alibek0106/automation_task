import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { PRODUCT_NAMES } from '../../src/constants/ProductData';
import { Routes } from '../../src/constants/Routes';

test.describe('TC16: Place Order: Login before Checkout', { tag: '@Abdykarimov' }, () => {

    test('User login before checkout and place order', async ({
        page,
        homePage,
        loginPage,
        paymentPage,
        cartSteps,
        checkoutSteps,
        accountDeletedPage,
        userService // Used for API creation setup
    }) => {
        // 1. Data Setup
        const user = DataFactory.generateUser();
        const payment = DataFactory.generatePaymentDetails();
        const productToAdd = PRODUCT_NAMES[0];

        // 2. Precondition: Create the User via API so they can log in
        await test.step('Precondition: Create User via API', async () => {
            await userService.createAccount(user);
        });

        // 3. Steps 1-3: Launch & Verify Home
        await test.step('Navigate to Home', async () => {
            await homePage.goto();
            await expect(page).toHaveTitle(Routes.WEB.HOME_TITLE);
        });

        // 4. Steps 4-6: Login (UI Flow)
        await test.step('Login with valid credentials', async () => {
            await homePage.clickSignupLogin();

            // Verify Login Header
            await expect(loginPage.loginHeader).toBeVisible();

            // Perform Login
            await loginPage.login(user.email, user.password);

            // Verify Logged in state
            await expect(homePage.loggedInText).toContainText(user.name);
        });

        // 5. Steps 7-9: Add Product & View Cart
        await test.step('Add products to cart', async () => {
            // This handles: Navigate to Products -> Add -> View Cart Modal
            await cartSteps.addProductAndGoToCart(productToAdd);

            // Step 9: Verify Cart Page
            await expect(page).toHaveURL(Routes.WEB.VIEW_CART);
        });

        // 6. Steps 10-11: Checkout & Review
        await test.step('Proceed to Checkout', async () => {
            await checkoutSteps.proceedToCheckoutSuccess();
        });

        // 7. Step 12: Place Order
        await test.step('Enter comment and Place Order', async () => {
            await checkoutSteps.placeOrder('TC16 Login-First Order: ' + payment.nameOnCard);
        });

        // 8. Steps 13-15: Payment
        await test.step('Enter Payment and Confirm', async () => {
            await checkoutSteps.enterPaymentAndConfirm(payment);
        });

        // 9. Steps 16-17: Delete Account
        await test.step('Delete Account', async () => {
            await paymentPage.deleteAccount();
            await expect(accountDeletedPage.deletedHeader).toBeVisible();
            await accountDeletedPage.clickContinue();
        });
    });
});