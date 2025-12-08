import { UserService } from '../api/UserService';
import { APIRequestContext } from '@playwright/test';

export type ApiFixtures = {
    userService: UserService;
};

export const apiFixtures = {
    userService: async ({ request }: { request: APIRequestContext }, use: (s: UserService) => Promise<void>) => {
        await use(new UserService(request));
    },
};