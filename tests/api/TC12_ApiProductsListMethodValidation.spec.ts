import { test } from '../../src/fixtures';

/**
 * TC12: API Products List Method Validation
 * 
 * Validates that the POST method is not supported for the products list endpoint.
 * Expects HTTP 405 Method Not Allowed response with appropriate error message.
 */

test.describe('API - Products List Method Validation', { tag: '@api @products' }, () => {
    test('TC12: Verify POST method is not supported for products list', async ({ productsApiSteps }) => {
        await productsApiSteps.verifyPostToProductsListNotSupported();
    });
});
