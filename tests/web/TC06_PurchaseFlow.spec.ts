import { test } from '../../src/fixtures';
import { DataFactory, User } from '../../src/utils/DataFactory';
import { PAYMENT_INFO } from '../../src/utils/Constants';
import { AutomationExerciseApi } from '../../src/api/AutomationExerciseApi';
import { PRODUCT_DETAILS, PRODUCTS } from '../../src/constants/Products';

test.describe('End-to-End Purchase Flow', () => {
    let user: User;

    test.beforeEach(async ({ request }) => {
        const api = new AutomationExerciseApi(request);
        user = DataFactory.generateFullUser();
        await api.registerUser(user);
    });

    test.afterEach(async ({ request }) => {
        if (user) {
            const api = new AutomationExerciseApi(request);
            await api.deleteUser(user.email, user.password);
        }
    });

    test('TC06: Registered user completes a successful purchase of multiple items', async ({
        automationExerciseLandingSteps,
        automationExerciseNavigationSteps,
        automationExerciseLoginSteps,
        automationExerciseProductsSteps,
        automationExerciseCartSteps,
        automationExerciseCheckoutSteps,
        automationExercisePaymentSteps,
    }) => {
        // 1. Login
        await automationExerciseLandingSteps.navigateToHomepage();
        await automationExerciseNavigationSteps.clickSignupLogin();
        await automationExerciseLoginSteps.login(user.email, user.password);
        await automationExerciseNavigationSteps.verifyUserLoggedIn(user.name);

        // 2-3. Product Selection
        await automationExerciseNavigationSteps.clickProducts();
        await automationExerciseProductsSteps.addProductToCart(PRODUCTS.BLUE_TOP);
        await automationExerciseProductsSteps.clickContinueShopping();
        await automationExerciseProductsSteps.addProductToCart(PRODUCTS.MEN_TSHIRT);
        await automationExerciseProductsSteps.clickContinueShopping();

        // 4-5. Cart Verification
        await automationExerciseNavigationSteps.clickCart();
        await automationExerciseCartSteps.verifyCartContent([
            PRODUCT_DETAILS.BLUE_TOP,
            PRODUCT_DETAILS.MEN_TSHIRT
        ]);

        // 6-10. Checkout & Address Verification
        await automationExerciseCartSteps.proceedToCheckout();
        await automationExerciseCheckoutSteps.verifyAddressDetails(user);

        // 11-12. Payment
        await automationExerciseCheckoutSteps.enterCommentAndPlaceOrder('Test Order Comment');

        await automationExercisePaymentSteps.enterPaymentDetails(
            PAYMENT_INFO.NAME_ON_CARD,
            PAYMENT_INFO.CARD_NUMBER,
            PAYMENT_INFO.CVC,
            PAYMENT_INFO.EXPIRY_MONTH,
            PAYMENT_INFO.EXPIRY_YEAR
        );
        await automationExercisePaymentSteps.confirmOrder();

        // 13-15. Confirmation
        await automationExercisePaymentSteps.verifyOrderPlaced();
        await automationExercisePaymentSteps.downloadInvoice();
        await automationExercisePaymentSteps.clickContinue();

        // 16. Cart Cleanup Verification
        await automationExerciseNavigationSteps.clickCart();
        await automationExerciseCartSteps.verifyCartEmpty();
    });
});
