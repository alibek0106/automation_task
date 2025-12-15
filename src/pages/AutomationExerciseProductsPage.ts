import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AutomationExerciseProductsPage extends BasePage {
    readonly productsList: Locator;
    readonly viewProductButtons: Locator;
    readonly addToCartButtons: Locator;

    constructor(page: Page) {
        super(page);
        this.productsList = page.locator('.features_items');
        this.viewProductButtons = page.locator('.choose .nav-justified');
        this.addToCartButtons = page.locator('.add-to-cart-overlay'); // Simplified locator, might need refinement based on actual DOM
    }

    async navigate() {
        await this.page.goto('/products');
    }

    async verifyPageOpened() {
        await expect(this.page).toHaveTitle(/Automation Exercise - All Products/);
        await expect(this.productsList).toBeVisible();
    }

    async viewProductDetails(index: number) {
        // index is 0-based
        await this.viewProductButtons.nth(index).click();
    }

    async addProductToCart(index: number) {
        // This might need more specific selector logic depending on the site structure
        // For now assuming a list of "Add to cart" buttons
        await this.page.locator('.single-products').nth(index).locator('.add-to-cart').first().click();
    }
}
