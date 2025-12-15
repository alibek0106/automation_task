import { AutomationExerciseProductsPage } from '../pages/AutomationExerciseProductsPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseProductsSteps {
    constructor(private productsPage: AutomationExerciseProductsPage) { }

    @step('Verify Products page is visible')
    async verifyProductsPageVisible() {
        await this.productsPage.verifyPageOpened();
    }

    @step('View details of the first product')
    async viewFirstProductDetails() {
        await this.productsPage.viewProductDetails(0);
    }

    @step('Navigate to Products page')
    async navigateToProductsPage() {
        await this.productsPage.navigate();
    }

    @step('Add product "{0}" to cart')
    async addProductToCart(product: string | number) {
        if (typeof product === 'number') {
            await this.productsPage.addProductToCart(product);
        } else {
            await this.productsPage.addProductToCartByName(product);
        }
    }

    @step('Click "Continue Shopping"')
    async clickContinueShopping() {
        await this.productsPage.clickContinueShopping();
    }

    @step('Search for product: {0}')
    async searchForProduct(term: string) {
        await this.productsPage.searchProduct(term);
    }

    @step('Verify "SEARCHED PRODUCTS" header is visible')
    async verifySearchedProductsHeader() {
        await this.productsPage.verifySearchedProductsHeader();
    }

    @step('Verify all search results contain: {0}')
    async verifySearchResultsContain(term: string) {
        const names = await this.productsPage.getProductNames();
        if (names.length === 0) {
            throw new Error(`No products found for search term: ${term}`);
        }

        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedTerm = normalize(term);

        for (const name of names) {
            const normalizedName = normalize(name);
            if (!normalizedName.includes(normalizedTerm)) {
                // Log but don't fail immediately if it's a known weak match? No, fail but with better message.
                // For now, let's assume if it fails strict check, we might check if the term is 'dress' and result is 'top' (fuzzy).
                // But generally we want to enforce the test.
                if (!normalizedName.includes(normalizedTerm)) {
                    throw new Error(`Product "${name}" (normalized: ${normalizedName}) does not contain search term "${term}" (normalized: ${normalizedTerm})`);
                }
            }
        }
    }

    @step('Verify no products are displayed')
    async verifyNoProductsDisplayed() {
        const names = await this.productsPage.getProductNames();
        if (names.length > 0) {
            throw new Error(`Expected no products, but found: ${names.join(', ')}`);
        }
    }
}
