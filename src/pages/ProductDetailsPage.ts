import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
    readonly quantityInput: Locator = this.page.getByRole('spinbutton').describe('Quantity input');
    readonly addToCartBtn: Locator = this.page.getByRole('button', { name: 'Add to cart' }).filter({ hasNotText: /Category|Brands|Subscription/ }).describe('Add to cart button');
    readonly productName: Locator = this.page.getByRole('heading', { level: 2 }).filter({ hasNotText: /Category|Brands|Subscription/ }).describe('Product name');
    readonly viewCartModalLink: Locator = this.page.getByRole('link', { name: 'View Cart' }).filter({ hasText: 'View Cart' }).describe('View Cart Modal Link');
    readonly continueShoppingBtn: Locator = this.page.getByRole('button', { name: 'Continue Shopping' }).describe('Continue Shopping button');
    readonly productInfo: Locator = this.page.locator('.product-information').describe('Product Information');

    constructor(page: Page) {
        super(page);
    }

    async getProductNameText(): Promise<string> {
        return await this.productName.innerText();
    }

    async setQuantity(quantity: number) {
        await this.quantityInput.fill(String(quantity));
    }

    async addToCart() {
        await this.addToCartBtn.click();
    }

    async verifyProductDetailsVisible() {
        await expect(this.productInfo, 'Product information should be visible').toBeVisible();
    }

    async clickViewCartFromModal() {
        await this.viewCartModalLink.click();
    }

    async clickContinueShopping() {
        await this.continueShoppingBtn.click();
    }
}