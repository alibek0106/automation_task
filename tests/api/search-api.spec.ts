import { test, expect } from '../../src/fixtures';
import { StatusCode } from '../../src/constants/StatusCode';
import { SearchProductResponseSchema } from '../../src/models/ProductModels';

test.describe('Search Product API', () => {
    test('API 5: POST To Search Product with search_product parameter', async ({ searchService }) => {
        const searchTerms = ['top', 'tshirt', 'jean'];
        
        for (const searchTerm of searchTerms) {
            await test.step(`Search for "${searchTerm}"`, async () => {
                const response = await searchService.searchProduct(searchTerm);

                // Assert status code
                expect(
                    response.status(),
                    `POST /api/searchProduct with search_product="${searchTerm}" should return 200 OK`
                ).toBe(StatusCode.OK);

                // Validate response schema
                const body = await response.json();
                const parsed = SearchProductResponseSchema.parse(body);

                // Assert response structure
                expect(
                    parsed.responseCode,
                    'Response code should be 200'
                ).toBe(StatusCode.OK);
                expect(
                    parsed.products,
                    'Search results should be an array'
                ).toBeInstanceOf(Array);
            });
        }
    });

    test('API 6: POST To Search Product without search_product parameter', async ({ searchService }) => {
        const response = await searchService.searchProductWithoutParameter();

        // Assert status code
        expect(
            response.status(),
            'POST /api/searchProduct without search_product parameter should return 400 Bad Request'
        ).toBe(StatusCode.BAD_REQUEST);

        // Validate response message
        const body = await response.json();
        expect(
            body.message,
            'Response message should indicate missing search_product parameter'
        ).toBe('Bad request, search_product parameter is missing in POST request.');
    });
});


