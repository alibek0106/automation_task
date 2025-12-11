import { isolatedTest as test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { PRODUCT_NAMES } from '../../src/constants/ProductData';
import { Routes } from '../../src/constants/Routes';
import { RandomDataGenerator } from '../../src/utils/RandomDataGenerator';
import { User } from '../../src/models/UserModels';
import { PaymentDetails } from '../../src/models/PaymentModels';

test.describe('TC16: Place Order: Login before Checkout', { tag: '@Abdykarimov' }, () => {
    // 1. Shared Variables
    let user: User;
    let payment: PaymentDetails;
    const productToAdd = PRODUCT_NAMES[0];

    // 2. Setup: Create User (API) & Navigate Home
    test.beforeEach(async ({ homePage, userService, page }) => {
        // Generate Data
        user = DataFactory.generateUser();
        payment = DataFactory.generatePaymentDetails();

        // Pre-condition: Create the User via API so they exist for Login
        await test.step('Precondition: Create User via API', async () => {
            await userService.createAccount(user);
        });

        // Navigate to application
        await test.step('Navigate to Home', async () => {
            await homePage.goto();
            await expect(page, 'Page should have expected title').toHaveTitle(Routes.WEB.HOME_TITLE);
        });
    });

    // 3. Teardown: Delete Account
    test.afterEach(async ({ paymentPage, accountDeletedPage }) => {
        await test.step('Post-condition: Delete Account', async () => {
            await paymentPage.clickDeleteAccount();
            await expect(accountDeletedPage.deletedHeader, 'Account should be successfully deleted').toBeVisible();
            await accountDeletedPage.clickContinue();
        });
    });

    // 4. Test Body
    test('User login before checkout and place order', async ({
        page,
        authSteps,
        cartSteps,
        checkoutSteps,
    }) => {
        // Step 1: Login (UI Flow)
        await authSteps.openAndLogin(user);

        // Step 2: Add Product & View Cart
        await cartSteps.addProductAndGoToCart(productToAdd);
        await expect(page, 'Page should have expected URL').toHaveURL(Routes.WEB.VIEW_CART);

        // Step 3: Checkout
        await checkoutSteps.proceedToCheckoutSuccess();

        // Step 4: Comment & Place Order
        await test.step('Enter comment and Place Order', async () => {
            const orderRef = RandomDataGenerator.getRandomString(8);
            const comment = `TC16 Login Order: ${orderRef} - Placed by ${payment.nameOnCard}`;

            await checkoutSteps.placeOrder(comment);
        });

        // Step 5: Payment
        await checkoutSteps.enterPaymentAndConfirm(payment);
    });
});