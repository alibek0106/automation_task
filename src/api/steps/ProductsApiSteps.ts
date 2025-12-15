import { ApiClient } from '../ApiClient';
import { expect } from '@playwright/test';
import { API_ENDPOINTS, API_STATUS_CODES } from '../../utils/Constants';
import { step } from '../../utils/Decorators';

export class ProductsApiSteps {
    constructor(private apiClient: ApiClient) { }

    @step('Verify all products list API response')
    async verifyAllProductsList() {
        const response = await this.apiClient.get(API_ENDPOINTS.PRODUCTS_LIST);

        // Verify status code
        expect(response.status(), `API Response Status should be 200`).toBe(200);

        // Verify response body
        const responseBody = await response.json();

        // Verify 'products' property exists
        expect(responseBody).toHaveProperty('products');

        // Verify products list is not empty
        const products = responseBody.products;
        expect(Array.isArray(products), 'Products should be an array').toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        // Optional: Log count
        console.log(`Verified ${products.length} products retrieved from API.`);
    }

    @step('Verify POST to products list is not supported')
    async verifyPostToProductsListNotSupported() {
        const response = await this.apiClient.post(API_ENDPOINTS.PRODUCTS_LIST, {});

        // API returns 200 OK even for "Method Not Allowed" logical error
        expect(response.status(), `API Response Status should be 200`).toBe(200);

        // Verify response body message
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('responseCode', 405);
        expect(responseBody).toHaveProperty('message', 'This request method is not supported.');
    }
}
