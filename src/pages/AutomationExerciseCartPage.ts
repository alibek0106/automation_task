import { Page, Locator, expect } from '@playwright/test';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AutomationExerciseCartPage extends BasePage {
    private readonly cartTable: Locator;
    private readonly cartRows: Locator;
    private readonly emptyCartMessage: Locator;
    private readonly proceedToCheckoutButton: Locator;

    private readonly deleteButtonSelector = '.cart_quantity_delete';
    private readonly quantityButtonSelector = '.cart_quantity button';
    private readonly priceSelector = '.cart_price p';
    private readonly totalSelector = '.cart_total p';
    private readonly descriptionSelector = '.cart_description h4 a';

    constructor(page: Page) {
        super(page, 'CartPage');
        this.cartTable = this.page.locator('#cart_info_table').describe('Cart Table');
        this.cartRows = this.page.locator('#cart_info_table tbody tr').describe('Cart Rows');
        this.emptyCartMessage = this.page.locator('#empty_cart').describe('Empty Cart Message');
        this.proceedToCheckoutButton = this.page.locator('text=Proceed To Checkout').describe('Proceed To Checkout Button');
    }

    async removeProduct(productName: string) {
        const row = this.cartRows.filter({ hasText: productName });
        await row.locator(this.deleteButtonSelector).click();
    }

    async verifyCartEmpty() {
        await expect(this.emptyCartMessage, 'Empty cart message should be as expected').toContainText(MESSSAGES.CART_EMPTY);
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }

    async verifyCartVisible() {
        await expect(this.cartTable, 'Cart table should be visible').toBeVisible();
    }

    async verifyProductQuantity(productName: string, quantity: string) {
        // Finding the row that contains the product name
        const row = this.cartRows.filter({ hasText: productName });
        const quantityButton = row.locator(this.quantityButtonSelector);
        await expect(quantityButton, 'Product quantity should match').toHaveText(quantity);
    }

    async verifyProductPrice(productName: string, price: string) {
        const row = this.cartRows.filter({ hasText: productName });
        const priceElement = row.locator(this.priceSelector);
        await expect(priceElement, 'Product price should match').toHaveText(price);
    }

    async verifyTotalPrice(productName: string, total: string) {
        const productNameRow = this.cartRows.filter({ hasText: productName });
        const totalElement = productNameRow.locator(this.totalSelector);
        await expect(totalElement, 'Total price should match').toHaveText(total);
    }

    async getCartProducts() {
        return this.cartRows.all();
    }

    async verifyProductRemoved(productName: string) {
        const productNameRow = this.cartRows.filter({ hasText: productName });
        await expect(productNameRow, 'Product should be removed').not.toBeVisible();
    }

    async getCartItemsDetails(): Promise<{ name: string, price: string, quantity: string, total: string }[]> {
        const rows = await this.cartRows.all();
        const details = [];
        for (const row of rows) {
            const name = await row.locator(this.descriptionSelector).innerText();
            const price = await row.locator(this.priceSelector).innerText();
            const quantity = await row.locator(this.quantityButtonSelector).innerText();
            const total = await row.locator(this.totalSelector).innerText();
            details.push({ name, price, quantity, total });
        }
        return details;
    }
}
