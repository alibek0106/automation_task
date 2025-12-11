import { isolatedTest as test, expect } from '../../src/fixtures';
import { PRODUCT_NAMES } from '../../src/constants/ProductData';
import { Routes } from '../../src/constants/Routes';

test.describe('TC03: Add Multiple Products by Name', { tag: '@Abdykarimov' }, () => {
    test('should verify quantities, prices, and totals', async ({
        cartSteps,
        cartPage,
        page
    }) => {
        // 1. Arrange
        const product1 = PRODUCT_NAMES[0];
        const product2 = PRODUCT_NAMES[1];

        // 2. Add products and go to cart
        await cartSteps.addProductWithQuantity(product1, 3);
        await cartSteps.addProductAndGoToCart(product2);

        // 3. Assert
        await test.step('Verify Navigation to Cart', async () => {
            await expect(page, 'Page should have expected URL').toHaveURL(Routes.WEB.VIEW_CART);
        });

        // Verify Product 1 details
        await cartSteps.verifyProductDetails(product1, 3);

        // Verify Product 2 details
        await cartSteps.verifyProductDetails(product2, 1);

        await test.step('Verify Cart Total', async () => {
            const item1 = await cartPage.getProductByName(product1);
            const item2 = await cartPage.getProductByName(product2);
            const calculatedTotal = await cartPage.getCalculatedTotal();

            expect(calculatedTotal, 'Total matches sum of items').toBe(item1.total + item2.total);
        });
    });
});