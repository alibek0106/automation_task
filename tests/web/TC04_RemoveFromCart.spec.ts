import { isolatedTest as test, expect } from '../../src/fixtures';

test.describe('TC04: Remove Product from Cart @Abdykarimov', () => {

    test('should verify removal of products', async ({
        cartSteps,
        cartPage,
        productsPage
    }) => {
        let addedProducts: string[] = [];
        let productToRemove: string;
        let productToKeep: string;

        // 1. Arrange
        await test.step('Setup: Populate cart with products', async () => {
            addedProducts = await cartSteps.populateCart(2);
            productToRemove = addedProducts[0];
            productToKeep = addedProducts[1];

            // Navigate to cart manually after population
            await productsPage.navigateToCart();
        });

        // 2. Act: Remove first product
        await test.step('Remove product', async () => {
            await cartPage.removeProduct(productToRemove);
            await expect(cartPage.getProductRow(productToRemove)).toHaveCount(0);
        });

        // 3. Assert: Verify remaining state
        await test.step('Verify remaining product state', async () => {
            expect(await cartPage.getCartCount(), 'Count should be 1').toBe(1);

            const remainingItem = await cartPage.getProductByName(productToKeep);
            expect(remainingItem.name).toBe(productToKeep);

            const newTotal = await cartPage.getCalculatedTotal();
            expect(newTotal).toBe(remainingItem.total);
        });

        // 4. Act: Empty Cart
        await test.step('Empty the cart', async () => {
            await cartPage.removeProduct(productToKeep);
            await expect(cartPage.emptyCartMessage).toBeVisible();
        });
    });
});