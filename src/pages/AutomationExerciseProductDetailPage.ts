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
        this.quantityInput = this.resolveLocator('#quantity', 'Quantity Input');
        this.addToCartButton = this.resolveLocator('button.cart', 'Add To Cart Button');
        this.productInformation = this.resolveLocator('.product-information', 'Product Information');
        // Product Details
        this.productName = this.resolveLocator('.product-information h2', 'Product Name');
        this.productPrice = this.resolveLocator('.product-information span span', 'Product Price');
        // Modal buttons
        this.continueShoppingButton = this.resolveLocator('.modal-footer button', 'Continue Shopping Button');
        this.viewCartLink = this.resolveLocator('.modal-body a[href="/view_cart"]', 'View Cart Link');
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
