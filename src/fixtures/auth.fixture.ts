import { test as base, Page } from '@playwright/test';
import { DataFactory } from '../utils/DataFactory';
import { User } from '../models/UserModels';
import { UserService } from '../api/UserService';
import { AuthSteps } from '../steps/AuthSteps';

// Define the type for our new fixture
export type AuthFixtures = {
    authedUser: User;
};

// Define the fixture logic
export const authFixture = {
    authedUser: async ({ page, userService, authSteps }: { page: Page, userService: UserService, authSteps: AuthSteps }, use: (u: User) => Promise<void>) => {
        // 1. Generate Data
        const user = DataFactory.generateUser();

        // 2. Setup (API Creation + UI Login)
        await userService.createAccount(user);
        await authSteps.login(user);

        // 3. Provide user to the test
        await use(user);
    },
};