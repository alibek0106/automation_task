import { test } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { PRODUCTS, PRODUCT_DETAILS } from '../../src/constants/Products';

/**
 * TC08: Cart Quantity Update
 * 
 * Validates cart quantity updates and subtotal calculations including
 * multiple products, quantity changes, and invalid quantity handling.
 */

test.describe('TC08: Cart Quantity Update', { tag: '@cart @web' }, () => {
    let user: ReturnType<typeof DataFactory.generateUser>;

    test.beforeEach(async ({
        userApiSteps,
        automationExerciseLandingSteps,
        automationExerciseNavigationSteps,
        automationExerciseLoginSteps
    }) => {
        user = DataFactory.generateUser();
        const account = DataFactory.generateAccountDetails();
        const address = DataFactory.generateAddressInfo();

        await userApiSteps.registerUser(user, account, address);

        await automationExerciseLandingSteps.navigateToHomepage();
        await automationExerciseNavigationSteps.clickSignupLogin();
        await automationExerciseLoginSteps.login(user.email, user.password);
        await automationExerciseNavigationSteps.verifyUserLoggedIn(user.name);
    });

    test.afterEach(async ({ userApiSteps }) => {
        if (user) {
            await userApiSteps.deleteUser(user.email, user.password);
        }
    });

    test('Scenario: Verify subtotal calculations when quantity changes', async ({
        automationExerciseProductsSteps,
        automationExerciseProductDetailSteps,
        automationExerciseCartSteps
    }) => {
        const productName = PRODUCTS.BLUE_TOP;
        const priceInt = 500;
        const quantity = '5';
        const expectedTotal = `Rs. ${priceInt * parseInt(quantity)}`; // Rs. 2500

        // 1. Add product with Qty 1 initially
        await automationExerciseProductsSteps.navigateToProductsPage();
        await automationExerciseProductsSteps.viewProductDetails(productName);
        await automationExerciseProductDetailSteps.addProductToCartWithQuantity('1');
        await automationExerciseProductDetailSteps.clickViewCart();

        // Verify initial state
        await automationExerciseCartSteps.verifyCartContent([{
            name: productName,
            price: PRODUCT_DETAILS.BLUE_TOP.price,
            quantity: '1',
            total: PRODUCT_DETAILS.BLUE_TOP.price
        }]);

        // 2. Update Quantity to 5 (Workflow: Remove -> Re-add with new qty)
        await automationExerciseCartSteps.removeProduct(productName);
        await automationExerciseProductsSteps.navigateToProductsPage();
        await automationExerciseProductsSteps.viewProductDetails(productName);
        await automationExerciseProductDetailSteps.addProductToCartWithQuantity(quantity);
        await automationExerciseProductDetailSteps.clickViewCart();

        // 3. Verify new calculations
        await automationExerciseCartSteps.verifyCartContent([{
            name: productName,
            price: PRODUCT_DETAILS.BLUE_TOP.price,
            quantity: quantity,
            total: expectedTotal
        }]);
    });

    test('Scenario: Verify calculations with multiple products in cart', async ({
        automationExerciseProductsSteps,
        automationExerciseProductDetailSteps,
        automationExerciseCartSteps
    }) => {
        const item1 = PRODUCTS.BLUE_TOP;
        const item2 = PRODUCTS.MEN_TSHIRT;
        const qty1 = '3';
        const qty2 = '2';

        // Add Item 1 (Blue Top) with Qty 3
        await automationExerciseProductsSteps.navigateToProductsPage();
        await automationExerciseProductsSteps.viewProductDetails(item1);
        await automationExerciseProductDetailSteps.addProductToCartWithQuantity(qty1);
        await automationExerciseProductDetailSteps.clickContinueShopping();

        // Add Item 2 (Men Tshirt) with Qty 2
        await automationExerciseProductsSteps.navigateToProductsPage();
        await automationExerciseProductsSteps.viewProductDetails(item2);
        await automationExerciseProductDetailSteps.addProductToCartWithQuantity(qty2);
        await automationExerciseProductDetailSteps.clickViewCart();

        // Verify Cart
        // Blue Top: 500 * 3 = 1500
        // Men Tshirt: 400 * 2 = 800
        await automationExerciseCartSteps.verifyCartContent([
            {
                name: item1,
                price: PRODUCT_DETAILS.BLUE_TOP.price,
                quantity: qty1,
                total: 'Rs. 1500'
            },
            {
                name: item2,
                price: PRODUCT_DETAILS.MEN_TSHIRT.price,
                quantity: qty2,
                total: 'Rs. 800'
            }
        ]);
    });

    test('Scenario: Handle invalid quantity updates', async ({
        automationExerciseProductsSteps,
        automationExerciseProductDetailSteps,
        automationExerciseNavigationSteps,
        automationExerciseCartSteps
    }) => {
        const productName = PRODUCTS.BLUE_TOP;

        await automationExerciseProductsSteps.navigateToProductsPage();
        await automationExerciseProductsSteps.viewProductDetails(productName);

        // Attempt to set quantity to 0
        await automationExerciseProductDetailSteps.addProductToCartWithQuantity('0');

        // Navigate to cart to verify logic
        await automationExerciseNavigationSteps.clickCart();

        // Verify cart is empty
        await automationExerciseCartSteps.verifyCartEmpty();
    });
});
