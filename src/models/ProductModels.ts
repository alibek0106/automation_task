import { z } from 'zod';

export const CartItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    total: z.number(),
});

export type CartItem = z.infer<typeof CartItemSchema>;