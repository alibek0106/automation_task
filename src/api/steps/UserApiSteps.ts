import { ApiClient } from '../ApiClient';
import { User, AccountDetails, AddressInfo } from '../../utils/DataFactory';
import { expect } from '@playwright/test';
import { API_STATUS_CODES, API_ENDPOINTS } from '../../utils/Constants';

export class UserApiSteps {
    constructor(private apiClient: ApiClient) { }

    async createAccount(user: { name: string, email: string }, account: AccountDetails, address: AddressInfo) {
        // Map deeply nested objects to flat API structure
        const data = {
            name: user.name,
            email: user.email,
            password: account.password,
            title: account.title,
            birth_date: account.day,
            birth_month: account.month,
            birth_year: account.year,
            firstname: address.firstName,
            lastname: address.lastName,
            company: address.company,
            address1: address.address,
            address2: address.address2,
            country: address.country,
            zipcode: address.zipcode,
            state: address.state,
            city: address.city,
            mobile_number: address.mobileNumber
        };

        const response = await this.apiClient.post(API_ENDPOINTS.CREATE_ACCOUNT, data);
        const responseBody = await response.text();

        // API returns 200/201 but strict checking is good. 
        // AutomationExercise API often returns JSON string like "User created!" inside HTML sometimes?
        // Let's assume expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(API_STATUS_CODES.OK); // Doc said 201 but typically 200
        // Or confirm status logic later. Start with basics.
    }

    async deleteAccount(email: string, password: string) {
        const data = {
            email: email,
            password: password
        };
        const response = await this.apiClient.delete(API_ENDPOINTS.DELETE_ACCOUNT, data);
        expect(response.status()).toBe(API_STATUS_CODES.OK);
    }
}
