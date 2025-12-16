import { z } from 'zod';

// Product schema
export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.string(),
    brand: z.string(),
    category: z.object({
        usertype: z.object({
            usertype: z.string(),
        }).optional(),
        category: z.string(),
    }).optional(),
}).strict();

// Products list response schema
export const ProductsListResponseSchema = z.object({
    responseCode: z.number(),
    products: z.array(ProductSchema),
}).strict();

// Product detail response (for search)
export const SearchProductResponseSchema = z.object({
    responseCode: z.number(),
    products: z.array(ProductSchema),
}).strict();

export type Product = z.infer<typeof ProductSchema>;
export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;
export type SearchProductResponse = z.infer<typeof SearchProductResponseSchema>;
