import { isolatedTest as test, expect } from "../../../src/fixtures";
import { DataFactory } from "../../../src/utils/DataFactory";
import { User } from "../../../src/models/UserModels";

test.describe("TC02-Hybrid: Login with API-Created User", () => {
    let testUser: User;

    test.beforeEach(async ({ userApiSteps }) => {
        // Create user via API for faster setup
        const workerIndex = test.info().workerIndex;
        testUser = DataFactory.generateUser({ workerIndex });
        await userApiSteps.createUserViaApi(testUser);
    });

    test.afterEach(async ({ userApiSteps }) => {
        // Cleanup: Delete user via API
        await userApiSteps.deleteUserViaApi(testUser.email, testUser.password);
    });

    test("should login with API-created user credentials via UI", async ({
        homePage,
        loginPage,
        authSteps,
    }) => {
        // Step 1: Navigate to homepage
        await test.step("Navigate to homepage", async () => {
            await homePage.goto();
            await homePage.verifyPageOpened();
        });

        // Step 2: Navigate to login page
        await test.step("Navigate to login page", async () => {
            await homePage.clickSignupLogin();
            await expect(
                loginPage.loginHeader,
                "Login to your account heading should be visible"
            ).toBeVisible();
        });

        // Step 3: Login with API-created credentials
        await test.step("Login with API-created user credentials", async () => {
            await loginPage.login(testUser.email, testUser.password);
        });

        // Step 4: Verify successful login
        await test.step("Verify successful login", async () => {
            await expect(
                homePage.loggedInText,
                "Logged in text should be visible"
            ).toBeVisible();
            await expect(
                homePage.loggedInText,
                `Should show logged in as ${testUser.name}`
            ).toContainText(testUser.name);
        });

        // Step 5: Verify user is on homepage after login
        await test.step("Verify redirected to homepage", async () => {
            await homePage.verifyPageOpened();
        });
    });
});

