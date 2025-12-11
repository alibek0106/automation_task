import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Routes } from "../constants/Routes";

export class ContactPage extends BasePage {
  // Helper arrow function to reduce duplication for test ID locators
  private getByDataQa = (name: string, description: string): Locator =>
    this.page.getByTestId(name).describe(description);

  // Header
  readonly getInTouchHeading: Locator = this.page
    .getByRole("heading", { name: "Get In Touch" })
    .describe("Get In Touch Heading");

  // Form fields
  readonly nameInput: Locator = this.getByDataQa("name", "Name input");
  readonly emailInput: Locator = this.getByDataQa("email", "Email input");
  readonly subjectInput: Locator = this.getByDataQa("subject", "Subject input");
  readonly messageTextarea: Locator = this.getByDataQa(
    "message",
    "Message textarea",
  );
  readonly fileUploadInput: Locator = this.page
    .locator('input[name="upload_file"]')
    .describe("File upload input");
  readonly submitButton: Locator = this.getByDataQa(
    "submit-button",
    "Submit button",
  );

  // Success/Error messages
  readonly successMessage: Locator = this.page
    .locator(".status.alert.alert-success")
    .describe("Success message");
  readonly alertSuccess: Locator = this.page
    .locator(".alert-success")
    .describe("Alert success");

  constructor(page: Page) {
    super(
      page,
      page
        .getByRole("heading", { name: "Get In Touch" })
        .describe("Get In Touch Heading"),
    );
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
    await this.navigation.clickContactUs();
  }

  /**
   * Verify "GET IN TOUCH" form is displayed
   */
  async verifyGetInTouchFormVisible() {
    await this.verifyPageOpened("Get In Touch Heading should be visible");
  }

  /**
   * Verify all form fields are visible
   * Using soft assertions to see all missing fields at once
   */
  async verifyAllFormFieldsVisible() {
    // Soft assertions: Check all fields to see all failures at once (data verification)
    await expect.soft(this.nameInput, "Name input should be visible").toBeVisible();
    await expect.soft(
      this.emailInput,
      "Email input should be visible",
    ).toBeVisible();
    await expect.soft(
      this.subjectInput,
      "Subject input should be visible",
    ).toBeVisible();
    await expect.soft(
      this.messageTextarea,
      "Message textarea should be visible",
    ).toBeVisible();
    await expect.soft(
      this.fileUploadInput,
      "File upload input should be visible",
    ).toBeVisible();
    await expect.soft(
      this.submitButton,
      "Submit button should be visible",
    ).toBeVisible();
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
    const dialogPromise = this.page.waitForEvent("dialog");

    await this.submitButton.click();

    // Wait for and accept the alert
    const dialog = await dialogPromise;
    await dialog.accept();

    // Wait for page to process the submission
    await this.waitForLoadState("networkidle");
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
      "Success message should be visible",
    ).toBeVisible({ timeout: 10000 });

    await expect(
      this.successMessage,
      `Success message should contain: ${expectedMessage}`,
    ).toContainText(expectedMessage);
  }
}
