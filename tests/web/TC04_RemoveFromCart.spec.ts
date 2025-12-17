import { test } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { PRODUCTS } from '../../src/constants/Products';

/**
 * TC04: Cart Management
 * 
 * Validates product removal from cart including individual product removal
 * and cart empty state verification.
 */

test.describe('Cart Management', () => {
    test('TC04: Remove products from cart and verify empty state', async ({
        automationExerciseLandingSteps,
        automationExerciseNavigationSteps,
        automationExerciseLoginSteps,
        automationExerciseProductsSteps,
        automationExerciseProductDetailSteps,
        automationExerciseCartSteps
    }) => {
        // Arrange: Login with a user (using generic user for this test flow)
        const user = DataFactory.generateUser();

        // 1. Navigate to home
        await automationExerciseLandingSteps.navigateToHomepage();
        await automationExerciseLandingSteps.verifyPageOpened();

        // 2. Login/Register
        await automationExerciseNavigationSteps.clickSignupLogin();
        await automationExerciseLoginSteps.signup(user.name, user.email);

        // 3. Add products to cart
        await automationExerciseProductsSteps.navigateToProductsPage();
        await automationExerciseProductsSteps.verifyProductsPageVisible();
        await automationExerciseProductsSteps.addProductToCart(0); // 1st product (Blue Top)
        await automationExerciseProductDetailSteps.clickContinueShopping();
        await automationExerciseProductsSteps.addProductToCart(1); // 2nd product (Men Tshirt)
        await automationExerciseProductDetailSteps.clickViewCart();

        // 4. Verify initial state
        await automationExerciseCartSteps.verifyCartVisible();

        // 5. Remove first product
        await automationExerciseCartSteps.removeProduct(PRODUCTS.BLUE_TOP);

        // 6. Verify specific product removed
        await automationExerciseCartSteps.verifyProductRemoved(PRODUCTS.BLUE_TOP);

        // 7. Remove remaining products
        await automationExerciseCartSteps.removeProduct(PRODUCTS.MEN_TSHIRT);

        // 8. Verify empty state
        await automationExerciseCartSteps.verifyCartEmpty();
    });
});
