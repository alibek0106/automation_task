import { AutomationExerciseProductsPage } from '../pages/AutomationExerciseProductsPage';
import { step } from '../utils/Decorators';
import { ERROR_MESSAGES } from '../utils/Constants';

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

    @step('View details of product: {0}')
    async viewProductDetails(productName: string) {
        await this.productsPage.viewProductDetailsByName(productName);
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
            throw new Error(`${ERROR_MESSAGES.NO_PRODUCTS_FOUND}: ${term}`);
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
                    throw new Error(`${ERROR_MESSAGES.PRODUCT_VERIFICATION_FAILED}: Product "${name}" (normalized: ${normalizedName}) does not contain search term "${term}" (normalized: ${normalizedTerm})`);
                }
            }
        }
    }

    @step('Verify no products are displayed')
    async verifyNoProductsDisplayed() {
        const names = await this.productsPage.getProductNames();
        if (names.length > 0) {
            throw new Error(`${ERROR_MESSAGES.UNEXPECTED_PRODUCTS_FOUND}: ${names.join(', ')}`);
        }
    }

    @step('Filter by Category: {0} > {1}')
    async filterByCategory(mainCategory: string, subCategory: string) {
        await this.productsPage.clickCategory(mainCategory);
        await this.productsPage.clickSubCategory(mainCategory, subCategory);
    }

    @step('Filter by Brand: {0}')
    async filterByBrand(brandName: string) {
        await this.productsPage.clickBrand(brandName);
    }

    @step('Verify page header is "{0}"')
    async verifyPageHeader(expectedTitle: string) {
        await this.productsPage.verifyPageHeader(expectedTitle);
    }

    @step('Verify displayed product count is greater than {0}')
    async verifyProductCountGreaterThan(minCount: number) {
        const count = await this.productsPage.getProductCount();
        if (count <= minCount) {
            throw new Error(`${ERROR_MESSAGES.PRODUCT_COUNT_MISMATCH} ${minCount} products, but found ${count}`);
        }
    }
}
