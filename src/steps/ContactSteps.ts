import { expect } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage';
import { TIMEOUTS } from '../constants/Timeouts';

export class ContactSteps {
    private contactPage: ContactPage;

    constructor(contactPage: ContactPage) {
        this.contactPage = contactPage;
    }

    async verifyContactFormIsDisplayed() {
        await expect(this.contactPage.nameInput, 'Name input should be visible').toBeVisible();
        await expect(this.contactPage.emailInput, 'Email input should be visible').toBeVisible();
        await expect(this.contactPage.subjectInput, 'Subject input should be visible').toBeVisible();
        await expect(this.contactPage.messageTextarea, 'Message textarea should be visible').toBeVisible();
        await expect(this.contactPage.fileUploadInput, 'File upload input should be visible').toBeVisible();
        await expect(this.contactPage.submitButton, 'Submit button should be visible').toBeVisible();
    }

    /**
   * Verify success message is displayed
   */
    async verifySuccessMessage(expectedMessage: string) {
        // Success message should appear after alert is handled
        await expect(
            this.contactPage.successMessage,
            'Success message should be visible'
        ).toBeVisible({ timeout: TIMEOUTS.DEFAULT });

        await expect(
            this.contactPage.successMessage,
            `Success message should contain: ${expectedMessage}`
        ).toContainText(expectedMessage);
    }

    /**
   * Verify "GET IN TOUCH" form is displayed
   */
    async verifyGetInTouchFormVisible() {
        await expect(this.contactPage.getInTouchHeading, 'Get In Touch Heading should be visible').toBeVisible();
    }
}