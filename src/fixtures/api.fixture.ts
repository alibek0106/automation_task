import { ApiClient } from '../api/ApiClient';
import { UserApiSteps } from '../api/steps/UserApiSteps';

export type ApiFixture = {
    apiClient: ApiClient;
    userApiSteps: UserApiSteps;
};

export const apiFixture = {
    apiClient: async ({ request }: { request: any }, use: (r: ApiClient) => Promise<void>) => {
        await use(new ApiClient(request));
    },
    userApiSteps: async ({ apiClient }: { apiClient: ApiClient }, use: (r: UserApiSteps) => Promise<void>) => {
        await use(new UserApiSteps(apiClient));
    },
};
