import { test, expect } from '../../src/fixtures';
import { StatusCode } from '../../src/constants/StatusCode';
import { ProductsListResponseSchema } from '../../src/models/ProductModels';
import { Routes } from '../../src/constants/Routes';

test.describe('Products API', () => {
    test('API 1: Get All Products List', async ({ productService }) => {
        const response = await productService.getAllProducts();

        // Assert HTTP status code
        const httpStatus = response.status();
        expect(
            httpStatus,
            `GET ${Routes.API.PRODUCTS_LIST} HTTP status should be ${StatusCode.OK}`
        ).toBe(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = ProductsListResponseSchema.parse(body);

        // Assert response structure (responseCode in body should match HTTP status)
        expect(
            parsed.responseCode,
            `Response code in body should be ${StatusCode.OK}`
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

        // API returns HTTP 200 and uses responseCode in body for actual status
        expect(
            response.status(),
            `POST ${Routes.API.PRODUCTS_LIST} HTTP status should be 200 OK (error encoded in body.responseCode)`
        ).toBe(StatusCode.OK);

        // Validate response message
        const body = await response.json();
        expect(
            body.responseCode,
            `Response code in body should be ${StatusCode.METHOD_NOT_ALLOWED}`
        ).toBe(StatusCode.METHOD_NOT_ALLOWED);
        expect(
            body.message,
            `Response message should indicate method not supported`
        ).toBe('This request method is not supported.');
    });
});

