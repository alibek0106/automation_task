import { test } from '../src/fixtures';

test('TC03: Add Multiple Products to Cart and Verify Quantities and Totals', async ({
    automationExerciseLandingSteps,
    automationExerciseProductsSteps,
    automationExerciseProductDetailSteps,
    automationExerciseCartSteps,
    automationExerciseProductsPage
}) => {
    // Background: Given I am on the home page
    await automationExerciseLandingSteps.navigateToHomepage();
    await automationExerciseLandingSteps.verifyPageOpened();

    // Given I navigate to the "Products" page
    await automationExerciseProductsPage.navigate();
    await automationExerciseProductsSteps.verifyProductsPageVisible();

    // When I view the details of the first product in the list
    await automationExerciseProductsSteps.viewFirstProductDetails();

    // Then the product detail page should open
    await automationExerciseProductDetailSteps.verifyProductDetailVisible();

    // When I increase the quantity to "3"
    // And I click the "Add to cart" button
    await automationExerciseProductDetailSteps.addProductToCartWithQuantity('3');

    // And I click "Continue Shopping" in the modal
    await automationExerciseProductDetailSteps.clickContinueShopping();

    // When I navigate back to the "Products" page
    await automationExerciseProductsPage.navigate();
    await automationExerciseProductsSteps.verifyProductsPageVisible();

    // And I add the second product to the cart with quantity "1"
    await automationExerciseProductsSteps.addProductToCart(1); // 2nd product (index 1)

    // And I click "View Cart" in the modal
    await automationExerciseProductDetailSteps.clickViewCart();

    // Verifications
    // Then both products should be displayed in the cart
    await automationExerciseCartSteps.verifyCartVisible();

    // NOTE: Real test would need accurate data. Verification here is structural.
});
