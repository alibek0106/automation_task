import { test, expect } from '../../src/fixtures';
import { StatusCode } from '../../src/constants/StatusCode';
import { ProductsListResponseSchema } from '../../src/models/ProductModels';

test.describe('Products API', () => {
    test('API 1: Get All Products List', async ({ productService }) => {
        const response = await productService.getAllProducts();

        // Assert HTTP status code
        const httpStatus = response.status();
        expect(
            httpStatus,
            'GET /api/productsList HTTP status should be 200 OK'
        ).toBe(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = ProductsListResponseSchema.parse(body);

        // Assert response structure (responseCode in body should match HTTP status)
        expect(
            parsed.responseCode,
            'Response code in body should be 200'
        ).toBe(StatusCode.OK);
        expect(
            parsed.products,
            'Products list should be an array'
        ).toBeInstanceOf(Array);
        expect(
            parsed.products.length,
            'Products list should contain items'
        ).toBeGreaterThan(0);
    });

    test('API 2: POST To All Products List', async ({ productService }) => {
        const response = await productService.postToProductsList();

        // Assert status code
        expect(
            response.status(),
            'POST /api/productsList should return 405 Method Not Allowed'
        ).toBe(StatusCode.METHOD_NOT_ALLOWED);

        // Validate response message
        const body = await response.json();
        expect(
            body.message,
            'Response message should indicate method not supported'
        ).toBe('This request method is not supported.');
    });
});

