import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountDeletedPage extends BasePage {
  readonly deletedMessage: Locator;
  readonly continueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.deletedMessage = page.getByText('Account Deleted!').describe('Account deleted message');
    this.continueBtn = page.locator('[data-qa="continue-button"]').describe('Continue button');
  }

  async clickContinue() {
    await this.continueBtn.click();
  }
}
