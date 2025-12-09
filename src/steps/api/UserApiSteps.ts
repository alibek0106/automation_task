import { test, APIRequestContext, BrowserContext } from '@playwright/test';
import { UserService } from '../../api/UserService';
import { User } from '../../models/UserModels';
import { Routes } from '../../constants/Routes';

export class UserApiSteps {
    constructor(private userService: UserService) { }

    async registerUser(user: User) {
        return await test.step(`API: Register User '${user.name}'`, async () => {
            const response = await this.userService.createAccount(user);
            return response;
        });
    }

    /**
     * Hybrid Login Logic (CSRF Aware)
     * Scrapes the Django CSRF token to bypass security checks
     */
    async createAndLoginUser(
        user: User,
        context: BrowserContext
    ) {
        await test.step(`API: Create and Login User '${user.name}'`, async () => {
            // 1. Create Account
            await this.registerUser(user);

            const browserRequest = context.request;

            // 2. GET the login page to generate the CSRF token
            const visitResponse = await browserRequest.get(Routes.WEB.LOGIN);

            // Check if GET was successful
            if (!visitResponse.ok()) {
                throw new Error(`Failed to load login page. Status: ${visitResponse.status()}`);
            }

            // 3. Extract the CSRF Token from the HTML
            const pageHtml = await visitResponse.text();

            // Regex to find: <input type="hidden" name="csrfmiddlewaretoken" value="..." />
            const csrfMatch = pageHtml.match(/name="csrfmiddlewaretoken" value="([^"]+)"/);

            let csrfToken = '';
            if (csrfMatch && csrfMatch[1]) {
                csrfToken = csrfMatch[1];
            } else {
                console.warn('Could not extract csrfmiddlewaretoken from HTML, trying without it...');
            }

            const finalUrl = visitResponse.url();
            const origin = new URL(finalUrl).origin;

            // 4. POST with the Token
            const loginResponse = await browserRequest.post(Routes.WEB.LOGIN, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Origin': origin,
                    'Referer': finalUrl
                },
                form: {
                    csrfmiddlewaretoken: csrfToken,
                    email: user.email,
                    password: user.password
                }
            });

            if (!loginResponse.ok() && loginResponse.status() !== 302) {
                const body = await loginResponse.text();
                throw new Error(`Failed to login via API. Status: ${loginResponse.status()}. \nUrl: ${finalUrl} \nBody: ${body}`);
            }
        });
    }
}