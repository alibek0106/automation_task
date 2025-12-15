import { APIResponse } from '@playwright/test';

export const customMatchers = {
    /**
     * Asserts that the APIResponse has the expected status code.
     * @param response The APIResponse object
     * @param expectedCode The expected status code (number)
     */
    async toHaveStatusCode(response: APIResponse, expectedCode: number) {
        const actualCode = response.status();
        const pass = actualCode === expectedCode;

        if (pass) {
            return {
                message: () => `expected response status code not to be ${expectedCode}`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected response status code to be ${expectedCode}, but got ${actualCode}\nStatus Text: ${response.statusText()}`,
                pass: false,
            };
        }
    },
};
