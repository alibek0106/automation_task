import { Page, Locator } from '@playwright/test';
import { User } from '../models/UserModels';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
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
  readonly accountInfoHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.accountInfoHeading = page.getByText('Enter Account Information').describe('Account Info Heading');
    this.titleMr = page.getByLabel('Mr.').describe('Title Mr');
    this.titleMrs = page.getByLabel('Mrs.').describe('Title Mrs');
    this.password = page.locator('[data-qa="password"]').describe('Password input');
    this.daySelect = page.locator('[data-qa="days"]').describe('Day select');
    this.monthSelect = page.locator('[data-qa="months"]').describe('Month select');
    this.yearSelect = page.locator('[data-qa="years"]').describe('Year select');
    this.newsletterCheck = page.getByLabel('Sign up for our newsletter!').describe('Newsletter check');
    this.offersCheck = page.getByLabel('Receive special offers from our partners!').describe('Offers check');
    this.firstName = page.locator('[data-qa="first_name"]').describe('First name input');
    this.lastName = page.locator('[data-qa="last_name"]').describe('Last name input');
    this.company = page.locator('[data-qa="company"]').describe('Company input');
    this.address1 = page.locator('[data-qa="address"]').describe('Address input');
    this.address2 = page.locator('[data-qa="address2"]').describe('Secondary Address input');
    this.country = page.locator('[data-qa="country"]').describe('Country select');
    this.state = page.locator('[data-qa="state"]').describe('State input');
    this.city = page.locator('[data-qa="city"]').describe('City input');
    this.zipcode = page.locator('[data-qa="zipcode"]').describe('Zipcode input');
    this.mobile = page.locator('[data-qa="mobile_number"]').describe('Mobile input');
    this.createAccountBtn = page.locator('[data-qa="create-account"]').describe('Create account button');
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
