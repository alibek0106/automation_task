import { ApiClient } from '../api/ApiClient';
import { AutomationExerciseApi } from '../api/AutomationExerciseApi';
import { UserApiSteps } from '../api/steps/UserApiSteps';
import { ProductsApiSteps } from '../api/steps/ProductsApiSteps';

export type ApiFixture = {
    apiClient: ApiClient;
    automationExerciseApi: AutomationExerciseApi;
    userApiSteps: UserApiSteps;
    productsApiSteps: ProductsApiSteps;
};

export const apiFixture = {
    apiClient: async ({ request }: { request: any }, use: (r: ApiClient) => Promise<void>) => {
        await use(new ApiClient(request));
    },
    automationExerciseApi: async ({ request }: { request: any }, use: (r: AutomationExerciseApi) => Promise<void>) => {
        await use(new AutomationExerciseApi(request));
    },
    userApiSteps: async ({ automationExerciseApi }: { automationExerciseApi: AutomationExerciseApi }, use: (r: UserApiSteps) => Promise<void>) => {
        await use(new UserApiSteps(automationExerciseApi));
    },
    productsApiSteps: async ({ apiClient }: { apiClient: ApiClient }, use: (r: ProductsApiSteps) => Promise<void>) => {
        await use(new ProductsApiSteps(apiClient));
    },
};
