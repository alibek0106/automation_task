import { z } from 'zod';

// Brand schema
export const BrandSchema = z.object({
    id: z.number(),
    brand: z.string(),
}).strict();

// Brands list response schema
export const BrandsListResponseSchema = z.object({
    responseCode: z.number(),
    brands: z.array(BrandSchema),
}).strict();

export type Brand = z.infer<typeof BrandSchema>;
export type BrandsListResponse = z.infer<typeof BrandsListResponseSchema>;


