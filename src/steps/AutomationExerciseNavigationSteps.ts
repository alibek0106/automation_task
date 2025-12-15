import { AutomationExerciseNavigationMenu } from '../pages/AutomationExerciseNavigationMenu';
import { step } from '../utils/Decorators';

export class AutomationExerciseNavigationSteps {
    constructor(private navigationMenu: AutomationExerciseNavigationMenu) { }

    @step('Click Signup/Login link')
    async clickSignupLogin() {
        await this.navigationMenu.clickSignupLogin();
    }

    @step('Click Delete Account link')
    async clickDeleteAccount() {
        await this.navigationMenu.clickDeleteAccount();
    }

    @step('Click Logout link')
    async clickLogout() {
        await this.navigationMenu.clickLogout();
    }

    @step('Verify user is logged in as {0}')
    async verifyUserLoggedIn(username: string) {
        await this.navigationMenu.verifyUserLoggedIn(username);
    }
}
