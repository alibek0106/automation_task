import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountDeletedPage extends BasePage {
  readonly deletedMessage: Locator;
  readonly continueBtn: Locator;
  readonly deletedHeader: Locator;

  constructor(page: Page) {
    const uniqueElement = page.getByRole('heading', { name: 'Account Deleted!' }).describe('Deleted page header');
    super(page, uniqueElement);
    this.deletedHeader = uniqueElement;
    this.deletedMessage = page.getByText('Account Deleted!').describe('Account deleted message');
    this.continueBtn = page.getByTestId('continue-button').describe('Continue button');
  }

  async clickContinue() {
    await this.continueBtn.click();
  }
}
