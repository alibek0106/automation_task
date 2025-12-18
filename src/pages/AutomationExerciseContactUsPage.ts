import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../constants/Routes';

export class AutomationExerciseContactUsPage extends BasePage {
    private readonly nameInput: Locator;
    private readonly emailInput: Locator;
    private readonly subjectInput: Locator;
    private readonly messageInput: Locator;
    private readonly uploadFileInput: Locator;
    private readonly submitButton: Locator;
    private readonly successMessage: Locator;
    private readonly homeButton: Locator;
    private readonly heading: Locator;

    constructor(page: Page) {
        super(page, 'ContactUsPage');
        this.heading = this.page.locator('h2.title:has-text("Get In Touch")').describe('Contact Us Heading');
        this.nameInput = this.page.getByTestId('name').describe('Contact Name Input');
        this.emailInput = this.page.getByTestId('email').describe('Contact Email Input');
        this.subjectInput = this.page.getByTestId('subject').describe('Contact Subject Input');
        this.messageInput = this.page.getByTestId('message').describe('Contact Message Input');
        this.uploadFileInput = this.page.locator('input[name="upload_file"]').describe('Upload File Input');
        this.submitButton = this.page.getByTestId('submit-button').describe('Submit Button');
        this.successMessage = this.page.locator('.status.alert-success').describe('Success Message');
        this.homeButton = this.page.locator('.btn-success').describe('Home Button'); // Assuming class .btn-success or generic locator
    }

    async navigate() {
        await this.page.goto(Routes.CONTACT_US);
    }

    async verifyPageOpened() {
        await super.verifyPageOpened(this.heading);
    }

    async enterName(name: string) {
        await this.nameInput.fill(name);
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async enterSubject(subject: string) {
        await this.subjectInput.fill(subject);
    }

    async enterMessage(message: string) {
        await this.messageInput.fill(message);
    }

    async uploadFile(filePath: string) {
        // Playwright handles file input
        await this.uploadFileInput.setInputFiles(filePath);
    }

    async submitForm() {
        // AutomationExercise shows an alert confirm dialog on submit?
        // Usually: page.on('dialog', dialog => dialog.accept());
        // We should handle this listener in the spec or here safely.
        // Let's attach listener once if needed, or assume no alert.
        // Checking behavior: clicking submit usually triggers simple POST.
        // BUT some forms use window.confirm. AutomationExercise often does for Delete Account, not sure for Contact.
        // Safe bet: add listener before click.
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
        await this.submitButton.click();
    }

    async verifySuccessMessage(text: string) {
        await expect(this.successMessage, 'Success message should be visible').toBeVisible();
        await expect(this.successMessage, 'Success message should have expected text').toHaveText(text);
    }

    async clickHome() {
        await this.homeButton.click();
    }

    async verifyStillOnPageAfterValidation(): Promise<void> {
        await expect(this.page, 'Should still be on Contact Us page').toHaveURL(Routes.BASE_URL + Routes.CONTACT_US);
    }
}
