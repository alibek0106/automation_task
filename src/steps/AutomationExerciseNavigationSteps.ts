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

    @step('Verify user is not logged in')
    async verifyUserNotLoggedIn() {
        await this.navigationMenu.verifyUserNotLoggedIn();
    }

    @step('Click Home link')
    async clickHome() {
        await this.navigationMenu.clickHome();
    }

    @step('Click Products link')
    async clickProducts() {
        await this.navigationMenu.clickProducts();
    }

    @step('Click Cart link')
    async clickCart() {
        await this.navigationMenu.clickCart();
    }

    @step('Verify account deleted')
    async verifyAccountDeleted() {
        await this.navigationMenu.verifyAccountDeleted();
    }
}
