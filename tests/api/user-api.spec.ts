import { test, expect } from '../../src/fixtures';
import { StatusCode } from '../../src/constants/StatusCode';
import { ApiResponseSchema, UserDetailResponseSchema } from '../../src/models/UserModels';
import { DataFactory } from '../../src/utils/DataFactory';

test.describe('User API', () => {
    test('API 7: POST To Verify Login with valid details', async ({ userService }) => {
        // First create a user to ensure we have valid credentials
        const user = DataFactory.generateUser();
        const createResponse = await userService.createAccount(user);
        expect(
            createResponse.status(),
            'User creation should succeed before login verification test'
        ).toBe(StatusCode.OK);

        // Now verify login with the created user's credentials
        const response = await userService.verifyLogin(user.email, user.password);

        // Assert status code
        expect(
            response.status(),
            'POST /api/verifyLogin with valid credentials should return 200 OK'
        ).toBe(StatusCode.OK);

        // Validate response message
        const body = await response.json();
        expect(
            body.message,
            'Response message should confirm user exists'
        ).toBe('User exists!');
    });

    test('API 8: POST To Verify Login without email parameter', async ({ userService }) => {
        const response = await userService.verifyLoginWithoutEmail('somepassword');

        // Assert status code
        expect(
            response.status(),
            'POST /api/verifyLogin without email should return 400 Bad Request'
        ).toBe(StatusCode.BAD_REQUEST);

        // Validate response message
        const body = await response.json();
        expect(
            body.message,
            'Response message should indicate missing email or password parameter'
        ).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    test('API 9: DELETE To Verify Login', async ({ userService }) => {
        const response = await userService.deleteVerifyLogin();

        // Assert status code
        expect(
            response.status(),
            'DELETE /api/verifyLogin should return 405 Method Not Allowed'
        ).toBe(StatusCode.METHOD_NOT_ALLOWED);

        // Validate response message
        const body = await response.json();
        expect(
            body.message,
            'Response message should indicate method not supported'
        ).toBe('This request method is not supported.');
    });

    test('API 10: POST To Verify Login with invalid details', async ({ userService }) => {
        const email = 'invaliduser@example.com';
        const password = 'invalidpassword';

        const response = await userService.verifyLogin(email, password);

        // Assert status code
        expect(
            response.status(),
            'POST /api/verifyLogin with invalid credentials should return 404 Not Found'
        ).toBe(StatusCode.NOT_FOUND);

        // Validate response message
        const body = await response.json();
        expect(
            body.message,
            'Response message should indicate user not found'
        ).toBe('User not found!');
    });

    test('API 11: POST To Create/Register User Account', async ({ userService }) => {
        const user = DataFactory.generateUser();

        const response = await userService.createAccount(user);

        // Assert status code (API may return 200 with responseCode 201 in body)
        const httpStatus = response.status();
        expect(
            httpStatus,
            'POST /api/createAccount HTTP status should be 200'
        ).toBe(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = ApiResponseSchema.parse(body);

        // Assert response structure (actual API status in responseCode)
        expect(
            parsed.responseCode,
            'Response code in body should be 201'
        ).toBe(StatusCode.CREATED);
        expect(
            parsed.message,
            'Response message should confirm user creation'
        ).toBe('User created!');
    });

    test('API 12: DELETE METHOD To Delete User Account', async ({ userService }) => {
        // First create a user
        const user = DataFactory.generateUser();
        const createResponse = await userService.createAccount(user);
        expect(
            createResponse.status(),
            'User creation should succeed before deletion test'
        ).toBe(StatusCode.OK);

        // Now delete the user
        const response = await userService.deleteAccount(user.email, user.password);

        // Assert status code
        expect(
            response.status(),
            'DELETE /api/deleteAccount should return 200 OK'
        ).toBe(StatusCode.OK);

        // Validate response message
        const body = await response.json();
        expect(
            body.message,
            'Response message should confirm account deletion'
        ).toBe('Account deleted!');
    });

    test('API 13: PUT METHOD To Update User Account', async ({ userService }) => {
        // First create a user
        const user = DataFactory.generateUser();
        const createResponse = await userService.createAccount(user);
        expect(
            createResponse.status(),
            'User creation should succeed before update test'
        ).toBe(StatusCode.OK);

        // Update user details
        const updatedUser = DataFactory.generateUser();
        updatedUser.email = user.email; // Keep same email

        const response = await userService.updateAccount(updatedUser);

        // Assert status code
        expect(
            response.status(),
            'PUT /api/updateAccount should return 200 OK'
        ).toBe(StatusCode.OK);

        // Validate response message
        const body = await response.json();
        expect(
            body.message,
            'Response message should confirm user update'
        ).toBe('User updated!');
    });

    test('API 14: GET user account detail by email', async ({ userService }) => {
        // First create a user
        const user = DataFactory.generateUser();
        const createResponse = await userService.createAccount(user);
        expect(
            createResponse.status(),
            'User creation should succeed before getting user detail'
        ).toBe(StatusCode.OK);

        // Get user details by email
        const response = await userService.getUserDetailByEmail(user.email);

        // Assert status code
        expect(
            response.status(),
            'GET /api/getUserDetailByEmail should return 200 OK'
        ).toBe(StatusCode.OK);

        // Validate response schema
        const body = await response.json();
        const parsed = UserDetailResponseSchema.parse(body);

        // Assert response structure
        expect(
            parsed.responseCode,
            'Response code should be 200'
        ).toBe(StatusCode.OK);
        expect(
            parsed.user.email,
            'User email in response should match requested email'
        ).toBe(user.email);
    });
});

