import { Page, Locator } from '@playwright/test';
import { User } from '../models/UserModels';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
    readonly titleMr: Locator = this.page.getByLabel('Mr.').describe('Title Mr');
    readonly titleMrs: Locator = this.page.getByLabel('Mrs.').describe('Title Mrs');
    readonly password: Locator = this.page.getByTestId('password').describe('Password input');
    readonly daySelect: Locator = this.page.getByTestId('days').describe('Day select');
    readonly monthSelect: Locator = this.page.getByTestId('months').describe('Month select');
    readonly yearSelect: Locator = this.page.getByTestId('years').describe('Year select');
    readonly newsletterCheck: Locator = this.page.getByLabel('Sign up for our newsletter!').describe('Newsletter check');
    readonly offersCheck: Locator = this.page.getByLabel('Receive special offers from our partners!').describe('Offers check');
    readonly firstName: Locator = this.page.getByTestId('first_name').describe('First name input');
    readonly lastName: Locator = this.page.getByTestId('last_name').describe('Last name input');
    readonly company: Locator = this.page.getByTestId('company').describe('Company input');
    readonly address1: Locator = this.page.getByTestId('address').describe('Address input');
    readonly address2: Locator = this.page.getByTestId('address2').describe('Secondary Address input');
    readonly country: Locator = this.page.getByTestId('country').describe('Country select');
    readonly state: Locator = this.page.getByTestId('state').describe('State input');
    readonly city: Locator = this.page.getByTestId('city').describe('City input');
    readonly zipcode: Locator = this.page.getByTestId('zipcode').describe('Zipcode input');
    readonly mobile: Locator = this.page.getByTestId('mobile_number').describe('Mobile input');
    readonly createAccountBtn: Locator = this.page.getByTestId('create-account').describe('Create account button');
    readonly accountInfoHeading: Locator;

    constructor(page: Page) {
        const uniqueElement = page.getByText('Enter Account Information').describe('Account Info Heading');
        super(page, uniqueElement);
        this.accountInfoHeading = uniqueElement;
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
