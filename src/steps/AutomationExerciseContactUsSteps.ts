import { AutomationExerciseContactUsPage } from '../pages/AutomationExerciseContactUsPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseContactUsSteps {
    constructor(private contactUsPage: AutomationExerciseContactUsPage) { }

    @step('Navigate to Contact Us page')
    async navigateToContactUsPage() {
        await this.contactUsPage.navigate();
    }

    @step('Verify "GET IN TOUCH" form is visible')
    async verifyContactUsPageVisible() {
        await this.contactUsPage.verifyPageOpened();
    }

    @step('Fill contact form')
    async fillContactForm(data: { name: string, email: string, subject: string, message: string }) {
        await this.contactUsPage.enterName(data.name);
        await this.contactUsPage.enterEmail(data.email);
        await this.contactUsPage.enterSubject(data.subject);
        await this.contactUsPage.enterMessage(data.message);
    }

    @step('Upload file: {0}')
    async uploadFile(filePath: string) {
        await this.contactUsPage.uploadFile(filePath);
    }

    @step('Click Submit button')
    async submitForm() {
        await this.contactUsPage.submitForm();
    }

    @step('Verify success message: {0}')
    async verifySuccessMessage(message: string) {
        await this.contactUsPage.verifySuccessMessage(message);
    }

    @step('Click Home button')
    async clickHome() {
        await this.contactUsPage.clickHome();
    }

    @step('Verify still on Contact Us page (validation failed)')
    async verifyStillOnContactUsPage(): Promise<void> {
        await this.contactUsPage.verifyStillOnPageAfterValidation();
    }
}
