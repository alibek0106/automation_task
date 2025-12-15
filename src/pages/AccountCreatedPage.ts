import { Page, Locator, expect } from '@playwright/test';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
    readonly accountCreatedHeader: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.accountCreatedHeader = page.getByText(MESSSAGES.ACCOUNT_CREATED);
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async verifyAccountCreatedMessage() {
        await expect(this.accountCreatedHeader).toBeVisible();
    }

    async clickContinue() {
        await this.continueButton.click();
    }
}
