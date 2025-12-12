import { AutomationExerciseNavigationMenu } from '../pages/AutomationExerciseNavigationMenu';

export class AutomationExerciseNavigationSteps {
    constructor(private navigationMenu: AutomationExerciseNavigationMenu) { }

    async clickSignupLogin() {
        await this.navigationMenu.clickSignupLogin();
    }

    async clickDeleteAccount() {
        await this.navigationMenu.clickDeleteAccount();
    }

    async clickLogout() {
        await this.navigationMenu.clickLogout();
    }

    async verifyUserLoggedIn(username: string) {
        await this.navigationMenu.verifyUserLoggedIn(username);
    }
}
