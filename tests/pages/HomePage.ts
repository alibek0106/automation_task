import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../framework/pages/BasePage';

/**
 * HomePage - Represents the main homepage of automationexercise.com
 */
export class HomePage extends BasePage {
  // Locators
  protected readonly uniqueElement: Locator;
  private readonly signupLoginLink: Locator;
  private readonly logo: Locator;
  private readonly loggedInAsText: Locator;
  private readonly deleteAccountLink: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators using Playwright best practices (getByRole, getByText)

    // 'Features Items' is a prominent heading on the homepage
    this.uniqueElement = page.getByText('Features Items').first();

    // Navigation links
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });

    // Status text
    this.loggedInAsText = page.getByText('Logged in as');

    // Logo - keeping locator as it's structurally reliable for the brand image wrapper
    this.logo = page.locator('.logo');
  }


  async navigateToHome(): Promise<void> {
    await this.navigate('/');
    await this.waitForPageToLoad();
  }

  async verifyHomepageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.logo);
    await this.verifyElementVisible(this.uniqueElement);
  }

  /**
   * Click on Signup/Login link
   */
  async clickSignupLogin(): Promise<void> {
    await this.clickElement(this.signupLoginLink);
  }

  /**
   * Verify user is logged in with specific username
   */
  async verifyLoggedInAs(username: string): Promise<void> {
    await this.verifyElementVisible(this.loggedInAsText);
    const loggedInText = await this.getTextContent(this.loggedInAsText);
    expect(loggedInText).toContain(username);
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.loggedInAsText.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get logged in username
   */
  async getLoggedInUsername(): Promise<string> {
    const text = await this.getTextContent(this.loggedInAsText);
    // Extract username from "Logged in as <username>"
    // The text content often comes as "Logged in as Username" flattened
    return text.replace('Logged in as', '').trim();
  }

  /**
   * Click logout link
   */
  async clickLogout(): Promise<void> {
    await this.clickElement(this.logoutLink);
  }

  /**
   * Click delete account link
   */
  async clickDeleteAccount(): Promise<void> {
    await this.clickElement(this.deleteAccountLink);
  }
}
