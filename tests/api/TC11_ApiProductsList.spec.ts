import { test } from '../../src/fixtures';

/**
 * TC11: API Products List
 * 
 * Validates that the GET /api/productsList endpoint returns a valid response
 * with a non-empty products array and correct HTTP status code.
 */

test.describe('API - Products List', { tag: '@api @products' }, () => {
    test('TC11: Get all products list successfully', async ({ productsApiSteps }) => {
        await productsApiSteps.verifyAllProductsList();
    });
});
