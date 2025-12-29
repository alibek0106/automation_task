import { Page, Locator, expect } from '@playwright/test';
import { Routes } from '../constants/Routes';
import { BasePage } from './BasePage';

export class AutomationExerciseLandingPage extends BasePage {
        private readonly body: Locator;

        constructor(page: Page) {
                super(page, 'LandingPage');
                this.body = this.page.locator('body').describe('Body');
        }

        async navigate() {
                await this.page.goto(Routes.BASE_URL);
        }

        async verifyPageOpened() {
                await expect(this.page, 'Landing page should be opened').toHaveTitle(Routes.TITLE);
                await expect(this.body, 'Page Body should be visible').toBeVisible();
        }
}
