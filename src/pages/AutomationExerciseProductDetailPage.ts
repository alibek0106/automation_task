import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AutomationExerciseProductDetailPage extends BasePage {
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly productInformation: Locator;
    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartLink: Locator;

    constructor(page: Page) {
        super(page);
        this.quantityInput = page.locator('#quantity');
        this.addToCartButton = page.locator('button.cart');
        this.productInformation = page.locator('.product-information');
        // Product Details
        this.productName = page.locator('.product-information h2');
        this.productPrice = page.locator('.product-information span span');
        // Modal buttons
        this.continueShoppingButton = page.locator('.modal-footer button');
        this.viewCartLink = page.locator('.modal-body a[href="/view_cart"]');
    }

    async verifyProductDetailVisible() {
        await expect(this.productInformation).toBeVisible();
    }

    async getProductName(): Promise<string> {
        return await this.productName.innerText();
    }

    async getProductPrice(): Promise<string> {
        return await this.productPrice.innerText();
    }

    async setQuantity(quantity: string) {
        await this.quantityInput.fill(quantity);
    }

    async addToCart() {
        await this.addToCartButton.click();
    }

    async clickContinueShopping() {
        await this.continueShoppingButton.click();
    }

    async clickViewCart() {
        await this.viewCartLink.click();
    }
}
