import { isolatedTest as test, expect } from '../../src/fixtures';
import { PRODUCT_NAMES } from '../../src/constants/ProductData';
import { Routes } from '../../src/constants/Routes';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('TC03: Add Multiple Products (Hybrid Approach)', { tag: ['@Abdykarimov', '@Hybrid'] }, () => {
    test('should verify quantities and totals with API-injected session', async ({
        page,
        context,
        request,
        cartSteps,
        cartPage,
        userApiSteps,
        homePage
    }) => {
        // 1. Arrange: Data Generation
        const user = DataFactory.generateUser();
        const product1 = PRODUCT_NAMES[0];
        const product2 = PRODUCT_NAMES[1];

        // 2. Hybrid Setup: Create User & Inject Session via API
        await userApiSteps.createAndLoginUser(user, context);

        // Optional: Verify we are actually logged in on the UI (Sanity Check)
        await test.step('Verify session injection', async () => {
            await homePage.goto();
            // Assert that the 'Logged in as...' text is visible
            await expect(homePage.loggedInText, 'User should be logged in via API injection').toContainText(user.name);
        });

        // 3. Act: UI Interactions (Cart Logic)
        await test.step('Add products to cart', async () => {
            // Note: logic remains purely UI here as requested
            await cartSteps.addProductWithQuantity(product1, 3);
            await cartSteps.addProductAndGoToCart(product2);
        });

        // 4. Assert: Validations
        await test.step('Verify Navigation to Cart', async () => {
            await expect(page, 'Page should have expected URL').toHaveURL(Routes.WEB.VIEW_CART);
        });

        await test.step(`Verify details for ${product1}`, async () => {
            const item1 = await cartPage.getProductByName(product1);
            expect(item1.name, 'Item name should match').toBe(product1);
            expect(item1.quantity, 'Item quantity should match').toBe(3);
            expect(item1.total, 'Item total should match').toBe(item1.price * 3);
        });

        await test.step(`Verify details for ${product2}`, async () => {
            const item2 = await cartPage.getProductByName(product2);
            expect(item2.name, 'Item name should match').toBe(product2);
            expect(item2.quantity, 'Item quantity should match').toBe(1);
            expect(item2.total, 'Item total should match').toBe(item2.price * 1);
        });

        await test.step('Verify Cart Total', async () => {
            const item1 = await cartPage.getProductByName(product1);
            const item2 = await cartPage.getProductByName(product2);
            const calculatedTotal = await cartPage.getCalculatedTotal();

            expect(calculatedTotal, 'Total matches sum of items').toBe(item1.total + item2.total);
        });
    });
});