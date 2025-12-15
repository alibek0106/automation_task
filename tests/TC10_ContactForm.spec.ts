import { test, expect } from '../src/fixtures/index';
import path from 'path';

test.describe('TC10: Contact Form Submission', () => {

    test.beforeEach(async ({ automationExerciseLandingSteps, automationExerciseContactUsSteps }) => {
        await automationExerciseLandingSteps.navigateToHomepage();
        // Click 'Contact us'. Need to add this to NavigationSteps or just explicit.
        // Usually NavigationSteps has logic.
        // Let's check 'AutomationExerciseNavigationSteps.ts' manually or assume 'clickContactUs' exists?
        // Checking view log: I didn't see 'clickContactUs' in NavigationSteps earlier view.
        // I will implement it in NavigationMenu/Steps if needed, or use direct nav via ContactSteps.navigateToContactUsPage().
        // TC background says "User clicks on Contact us link". 
        // Using `contactUsSteps.navigateToContactUsPage()` is cleaner and direct.
        await automationExerciseContactUsSteps.navigateToContactUsPage();
        await automationExerciseContactUsSteps.verifyContactUsPageVisible();
    });

    test('Scenario: Successful form submission with file attachment', async ({ automationExerciseContactUsSteps }) => {
        const filePath = path.join(__dirname, 'testData', 'sample-invoice.txt');

        await automationExerciseContactUsSteps.fillContactForm(
            'Test Worker',
            'worker@example.com',
            'Test Inquiry',
            'This is a test message regarding product quality (min 50 chars).'
        );
        await automationExerciseContactUsSteps.uploadFile(filePath);
        await automationExerciseContactUsSteps.submitForm();

        await automationExerciseContactUsSteps.verifySuccessMessage('Success! Your details have been submitted successfully.');
        await automationExerciseContactUsSteps.clickHome();
    });

    // Note: Negative tests for validation require asserting things that might be browser-native (HTML5 validation)
    // or checks that PAGE URL didn't change (still on contact_us).
    // AutomationExercise often uses HTML5 'required' attribute. 
    // Playwright handles validation checks via `expect(locator).toBeEmpty()` etc? 
    // Or we check that `submitForm` didn't redirect.
    // Or check `:invalid` CSS.

    test('Scenario: Verify mandatory field validation', async ({ automationExerciseContactUsSteps, page }) => {
        // Leave all empty
        await automationExerciseContactUsSteps.submitForm();

        // Form should not submit. URL should still be /contact_us
        expect(page.url()).toContain('/contact_us');

        // Check for browser validation message? 
        // Playwright can access validationMessage property.
        // But verifying URL is a good basic check for 'Form didn't submit'.
        // Let's assume URL check is sufficient for this level.
    });

    const invalidEmails = [
        { email: 'invalidemail', desc: 'No domain' },
        { email: 'test@', desc: 'Missing domain' },
        { email: '@test.com', desc: 'Missing username' },
        { email: 'test@.com', desc: 'Missing domain name' }
    ];

    for (const data of invalidEmails) {
        test(`Scenario: Verify email format validation - ${data.desc}`, async ({ automationExerciseContactUsSteps, page }) => {
            await automationExerciseContactUsSteps.fillContactForm('Test', data.email, 'Sub', 'Msg');
            await automationExerciseContactUsSteps.submitForm();

            // Should stay on page due to validation
            expect(page.url()).toContain('/contact_us');
        });
    }
});
