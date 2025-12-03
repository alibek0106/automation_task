import { Page, Locator } from '@playwright/test';
import { CartItem } from '../models/ProductModels';

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private getDataRows(): Locator {
        return this.page.getByRole('table').getByRole('row').filter({ hasNotText: 'Description' });
    }

    // Extracts formatted data from a specific cart row.
    async getCartItem(index: number): Promise<CartItem> {
        const row = this.getDataRows().nth(index);
        const cells = row.getByRole('cell');

        const name = await cells.nth(1).getByRole('link').innerText();
        const priceText = await cells.nth(2).innerText();
        const quantityText = await cells.nth(3).getByRole('button').innerText();
        const totalText = await cells.nth(4).innerText();

        const rowId = await row.getAttribute('id');

        // Helper to clean "Rs. 500" -> 500
        const cleanPrice = (val: string) => parseInt(val.replace(/\D/g, ''), 10);

        return {
            id: rowId || `unknown-${index}`,
            name: name.trim(),
            price: cleanPrice(priceText),
            quantity: parseInt(quantityText, 10),
            total: cleanPrice(totalText),
        };
    }

    // Returns the total number of product rows in the cart
    async getCartCount(): Promise<number> {
        return await this.getDataRows().count();
    }
}