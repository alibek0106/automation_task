import { ApiClient } from '../ApiClient';
import { expect } from '../../fixtures';
import { API_ENDPOINTS, API_STATUS_CODES, API_MESSAGES, API_RESPONSE_KEYS } from '../../utils/Constants';
import { step } from '../../utils/Decorators';

export class ProductsApiSteps {
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
}
