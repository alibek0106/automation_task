import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountDeletedPage extends BasePage {
  // Helper arrow function to reduce duplication for test ID locators
  private getByDataQa = (name: string, description: string): Locator =>
    this.page.getByTestId(name).describe(description);

  readonly deletedHeader: Locator = this.page.getByRole('heading', { name: 'Account Deleted!' }).describe('Deleted page header');
  readonly deletedMessage: Locator = this.page.getByText('Account Deleted!').describe('Account deleted message');
  readonly continueBtn: Locator = this.getByDataQa('continue-button', 'Continue button');

  constructor(page: Page) {
    super(page);
  }

  async clickContinue() {
    await this.continueBtn.click();
  }
}
