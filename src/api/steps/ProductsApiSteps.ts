import { ApiClient } from '../ApiClient';
import { expect } from '../../fixtures';
import { API_ENDPOINTS, API_STATUS_CODES, API_MESSAGES, API_RESPONSE_KEYS } from '../../utils/Constants';
import { step } from '../../utils/Decorators';
import { Product, SearchProductResponse } from '../models/SearchProduct';

export class ProductsApiSteps {
    private storedApiProducts: Product[] = [];

    constructor(private apiClient: ApiClient) { }

    @step('Verify all products list API response')
    async verifyAllProductsList() {
        const response = await this.apiClient.get(API_ENDPOINTS.PRODUCTS_LIST);

        // Verify status code
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Verify response body
        const responseBody = await response.json();

        // Verify 'products' property exists
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.PRODUCTS);

        // Verify products list is not empty
        const products = responseBody[API_RESPONSE_KEYS.PRODUCTS];
        expect(Array.isArray(products), 'Products should be an array').toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        // Optional: Log count
        console.log(`Verified ${products.length} products retrieved from API.`);
    }

    @step('Verify POST to products list is not supported')
    async verifyPostToProductsListNotSupported() {
        const response = await this.apiClient.post(API_ENDPOINTS.PRODUCTS_LIST, {});

        // API returns 200 OK even for "Method Not Allowed" logical error
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Verify response body message
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.RESPONSE_CODE, API_STATUS_CODES.METHOD_NOT_ALLOWED);
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.MESSAGE, API_MESSAGES.METHOD_NOT_SUPPORTED);
    }

    @step('Search for product "{0}" via API')
    async searchProductViaApi(searchTerm: string): Promise<Product[]> {
        const response = await this.apiClient.post(API_ENDPOINTS.SEARCH_PRODUCT, {
            search_product: searchTerm
        });

        // Verify status code
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Parse response
        const responseBody: SearchProductResponse = await response.json();

        // Verify response structure
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.RESPONSE_CODE, API_STATUS_CODES.OK);
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.PRODUCTS);

        // Store and return products
        this.storedApiProducts = responseBody.products;
        console.log(`API returned ${this.storedApiProducts.length} products for search term: ${searchTerm}`);
        return this.storedApiProducts;
    }

    @step('Get stored API search results')
    getStoredApiProducts(): Product[] {
        return this.storedApiProducts;
    }

    @step('Verify API search for "{0}" returns empty or not found')
    async verifyApiSearchReturnsEmptyOrNotFound(searchTerm: string) {
        const response = await this.apiClient.post(API_ENDPOINTS.SEARCH_PRODUCT, {
            search_product: searchTerm
        });

        // Verify status code
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Parse response
        const responseBody: SearchProductResponse = await response.json();

        // Verify response indicates no products
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.RESPONSE_CODE, API_STATUS_CODES.OK);
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.PRODUCTS);

        const products = responseBody.products;
        expect(Array.isArray(products), 'Products should be an array').toBeTruthy();
        expect(products.length, `Expected no products for search term "${searchTerm}"`).toBe(0);

        console.log(`API correctly returned empty list for search term: ${searchTerm}`);
    }
}
