import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

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
        this.heading = this.resolveLocator('h2.title:has-text("Get In Touch")', 'Contact Us Heading');
        this.nameInput = this.resolveLocator('[data-qa="name"]', 'Contact Name Input');
        this.emailInput = this.resolveLocator('[data-qa="email"]', 'Contact Email Input');
        this.subjectInput = this.resolveLocator('[data-qa="subject"]', 'Contact Subject Input');
        this.messageInput = this.resolveLocator('[data-qa="message"]', 'Contact Message Input');
        this.uploadFileInput = this.resolveLocator('input[name="upload_file"]', 'Upload File Input');
        this.submitButton = this.resolveLocator('[data-qa="submit-button"]', 'Submit Button');
        this.successMessage = this.resolveLocator('.status.alert-success', 'Success Message');
        this.homeButton = this.resolveLocator('.btn-success', 'Home Button'); // Assuming class .btn-success or generic locator
    }

    async navigate() {
        await this.page.goto('/contact_us');
    }

    async verifyPageOpened() {
        await expect(this.heading).toBeVisible();
    }

    async fillContactForm(name: string, email: string, subject: string, message: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
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
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toHaveText(text);
    }

    async clickHome() {
        await this.homeButton.click();
    }
}
