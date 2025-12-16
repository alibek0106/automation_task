import { Page, Locator } from '@playwright/test';
import { User } from '../models/UserModels';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
    // Helper arrow function to reduce duplication for test ID locators
    private getByDataQa = (name: string, description: string): Locator =>
        this.page.getByTestId(name).describe(description);

    readonly accountInfoHeading: Locator = this.page.getByText('Enter Account Information').describe('Account Info Heading');
    readonly titleMr: Locator = this.page.getByLabel('Mr.').describe('Title Mr');
    readonly titleMrs: Locator = this.page.getByLabel('Mrs.').describe('Title Mrs');
    readonly password: Locator = this.getByDataQa('password', 'Password input');
    readonly daySelect: Locator = this.getByDataQa('days', 'Day select');
    readonly monthSelect: Locator = this.getByDataQa('months', 'Month select');
    readonly yearSelect: Locator = this.getByDataQa('years', 'Year select');
    readonly newsletterCheck: Locator = this.page.getByLabel('Sign up for our newsletter!').describe('Newsletter check');
    readonly offersCheck: Locator = this.page.getByLabel('Receive special offers from our partners!').describe('Offers check');
    readonly firstName: Locator = this.getByDataQa('first_name', 'First name input');
    readonly lastName: Locator = this.getByDataQa('last_name', 'Last name input');
    readonly company: Locator = this.getByDataQa('company', 'Company input');
    readonly address1: Locator = this.getByDataQa('address', 'Address input');
    readonly address2: Locator = this.getByDataQa('address2', 'Secondary Address input');
    readonly country: Locator = this.getByDataQa('country', 'Country select');
    readonly state: Locator = this.getByDataQa('state', 'State input');
    readonly city: Locator = this.getByDataQa('city', 'City input');
    readonly zipcode: Locator = this.getByDataQa('zipcode', 'Zipcode input');
    readonly mobile: Locator = this.getByDataQa('mobile_number', 'Mobile input');
    readonly createAccountBtn: Locator = this.getByDataQa('create-account', 'Create account button');

    constructor(page: Page) {
        super(page);
    }

    async fillAccountDetails(user: User) {
        if (user.title === 'Mr') await this.titleMr.check();
        else await this.titleMrs.check();

        await this.password.fill(user.password);
        await this.daySelect.selectOption(user.birthDay);
        await this.monthSelect.selectOption(user.birthMonth);
        await this.yearSelect.selectOption(user.birthYear);
        await this.newsletterCheck.check();
        await this.offersCheck.check();
        await this.firstName.fill(user.firstName);
        await this.lastName.fill(user.lastName);
        await this.company.fill(user.company);
        await this.address1.fill(user.address1);
        if (user.address2) await this.address2.fill(user.address2);
        await this.country.selectOption(user.country);
        await this.state.fill(user.state);
        await this.city.fill(user.city);
        await this.zipcode.fill(user.zipcode);
        await this.mobile.fill(user.mobileNumber);
    }

    async clickCreateAccount() {
        await this.createAccountBtn.click();
    }
}
