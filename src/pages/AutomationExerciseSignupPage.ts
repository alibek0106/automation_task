import { Page, Locator, expect } from '@playwright/test';
import { MESSSAGES } from '../constants/Messages';
import { BasePage } from './BasePage';

export class AutomationExerciseSignupPage extends BasePage {
    // Header
    private readonly accountInfoHeader: Locator;

    // Account Info
    private readonly titleMr: Locator;
    private readonly titleMrs: Locator;
    private readonly passwordInput: Locator;
    private readonly daysDropdown: Locator;
    private readonly monthsDropdown: Locator;
    private readonly yearsDropdown: Locator;
    private readonly newsletterCheckbox: Locator;
    private readonly specialOffersCheckbox: Locator;

    // Address Info
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly companyInput: Locator;
    private readonly addressInput: Locator;
    private readonly address2Input: Locator;
    private readonly countryDropdown: Locator;
    private readonly stateInput: Locator;
    private readonly cityInput: Locator;
    private readonly zipcodeInput: Locator;
    private readonly mobileNumberInput: Locator;

    private readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page, 'SignupPage');

        this.accountInfoHeader = page.getByText(MESSSAGES.ENTER_ACCOUNT_INFO);

        this.titleMr = this.page.locator('#id_gender1').describe('Title Mr');
        this.titleMrs = this.page.locator('#id_gender2').describe('Title Mrs');
        this.passwordInput = this.page.locator('[data-qa="password"]').describe('Password Input');
        this.daysDropdown = this.page.locator('[data-qa="days"]').describe('Days Dropdown');
        this.monthsDropdown = this.page.locator('[data-qa="months"]').describe('Months Dropdown');
        this.yearsDropdown = this.page.locator('[data-qa="years"]').describe('Years Dropdown');
        this.newsletterCheckbox = this.page.locator('#newsletter').describe('Newsletter Checkbox');
        this.specialOffersCheckbox = this.page.locator('#optin').describe('Special Offers Checkbox');

        this.firstNameInput = this.page.locator('[data-qa="first_name"]').describe('First Name Input');
        this.lastNameInput = this.page.locator('[data-qa="last_name"]').describe('Last Name Input');
        this.companyInput = this.page.locator('[data-qa="company"]').describe('Company Input');
        this.addressInput = this.page.locator('[data-qa="address"]').describe('Address Input');
        this.address2Input = this.page.locator('[data-qa="address2"]').describe('Address2 Input');
        this.countryDropdown = this.page.locator('[data-qa="country"]').describe('Country Dropdown');
        this.stateInput = this.page.locator('[data-qa="state"]').describe('State Input');
        this.cityInput = this.page.locator('[data-qa="city"]').describe('City Input');
        this.zipcodeInput = this.page.locator('[data-qa="zipcode"]').describe('Zipcode Input');
        this.mobileNumberInput = this.page.locator('[data-qa="mobile_number"]').describe('Mobile Number Input');

        this.createAccountButton = this.page.locator('[data-qa="create-account"]').describe('Create Account Button');
    }

    async verifyAccountInfoPageOpened() {
        await expect(this.accountInfoHeader, 'Account Info Header should be visible').toBeVisible();
    }

    async selectTitle(title: 'Mr.' | 'Mrs.') {
        await (title === 'Mr.' ? this.titleMr : this.titleMrs).check();
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async selectDateOfBirth(day: string, month: string, year: string) {
        await this.daysDropdown.selectOption(day);
        await this.monthsDropdown.selectOption(month);
        await this.yearsDropdown.selectOption(year);
    }

    async checkNewsletter() {
        await this.newsletterCheckbox.check();
    }

    async checkSpecialOffers() {
        await this.specialOffersCheckbox.check();
    }

    async enterFirstName(firstName: string) {
        await this.firstNameInput.fill(firstName);
    }

    async enterLastName(lastName: string) {
        await this.lastNameInput.fill(lastName);
    }

    async enterCompany(company: string) {
        await this.companyInput.fill(company);
    }

    async enterAddress(address: string) {
        await this.addressInput.fill(address);
    }

    async enterAddress2(address2: string) {
        await this.address2Input.fill(address2);
    }

    async selectCountry(country: string) {
        await this.countryDropdown.selectOption(country);
    }

    async enterState(state: string) {
        await this.stateInput.fill(state);
    }

    async enterCity(city: string) {
        await this.cityInput.fill(city);
    }

    async enterZipcode(zipcode: string) {
        await this.zipcodeInput.fill(zipcode);
    }

    async enterMobileNumber(mobileNumber: string) {
        await this.mobileNumberInput.fill(mobileNumber);
    }

    async clickCreateAccount() {
        await this.createAccountButton.click();
    }
}
