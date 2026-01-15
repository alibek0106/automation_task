import { expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';

declare global {
    // Augment Playwright's expect matchers
    namespace PlaywrightTest {
        interface Matchers<R> {
            /**
             * Assert that a response or numeric status code matches the expected HTTP status.
             *
             * Supports:
             * - APIResponse: await expect(response).toHaveStatusCode(StatusCode.OK);
             * - number: await expect(statusCode).toHaveStatusCode(StatusCode.OK);
             */
            toHaveStatusCode(expected: number): Promise<R>;
        }
    }
}

type StatusLike = APIResponse | number;

expect.extend({
    async toHaveStatusCode(received: StatusLike, expected: number) {
        const actual =
            typeof (received as APIResponse).status === 'function'
                ? (received as APIResponse).status()
                : (received as number);

        const pass = actual === expected;

        return {
            message: () =>
                pass
                    ? `Expected status code not to be ${expected}, but received ${actual}.`
                    : `Expected status code to be ${expected}, but received ${actual}.`,
            pass,
        };
    },
});


