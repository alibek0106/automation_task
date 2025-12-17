import { ApiClient } from '../ApiClient';
import { expect } from '../../fixtures';
import { API_ENDPOINTS, API_STATUS_CODES, API_MESSAGES, API_RESPONSE_KEYS } from '../../utils/Constants';
import { step } from '../../utils/Decorators';
import { Product, SearchProductResponse } from '../models/SearchProduct';

export class ProductsApiSteps {
    private storedApiProducts: Product[] = [];

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

    @step('Search for product "{0}" via API')
    async searchProductViaApi(searchTerm: string): Promise<Product[]> {
        const response = await this.apiClient.post(API_ENDPOINTS.SEARCH_PRODUCT, {
            search_product: searchTerm
        });

        // Verify status code
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Parse response
        const responseBody: SearchProductResponse = await response.json();

        // Verify response structure
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.RESPONSE_CODE, API_STATUS_CODES.OK);
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.PRODUCTS);

        // Store and return products
        this.storedApiProducts = responseBody.products;
        console.log(`API returned ${this.storedApiProducts.length} products for search term: ${searchTerm}`);
        return this.storedApiProducts;
    }

    @step('Get stored API search results')
    getStoredApiProducts(): Product[] {
        return this.storedApiProducts;
    }

    @step('Verify API search for "{0}" returns empty or not found')
    async verifyApiSearchReturnsEmptyOrNotFound(searchTerm: string) {
        const response = await this.apiClient.post(API_ENDPOINTS.SEARCH_PRODUCT, {
            search_product: searchTerm
        });

        // Verify status code
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        // Parse response
        const responseBody: SearchProductResponse = await response.json();

        // Verify response indicates no products
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.RESPONSE_CODE, API_STATUS_CODES.OK);
        expect(responseBody).toHaveProperty(API_RESPONSE_KEYS.PRODUCTS);

        const products = responseBody.products;
        expect(Array.isArray(products), 'Products should be an array').toBeTruthy();
        expect(products.length, `Expected no products for search term "${searchTerm}"`).toBe(0);

        console.log(`API correctly returned empty list for search term: ${searchTerm}`);
    }

    @step('Get all brands via API')
    async getAllBrands(): Promise<any[]> {
        const response = await this.apiClient.get(API_ENDPOINTS.BRANDS_LIST);
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('brands');
        return responseBody.brands;
    }

    @step('Get all products via API')
    async getAllProducts(): Promise<Product[]> {
        const response = await this.apiClient.get(API_ENDPOINTS.PRODUCTS_LIST);
        await expect(response).toHaveStatusCode(API_STATUS_CODES.OK);
        const responseBody = await response.json();
        return responseBody.products;
    }

    @step('Get products by Brand "{0}" via API')
    async getProductsByBrand(brandName: string): Promise<Product[]> {
        const allProducts = await this.getAllProducts();

        // Filter logic: Check if product.brand matches brandName (case-insensitive)
        const filtered = allProducts.filter(p =>
            p.brand && p.brand.toLowerCase() === brandName.toLowerCase()
        );

        console.log(`API Found ${filtered.length} products for Brand: ${brandName}`);
        return filtered;
    }

    @step('Get products by Category "{0}" > "{1}" via API')
    async getProductsByCategory(mainCategory: string, subCategory: string): Promise<Product[]> {
        const allProducts = await this.getAllProducts();

        // Filter logic: 
        // mainCategory matches product.category.usertype.usertype
        // subCategory matches product.category.category
        const filtered = allProducts.filter(p => {
            // Safe navigation in case category structure is missing
            const pMainCat = p.category?.usertype?.usertype;
            const pSubCat = p.category?.category;

            return pMainCat && pMainCat.toLowerCase() === mainCategory.toLowerCase() &&
                pSubCat && pSubCat.toLowerCase() === subCategory.toLowerCase();
        });

        console.log(`API Found ${filtered.length} products for Category: ${mainCategory} > ${subCategory}`);
        return filtered;
    }
}
