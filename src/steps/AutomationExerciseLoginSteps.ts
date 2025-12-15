import { AutomationExerciseLoginPage } from '../pages/AutomationExerciseLoginPage';
import { step } from '../utils/Decorators';

export class AutomationExerciseLoginSteps {
    constructor(private loginPage: AutomationExerciseLoginPage) { }

    @step('Navigate to Login page')
    async navigateToLoginPage() {
        await this.loginPage.navigate();
    }

    @step('Verify "New User Signup!" is visible')
    async verifyNewUserSignupVisible() {
        await this.loginPage.verifyNewUserSignupVisible();
    }

    @step('Verify "Login to your account" header is visible')
    async verifyLoginHeaderVisible() {
        await this.loginPage.verifyLoginHeaderVisible();
    }

    @step('Enter signup credentials: {0}, {1}')
    async enterSignupCredentials(name: string, email: string) {
        await this.loginPage.enterSignupName(name);
        await this.loginPage.enterSignupEmail(email);
    }

    @step('Click Signup button')
    async clickSignupButton() {
        await this.loginPage.clickSignup();
    }

    @step('Signup with name: {0}, email: {1}')
    async signup(name: string, email: string) {
        await this.enterSignupCredentials(name, email);
        await this.clickSignupButton();
    }

    @step('Enter login credentials: {0}, ***')
    async enterLoginCredentials(email: string, password: string) {
        await this.loginPage.enterLoginEmail(email);
        await this.loginPage.enterLoginPassword(password);
    }

    @step('Click Login button')
    async clickLoginButton() {
        await this.loginPage.clickLogin();
    }

    @step('Login with email: {0}')
    async login(email: string, password: string) {
        await this.enterLoginCredentials(email, password);
        await this.clickLoginButton();
    }
}
