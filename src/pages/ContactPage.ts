import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../constants/Routes';

export class ContactPage extends BasePage {
  // Header
  readonly getInTouchHeading: Locator;

  // Form fields
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly fileUploadInput: Locator;
  readonly submitButton: Locator;

  // Success/Error messages
  readonly successMessage: Locator;
  readonly alertSuccess: Locator;

  constructor(page: Page) {
    super(page);

    // Header
    this.getInTouchHeading = page.getByRole('heading', { name: 'Get In Touch' }).describe('Get In Touch Heading');

    // Form fields - using stable locators
    this.nameInput = page.locator('[data-qa="name"]').describe('Name Input');
    this.emailInput = page.locator('[data-qa="email"]').describe('Email Input');
    this.subjectInput = page.locator('[data-qa="subject"]').describe('Subject Input');
    this.messageTextarea = page.locator('[data-qa="message"]').describe('Message Textarea');
    this.fileUploadInput = page.locator('input[name="upload_file"]').describe('File Upload Input');
    this.submitButton = page.locator('[data-qa="submit-button"]').describe('Submit Button');

    // Messages
    this.successMessage = page.locator('.status.alert.alert-success').describe('Success Message');
    this.alertSuccess = page.locator('.alert-success').describe('Alert');
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
    await expect(this.getInTouchHeading).toBeVisible();
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