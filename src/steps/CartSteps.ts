import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { PRODUCT_NAMES } from '../constants/ProductData';
import { CartPage } from '../pages/CartPage';

export class CartSteps {
    constructor(
        private productsPage: ProductsPage,
        private detailsPage: ProductDetailsPage,
        private cartPage: CartPage
    ) { }

    /**
     * Adds a specific product by Name with custom quantity
     */
    async addProductWithQuantity(productName: string, quantity: number) {
        await test.step(`Add "${productName}" with quantity ${quantity}`, async () => {
            await this.productsPage.goto();
            await this.productsPage.viewProductByName(productName);
        })

        // Verify we landed on the right page
        // We expect the heading to match the name we clicked
        await expect(this.detailsPage.productName, 'Product name does not match').toHaveText(productName);

        await test.step('Add to cart with specified quantity', async () => {
            await this.detailsPage.setQuantity(quantity);
            await this.detailsPage.addToCart();

            await expect(this.detailsPage.continueShoppingBtn, 'Continue shopping button is not visible').toBeVisible();
            await this.detailsPage.clickContinueShopping();
        })
    }

    /**
     * Adds a specific product by Name and navigates to cart
     */
    async addProductAndGoToCart(productName: string) {
        await test.step('Add a specific product by name and navigate to cart', async () => {
            await this.productsPage.goto();
            await this.productsPage.viewProductByName(productName);

            await this.detailsPage.addToCart();
            await expect(this.detailsPage.viewCartModalLink, 'View cart modal link is not visible').toBeVisible();
            await this.detailsPage.clickViewCartFromModal();
        })
    }

    /**
     * Adds the first N products defined in our Data File
     */
    async populateCart(count: number): Promise<string[]> {
        return await test.step(`Populate cart with ${count} products`, async () => {
            const productsToAdd = PRODUCT_NAMES.slice(0, count);

            for (const name of productsToAdd) {
                await this.addProductWithQuantity(name, 1);
            }

            return productsToAdd;
        });
    }

    /**
     * Verifies that a product exists in the cart with the specific quantity
     * and that the total price is calculated correctly
     */
    async verifyProductDetails(productName: string, expectedQuantity: number) {
        await test.step(`Verify '${productName}' in cart has quantity ${expectedQuantity}`, async () => {
            const product = await this.cartPage.getProductByName(productName);
            expect(product.name, 'Product name should match').toBe(productName);
            expect(product.quantity, 'Product quantity should match').toBe(expectedQuantity);

            const expectedTotal = product.price * expectedQuantity;
            expect(product.total, `Total price should be ${expectedTotal}`).toBe(expectedTotal);
        });
    }

    /**
     * Add the first N products to the cart using a loop
     */
    async addProductsToCart(count: number) {
        await test.step(`Add first ${count} products to cart`, async () => {
            await this.productsPage.navigateToProducts();
            await this.productsPage.verifyAllProductsVisible();

            for (let i = 0; i < count; i++) {
                await this.productsPage.addProductToCart(i);
            }
        });
    }
}