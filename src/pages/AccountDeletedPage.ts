import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountDeletedPage extends BasePage {
  readonly deletedMessage: Locator = this.page.getByText('Account Deleted!').describe('Account deleted message');
  readonly continueBtn: Locator = this.page.getByTestId('continue-button').describe('Continue button');
  readonly deletedHeader: Locator;

  constructor(page: Page) {
    const uniqueElement = page.getByRole('heading', { name: 'Account Deleted!' }).describe('Deleted page header');
    super(page, uniqueElement);
    this.deletedHeader = uniqueElement;
  }

  async clickContinue() {
    await this.continueBtn.click();
  }
}
