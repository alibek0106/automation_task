import { Page, Locator } from '@playwright/test';

export class ProductDetailsPage {
    readonly page: Page;
    readonly quantityInput: Locator;
    readonly addToCartBtn: Locator;
    readonly productName: Locator;
    readonly viewCartModalLink: Locator;
    readonly continueShoppingBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.quantityInput = page.getByRole('spinbutton').describe('Quantity input');
        this.addToCartBtn = page.getByRole('button', { name: 'Add to cart' }).filter({ hasNotText: /Category|Brands|Subscription/ }).describe('Add to cart button');
        this.productName = page.getByRole('heading', { level: 2 }).filter({ hasNotText: /Category|Brands|Subscription/ }).describe('Product name');
        this.viewCartModalLink = page.getByRole('link', { name: 'View Cart' }).filter({ hasText: 'View Cart' }).describe('View Cart Modal Link');
        this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' }).describe('Continue Shopping button');
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

    async clickViewCartFromModal() {
        await this.viewCartModalLink.click();
    }

    async clickContinueShopping() {
        await this.continueShoppingBtn.click();
    }
}