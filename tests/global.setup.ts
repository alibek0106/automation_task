import { test as setup, expect } from '../src/fixtures';
import config from '../playwright.config';
import { DataFactory } from '../src/utils/DataFactory';
import { UserService } from '../src/api/UserService';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';
import fs from 'fs';
import path from 'path';



setup('authenticate workers', async ({ page, request, context, homePage, loginPage }) => {
    // Get worker count from config (defaults to 4 if not numeric)
    const workerCount = typeof config.workers === 'number'
        ? config.workers
        : 4;

    console.log(`\n🔧 Setting up ${workerCount} worker account(s)...\n`);

    // Create unique account for each worker
    for (let workerIndex = 0; workerIndex < workerCount; workerIndex++) {
        const user = DataFactory.generateUser();
        const userService = new UserService(request);

        const storageStatePath = path.join(__dirname, `../playwright/.auth/worker-${workerIndex}.json`);
        const userDataPath = path.join(__dirname, `../playwright/.auth/user-${workerIndex}.json`);

        // Create user via API
        await userService.createAccount(user);

        // Login via UI to establish session
        // await homePage.goto();
        // await homePage.clickSignupLogin();
        // await loginPage.login(user.email, user.password);
        // await expect(homePage.loggedInText, `Worker ${workerIndex} should be logged in`).toBeVisible();

        // Save storage state and user data for this worker
        await context.storageState({ path: storageStatePath });
        fs.writeFileSync(userDataPath, JSON.stringify(user, null, 2));

        console.log(`✓ Worker ${workerIndex}: ${user.email}`);

        // Clear session for next worker (if not last iteration)
        if (workerIndex < workerCount - 1) {
            await context.clearCookies();
        }
    }

    console.log(`\n✅ All ${workerCount} worker accounts created successfully!\n`);
});

// Increase timeout for setup - creating multiple accounts takes time
setup.setTimeout(120000); // 2 minutes for creating N accounts