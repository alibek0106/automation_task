import { Page, Locator } from '@playwright/test';

export class AccountCreatedPage {
    readonly successMessage: Locator;
    readonly continueBtn: Locator;

    constructor(readonly page: Page) {
        this.successMessage = page.getByText('Account Created!').describe('Success message');
        this.continueBtn = page.locator('[data-qa="continue-button"]').describe('Continue button');
    }

    async clickContinue() {
        await this.continueBtn.click();
    }
}