import { expect } from '@playwright/test';
import { ProductService } from '../Services/ProductService';
import { SearchService } from '../Services/SearchService';
import { Product, ProductsListResponseSchema, SearchProductResponseSchema } from '../../models/ProductModels';
import { StatusCode } from '../../constants/StatusCode';
import { step } from '../../utils/StepDecorator';

/**
 * ProductApiSteps - API operations for product data
 * Used for validating product data between API and UI
 */
export class ProductApiSteps {
    constructor(
        private productService: ProductService,
        private searchService: SearchService
    ) {}

    /**
     * Get all products via API
     * @returns Array of products
     */
    @step('API: Get all products')
    async getAllProductsViaApi(): Promise<Product[]> {
        const maxAttempts = 3;
        let lastStatus = -1;
        let lastBody: unknown = undefined;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const response = await this.productService.getAllProducts();
            lastStatus = response.status();

            if (lastStatus === StatusCode.OK) {
                const body = await response.json();
                const parsed = ProductsListResponseSchema.parse(body);

                expect(
                    parsed.responseCode,
                    `Response code should be 200, got ${parsed.responseCode}`
                ).toBe(StatusCode.OK);

                return parsed.products;
            }

            lastBody = await response.json().catch(() => undefined);
            if (![StatusCode.INTERNAL_SERVER_ERROR, 502, 503, 504].includes(lastStatus)) {
                break;
            }

            // Backoff for transient upstream issues (no Playwright page waits)
            await new Promise((r) => setTimeout(r, 300 * attempt));
        }

        // Assert HTTP status
        expect(
            lastStatus,
            `Get all products API should return HTTP 200 (may transiently fail).\nLast body: ${JSON.stringify(lastBody)}`
        ).toBe(StatusCode.OK);
        return [];
    }

    /**
     * Search products via API
     * @param searchTerm Search keyword
     * @returns Array of matching products
     */
    @step('API: Search products')
    async searchProductsViaApi(searchTerm: string): Promise<Product[]> {
        const maxAttempts = 3;
        let lastStatus = -1;
        let lastBody: unknown = undefined;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const response = await this.searchService.searchProduct(searchTerm);
            lastStatus = response.status();

            if (lastStatus === StatusCode.OK) {
                const body = await response.json();
                const parsed = SearchProductResponseSchema.parse(body);

                expect(
                    parsed.responseCode,
                    `Search response code should be 200, got ${parsed.responseCode}`
                ).toBe(StatusCode.OK);

                return parsed.products;
            }

            lastBody = await response.json().catch(() => undefined);
            if (![StatusCode.INTERNAL_SERVER_ERROR, 502, 503, 504].includes(lastStatus)) {
                break;
            }

            await new Promise((r) => setTimeout(r, 300 * attempt));
        }

        // Assert HTTP status
        expect(
            lastStatus,
            `Search products API should return HTTP 200 for "${searchTerm}" (may transiently fail).\nLast body: ${JSON.stringify(lastBody)}`
        ).toBe(StatusCode.OK);
        return [];
    }

    /**
     * Get product by ID from products list
     * @param products Array of products
     * @param productId Product ID to find
     * @returns Product if found, undefined otherwise
     */
    @step('API: Find product by ID in list')
    async getProductByIdViaApi(products: Product[], productId: number): Promise<Product | undefined> {
        return products.find(product => product.id === productId);
    }

    /**
     * Get product by name from products list
     * @param products Array of products
     * @param productName Product name to find
     * @returns Product if found, undefined otherwise
     */
    @step('API: Find product by name in list')
    async getProductByNameViaApi(products: Product[], productName: string): Promise<Product | undefined> {
        const normalize = (value: string) =>
            value
                .replace(/\u00a0/g, " ") // NBSP → space
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

        const target = normalize(productName);
        return products.find((product) => {
            const apiName = normalize(product.name);
            return apiName.includes(target) || target.includes(apiName);
        });
    }

    /**
     * Verify product prices match between API and UI
     * Handles price format differences (e.g., "Rs. 500" vs "500")
     * @param apiProduct Product from API
     * @param uiPrice Price string from UI
     * @returns true if prices match, false otherwise
     */
    @step('API: Verify UI price matches API price')
    async verifyProductPricesMatch(apiProduct: Product, uiPrice: string): Promise<boolean> {
        const extract = (value: string): number => {
            const normalized = value.replace(/\u00a0/g, " ");
            const match = normalized.match(/(\d+(?:\.\d+)?)/);
            return match ? parseFloat(match[1]) : Number.NaN;
        };

        const apiPriceNum = extract(apiProduct.price);
        const uiPriceNum = extract(uiPrice);

        // Compare prices (allow small floating point differences)
        return Math.abs(apiPriceNum - uiPriceNum) < 0.01;
    }

    /**
     * Parse price string to number (removes currency symbols)
     * @param priceString Price string (e.g., "Rs. 500" or "$50.00")
     * @returns Numeric price value
     */
    @step('API: Parse price string to number')
    async parsePriceToNumber(priceString: string): Promise<number> {
        const normalized = priceString.replace(/\u00a0/g, " ");
        const match = normalized.match(/(\d+(?:\.\d+)?)/);
        if (!match) {
            throw new Error(`Could not parse numeric price from: "${priceString}"`);
        }
        return parseFloat(match[1]);
    }
}

