import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
    readonly successMessage: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page) {
        const uniqueElement = page.getByTestId('continue-button').describe('Continue button');
        super(page, uniqueElement);
        this.continueBtn = uniqueElement;
        this.successMessage = page.getByText('Account Created!').describe('Success message');
    }

    async clickContinue() {
        await this.continueBtn.click();
    }
}
