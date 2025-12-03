import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../framework/pages/BasePage';

/**
 * SignupLoginPage - Represents the signup/login page
 */
export class SignupLoginPage extends BasePage {
  // Locators
  protected readonly uniqueElement: Locator;

  // Signup section
  private readonly newUserSignupHeading: Locator;
  private readonly signupNameInput: Locator;
  private readonly signupEmailInput: Locator;
  private readonly signupButton: Locator;

  // Login section
  private readonly loginHeading: Locator;
  private readonly loginEmailInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginButton: Locator;

  // Error messages
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.uniqueElement = page.locator('.signup-form');

    // Signup section locators
    this.newUserSignupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.signupNameInput = page.getByTestId('signup-name');
    this.signupEmailInput = page.getByTestId('signup-email');
    this.signupButton = page.getByTestId('signup-button');

    // Login section locators
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.loginEmailInput = page.getByTestId('login-email');
    this.loginPasswordInput = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');

    // Error message
    this.errorMessage = page.locator('p[style*="color: red"]');
  }

  /**
   * Verify "New User Signup!" section is visible
   */
  async verifyNewUserSignupVisible(): Promise<void> {
    await this.verifyElementVisible(this.newUserSignupHeading);
    await expect(this.newUserSignupHeading).toBeVisible();
  }

  /**
   * Fill signup form with name and email
   */
  async fillSignupForm(name: string, email: string): Promise<void> {
    await this.fillInput(this.signupNameInput, name);
    await this.fillInput(this.signupEmailInput, email);
  }

  /**
   * Click signup button
   */
  async clickSignup(): Promise<void> {
    await this.clickElement(this.signupButton);
  }

  /**
   * Complete signup process (fill form and submit)
   */
  async signup(name: string, email: string): Promise<void> {
    await this.fillSignupForm(name, email);
    await this.clickSignup();
  }

  /**
   * Verify "Login to your account" section is visible
   */
  async verifyLoginSectionVisible(): Promise<void> {
    await this.verifyElementVisible(this.loginHeading);
    await expect(this.loginHeading).toBeVisible();
  }

  /**
   * Fill login form with email and password
   */
  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.fillInput(this.loginEmailInput, email);
    await this.fillInput(this.loginPasswordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * Complete login process (fill form and submit)
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillLoginForm(email, password);
    await this.clickLogin();
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageVisible(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getTextContent(this.errorMessage);
  }
}
