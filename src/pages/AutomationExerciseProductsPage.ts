import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TIMEOUTS, MESSAGES, PAGE_TITLES } from '../utils/Constants';

export class AutomationExerciseProductsPage extends BasePage {
    private readonly productsList: Locator;
    private readonly viewProductButtons: Locator;
    private readonly addToCartButtons: Locator;
    private readonly searchInput: Locator;
    private readonly submitSearchButton: Locator;
    private readonly searchedProductsHeader: Locator;
    private readonly productNames: Locator;
    private readonly productCards: Locator;

    constructor(page: Page) {
        super(page, 'ProductsPage');
        this.productsList = this.resolveLocator('.features_items', 'Products List');
        this.viewProductButtons = this.resolveLocator('.choose .nav-justified', 'View Product Buttons');
        this.addToCartButtons = this.resolveLocator('.add-to-cart-overlay', 'Add to Cart Buttons');

        // Search elements
        this.searchInput = this.resolveLocator('#search_product', 'Search Input');
        this.submitSearchButton = this.resolveLocator('#submit_search', 'Search Button');
        this.searchedProductsHeader = this.resolveLocator(`h2.title:has-text("${MESSAGES.SEARCHED_PRODUCTS}")`, 'Searched Products Header');
        this.productNames = this.resolveLocator('.productinfo p', 'Product Names');
        this.productCards = this.resolveLocator('.product-image-wrapper', 'Product Cards');
    }

    async navigate() {
        await this.page.goto('/products');
    }

    async verifyPageOpened() {
        await expect(this.page).toHaveTitle(PAGE_TITLES.ALL_PRODUCTS);
        await expect(this.productsList).toBeVisible();
    }

    async searchProduct(term: string) {
        await this.searchInput.fill(term);
        await this.submitSearchButton.click();
    }

    async verifySearchedProductsHeader() {
        await expect(this.searchedProductsHeader).toBeVisible({ timeout: TIMEOUTS.VISIBILITY });
    }

    async getProductNames(): Promise<string[]> {
        return await this.productNames.allInnerTexts();
    }

    getProductCard(index: number): Locator {
        return this.productCards.nth(index);
    }

    async viewProductDetails(index: number) {
        // index is 0-based
        await this.viewProductButtons.nth(index).click();
    }

    async addProductToCart(index: number) {
        await this.getProductCard(index).locator('.add-to-cart').first().click();
    }

    async addProductToCartByName(productName: string) {
        const product = this.productCards.filter({ hasText: productName }).first();
        await product.hover();
        await product.locator('.add-to-cart').first().click();
    }

    async clickContinueShopping() {
        await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
    }
}
