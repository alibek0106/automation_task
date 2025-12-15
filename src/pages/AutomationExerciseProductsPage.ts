import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TIMEOUTS, MESSAGES, PAGE_TITLES } from '../utils/Constants';

export class AutomationExerciseProductsPage extends BasePage {
    readonly productsList: Locator;
    readonly viewProductButtons: Locator;
    readonly addToCartButtons: Locator;
    readonly searchInput: Locator;
    readonly submitSearchButton: Locator;
    readonly searchedProductsHeader: Locator;
    readonly productNames: Locator;
    readonly products: Locator;

    constructor(page: Page) {
        super(page);
        this.productsList = page.locator('.features_items');
        this.viewProductButtons = page.locator('.choose .nav-justified');
        this.addToCartButtons = page.locator('.add-to-cart-overlay');

        // Search elements
        this.searchInput = page.locator('#search_product').describe('Search Input');
        this.submitSearchButton = page.locator('#submit_search').describe('Search Button');
        this.searchedProductsHeader = page.locator(`h2.title:has-text("${MESSAGES.SEARCHED_PRODUCTS}")`).describe('Searched Products Header');
        this.productNames = page.locator('.productinfo p').describe('Product Names');
        this.products = page.locator('.product-image-wrapper').describe('Product Cards');
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
        return this.page.locator('.single-products').nth(index);
    }

    async viewProductDetails(index: number) {
        // index is 0-based
        await this.viewProductButtons.nth(index).click();
    }

    async addProductToCart(index: number) {
        await this.getProductCard(index).locator('.add-to-cart').first().click();
    }
}
