import { test } from '../../src/fixtures';
import path from 'path';
import { DataFactory } from '../../src/utils/DataFactory';
import { MESSAGES } from '../../src/utils/Constants';

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
        const filePath = path.join(__dirname, 'testData', 'sample-invoice.txt');
        const formData = DataFactory.generateContactFormData();

        await automationExerciseContactUsSteps.fillContactForm(
            formData.name,
            formData.email,
            formData.subject,
            formData.message
        );
        await automationExerciseContactUsSteps.uploadFile(filePath);
        await automationExerciseContactUsSteps.submitForm();

        await automationExerciseContactUsSteps.verifySuccessMessage(MESSAGES.CONTACT_SUCCESS);
        await automationExerciseContactUsSteps.clickHome();
    });

    test('Scenario: Verify mandatory field validation', async ({ automationExerciseContactUsSteps }) => {
        await automationExerciseContactUsSteps.submitForm();
        await automationExerciseContactUsSteps.verifyStillOnContactUsPage();
    });

    const invalidEmails = [
        { email: 'invalidemail', desc: 'No domain' },
        { email: 'test@', desc: 'Missing domain' },
        { email: '@test.com', desc: 'Missing username' },
        { email: 'test@.com', desc: 'Missing domain name' }
    ];

    for (const data of invalidEmails) {
        test(`Scenario: Verify email format validation - ${data.desc}`, async ({ automationExerciseContactUsSteps }) => {
            await automationExerciseContactUsSteps.fillContactForm('Test', data.email, 'Sub', 'Msg');
            await automationExerciseContactUsSteps.submitForm();
            await automationExerciseContactUsSteps.verifyStillOnContactUsPage();
        });
    }
});
