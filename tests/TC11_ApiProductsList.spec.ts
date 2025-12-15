import { test } from '../src/fixtures';

test.describe('API - Products List', () => {
    test('TC11: Get all products list successfully', async ({ productsApiSteps }) => {
        // 1. Send GET request to products list endpoint
        // 2. Verify status code is 200
        // 3. Verify response body contains 'products' list
        // 4. Verify product list is not empty
        await productsApiSteps.verifyAllProductsList();
    });
});
