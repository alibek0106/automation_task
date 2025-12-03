import { Page, Locator } from '@playwright/test';
import { Routes } from '../constants/Routes';

export class ProductsPage {
    readonly page: Page;
    readonly viewProductLinks: Locator;
    readonly searchInput: Locator;
    readonly searchBtn: Locator;
    readonly continueShoppingBtn: Locator;
    readonly viewCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.viewProductLinks = page.getByRole('link', { name: 'View Product' }).describe('View Product Links');
        this.searchInput = page.getByPlaceholder('Search Product').describe('Search Input');
        this.searchBtn = page.getByRole('button', { name: 'submit_search' }).describe('Search Button');
        this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' }).describe('Continue Shopping Button');
        this.viewCartLink = page.getByRole('link', { name: 'View Cart' }).first().describe('View Cart Link');
    }

    async goto() {
        await this.page.goto(Routes.WEB.PRODUCTS);
    }

    /**
     * Clicks "View Product" for a specific index in the list
     * @param index 0-based index of the product
     */
    async viewProductDetails(index: number = 0) {
        await this.viewProductLinks.nth(index).click();
    }

    async clickContinueShopping() {
        await this.continueShoppingBtn.click();
    }
}