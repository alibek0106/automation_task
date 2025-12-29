/**
 * Product model representing a single product from the API
 */
export interface Product {
    id: number;
    name: string;
    price: string;
    brand: string;
    category?: {
        usertype?: {
            usertype: string;
        };
        category: string;
    };
}

/**
 * Search Product API response model
 */
export interface SearchProductResponse {
    responseCode: number;
    products: Product[];
}
