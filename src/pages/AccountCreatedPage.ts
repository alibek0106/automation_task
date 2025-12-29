import { Page, Locator, expect } from '@playwright/test';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
    private readonly accountCreatedHeader: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        super(page, 'AccountCreatedPage');
        this.accountCreatedHeader = page.getByText(MESSSAGES.ACCOUNT_CREATED).describe('Account Created Header');
        this.continueButton = this.page.locator('[data-qa="continue-button"]').describe('Continue Button');
    }

    async verifyAccountCreatedMessage() {
        await expect(this.accountCreatedHeader, 'Account created message should be visible').toBeVisible();
    }

    async clickContinue() {
        await this.continueButton.click();
    }
}
