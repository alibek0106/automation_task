import { test, expect } from '../../src/fixtures';
import { Routes } from '../../src/constants/Routes';
import { DataFactory } from '../../src/utils/DataFactory';
import { UserService } from '../../src/api/UserService';
import { User } from '../../src/models/UserModels';
import { LOGIN_NEGATIVE_SCENARIOS } from '../../src/utils/LoginScenarios';

test.describe('TC05: Login Negative Scenarios (REST API)', { tag: ['@API', '@Negative', '@Abdykarimov'] }, () => {

    let validUser: User;

    test.beforeAll(async ({ request }) => {
        const userService = new UserService(request);
        validUser = DataFactory.generateUser();
        await userService.createAccount(validUser);
    });

    for (const scenario of LOGIN_NEGATIVE_SCENARIOS) {
        test(`should fail login via API: ${scenario.desc}`, async ({ request }) => {
            const emailToSend = scenario.email === 'valid' ? validUser.email : scenario.email;

            const response = await request.post(Routes.API.VERIFY_LOGIN, {
                form: {
                    email: emailToSend,
                    password: scenario.pass
                }
            });

            const responseBody = await response.json();

            // 1. Assert Message
            expect(responseBody.message, 'API Message should match').toBe(scenario.expectedApiMsg);

            // 2. Assert Response Code (Driven by Data file now)
            expect(responseBody.responseCode, 'API Response Code should match').toBe(scenario.responseCode);
        });
    }
});