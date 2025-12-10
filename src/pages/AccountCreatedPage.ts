import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
    readonly successMessage: Locator = this.page.getByText('Account Created!').describe('Success message');
    readonly continueBtn: Locator = this.page.locator('[data-qa="continue-button"]').describe('Continue button');

    constructor(page: Page) {
        super(page);
    }

    async clickContinue() {
        await this.continueBtn.click();
    }
}
