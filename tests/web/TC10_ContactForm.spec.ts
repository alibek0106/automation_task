import { test } from '../../src/fixtures';
import { TestDataProvider } from '../../src/utils/TestDataProvider';
import { DataFactory } from '../../src/utils/DataFactory';
import { MESSAGES, TEST_DATA } from '../../src/utils/Constants';

/**
 * TC10: Contact Form Submission
 * 
 * Validates contact form submission functionality including successful submission
 * with file attachments and form validation for mandatory fields and email format.
 */

test.describe('TC10: Contact Form Submission', () => {

    test.beforeEach(async ({ automationExerciseLandingSteps, automationExerciseContactUsSteps }) => {
        await automationExerciseLandingSteps.navigateToHomepage();
        await automationExerciseContactUsSteps.navigateToContactUsPage();
        await automationExerciseContactUsSteps.verifyContactUsPageVisible();
    });

    test('Scenario: Successful form submission with file attachment', async ({ automationExerciseContactUsSteps }) => {
        const filePath = TestDataProvider.getTestFilePath('sample-invoice.txt');
        const formData = DataFactory.generateContactFormData();

        await automationExerciseContactUsSteps.fillContactForm({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
        });
        await automationExerciseContactUsSteps.uploadFile(filePath);
        await automationExerciseContactUsSteps.submitForm();

        await automationExerciseContactUsSteps.verifySuccessMessage(MESSAGES.CONTACT_SUCCESS);
        await automationExerciseContactUsSteps.clickHome();
    });

    test('Scenario: Verify mandatory field validation', async ({ automationExerciseContactUsSteps }) => {
        await automationExerciseContactUsSteps.submitForm();
        await automationExerciseContactUsSteps.verifyStillOnContactUsPage();
    });

    const invalidEmails = TEST_DATA.INVALID_EMAILS;

    for (const data of invalidEmails) {
        test(`Scenario: Verify email format validation - ${data.desc}`, async ({ automationExerciseContactUsSteps }) => {
            await automationExerciseContactUsSteps.fillContactForm({
                name: TEST_DATA.CONTACT_US.NAME,
                email: data.email,
                subject: TEST_DATA.CONTACT_US.SUBJECT,
                message: TEST_DATA.CONTACT_US.MESSAGE
            });
            await automationExerciseContactUsSteps.submitForm();
            await automationExerciseContactUsSteps.verifyStillOnContactUsPage();
        });
    }
});
