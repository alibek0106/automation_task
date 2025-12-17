import { test } from '../../src/fixtures';

test.describe('API - Products List Method Validation', () => {
    test('TC12: Verify POST method is not supported for products list', async ({ productsApiSteps }) => {
        // 1. Send POST request to products list endpoint
        // 2. Verify status code is 405
        // 3. Verify response body contains "This request method is not supported."
        await productsApiSteps.verifyPostToProductsListNotSupported();
    });
});
