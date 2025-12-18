import { AutomationExerciseProductsPage } from '../pages/AutomationExerciseProductsPage';
import { step } from '../utils/Decorators';
import { ERROR_MESSAGES } from '../utils/Constants';
import { Product } from '../api/models/SearchProduct';

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

    @step('Verify success message is visible')
    async verifySuccessMessage() {
        await this.productsPage.verifySuccessMessage();
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

    // ==================== Hybrid API Validation Methods ====================

    @step('Verify UI product count matches API count')
    async verifyProductCountMatchesApi(apiProducts: Product[]) {
        const uiCount = await this.productsPage.getProductCount();
        const apiCount = apiProducts.length;

        if (uiCount !== apiCount) {
            throw new Error(`Product count mismatch: API returned ${apiCount} products, but UI displays ${uiCount} products`);
        }
    }

    @step('Verify UI product names match API response')
    async verifyProductNamesMatchApi(apiProducts: Product[]) {
        const uiProducts = await this.productsPage.getProductDetails();

        // Sort both arrays by name for consistent comparison
        const sortedApiProducts = [...apiProducts].sort((a, b) => a.name.localeCompare(b.name));
        const sortedUiProducts = [...uiProducts].sort((a, b) => a.name.localeCompare(b.name));

        const mismatches: string[] = [];

        for (let i = 0; i < sortedApiProducts.length; i++) {
            const apiName = sortedApiProducts[i].name.trim();
            const uiName = sortedUiProducts[i]?.name.trim();

            if (apiName !== uiName) {
                mismatches.push(`Position ${i}: API="${apiName}", UI="${uiName}"`);
            }
        }

        if (mismatches.length > 0) {
            throw new Error(`Product names mismatch:\n${mismatches.join('\n')}`);
        }
    }

    @step('Verify UI product prices match API response')
    async verifyProductPricesMatchApi(apiProducts: Product[]) {
        const uiProducts = await this.productsPage.getProductDetails();

        // Sort both arrays by name to ensure matching order
        const sortedApiProducts = [...apiProducts].sort((a, b) => a.name.localeCompare(b.name));
        const sortedUiProducts = [...uiProducts].sort((a, b) => a.name.localeCompare(b.name));

        const mismatches: string[] = [];

        for (let i = 0; i < sortedApiProducts.length; i++) {
            const apiPrice = sortedApiProducts[i].price.trim();
            const uiPrice = sortedUiProducts[i]?.price.trim();

            // Normalize prices for comparison (remove extra spaces, currencies, etc.)
            const normalizePrice = (price: string) => price.replace(/\s+/g, ' ').trim();

            if (normalizePrice(apiPrice) !== normalizePrice(uiPrice)) {
                mismatches.push(`Product "${sortedApiProducts[i].name}": API="${apiPrice}", UI="${uiPrice}"`);
            }
        }

        if (mismatches.length > 0) {
            throw new Error(`Product prices mismatch:\n${mismatches.join('\n')}`);
        }
    }

    @step('Verify product card structure at index {0}')
    async verifyProductCardStructureAt(index: number) {
        await this.productsPage.verifyProductCardStructure(index);
    }

    @step('Verify all product cards have required structure')
    async verifyAllProductCardsStructure() {
        const count = await this.productsPage.getProductCount();

        for (let i = 0; i < count; i++) {
            await this.productsPage.verifyProductCardStructure(i);
        }
    }

    @step('Verify empty search results are displayed')
    async verifyEmptySearchResults() {
        await this.productsPage.verifyEmptyState();
    }
}
