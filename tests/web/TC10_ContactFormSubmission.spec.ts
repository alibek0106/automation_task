import { test } from '../../src/fixtures';
import { TestData } from '../../src/constants/TestData';
import path from 'path';

test.describe('TC10: Contact Form Submission with File Upload', { tag: '@meladze' }, () => {
  // TO aleksey: this test case could't be finished i think there is some problems with website
  test('should submit contact form with all details including file upload', async ({
    homePage,
    contactPage,
    authedUser
  }) => {
    const testFilePath = path.join(process.cwd(), 'tests/fixtures/test-upload.txt');

    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });

    await test.step('Navigate to Contact Us page', async () => {
      await contactPage.clickContactUsLink();
    });

    await test.step('Verify GET IN TOUCH form is displayed', async () => {
      await contactPage.verifyGetInTouchFormVisible();
    });

    await test.step('Verify all form fields are visible', async () => {
      await contactPage.verifyAllFormFieldsVisible();
    });

    await test.step('Fill contact form with valid data and upload file', async () => {
      await contactPage.submitContactForm({
        name: TestData.CONTACT.VALID_SUBMISSION.name,
        email: authedUser.email,
        subject: TestData.CONTACT.VALID_SUBMISSION.subject,
        message: TestData.CONTACT.VALID_SUBMISSION.message,
        filePath: testFilePath,
      });
    });

  });
});
