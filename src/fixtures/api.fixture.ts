import { UserService } from '../api/UserService';
import { UserApiSteps } from '../steps/UserApiSteps';
import { APIRequestContext } from '@playwright/test';

export type ApiFixtures = {
    userService: UserService;
    userApiSteps: UserApiSteps;
};

export const apiFixtures = {
    userService: async ({ request }: { request: APIRequestContext }, use: (s: UserService) => Promise<void>) => {
        await use(new UserService(request));
    },
    userApiSteps: async ({ userService }: { userService: UserService }, use: (s: UserApiSteps) => Promise<void>) => {
        await use(new UserApiSteps(userService));
    },
};