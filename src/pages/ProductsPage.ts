import { Page, Locator } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
    readonly continueShoppingBtn: Locator;
    readonly viewCartLink: Locator;
    readonly productCards: Locator;

    constructor(page: Page) {
        super(page);
        this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' }).describe('Continue Shopping Button');
        this.viewCartLink = page.getByText(' Cart', { exact: true }).describe('View Cart Link');
        this.productCards = page.locator('.product-image-wrapper');
    }

    async goto() {
        await this.page.goto(Routes.WEB.PRODUCTS);
    }


    async viewProductByName(productName: string) {
        const card = this.productCards.filter({ hasText: productName });
        const viewLink = card.getByRole('link', { name: 'View Product' });
        await viewLink.click();
    }

    async clickContinueShopping() {
        await this.continueShoppingBtn.click();
    }

    async navigateToCart() {
        await this.viewCartLink.click();
    }
}