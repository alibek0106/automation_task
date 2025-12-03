
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly uniqueElement!: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForPageToLoad(): Promise<void> {
    await this.uniqueElement.waitFor({ state: 'visible' });
    await expect(this.uniqueElement).toBeVisible();
  }

  /**
   * Click element with proper wait
   */
  protected async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill input field with validation
   */
  protected async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  /**
   * Select dropdown option
   */
  protected async selectDropdown(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  /**
   * Check checkbox
   */
  protected async checkCheckbox(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    if (!await locator.isChecked()) {
      await locator.check();
    }
  }

  /**
   * Verify element is visible
   */
  protected async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Get element text content
   */
  protected async getTextContent(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() ?? '';
  }
}

