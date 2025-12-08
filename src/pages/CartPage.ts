import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartItem } from '../models/ProductModels';

export class CartPage extends BasePage {
    readonly emptyCartMessage: Locator;
    readonly cartTable: Locator;
    readonly proceedToCheckoutBtn: Locator;
    readonly checkoutModalRegisterLoginLink: Locator;

    constructor(page: Page) {
        super(page);
        this.emptyCartMessage = page.getByText('Cart is empty!').describe('Empty Cart Message');
        this.cartTable = page
            .getByRole('table')
            .filter({ hasText: 'Item' })
            .filter({ hasText: 'Quantity' });
        this.proceedToCheckoutBtn = page.getByText('Proceed To Checkout').describe('Proceed To Checkout Button');
        this.checkoutModalRegisterLoginLink = page.getByRole('link', { name: 'Register / Login' });
    }

    private getAllRows(): Locator {
        return this.cartTable
            .getByRole('row')
            .filter({ hasNotText: 'Description' }) // Skip Header
            .filter({ hasNotText: 'Item' });       // Safety Skip
    }

    getProductRow(productName: string): Locator {
        return this.getAllRows()
            .filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
    }

    getRowByIndex(index: number): Locator {
        return this.getAllRows().nth(index);
    }

    private async extractRowData(row: Locator): Promise<CartItem> {
        const cells = row.getByRole('cell');

        // Semantic Location Strategy
        const name = await cells.nth(1).getByRole('link').innerText();
        const priceText = await cells.nth(2).innerText();
        const quantityText = await cells.nth(3).getByRole('button').innerText();
        const totalText = await cells.nth(4).innerText();
        const rowId = await row.getAttribute('id');

        // Parsing Logic
        const cleanPrice = (val: string) => parseInt(val.replace(/\D/g, ''), 10);

        return {
            id: rowId || 'unknown',
            name: name.trim(),
            price: cleanPrice(priceText),
            quantity: parseInt(quantityText, 10),
            total: cleanPrice(totalText),
        };
    }

    async getProductByName(productName: string): Promise<CartItem> {
        const row = this.getProductRow(productName);
        return await this.extractRowData(row);
    }

    /**
     * Get data for a product by index (e.g. "Get the first item in cart")
     */
    async getProductByIndex(index: number): Promise<CartItem> {
        const row = this.getRowByIndex(index);
        return await this.extractRowData(row);
    }

    /**
     * Remove a specific product by name
     */
    async removeProduct(productName: string): Promise<void> {
        const row = this.getProductRow(productName);
        // Find 'a' tag in the 6th cell (Index 5)
        const deleteBtn = row.getByRole('cell').nth(5).locator('a');
        await deleteBtn.click();
    }

    async getCartCount(): Promise<number> {
        if (await this.emptyCartMessage.isVisible()) return 0;
        return await this.getAllRows().count();
    }

    /**
     * Calculates total of all visible rows
     */
    async getCalculatedTotal(): Promise<number> {
        const count = await this.getCartCount();
        let total = 0;
        for (let i = 0; i < count; i++) {
            const item = await this.getProductByIndex(i);
            total += item.total;
        }
        return total;
    }

    async clickProceedToCheckout() {
        await this.proceedToCheckoutBtn.click();
    }

    async clickRegisterLoginFromModal() {
        await this.checkoutModalRegisterLoginLink.click();
    }

    async verifyRegisterLoginModal() {
        const registerLoginModal = this.page.locator('.modal-content');
        await expect(registerLoginModal).toBeVisible({ timeout: 5000 });
        const registerLink = registerLoginModal.getByRole('link', { name: /Register.*Login/i });
        await expect(registerLink).toBeVisible();
    }

    async getProductQuantity(productName: string): Promise<number> {
        const row = this.getProductRow(productName);
        const quantityText = await row.getByRole('cell').nth(3).innerText();
        return parseInt(quantityText, 10);
    }

    async getProductTotal(productName: string): Promise<number> {
        const row = this.getProductRow(productName);
        const totalText = await row.getByRole('cell').nth(4).innerText();
        return parseInt(totalText.replace(/\D/g, ''), 10);
    }
}
