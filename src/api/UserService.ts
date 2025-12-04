import { APIRequestContext } from '@playwright/test';
import { User } from '../models/UserModels';

export class UserService {
    private request: APIRequestContext;
    private baseURL = 'https://www.automationexercise.com';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * Create a new user account via API
     */
    async createAccount(user: User): Promise<void> {
        const formData = new URLSearchParams();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('title', user.title);
        formData.append('birth_date', user.birthDate);
        formData.append('birth_month', user.birthMonth);
        formData.append('birth_year', user.birthYear);
        formData.append('firstname', user.firstName);
        formData.append('lastname', user.lastName);
        formData.append('company', user.company);
        formData.append('address1', user.address1);
        formData.append('address2', user.address2);
        formData.append('country', user.country);
        formData.append('zipcode', user.zipcode);
        formData.append('state', user.state);
        formData.append('city', user.city);
        formData.append('mobile_number', user.mobileNumber);

        const response = await this.request.post(`${this.baseURL}/api/createAccount`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: formData.toString(),
        });

        if (!response.ok()) {
            const body = await response.text();
            throw new Error(`Failed to create account via API: ${response.status()} - ${body}`);
        }
    }

    /**
     * Delete a user account via API
     */
    async deleteAccount(email: string, password: string): Promise<void> {
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);

        const response = await this.request.delete(`${this.baseURL}/api/deleteAccount`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: formData.toString(),
        });

        if (!response.ok()) {
            const body = await response.text();
            throw new Error(`Failed to delete account via API: ${response.status()} - ${body}`);
        }
    }

    /**
     * Verify login via API
     */
    async verifyLogin(email: string, password: string): Promise<boolean> {
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);

        const response = await this.request.post(`${this.baseURL}/api/verifyLogin`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: formData.toString(),
        });

        if (!response.ok()) {
            return false;
        }

        const body = await response.json();
        return body.responseCode === 200;
    }
}
