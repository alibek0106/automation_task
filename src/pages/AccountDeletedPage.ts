import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountDeletedPage extends BasePage {
  readonly deletedHeader: Locator = this.page.getByRole('heading', { name: 'Account Deleted!' }).describe('Deleted page header');
  readonly deletedMessage: Locator = this.page.getByText('Account Deleted!').describe('Account deleted message');
  readonly continueBtn: Locator = this.page.locator('[data-qa="continue-button"]').describe('Continue button');

  constructor(page: Page) {
    super(page);
  }

  async clickContinue() {
    await this.continueBtn.click();
  }
}
