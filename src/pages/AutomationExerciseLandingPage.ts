import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class AutomationExerciseLandingPage extends BasePage {
    readonly body: Locator;

    constructor(page: Page) {
        super(page);
        this.body = page.locator('body');
    }

    async navigate() {
        await this.page.goto(Routes.BASE_URL);
    }

    async verifyPageOpened() {
        await expect(this.page).toHaveTitle(/Automation Exercise/);
        await expect(this.body).toBeVisible();
    }
}
