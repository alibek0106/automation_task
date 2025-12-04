import { expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { PRODUCT_NAMES } from '../constants/ProductData';

export class CartSteps {
    constructor(
        private productsPage: ProductsPage,
        private detailsPage: ProductDetailsPage
    ) { }

    /**
     * Adds a specific product by Name with custom quantity
     */
    async addProductWithQuantity(productName: string, quantity: number) {
        await this.productsPage.goto();

        // Action: Select by Name
        await this.productsPage.viewProductByName(productName);

        // Verify we landed on the right page
        // We expect the heading to match the name we clicked
        await expect(this.detailsPage.productName).toHaveText(productName);

        await this.detailsPage.setQuantity(quantity);
        await this.detailsPage.addToCart();

        await expect(this.detailsPage.continueShoppingBtn).toBeVisible();
        await this.detailsPage.clickContinueShopping();
    }

    /**
     * Adds a specific product by Name and navigates to cart
     */
    async addProductAndGoToCart(productName: string) {
        await this.productsPage.goto();
        await this.productsPage.viewProductByName(productName);

        await this.detailsPage.addToCart();
        await expect(this.detailsPage.viewCartModalLink).toBeVisible();
        await this.detailsPage.clickViewCartFromModal();
    }

    /**
     * Adds the first N products defined in our Data File
     */
    async populateCart(count: number): Promise<string[]> {
        const productsToAdd = PRODUCT_NAMES.slice(0, count); // Get top N names

        for (const name of productsToAdd) {
            await this.addProductWithQuantity(name, 1);
        }

        return productsToAdd; // Return names so test knows what to expect
    }

    // Changes the quantity of a product to a terget value
    async updateProductQuantity(productName: string, targetQty: number, currentQty: number) {
        if (targetQty === currentQty) return;

        if (targetQty > currentQty) {
            const needed = targetQty - currentQty;
            await this.addProductWithQuantity(productName, needed);
        } else {
            await this.productsPage.navigateToCart();
            await this.addProductWithQuantity(productName, targetQty);
        }
    }
}