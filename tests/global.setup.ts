import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';
import { DataFactory } from '../src/utils/DataFactory';
import { UserService } from '../src/api/UserService';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';

setup('authenticate', async ({ page, request }) => {
    const user = DataFactory.generateUser();
    const userService = new UserService(request);
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // Create user via API
    await userService.createAccount(user);

    // Login via UI
    await homePage.goto();
    await homePage.clickSignupLogin();
    await loginPage.login(user.email, user.password);

    await expect(homePage.loggedInText, 'User should be logged in').toBeVisible();

    await page.context().storageState({ path: STORAGE_STATE });
})