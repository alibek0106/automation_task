import { expect } from '@playwright/test';
import { UserService } from '../../src/api/UserService';
import { User, ApiResponseSchema, UserDetailResponseSchema, UserDetailResponse } from '../../src/models/UserModels';
import { StatusCode } from '../../src/constants/StatusCode';

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
    async createUserViaApi(user: User): Promise<User> {
        const response = await this.userService.createAccount(user);

        // Assert HTTP status
        expect(
            response.status(),
            `Create user API should return HTTP 200, got ${response.status()}`
        ).toBe(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = ApiResponseSchema.parse(body);

        // Assert API response code and message
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

    /**
     * Delete a user account via API
     * @param email User email
     * @param password User password
     */
    async deleteUserViaApi(email: string, password: string): Promise<void> {
        const response = await this.userService.deleteAccount(email, password);

        // Assert HTTP status
        expect(
            response.status(),
            `Delete user API should return HTTP 200, got ${response.status()}`
        ).toBe(StatusCode.OK);

        // Validate response message
        const body = await response.json();
        expect(
            body.message,
            'Account deletion message should be "Account deleted!"'
        ).toBe('Account deleted!');
    }

    /**
     * Verify login credentials via API
     * @param email User email
     * @param password User password
     * @returns true if login is valid, false otherwise
     */
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


