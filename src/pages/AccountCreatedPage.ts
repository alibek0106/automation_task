import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
  readonly successMessage: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.successMessage = page.getByText('Account Created!').describe('Success message');
    this.continueBtn = page.locator('[data-qa="continue-button"]').describe('Continue button');
  }

  async clickContinue() {
    await this.continueBtn.click();
  }
}
