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
        expect(response.status(), 'Status code should be 200').toBe(StatusCode.OK);

        const parsed = ApiResponseSchema.parse(await response.json());

        expect(parsed.responseCode, 'Response code should be 201').toBe(StatusCode.CREATED);
        expect(parsed.message, 'Message should be "User created!"').toBe('User created!');

        return parsed;
    }

    async deleteAccount(email: string, password: string) {
        const formData = { email, password };
        const response = await this.delete(Routes.API.DELETE_ACCOUNT, formData);
        expect(response.status(), 'Status code should be 200').toBe(StatusCode.OK);
        const json = await response.json();
        const parsed = ApiResponseSchema.parse(json);
        expect(parsed.responseCode, 'Response code should be 200').toBe(StatusCode.OK);
        expect(parsed.message, 'Message should be "Account deleted!"').toBe('Account deleted!');
    }
}