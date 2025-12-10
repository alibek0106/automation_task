import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../constants/Routes';

export class ContactPage extends BasePage {
  // Header
  readonly getInTouchHeading: Locator = this.page.getByRole('heading', { name: 'Get In Touch' }).describe('Get In Touch Heading');

  // Form fields
  readonly nameInput: Locator = this.page.locator('[data-qa="name"]').describe('Name input');
  readonly emailInput: Locator = this.page.locator('[data-qa="email"]').describe('Email input');
  readonly subjectInput: Locator = this.page.locator('[data-qa="subject"]').describe('Subject input');
  readonly messageTextarea: Locator = this.page.locator('[data-qa="message"]').describe('Message textarea');
  readonly fileUploadInput: Locator = this.page.locator('input[name="upload_file"]').describe('File upload input');
  readonly submitButton: Locator = this.page.locator('[data-qa="submit-button"]').describe('Submit button');

  // Success/Error messages
  readonly successMessage: Locator = this.page.locator('.status.alert.alert-success').describe('Success message');
  readonly alertSuccess: Locator = this.page.locator('.alert-success').describe('Alert success');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to contact us page
   */
  async goto() {
    await super.goto(Routes.WEB.CONTACT_US);
  }

  /**
   * Navigate via contact link in header
   */
  async clickContactUsLink() {
    await this.page.getByRole('link', { name: 'Contact us' }).click();
  }

  /**
   * Verify "GET IN TOUCH" form is displayed
   */
  async verifyGetInTouchFormVisible() {
    await expect(this.getInTouchHeading, 'Get In Touch Heading should be visible').toBeVisible();
  }

  /**
   * Verify all form fields are visible
   */
  async verifyAllFormFieldsVisible() {
    await expect(this.nameInput, 'Name input should be visible').toBeVisible();
    await expect(this.emailInput, 'Email input should be visible').toBeVisible();
    await expect(this.subjectInput, 'Subject input should be visible').toBeVisible();
    await expect(this.messageTextarea, 'Message textarea should be visible').toBeVisible();
    await expect(this.fileUploadInput, 'File upload input should be visible').toBeVisible();
    await expect(this.submitButton, 'Submit button should be visible').toBeVisible();
  }

  /**
   * Fill contact form with provided data
   */
  async fillContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectInput.fill(data.subject);
    await this.messageTextarea.fill(data.message);
  }

  /**
   * Upload a file
   * @param filePath Absolute path to the file to upload
   */
  async uploadFile(filePath: string) {
    await this.fileUploadInput.setInputFiles(filePath);
  }

  /**
   * Click submit button and handle alert dialog
   */
  async clickSubmit() {
    // Set up dialog handler BEFORE clicking submit
    const dialogPromise = this.page.waitForEvent('dialog');

    await this.submitButton.click();

    // Wait for and accept the alert
    const dialog = await dialogPromise;
    await dialog.accept();

    // Wait for page to process the submission
    await this.waitForLoadState('networkidle');
  }

  /**
   * Submit the contact form with all details
   */
  async submitContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    filePath?: string;
  }) {
    await this.fillContactForm(data);
  }

  /**
   * Verify success message is displayed
   */
  async verifySuccessMessage(expectedMessage: string) {
    // Success message should appear after alert is handled
    await expect(
      this.successMessage,
      'Success message should be visible'
    ).toBeVisible({ timeout: 10000 });

    await expect(
      this.successMessage,
      `Success message should contain: ${expectedMessage}`
    ).toContainText(expectedMessage);
  }
}
