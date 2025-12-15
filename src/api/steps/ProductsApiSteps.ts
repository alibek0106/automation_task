import { ApiClient } from '../ApiClient';
import { expect } from '@playwright/test';
import { API_ENDPOINTS } from '../../utils/Constants';
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
}
