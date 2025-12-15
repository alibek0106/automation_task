import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class AutomationExerciseLandingPage extends BasePage {
    private readonly body: Locator;

    constructor(page: Page) {
        super(page, 'LandingPage');
        this.body = this.resolveLocator('body', 'Body');
    }

    async navigate() {
        await this.page.goto(Routes.BASE_URL);
    }

    async verifyPageOpened() {
        await expect(this.page).toHaveTitle(/Automation Exercise/);
        await expect(this.body).toBeVisible();
    }
}
