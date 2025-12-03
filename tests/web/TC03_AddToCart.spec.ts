import { test, expect } from '../../src/fixtures';
import { DataFactory } from '../../src/utils/DataFactory';
import { Routes } from '../../src/constants/Routes';

test.describe('TC03: Add multiple products to cart and verify', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    const user = DataFactory.generateUser();

    test.beforeEach(async ({ userService, authSteps }) => {
        await userService.createAccount(user);
        await authSteps.login(user);
    });

    test('Should verify quantities, prices, and totals for multiple products', async ({ cartSteps, cartPage, page }) => {
        // Add first product with quantity 3
        const qtyProduct1 = 3;
        await cartSteps.addProductWithQuantity(0, qtyProduct1);

        // Add second product with quantity 1
        const qtyProduct2 = 1;
        await cartSteps.addProductAndGoToCart(1);

        // Verify navigation
        await expect(page, 'Should automatically navigate to cart page').toHaveURL(Routes.WEB.VIEW_CART);

        // Verify count
        const cartCount = await cartPage.getCartCount();
        expect(cartCount, 'Cart should contain exactly 2 unique items').toBe(2);

        // Verify first product
        const item1 = await cartPage.getCartItem(0);
        expect(item1.quantity, `First product quantity should be ${qtyProduct1}`).toBe(qtyProduct1);
        expect(item1.total, `First product total (${item1.total}) should be Price (${item1.price} * Qty (${qtyProduct1}))`).toBe(item1.price * qtyProduct1);

        // Verify second product
        const item2 = await cartPage.getCartItem(1);
        expect(item2.quantity, `Second product quantity should be ${qtyProduct2}`).toBe(qtyProduct2);
        expect(item2.total, `Second product total (${item2.total}) should equal its price (${item2.price})`).toBe(item2.price * qtyProduct2);

        expect(item1.name, 'The two products added should have different names').not.toEqual(item2.name);
        expect(item1.price, 'Product price should be greater than 0').toBeGreaterThan(0);
    });
});