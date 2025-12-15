import { APIRequestContext, expect } from '@playwright/test';
import { API_ENDPOINTS, TIMEOUTS } from '../utils/Constants';
import { User } from '../utils/DataFactory';

export class AutomationExerciseApi {
    constructor(private request: APIRequestContext) { }

    /**
     * Registers a new user via API
     * @param user User object containing registration details
     */
    async registerUser(user: User): Promise<void> {
        const response = await this.request.post(API_ENDPOINTS.CREATE_ACCOUNT, {
            form: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: user.title,
                birth_date: user.day,
                birth_month: user.month,
                birth_year: user.year,
                firstname: user.firstName,
                lastname: user.lastName,
                company: user.company,
                address1: user.address,
                address2: user.address2,
                country: user.country,
                zipcode: user.zipcode,
                state: user.state,
                city: user.city,
                mobile_number: user.mobileNumber
            },
            timeout: TIMEOUTS.API_TIMEOUT
        });

        // The API might return 200 even for failures, so we check the response body if possible
        // But for this exercise, we assume 200 OK means success unless we parse the message
        expect(response.status(), `Failed to register user via API: ${response.statusText()}`).toBe(200);

        const responseBody = await response.text();
        expect(responseBody).toContain('User created!');
    }

    /**
     * Deletes a user via API
     * @param email Email of the user to delete
     * @param password Password of the user to delete (if required by API, usually email/password needed for auth or specific delete params)
     */
    async deleteUser(email: string, password?: string): Promise<void> {
        const response = await this.request.delete(API_ENDPOINTS.DELETE_ACCOUNT, {
            form: {
                email: email,
                password: password || ''
            },
            timeout: TIMEOUTS.API_TIMEOUT
        });

        expect(response.status(), `Failed to delete user via API: ${response.statusText()}`).toBe(200);
        const responseBody = await response.text();
        expect(responseBody).toContain('Account deleted!');
    }
}
