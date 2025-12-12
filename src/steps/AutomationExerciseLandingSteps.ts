import { AutomationExerciseLandingPage } from '../pages/AutomationExerciseLandingPage';

export class AutomationExerciseLandingSteps {
    constructor(private landingPage: AutomationExerciseLandingPage) { }

    async navigateToHomepage() {
        await this.landingPage.navigate();
    }

    async verifyPageOpened() {
        await this.landingPage.verifyPageOpened();
    }
}
