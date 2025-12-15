import { Page, Locator, expect } from '@playwright/test';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AutomationExerciseCartPage extends BasePage {
    readonly cartTable: Locator;
    readonly cartRows: Locator;

    constructor(page: Page) {
        super(page);
        this.cartTable = page.locator('#cart_info_table');
        this.cartRows = page.locator('#cart_info_table tbody tr');
    }

    async removeProduct(productName: string) {
        const row = this.cartRows.filter({ hasText: productName });
        await row.locator('.cart_quantity_delete').click();
    }

    async verifyCartEmpty() {
        await expect(this.page.locator('#empty_cart .text-center')).toContainText(MESSSAGES.CART_EMPTY);
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
