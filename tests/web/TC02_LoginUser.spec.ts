import { test } from '../src/fixtures';
import * as fs from 'fs';
import * as path from 'path';

test.describe('User Authentication', () => {
    test('TC02: Login User with correct email and password', async ({
        automationExerciseLandingSteps,
        automationExerciseNavigationSteps,
        automationExerciseLoginSteps,
    }) => {
        // Arrange: Read test data from user-data.json
        const userDataPath = path.resolve('tests/testData/user-data.json');
        if (!fs.existsSync(userDataPath)) {
            throw new Error(`user-data.json not found at ${userDataPath}. Please run TC01 first to generate a user.`);
        }
        const user = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));

        // --- TEST FLOW ---
        // 1. Launch browser and Navigate to url 'http://automationexercise.com'
        await automationExerciseLandingSteps.navigateToHomepage();

        // 2. Verify that home page is visible successfully
        await automationExerciseLandingSteps.verifyPageOpened();

        // 3. Click on 'Signup / Login' button
        await automationExerciseNavigationSteps.clickSignupLogin();

        // 4. Verify 'Login to your account' is visible
        await automationExerciseLoginSteps.verifyLoginHeaderVisible();

        // 5. Enter correct email address and password
        // 6. Click 'login' button
        await automationExerciseLoginSteps.login(user.email, user.password);

        // 7. Verify that 'Logged in as username' is visible
        await automationExerciseNavigationSteps.verifyUserLoggedIn(user.name);

        // 8. Delete Account (Optional cleanup)
        // await automationExerciseNavigationSteps.clickDeleteAccount();
        // await automationExerciseNavigationSteps.verifyAccountDeleted();
    });
});
