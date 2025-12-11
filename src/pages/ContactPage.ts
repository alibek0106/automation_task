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
    const uniqueElement = page.getByRole('heading', { name: 'Get In Touch' }).describe('Get In Touch Heading');
    super(page, uniqueElement);
    this.getInTouchHeading = uniqueElement;
    this.nameInput = page.getByTestId('name').describe('Name input');
    this.emailInput = page.getByTestId('email').describe('Email input');
    this.subjectInput = page.getByTestId('subject').describe('Subject input');
    this.messageTextarea = page.getByTestId('message').describe('Message textarea');
    this.fileUploadInput = page.locator('input[name="upload_file"]').describe('File upload input');
    this.submitButton = page.getByTestId('submit-button').describe('Submit button');
    this.successMessage = page.locator('.status.alert.alert-success').describe('Success message');
    this.alertSuccess = page.locator('.alert-success').describe('Alert success');
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
