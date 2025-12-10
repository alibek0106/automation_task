import { Page, Locator } from '@playwright/test';
import { User } from '../models/UserModels';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
    readonly accountInfoHeading: Locator = this.page.getByText('Enter Account Information').describe('Account Info Heading');
    readonly titleMr: Locator = this.page.getByLabel('Mr.').describe('Title Mr');
    readonly titleMrs: Locator = this.page.getByLabel('Mrs.').describe('Title Mrs');
    readonly password: Locator = this.page.locator('[data-qa="password"]').describe('Password input');
    readonly daySelect: Locator = this.page.locator('[data-qa="days"]').describe('Day select');
    readonly monthSelect: Locator = this.page.locator('[data-qa="months"]').describe('Month select');
    readonly yearSelect: Locator = this.page.locator('[data-qa="years"]').describe('Year select');
    readonly newsletterCheck: Locator = this.page.getByLabel('Sign up for our newsletter!').describe('Newsletter check');
    readonly offersCheck: Locator = this.page.getByLabel('Receive special offers from our partners!').describe('Offers check');
    readonly firstName: Locator = this.page.locator('[data-qa="first_name"]').describe('First name input');
    readonly lastName: Locator = this.page.locator('[data-qa="last_name"]').describe('Last name input');
    readonly company: Locator = this.page.locator('[data-qa="company"]').describe('Company input');
    readonly address1: Locator = this.page.locator('[data-qa="address"]').describe('Address input');
    readonly address2: Locator = this.page.locator('[data-qa="address2"]').describe('Secondary Address input');
    readonly country: Locator = this.page.locator('[data-qa="country"]').describe('Country select');
    readonly state: Locator = this.page.locator('[data-qa="state"]').describe('State input');
    readonly city: Locator = this.page.locator('[data-qa="city"]').describe('City input');
    readonly zipcode: Locator = this.page.locator('[data-qa="zipcode"]').describe('Zipcode input');
    readonly mobile: Locator = this.page.locator('[data-qa="mobile_number"]').describe('Mobile input');
    readonly createAccountBtn: Locator = this.page.locator('[data-qa="create-account"]').describe('Create account button');

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

    async submit() {
        await this.createAccountBtn.click();
    }
}
