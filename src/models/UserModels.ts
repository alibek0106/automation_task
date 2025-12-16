import { z } from 'zod';

const AddressSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    zipcode: z.string(),
    mobileNumber: z.string(),
}).strict();

export const UserSchema = z.object({
    name: z.string().describe('Full display name'),
    email: z.email(),
    password: z.string().min(5, 'Password must be at least 5 characters long'),
    title: z.enum(['Mr', 'Mrs']),
    birthDay: z.string(),
    birthMonth: z.string(),
    birthYear: z.string(),
}).extend(AddressSchema.shape).strict();

export type User = z.infer<typeof UserSchema>;

// API Response Schema validation
export const ApiResponseSchema = z.object({
    responseCode: z.number(),
    message: z.string(),
}).strict().describe('Standard API response structure');

// User detail response schema
export const UserDetailResponseSchema = z.object({
    responseCode: z.number(),
    user: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        title: z.string(),
        birth_date: z.string(),
        birth_month: z.string(),
        birth_year: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        company: z.string(),
        address1: z.string(),
        address2: z.string().optional(),
        country: z.string(),
        zipcode: z.string(),
        state: z.string(),
        city: z.string(),
        mobile_number: z.string(),
    }),
}).strict();

export type UserDetailResponse = z.infer<typeof UserDetailResponseSchema>;