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

        this.titleMr = this.resolveLocator('#id_gender1', 'Title Mr');
        this.titleMrs = this.resolveLocator('#id_gender2', 'Title Mrs');
        this.passwordInput = this.resolveLocator('[data-qa="password"]', 'Password Input');
        this.daysDropdown = this.resolveLocator('[data-qa="days"]', 'Days Dropdown');
        this.monthsDropdown = this.resolveLocator('[data-qa="months"]', 'Months Dropdown');
        this.yearsDropdown = this.resolveLocator('[data-qa="years"]', 'Years Dropdown');
        this.newsletterCheckbox = this.resolveLocator('#newsletter', 'Newsletter Checkbox');
        this.specialOffersCheckbox = this.resolveLocator('#optin', 'Special Offers Checkbox');

        this.firstNameInput = this.resolveLocator('[data-qa="first_name"]', 'First Name Input');
        this.lastNameInput = this.resolveLocator('[data-qa="last_name"]', 'Last Name Input');
        this.companyInput = this.resolveLocator('[data-qa="company"]', 'Company Input');
        this.addressInput = this.resolveLocator('[data-qa="address"]', 'Address Input');
        this.address2Input = this.resolveLocator('[data-qa="address2"]', 'Address2 Input');
        this.countryDropdown = this.resolveLocator('[data-qa="country"]', 'Country Dropdown');
        this.stateInput = this.resolveLocator('[data-qa="state"]', 'State Input');
        this.cityInput = this.resolveLocator('[data-qa="city"]', 'City Input');
        this.zipcodeInput = this.resolveLocator('[data-qa="zipcode"]', 'Zipcode Input');
        this.mobileNumberInput = this.resolveLocator('[data-qa="mobile_number"]', 'Mobile Number Input');

        this.createAccountButton = this.resolveLocator('[data-qa="create-account"]', 'Create Account Button');
    }

    async verifyAccountInfoPageOpened() {
        await expect(this.accountInfoHeader).toBeVisible();
    }

    async selectTitle(title: 'Mr.' | 'Mrs.') {
        if (title === 'Mr.') {
            await this.titleMr.check();
        } else {
            await this.titleMrs.check();
        }
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
