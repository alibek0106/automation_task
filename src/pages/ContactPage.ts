import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../constants/Routes';

export class ContactPage extends BasePage {
  // Header
  readonly getInTouchHeading: Locator;

  // Form fields
  readonly nameInput: Locator = this.page.getByTestId('name').describe('Name input');
  readonly emailInput: Locator = this.page.getByTestId('email').describe('Email input');
  readonly subjectInput: Locator = this.page.getByTestId('subject').describe('Subject input');
  readonly messageTextarea: Locator = this.page.getByTestId('message').describe('Message textarea');
  readonly fileUploadInput: Locator = this.page.locator('input[name="upload_file"]').describe('File upload input');
  readonly submitButton: Locator = this.page.getByTestId('submit-button').describe('Submit button');

  // Success/Error messages
  readonly successMessage: Locator = this.page.locator('.status.alert.alert-success').describe('Success message');
  readonly alertSuccess: Locator = this.page.locator('.alert-success').describe('Alert success');

  constructor(page: Page) {
    const uniqueElement = page.getByRole('heading', { name: 'Get In Touch' }).describe('Get In Touch Heading');
    super(page, uniqueElement);
    this.getInTouchHeading = uniqueElement;
  }

  /**
   * Navigate to contact us page
   */
  async goto() {
    await super.goto(Routes.WEB.CONTACT_US);
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
}
