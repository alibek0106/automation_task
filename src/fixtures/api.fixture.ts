import { UserService } from '../api/UserService';
import { APIRequestContext } from '@playwright/test';
import { UserApiSteps } from '../steps/api/UserApiSteps';

export type ApiFixtures = {
    userService: UserService;
    userApiSteps: UserApiSteps;
};

export const apiFixtures = {
    userService: async ({ request }: { request: APIRequestContext }, use: (s: UserService) => Promise<void>) => {
        await use(new UserService(request));
    },
    userApiSteps: async ({ userService }: ApiFixtures, use: (s: UserApiSteps) => Promise<void>) => {
        await use(new UserApiSteps(userService));
    },
};