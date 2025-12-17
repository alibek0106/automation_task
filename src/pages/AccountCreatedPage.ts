import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../constants/Routes';

export class AccountCreatedPage extends BasePage {
    // Helper arrow function to reduce duplication for test ID locators
    private getByDataQa = (name: string, description: string): Locator =>
        this.page.getByTestId(name).describe(description);

    readonly successMessage: Locator = this.page.getByText('Account Created!').describe('Success message');
    readonly continueBtn: Locator = this.getByDataQa('continue-button', 'Continue button');

    constructor(page: Page) {
        super(page);
    }

    async clickContinue() {
        await this.clickAndWaitForURL(
            new RegExp(`${Routes.WEB.HOME}($|\\?)`),
            () => this.continueBtn.click()
        );
    }
}
