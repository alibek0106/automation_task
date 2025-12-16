import { expect } from '@playwright/test';
import { UserService } from '../Services/UserService';
import { User, ApiResponseSchema, UserDetailResponseSchema, UserDetailResponse } from '../../models/UserModels';
import { StatusCode } from '../../constants/StatusCode';
import { step } from '../../utils/StepDecorator';

/**
 * UserApiSteps - API operations for user management
 * Used for faster test data setup/teardown compared to UI operations
 */
export class UserApiSteps {
    constructor(private userService: UserService) {}

    /**
     * Create a user account via API
     * @param user User data object
     * @returns Created user data (same as input)
     */
    @step('API: Create user account')
    async createUserViaApi(user: User): Promise<User> {
        const maxAttempts = 3;
        let lastStatus = -1;
        let lastBody: unknown = undefined;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const response = await this.userService.createAccount(user);
            lastStatus = response.status();

            if (lastStatus === StatusCode.OK) {
                const body = await response.json();
                const parsed = ApiResponseSchema.parse(body);

                expect(
                    parsed.responseCode,
                    `User creation should return responseCode 201, got ${parsed.responseCode}`
                ).toBe(StatusCode.CREATED);
                expect(
                    parsed.message,
                    'User creation message should be "User created!"'
                ).toBe('User created!');

                return user;
            }

            lastBody = await response.json().catch(() => undefined);
            if (![StatusCode.INTERNAL_SERVER_ERROR, 502, 503, 504].includes(lastStatus)) {
                break;
            }

            await new Promise((r) => setTimeout(r, 300 * attempt));
        }

        // Assert HTTP status
        expect(
            lastStatus,
            `Create user API should return HTTP 200.\nLast body: ${JSON.stringify(lastBody)}`
        ).toBe(StatusCode.OK);
        return user;
    }

    /**
     * Delete a user account via API
     * @param email User email
     * @param password User password
     */
    @step('API: Delete user account')
    async deleteUserViaApi(email: string, password: string): Promise<void> {
        const maxAttempts = 3;
        let lastStatus = -1;
        let lastBody: any = undefined;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const response = await this.userService.deleteAccount(email, password);
            lastStatus = response.status();
            lastBody = await response.json().catch(() => undefined);

            if (lastStatus === StatusCode.OK) {
                // Idempotent cleanup: API may reply "Account not found!" if already deleted.
                if (lastBody?.message === 'Account deleted!' || lastBody?.message === 'Account not found!') {
                    return;
                }

                // Fall through to assertion below for unexpected messages.
                break;
            }

            if (![StatusCode.INTERNAL_SERVER_ERROR, 502, 503, 504].includes(lastStatus)) {
                break;
            }
            await new Promise((r) => setTimeout(r, 300 * attempt));
        }

        expect(
            lastStatus,
            `Delete user API should return HTTP 200.\nLast body: ${JSON.stringify(lastBody)}`
        ).toBe(StatusCode.OK);
        expect(
            lastBody?.message,
            'Account deletion message should be "Account deleted!"'
        ).toBe('Account deleted!');
    }

    /**
     * Verify login credentials via API
     * @param email User email
     * @param password User password
     * @returns true if login is valid, false otherwise
     */
    @step('API: Verify login credentials')
    async verifyLoginViaApi(email: string, password: string): Promise<boolean> {
        const response = await this.userService.verifyLogin(email, password);

        const body = await response.json();
        
        if (response.status() === StatusCode.OK && body.message === 'User exists!') {
            return true;
        }
        return false;
    }

    /**
     * Get user details via API
     * @param email User email
     * @returns User detail response
     */
    @step('API: Get user details by email')
    async getUserDetailViaApi(email: string): Promise<UserDetailResponse> {
        const response = await this.userService.getUserDetailByEmail(email);

        // Assert HTTP status
        expect(
            response.status(),
            `Get user detail API should return HTTP 200, got ${response.status()}`
        ).toBe(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = UserDetailResponseSchema.parse(body);

        return parsed;
    }
}


