import { z } from 'zod';

export const PaymentDetailsSchema = z.object({
    nameOnCard: z.string(),
    cardNumber: z.string(),
    cvc: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
});

export type PaymentDetails = z.infer<typeof PaymentDetailsSchema>;