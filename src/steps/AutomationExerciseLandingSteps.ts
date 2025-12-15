import { AutomationExerciseLandingPage } from '../pages/AutomationExerciseLandingPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseLandingSteps {
    constructor(private landingPage: AutomationExerciseLandingPage) { }

    @step('Navigate to homepage')
    async navigateToHomepage() {
        await this.landingPage.navigate();
    }

    @step('Verify landing page is opened')
    async verifyPageOpened() {
        await this.landingPage.verifyPageOpened();
    }
}
