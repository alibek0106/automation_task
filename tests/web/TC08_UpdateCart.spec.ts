import { isolatedTest as test, expect } from '../../src/fixtures';
import { PRODUCT_NAMES } from '../../src/constants/ProductData';

test.describe('TC08: Update Product Quantity in Cart', { tag: '@Abdykarimov' }, () => {

    test('should verify quantity updates and total recalculations', async ({
        cartSteps,
        cartPage,
        productsPage,
        page
    }) => {
        // 1. Arrange: Login and Add Product (Qty 1)
        const productName = PRODUCT_NAMES[0]; // e.g., "Blue Top"
        const pricePerUnit = 500; // Known price for Blue Top

        await test.step(`Add ${productName} with Quantity 1`, async () => {
            await cartSteps.addProductWithQuantity(productName, 1);
        });

        await test.step('Verify initial state in Cart', async () => {
            await productsPage.navigateToCart();

            const qty = await cartPage.getProductQuantity(productName);
            const total = await cartPage.getProductTotal(productName);

            expect(qty, 'Initial quantity should be 1').toBe(1);
            expect(total, 'Initial subtotal should match unit price').toBe(pricePerUnit);
        });

        // 2. Act: Increase Quantity to 5
        await test.step('Increase Quantity to 5', async () => {
            await cartSteps.addProductWithQuantity(productName, 4);
        });

        // 3. Assert: Verify Increase Calculation
        await test.step('Verify calculations for Quantity 5', async () => {
            await productsPage.navigateToCart();

            const qty = await cartPage.getProductQuantity(productName);
            expect(qty, 'Quantity should update to 5').toBe(5);

            const subtotal = await cartPage.getProductTotal(productName);
            expect(subtotal, 'Subtotal should be Price * 5').toBe(pricePerUnit * 5);

            const cartTotal = await cartPage.getCalculatedTotal();
            expect(cartTotal).toBe(subtotal); // Since only 1 product type
        });

        // 4. Act: Decrease Quantity to 2
        // Since we can't edit, we must Remove then Add 2
        await test.step('Decrease Quantity to 2 (Re-add workflow)', async () => {
            await cartPage.removeProduct(productName);
            await expect(cartPage.getProductRow(productName)).toHaveCount(0);

            await cartSteps.addProductWithQuantity(productName, 2);
        });

        // 5. Assert: Verify Decrease Calculation
        await test.step('Verify calculations for Quantity 2', async () => {
            await productsPage.navigateToCart();

            const qty = await cartPage.getProductQuantity(productName);
            expect(qty, 'Quantity should be 2').toBe(2);

            const subtotal = await cartPage.getProductTotal(productName);
            expect(subtotal, 'Subtotal should be Price * 2').toBe(pricePerUnit * 2);
        });

        // 6. Act: Independent Updates (Multiple Products)
        const product2 = PRODUCT_NAMES[1]; // "Men Tshirt" (Price 400)
        const price2 = 400;

        await test.step('Add second product and verify mixed totals', async () => {
            await cartSteps.addProductWithQuantity(product2, 3);
            await productsPage.navigateToCart();

            // Verify Product 1 (Still 2)
            const qty1 = await cartPage.getProductQuantity(productName);
            expect(qty1).toBe(2);

            // Verify Product 2 (New 3)
            const qty2 = await cartPage.getProductQuantity(product2);
            expect(qty2).toBe(3);

            // Verify Cart Total
            const expectedTotal = (pricePerUnit * 2) + (price2 * 3);
            const actualTotal = await cartPage.getCalculatedTotal();
            expect(actualTotal, `Cart total should match (${pricePerUnit}*2 + ${price2}*3)`).toBe(expectedTotal);
        });
    });
});