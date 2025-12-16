import { expect } from '@playwright/test';
import { ProductService } from '../../src/api/ProductService';
import { SearchService } from '../../src/api/SearchService';
import { Product, ProductsListResponseSchema, SearchProductResponseSchema } from '../../src/models/ProductModels';
import { StatusCode } from '../../src/constants/StatusCode';

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
    async getAllProductsViaApi(): Promise<Product[]> {
        const response = await this.productService.getAllProducts();

        // Assert HTTP status
        expect(
            response.status(),
            `Get all products API should return HTTP 200, got ${response.status()}`
        ).toBe(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = ProductsListResponseSchema.parse(body);

        // Assert response code
        expect(
            parsed.responseCode,
            `Response code should be 200, got ${parsed.responseCode}`
        ).toBe(StatusCode.OK);

        return parsed.products;
    }

    /**
     * Search products via API
     * @param searchTerm Search keyword
     * @returns Array of matching products
     */
    async searchProductsViaApi(searchTerm: string): Promise<Product[]> {
        const response = await this.searchService.searchProduct(searchTerm);

        // Assert HTTP status
        expect(
            response.status(),
            `Search products API should return HTTP 200 for "${searchTerm}", got ${response.status()}`
        ).toBe(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = SearchProductResponseSchema.parse(body);

        // Assert response code
        expect(
            parsed.responseCode,
            `Search response code should be 200, got ${parsed.responseCode}`
        ).toBe(StatusCode.OK);

        return parsed.products;
    }

    /**
     * Get product by ID from products list
     * @param products Array of products
     * @param productId Product ID to find
     * @returns Product if found, undefined otherwise
     */
    getProductByIdViaApi(products: Product[], productId: number): Product | undefined {
        return products.find(product => product.id === productId);
    }

    /**
     * Get product by name from products list
     * @param products Array of products
     * @param productName Product name to find
     * @returns Product if found, undefined otherwise
     */
    getProductByNameViaApi(products: Product[], productName: string): Product | undefined {
        return products.find(product => 
            product.name.toLowerCase().includes(productName.toLowerCase())
        );
    }

    /**
     * Verify product prices match between API and UI
     * Handles price format differences (e.g., "Rs. 500" vs "500")
     * @param apiProduct Product from API
     * @param uiPrice Price string from UI
     * @returns true if prices match, false otherwise
     */
    verifyProductPricesMatch(apiProduct: Product, uiPrice: string): boolean {
        // Extract numeric value from API price (handles "Rs. 500" format)
        const apiPriceNum = parseFloat(apiProduct.price.replace(/[^0-9.]/g, ''));
        
        // Extract numeric value from UI price (handles "Rs. 500" format)
        const uiPriceNum = parseFloat(uiPrice.replace(/[^0-9.]/g, ''));

        // Compare prices (allow small floating point differences)
        return Math.abs(apiPriceNum - uiPriceNum) < 0.01;
    }

    /**
     * Parse price string to number (removes currency symbols)
     * @param priceString Price string (e.g., "Rs. 500" or "$50.00")
     * @returns Numeric price value
     */
    parsePriceToNumber(priceString: string): number {
        return parseFloat(priceString.replace(/[^0-9.]/g, ''));
    }
}

