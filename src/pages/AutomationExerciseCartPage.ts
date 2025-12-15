import { Page, Locator, expect } from '@playwright/test';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AutomationExerciseCartPage extends BasePage {
    private readonly cartTable: Locator;
    private readonly cartRows: Locator;
    private readonly emptyCartMessage: Locator;
    private readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        super(page, 'CartPage');
        this.cartTable = this.resolveLocator('#cart_info_table', 'Cart Table');
        this.cartRows = this.resolveLocator('#cart_info_table tbody tr', 'Cart Rows');
        this.emptyCartMessage = this.resolveLocator('#empty_cart', 'Empty Cart Message');
        this.proceedToCheckoutButton = this.resolveLocator('text=Proceed To Checkout', 'Proceed To Checkout Button');
    }

    async removeProduct(productName: string) {
        const row = this.cartRows.filter({ hasText: productName });
        await row.locator('.cart_quantity_delete').click();
    }

    async verifyCartEmpty() {
        await expect(this.emptyCartMessage).toContainText(MESSSAGES.CART_EMPTY);
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }

    async verifyCartVisible() {
        await expect(this.cartTable).toBeVisible();
    }

    async verifyProductQuantity(productName: string, quantity: string) {
        // Finding the row that contains the product name
        const row = this.cartRows.filter({ hasText: productName });
        const quantityButton = row.locator('.cart_quantity button');
        await expect(quantityButton).toHaveText(quantity);
    }

    async verifyProductPrice(productName: string, price: string) {
        const row = this.cartRows.filter({ hasText: productName });
        const priceElement = row.locator('.cart_price p');
        await expect(priceElement).toHaveText(price);
    }

    async verifyTotalPrice(productName: string, total: string) {
        const row = this.cartRows.filter({ hasText: productName });
        const totalElement = row.locator('.cart_total p');
        await expect(totalElement).toHaveText(total);
    }

    async getCartProducts() {
        return await this.cartRows.all();
    }

    async verifyProductRemoved(productName: string) {
        await expect(this.cartRows.filter({ hasText: productName })).not.toBeVisible();
    }
}
