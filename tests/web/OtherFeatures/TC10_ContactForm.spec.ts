import { test, expect } from "../../../src/fixtures";
import path from "path";
import fs from "fs";

test.describe("TC10: Contact Form Submission with File Upload", () => {
    // Create test file before tests
    test.beforeAll(async () => {
        const testFilePath = path.join(process.cwd(), "test-data", "test-file.txt");
        const testFileDir = path.dirname(testFilePath);

        if (!fs.existsSync(testFileDir)) {
            fs.mkdirSync(testFileDir, { recursive: true });
        }

        fs.writeFileSync(testFilePath, "This is a test file for contact form upload.");
    });

    test("should submit contact form with file attachment", async ({
        homePage,
        contactUsPage,
        authedUser,
    }) => {
        const testFilePath = path.join(process.cwd(), "test-data", "test-file.txt");

        const contactData = {
            name: authedUser.name,
            email: authedUser.email,
            subject: "Test Inquiry",
            message: "This is a test message for the contact form. It contains more than 50 characters to ensure proper validation.",
        };

        // Step 1: Navigate to Contact Us page
        await test.step("Navigate to contact us page", async () => {
            await homePage.goto();
            await homePage.clickContactUs();
            await contactUsPage.verifyPageOpened();
            await contactUsPage.verifyFormVisible();
        });

        // Step 2: Fill contact form
        await test.step("Fill contact form fields", async () => {
            await contactUsPage.fillContactForm(contactData);
        });

        // Step 3: Upload file
        await test.step("Upload file attachment", async () => {
            await contactUsPage.uploadFile(testFilePath);
        });
    });
});
