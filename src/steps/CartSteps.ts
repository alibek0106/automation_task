import { Page, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

export class CartSteps {
    constructor(
        private productsPage: ProductsPage,
        private detailsPage: ProductDetailsPage,
    ) { }

    async addProductWithQuantity(productIndex: number, quantity: number) {
        await this.productsPage.goto();
        await expect(this.productsPage.viewProductLinks.first(), 'Product list should be visible').toBeVisible();

        await this.productsPage.viewProductDetails(productIndex);
        await expect(this.detailsPage.productName, 'Product detail page should load').toBeVisible();

        await this.detailsPage.setQuantity(quantity);
        await this.detailsPage.addToCart();

        await expect(this.detailsPage.continueShoppingBtn, 'Added to cart modal should appear').toBeVisible();
        await this.detailsPage.clickContinueShopping();
    }

    async addProductAndGoToCart(productIndex: number) {
        await this.productsPage.goto();

        await this.productsPage.viewProductDetails(productIndex);
        await this.detailsPage.addToCart();

        await expect(this.detailsPage.viewCartModalLink, 'View Cart link should be visible in modal').toBeVisible();
        await this.detailsPage.clickViewCartFromModal();
    }
}