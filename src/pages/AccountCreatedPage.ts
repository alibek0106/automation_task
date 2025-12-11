import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
    readonly successMessage: Locator = this.page.getByText('Account Created!').describe('Success message');
    readonly continueBtn: Locator;

    constructor(page: Page) {
        const uniqueElement = page.getByTestId('continue-button').describe('Continue button');
        super(page, uniqueElement);
        this.continueBtn = uniqueElement;
    }

    async clickContinue() {
        await this.continueBtn.click();
    }
}
