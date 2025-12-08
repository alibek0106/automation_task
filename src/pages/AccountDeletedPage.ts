import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountDeletedPage extends BasePage {
    readonly deletedHeader: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.deletedHeader = page.getByRole('heading', { name: 'Account Deleted!' }).describe('Deleted page header');
        this.continueBtn = page.locator('[data-qa="continue-button"]').describe('Continue button');
    }

    async clickContinue() {
        await this.continueBtn.click();
    }
}