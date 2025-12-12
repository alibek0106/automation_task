import { AutomationExerciseLoginPage } from '../pages/AutomationExerciseLoginPage';

export class AutomationExerciseLoginSteps {
    constructor(private loginPage: AutomationExerciseLoginPage) { }

    async navigateToLoginPage() {
        await this.loginPage.navigate();
    }

    async verifyNewUserSignupVisible() {
        await this.loginPage.verifyNewUserSignupVisible();
    }

    async verifyLoginHeaderVisible() {
        await this.loginPage.verifyLoginHeaderVisible();
    }

    async enterSignupCredentials(name: string, email: string) {
        await this.loginPage.enterSignupName(name);
        await this.loginPage.enterSignupEmail(email);
    }

    async clickSignupButton() {
        await this.loginPage.clickSignup();
    }

    async signup(name: string, email: string) {
        await this.enterSignupCredentials(name, email);
        await this.clickSignupButton();
    }

    async enterLoginCredentials(email: string, password: string) {
        await this.loginPage.enterLoginEmail(email);
        await this.loginPage.enterLoginPassword(password);
    }

    async clickLoginButton() {
        await this.loginPage.clickLogin();
    }

    async login(email: string, password: string) {
        await this.enterLoginCredentials(email, password);
        await this.clickLoginButton();
    }
}
