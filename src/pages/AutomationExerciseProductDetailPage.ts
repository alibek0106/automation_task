import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AutomationExerciseProductDetailPage extends BasePage {
    private readonly quantityInput: Locator;
    private readonly addToCartButton: Locator;
    private readonly productInformation: Locator;
    private readonly productName: Locator;
    private readonly productPrice: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly viewCartLink: Locator;

    constructor(page: Page) {
        super(page, 'ProductDetailPage');
        this.quantityInput = this.page.locator('#quantity').describe('Quantity Input');
        this.addToCartButton = this.page.locator('button.cart').describe('Add To Cart Button');
        this.productInformation = this.page.locator('.product-information').describe('Product Information');
        // Product Details
        this.productName = this.page.locator('.product-information h2').describe('Product Name');
        this.productPrice = this.page.locator('.product-information span span').describe('Product Price');
        // Modal buttons
        this.continueShoppingButton = this.page.locator('.modal-footer button').describe('Continue Shopping Button');
        this.viewCartLink = this.page.locator('.modal-body a[href="/view_cart"]').describe('View Cart Link');
    }

    async verifyProductDetailVisible() {
        await expect(this.productInformation, 'Product Information should be visible').toBeVisible();
    }

    async getProductName(): Promise<string> {
        return this.productName.innerText();
    }

    async getProductPrice(): Promise<string> {
        return this.productPrice.innerText();
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
