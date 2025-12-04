import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

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
        this.getInTouchHeading = page.getByRole('heading', { name: 'Get In Touch' });

        // Form fields - using stable locators
        this.nameInput = page.locator('[data-qa="name"]');
        this.emailInput = page.locator('[data-qa="email"]');
        this.subjectInput = page.locator('[data-qa="subject"]');
        this.messageTextarea = page.locator('[data-qa="message"]');
        this.fileUploadInput = page.locator('input[name="upload_file"]');
        this.submitButton = page.locator('[data-qa="submit-button"]');

        // Messages
        this.successMessage = page.locator('.status.alert.alert-success');
        this.alertSuccess = page.locator('.alert-success');
    }

    /**
     * Navigate to contact us page
     */
    async goto() {
        await this.page.goto('/contact_us');
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
        await expect(this.page.getByText('Get In Touch')).toBeVisible();
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
     * Verify file is attached successfully
     */
    async verifyFileAttached() {
        const fileName = await this.fileUploadInput.inputValue();
        expect(fileName, 'File should be attached').toBeTruthy();
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
        await this.page.waitForLoadState('networkidle');
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
        // await this.fillContactForm(data);

        // if (data.filePath) {
        //     await this.uploadFile(data.filePath);
        // }

        // await this.clickSubmit();
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

    /**
     * Clear the contact form
     */
    async clearForm() {
        await this.nameInput.clear();
        await this.emailInput.clear();
        await this.subjectInput.clear();
        await this.messageTextarea.clear();
    }

    /**
     * Verify form is cleared or redirected after submission
     */
    async verifyFormClearedOrRedirected() {
        // Check if form is cleared OR if we're on a different page
        const currentUrl = this.page.url();
        const isContactPage = currentUrl.includes('/contact_us');

        if (isContactPage) {
            // If still on contact page, verify fields are empty
            const nameValue = await this.nameInput.inputValue();
            const emailValue = await this.emailInput.inputValue();

            expect(
                nameValue === '' || emailValue === '',
                'Form should be cleared after successful submission'
            ).toBe(true);
        }
    }
}
