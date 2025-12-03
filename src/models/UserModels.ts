import { z } from 'zod';

export const UserSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    title: z.enum(['Mr', 'Mrs']),
    firstName: z.string(),
    lastName: z.string(),
    company: z.string(),
    address1: z.string(),
    address2: z.string(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    zipcode: z.string(),
    mobileNumber: z.string(),
    birthDay: z.string(),
    birthMonth: z.string(),
    birthYear: z.string(),
});

export type User = z.infer<typeof UserSchema>;