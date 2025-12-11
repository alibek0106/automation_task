import { isolatedTest as test, expect } from '../../src/fixtures';
import { PRODUCT_NAMES, PRODUCT_PRICES } from '../../src/constants/ProductData';

test.describe('TC08: Update Product Quantity in Cart', { tag: '@Abdykarimov' }, () => {

    test('should verify quantity updates and total recalculations', async ({
        cartSteps,
        cartPage,
        productsPage,
    }) => {
        // 1. Arrange: Login and Add Product (Qty 1)
        const firstProduct = PRODUCT_NAMES[0];
        const pricePerUnit = PRODUCT_PRICES[0];
        const QTY_1 = 1;
        const QTY_2 = 2;
        const QTY_3 = 3;
        const QTY_4 = 4;
        const QTY_5 = 5;

        await cartSteps.addProductWithQuantity(firstProduct, QTY_1);

        await test.step('Verify initial state in Cart', async () => {
            await productsPage.navigateToCart();

            const qty = await cartPage.getProductQuantity(firstProduct);
            const total = await cartPage.getProductTotal(firstProduct);

            expect(qty, 'Initial quantity should be 1').toBe(QTY_1);
            expect(total, 'Initial subtotal should match unit price').toBe(pricePerUnit);
        });

        // 2. Act: Increase Quantity to 5
        await cartSteps.addProductWithQuantity(firstProduct, QTY_4);

        // 3. Assert: Verify Increase Calculation
        await test.step('Verify calculations for Quantity 5', async () => {
            await productsPage.navigateToCart();

            const qty = await cartPage.getProductQuantity(firstProduct);
            expect(qty, 'Quantity should update to 5').toBe(QTY_5);

            const subtotal = await cartPage.getProductTotal(firstProduct);
            expect(subtotal, 'Subtotal should be Price * 5').toBe(pricePerUnit * QTY_5);

            const cartTotal = await cartPage.getCalculatedTotal();
            expect(cartTotal, 'Cart total should match subtotal').toBe(subtotal); // Since only 1 product type
        });

        // 4. Act: Decrease Quantity to 2
        // Since we can't edit, we must Remove then Add 2
        await test.step('Decrease Quantity to 2 (Re-add workflow)', async () => {
            await cartPage.removeProduct(firstProduct);
            expect(cartPage.getProductRow(firstProduct), 'Product row should be removed').toHaveCount(0);
        });

        await cartSteps.addProductWithQuantity(firstProduct, QTY_2);

        // 5. Assert: Verify Decrease Calculation
        await test.step('Verify calculations for Quantity 2', async () => {
            await productsPage.navigateToCart();

            const qty = await cartPage.getProductQuantity(firstProduct);
            expect(qty, 'Quantity should be 2').toBe(QTY_2);

            const subtotal = await cartPage.getProductTotal(firstProduct);
            expect(subtotal, 'Subtotal should be Price * 2').toBe(pricePerUnit * QTY_2);
        });

        // 6. Act: Independent Updates (Multiple Products)
        const secondProduct = PRODUCT_NAMES[1]; // "Men Tshirt" (Price 400)
        const price2 = PRODUCT_PRICES[1];

        await test.step('Add second product and verify mixed totals', async () => {
            await cartSteps.addProductWithQuantity(secondProduct, QTY_3);
            await productsPage.navigateToCart();

            // Verify Product 1 (Still 2)
            await cartSteps.verifyProductDetails(firstProduct, QTY_2);

            // Verify Product 2 (New 3)
            await cartSteps.verifyProductDetails(secondProduct, QTY_3);

            // Verify Cart Total
            const expectedTotal = (pricePerUnit * QTY_2) + (price2 * QTY_3);
            const actualTotal = await cartPage.getCalculatedTotal();
            expect(actualTotal, `Cart total should match (${pricePerUnit}*2 + ${price2}*3)`).toBe(expectedTotal);
        });
    });
});