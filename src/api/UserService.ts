import { expect } from '@playwright/test';
import { ApiClient } from './ApiClient';
import { User, ApiResponseSchema } from '../models/UserModels';
import { Routes } from '../constants/Routes';
import { StatusCode } from '../constants/StatusCode';

export class UserService extends ApiClient {
    async createAccount(user: User) {
        const formData = {
            name: user.name,
            email: user.email,
            password: user.password,
            title: user.title,
            birth_date: user.birthDay,
            birth_month: user.birthMonth,
            birth_year: user.birthYear,
            firstname: user.firstName,
            lastname: user.lastName,
            company: user.company,
            address1: user.address1,
            address2: user.address2 || '',
            country: user.country,
            zipcode: user.zipcode,
            state: user.state,
            city: user.city,
            mobile_number: user.mobileNumber
        };

        const response = await this.post(Routes.API.CREATE_ACCOUNT, formData);
        expect(response.status()).toBe(StatusCode.OK);

        const parsed = ApiResponseSchema.parse(await response.json());

        expect(parsed.responseCode).toBe(StatusCode.CREATED);
        expect(parsed.message).toBe('User created!');

        return parsed;
    }
}