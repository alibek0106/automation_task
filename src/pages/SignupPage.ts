import { Page, Locator } from '@playwright/test';
import { User } from '../models/UserModels';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
    // Helper arrow function to reduce duplication for test ID locators
    private getByDataQa = (name: string, description: string): Locator =>
        this.page.getByTestId(name).describe(description);

    readonly accountInfoHeading: Locator;
    readonly titleMr: Locator;
    readonly titleMrs: Locator;
    readonly password: Locator;
    readonly daySelect: Locator;
    readonly monthSelect: Locator;
    readonly yearSelect: Locator;
    readonly newsletterCheck: Locator;
    readonly offersCheck: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly company: Locator;
    readonly address1: Locator;
    readonly address2: Locator;
    readonly country: Locator;
    readonly state: Locator;
    readonly city: Locator;
    readonly zipcode: Locator;
    readonly mobile: Locator;
    readonly createAccountBtn: Locator;

    constructor(page: Page) {
        super(page);

        // POM best-practice: initialize locators in constructor (Playwright docs)
        this.accountInfoHeading = this.page
            .getByText('Enter Account Information')
            .describe('Account Info Heading');
        this.titleMr = this.page.getByLabel('Mr.').describe('Title Mr');
        this.titleMrs = this.page.getByLabel('Mrs.').describe('Title Mrs');
        this.password = this.getByDataQa('password', 'Password input');
        this.daySelect = this.getByDataQa('days', 'Day select');
        this.monthSelect = this.getByDataQa('months', 'Month select');
        this.yearSelect = this.getByDataQa('years', 'Year select');
        this.newsletterCheck = this.page
            .getByLabel('Sign up for our newsletter!')
            .describe('Newsletter check');
        this.offersCheck = this.page
            .getByLabel('Receive special offers from our partners!')
            .describe('Offers check');
        this.firstName = this.getByDataQa('first_name', 'First name input');
        this.lastName = this.getByDataQa('last_name', 'Last name input');
        this.company = this.getByDataQa('company', 'Company input');
        this.address1 = this.getByDataQa('address', 'Address input');
        this.address2 = this.getByDataQa('address2', 'Secondary Address input');
        this.country = this.getByDataQa('country', 'Country select');
        this.state = this.getByDataQa('state', 'State input');
        this.city = this.getByDataQa('city', 'City input');
        this.zipcode = this.getByDataQa('zipcode', 'Zipcode input');
        this.mobile = this.getByDataQa('mobile_number', 'Mobile input');
        this.createAccountBtn = this.getByDataQa('create-account', 'Create account button');
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
