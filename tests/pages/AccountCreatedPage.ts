import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../framework/pages/BasePage';

export class AccountCreatedPage extends BasePage {
  // Locators
  protected readonly uniqueElement: Locator;
  private readonly accountCreatedHeading: Locator;
  private readonly continueButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.uniqueElement = page.getByTestId('account-created');
    this.accountCreatedHeading = page.getByTestId('account-created');
    this.continueButton = page.getByTestId('continue-button');
    this.successMessage = page.getByText('Congratulations!');
  }

  async verifyAccountCreatedVisible(): Promise<void> {
    await this.verifyElementVisible(this.accountCreatedHeading);
    await expect(this.accountCreatedHeading).toContainText('Account Created!');
  }

  async verifySuccessMessage(): Promise<void> {
    await this.verifyElementVisible(this.successMessage);
  }

  async clickContinue(): Promise<void> {
    await this.clickElement(this.continueButton);
  }

  async completeAccountCreation(): Promise<void> {
    await this.verifyAccountCreatedVisible();
    await this.clickContinue();
  }
}
